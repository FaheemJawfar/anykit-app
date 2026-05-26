"use client";

import { useState, useEffect } from "react";
import { getToolById, Tool } from "@/lib/tools";

// Custom event to synchronize favorites and recents across components
const FAVORITES_CHANGED_EVENT = "anykit_favorites_changed";
const RECENTS_CHANGED_EVENT = "anykit_recents_changed";

export function usePersistentTools() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load initial values from localStorage
    const storedFavs = localStorage.getItem("anykit_favorites");
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }

    const storedRecents = localStorage.getItem("anykit_recents");
    if (storedRecents) {
      try {
        setRecents(JSON.parse(storedRecents));
      } catch (e) {
        console.error("Failed to parse recents", e);
      }
    }

    // Event listeners for multi-component syncing
    const handleFavsChange = () => {
      const updated = localStorage.getItem("anykit_favorites");
      setFavorites(updated !== null ? JSON.parse(updated) : []);
    };

    const handleRecentsChange = () => {
      const updated = localStorage.getItem("anykit_recents");
      setRecents(updated !== null ? JSON.parse(updated) : []);
    };

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavsChange);
    window.addEventListener(RECENTS_CHANGED_EVENT, handleRecentsChange);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavsChange);
      window.removeEventListener(RECENTS_CHANGED_EVENT, handleRecentsChange);
    };
  }, []);

  const toggleFavorite = (toolId: string) => {
    let currentFavs: string[] = [];
    const stored = localStorage.getItem("anykit_favorites");
    if (stored) {
      try {
        currentFavs = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored favorites", e);
      }
    }

    let nextFavs: string[];
    if (currentFavs.includes(toolId)) {
      nextFavs = currentFavs.filter((id) => id !== toolId);
    } else {
      nextFavs = [...currentFavs, toolId];
    }
    setFavorites(nextFavs);
    localStorage.setItem("anykit_favorites", JSON.stringify(nextFavs));
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
  };

  const addRecent = (toolId: string) => {
    let currentRecents: string[] = [];
    const stored = localStorage.getItem("anykit_recents");
    if (stored) {
      try {
        currentRecents = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored recents", e);
      }
    }

    // Keep only the 5 most recent tools and avoid duplicates (move to front)
    const filtered = currentRecents.filter((id) => id !== toolId);
    const nextRecents = [toolId, ...filtered].slice(0, 5);
    setRecents(nextRecents);
    localStorage.setItem("anykit_recents", JSON.stringify(nextRecents));
    window.dispatchEvent(new CustomEvent(RECENTS_CHANGED_EVENT));
  };

  const clearRecents = () => {
    setRecents([]);
    localStorage.removeItem("anykit_recents");
    window.dispatchEvent(new CustomEvent(RECENTS_CHANGED_EVENT));
  };

  const favoriteTools = mounted
    ? favorites.map((id) => getToolById(id)).filter((t): t is Tool => !!t)
    : [];

  const recentTools = mounted
    ? recents.map((id) => getToolById(id)).filter((t): t is Tool => !!t)
    : [];

  return {
    favorites,
    recents,
    favoriteTools,
    recentTools,
    isFavorite: (toolId: string) => favorites.includes(toolId),
    toggleFavorite,
    addRecent,
    clearRecents,
    mounted,
  };
}

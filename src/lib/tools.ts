export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  path: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'developer',
    name: 'Developer Tools',
    description: 'Tools for developers and programmers',
    icon: '💻',
  },
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Text manipulation and formatting',
    icon: '📝',
  },
  {
    id: 'converter',
    name: 'Converters',
    description: 'Convert between different formats',
    icon: '🔄',
  },
  {
    id: 'math',
    name: 'Math',
    description: 'Calculations and math utilities',
    icon: '🔢',
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Image manipulation and processing',
    icon: '🖼️',
  },
  {
    id: 'color',
    name: 'Color Tools',
    description: 'Color manipulation and conversion',
    icon: '🎨',
  },
  {
    id: 'generator',
    name: 'Generators',
    description: 'Generate various content',
    icon: '✨',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security and encryption tools',
    icon: '🔒',
  },
];

export const tools: Tool[] = [
  // Developer Tools
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and beautify JSON data',
    category: 'developer',
    icon: '📋',
    path: '/tools/json-formatter',
    tags: ['json', 'format', 'beautify'],
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    category: 'developer',
    icon: '🔐',
    path: '/tools/base64-encoder',
    tags: ['base64', 'encode', 'decode'],
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL strings',
    category: 'developer',
    icon: '🔗',
    path: '/tools/url-encoder',
    tags: ['url', 'encode', 'decode'],
  },
  
  // Text Tools
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, and lines',
    category: 'text',
    icon: '📊',
    path: '/tools/word-counter',
    tags: ['text', 'count', 'words'],
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between different cases',
    category: 'text',
    icon: '🔤',
    path: '/tools/case-converter',
    tags: ['text', 'case', 'convert'],
  },
  {
    id: 'text-diff',
    name: 'Text Diff',
    description: 'Compare two texts and find differences',
    category: 'text',
    icon: '🔍',
    path: '/tools/text-diff',
    tags: ['text', 'diff', 'compare'],
  },
  
  // Converters
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to readable dates',
    category: 'converter',
    icon: '🕐',
    path: '/tools/timestamp-converter',
    tags: ['timestamp', 'date', 'convert'],
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units',
    category: 'converter',
    icon: '📏',
    path: '/tools/unit-converter',
    tags: ['unit', 'convert', 'measurement'],
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between color formats',
    category: 'color',
    icon: '🎨',
    path: '/tools/color-converter',
    tags: ['color', 'convert', 'hex', 'rgb'],
  },
  
  // Math
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Simple and scientific calculator',
    category: 'math',
    icon: '🧮',
    path: '/tools/calculator',
    tags: ['math', 'calculator', 'calculate'],
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages easily',
    category: 'math',
    icon: '％',
    path: '/tools/percentage-calculator',
    tags: ['math', 'percentage', 'calculate'],
  },
  
  // Generators
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure random passwords',
    category: 'security',
    icon: '🔑',
    path: '/tools/password-generator',
    tags: ['password', 'generate', 'security'],
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs',
    category: 'generator',
    icon: '🆔',
    path: '/tools/uuid-generator',
    tags: ['uuid', 'generate', 'random'],
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text',
    category: 'generator',
    icon: '📱',
    path: '/tools/qr-generator',
    tags: ['qr', 'generate', 'code'],
  },
  {
    id: 'image-resize',
    name: 'Image Resize',
    description: 'Resize images in your browser',
    category: 'image',
    icon: '🖼️',
    path: '/tools/image-resize',
    tags: ['image', 'resize', 'edit'],
  },
];

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(tool => tool.category === categoryId);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(
    tool =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

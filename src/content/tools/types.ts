export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolHowToStep {
  name: string;
  text: string;
}

export interface ToolSection {
  heading: string;
  /** Plain-text paragraphs. Rendered server-side as <p> elements. */
  paragraphs?: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
}

export interface ToolContent {
  /** Overrides the generated <title>. Keep under ~60 chars. */
  seoTitle?: string;
  /** Overrides the generated meta description. Keep 140–160 chars. */
  seoDescription?: string;
  /** Short lead paragraph shown directly under the tool, above the sections. */
  intro: string;
  sections: ToolSection[];
  howTo: ToolHowToStep[];
  faqs: ToolFaq[];
  /** Tool ids to cross-link. Falls back to same-category tools if omitted. */
  related?: string[];
}

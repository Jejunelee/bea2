export interface WhatYouGetSettings {
  id: number;
  section_title: string;
  italic_word: string;
  background_color: string;
  text_color: string;
  muted_text_color: string;
  accent_color: string;
  glow_intensity: number;
  checkmark_background_color: string;
  checkmark_icon_color: string;
  title_emphasis_words: Record<string, string>; // Maps title -> word to emphasize
  description_emphasis_phrases: string[];
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  id: number;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
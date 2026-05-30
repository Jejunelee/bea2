export interface WhatIsReviewedSettings {
  id: number;
  section_title: string;
  italic_word: string;
  background_color: string;
  text_color: string;
  muted_text_color: string;
  accent_color: string;
  glow_intensity: number;
  title_emphasis_words: string[];
  image_url: string;
  quote_text: string;
  quote_author: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewArea {
  id: number;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
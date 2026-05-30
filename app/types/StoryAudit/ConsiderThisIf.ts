export interface ConsiderThisIfSettings {
  id: number;
  section_title: string;
  italic_word: string;
  background_color: string;
  text_color: string;
  muted_text_color: string;
  accent_color: string;
  glow_intensity: number;
  created_at: string;
  updated_at: string;
}

export interface ConsiderThisIfItem {
  id: number;
  text: string;
  display_order: number;
  emphasis_words: string[]; // JSON array of words to emphasize
  created_at: string;
  updated_at: string;
}
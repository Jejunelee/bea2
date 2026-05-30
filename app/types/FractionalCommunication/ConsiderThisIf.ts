export interface FractionalConsiderSettings {
  id: number;
  section_title: string;
  italic_word: string;
  background_color: string;
  text_color: string;
  muted_text_color: string;
  accent_color: string;
  glow_intensity: number;
  icon_color: string;
  emphasis_words: string[];
  created_at: string;
  updated_at: string;
}

export interface FractionalConsiderItem {
  id: number;
  text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
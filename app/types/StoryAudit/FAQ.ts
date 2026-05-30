export interface FAQSettings {
  id: number;
  section_title: string;
  italic_word: string;
  background_color: string;
  text_color: string;
  muted_text_color: string;
  accent_color: string;
  glow_intensity: number;
  card_background_color: string;
  card_hover_color: string;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
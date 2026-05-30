export interface OutcomesSettings {
  id: number;
  section_title: string;
  italic_word: string;
  background_color: string;
  text_color: string;
  muted_text_color: string;
  accent_color: string;
  glow_intensity: number;
  process_note_text: string;
  process_note_emphasis_phrases: string[];
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Outcome {
  id: number;
  text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
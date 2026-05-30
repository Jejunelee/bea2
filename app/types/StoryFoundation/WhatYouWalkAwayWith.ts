export interface FoundationWalkAwaySettings {
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
  created_at: string;
  updated_at: string;
}

export interface WalkAwayItem {
  id: number;
  text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
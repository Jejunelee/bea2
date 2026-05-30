export interface TimelineSettings {
  id: number;
  section_title: string;
  italic_word: string;
  background_color: string;
  text_color: string;
  muted_text_color: string;
  accent_color: string;
  glow_intensity: number;
  circle_background_color: string;
  circle_text_color: string;
  created_at: string;
  updated_at: string;
}

export interface TimelineWeek {
  id: number;
  week_number: number;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
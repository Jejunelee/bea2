export interface AuditHeroSettings {
  id: number;
  headline: string;
  italic_words: string[]; // Array of words to italicize
  description: string;
  button_text: string;
  booking_url: string;
  background_color: string;
  background_gradient_colors: string[]; // Array of 5 gradient colors
  text_color: string;
  accent_color: string;
  glow_color: string;
  glow_intensity: number;
  button_background_color: string;
  button_text_color: string;
  created_at: string;
  updated_at: string;
}
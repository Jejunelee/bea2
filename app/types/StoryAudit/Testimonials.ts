export interface TestimonialsSettings {
  id: number;
  section_title: string;
  italic_word: string;
  background_gradient_start: string;
  background_gradient_middle: string;
  background_gradient_end: string;
  text_color: string;
  muted_text_color: string;
  author_text_color: string;
  accent_color: string;
  glow_intensity: number;
  quote_emphasis_phrases: string[];
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
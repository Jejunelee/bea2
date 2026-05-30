export interface TestimonialSliderSettings {
  id: number;
  heading_text: string;
  heading_italic_word: string;
  subheading_text: string;
  background_color: string;
  text_color: string;
  card_background_color: string;
  accent_color: string;
  animation_speed_multiplier: number;
  created_at: string;
  updated_at: string;
}

export interface TestimonialSlide {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  display_order: number;
  image_url: string;
  image_name: string;
  created_at: string;
  updated_at: string;
}
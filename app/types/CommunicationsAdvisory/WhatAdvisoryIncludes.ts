export interface AdvisoryIncludesSettings {
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
  title_emphasis_words: Record<string, string>;
  quote_text: string;
  quote_author: string;
  image_url: string;
  footer_text: string;
  footer_link: string;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryInclude {
  id: number;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
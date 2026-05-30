export interface CaseStudySettings {
  id: number;
  section_title: string;
  italic_word: string;
  background_color: string;
  text_color: string;
  muted_text_color: string;
  accent_color: string;
  glow_intensity: number;
  category_color: string;
  border_color: string;
  title_emphasis_words: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  id: number;
  title: string;
  description: string;
  category: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
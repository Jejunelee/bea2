export interface PackagesSettings {
    id: number;
    background_color: string;
    section_padding_desktop: string;
    section_padding_mobile: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface PackagesItem {
    id: number;
    display_order: number;
    tag: string;
    tag_color: string;
    tag_subtext: string;
    title: string;
    description: string;
    bullets: string[];
    button_text: string;
    button_link: string;
    bg_image_url: string;
    italic_words: string[];
    created_at: string;
    updated_at: string;
  }
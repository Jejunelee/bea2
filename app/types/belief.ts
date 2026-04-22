export interface BeliefSettings {
    id: number;
    background_image_url: string;
    background_color: string;
    overlay_opacity: number;
    hero_badge_text: string;
    hero_title_prefix: string;
    hero_title_italic: string;
    hero_title_suffix: string;
    content_background_color: string;
    text_color: string;
    button_text: string;
    button_link: string;
    button_background_color: string;
    button_text_color: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface BeliefItem {
    id: number;
    display_order: number;
    title: string;
    headline_prefix: string;
    headline_italic: string;
    headline_suffix: string;
    description: string;
    created_at: string;
    updated_at: string;
  }
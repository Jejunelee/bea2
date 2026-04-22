export interface Section2Settings {
    id: number;
    background_color: string;
    text_color: string;
    badge_text: string;
    badge_text_color: string;
    title_prefix: string;
    title_suffix: string;
    title_color: string;
    description: string;
    description_color: string;
    bullets: string[];
    bullet_color: string;
    button_text: string;
    button_background_color: string;
    button_text_color: string;
    button_hover_color: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Section2Episode {
    id: number;
    display_order: number;
    episode_number: number;
    title: string;
    subtitle: string;
    embed_url: string;
    created_at: string;
    updated_at: string;
  }
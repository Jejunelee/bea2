export interface SocialLink {
    name: string;
    url: string;
  }
  
  export interface LatestSettings {
    id: number;
    background_color: string;
    title_text: string;
    social_links: SocialLink[];
    podcast_title: string;
    headphones_image_url: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface LatestCard {
    id: number;
    display_order: number;
    background_color: string;
    icon_url: string;
    image_url: string;
    link_url: string;
    created_at: string;
    updated_at: string;
  }
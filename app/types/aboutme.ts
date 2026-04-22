export interface AboutMeSettings {
    id: number;
    title_prefix: string;
    title_name: string;
    highlight_image_url: string;
    highlight_image_animation: boolean;
    background_color: string;
    text_color: string;
    italic_text_color: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface AboutMeCountry {
    id: number;
    country_name: string;
    flag_emoji: string;
    display_order: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface AboutMeParagraph {
    id: number;
    paragraph_text: string;
    is_italic: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface AboutMeImage {
    id: number;
    image_key: string;
    image_url: string;
    image_name: string;
    position: 'left' | 'right';
    layer_order: number;
    top_offset: string;
    left_offset: string;
    right_offset: string;
    bottom_offset: string;
    width: string;
    is_mac_header: boolean;
    created_at: string;
    updated_at: string;
  }
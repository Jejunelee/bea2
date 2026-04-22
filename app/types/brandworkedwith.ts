export interface WorkedWithSettings {
    id: number;
    background_color: string;
    text_color: string;
    heading_prefix: string;
    heading_brands_italic: string;
    heading_people_italic: string;
    heading_suffix: string;
    divider_color: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface WorkedWithBrand {
    id: number;
    display_order: number;
    name: string;
    logo_url: string;
    website_url: string;
    created_at: string;
    updated_at: string;
  }
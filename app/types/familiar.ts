export interface FamiliarCard {
    id: number;
    card_order: number;
    image_url: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface FamiliarSettings {
    id: number;
    heading_text: string;
    heading_italic_word: string;
    subheading_text: string;
    background_color: string;
    card_background_color: string;
    text_color: string;
    created_at: string;
    updated_at: string;
  }
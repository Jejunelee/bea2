export interface HeroContent {
    id: number;
    typed_text: string;
    subheading_text: string;
    description_text: string;
    button1_text: string;
    button2_text: string;
    footer_text: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface HeroImage {
    id: number;
    image_key: 'left_polaroid' | 'right_polaroid' | 'sharpest_image';
    image_url: string;
    created_at: string;
    updated_at: string;
  }
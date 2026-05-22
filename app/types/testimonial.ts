// app/types/testimonial.ts

export interface TestimonialSlide {
    id: number;
    quote: string;
    author: string;
    role: string;
    company: string;
    display_order: number;
    imagePath?: string; // Optional individual image path for each person
    created_at?: string;
    updated_at?: string;
  }
  
  export interface TestimonialSliderSettings {
    id: number;
    heading_text: string;
    heading_italic_word: string;
    subheading_text: string;
    created_at?: string;
    updated_at?: string;
  }
  
  // Optional: If you want to store images in a separate table
  export interface TestimonialImage {
    id: number;
    testimonial_id: number;
    image_path: string;
    alt_text?: string;
    created_at?: string;
  }
  
  // Props for the testimonial card component
  export interface TestimonialCardProps {
    testimonial: TestimonialSlide;
    isMobile?: boolean;
  }
  
  // Props for the slider component
  export interface TestimonialSliderProps {
    settings?: Partial<TestimonialSliderSettings>;
    testimonials?: TestimonialSlide[];
    autoPlay?: boolean;
    autoPlayDelay?: number;
  }
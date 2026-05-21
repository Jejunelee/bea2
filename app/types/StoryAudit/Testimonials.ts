// /apps/types/Audit/Testimonials.ts

export interface TestimonialsSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Testimonial {
    id: number;
    quote: string;
    author: string;
    role?: string | null;
    company?: string | null;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
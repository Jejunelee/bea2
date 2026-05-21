// /apps/types/Fractional/FAQ.ts

export interface FractionalFAQSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface FractionalFAQItem {
    id: number;
    question: string;
    answer: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
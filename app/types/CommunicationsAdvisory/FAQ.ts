// /apps/types/Advisory/FAQ.ts

export interface AdvisoryFAQSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface AdvisoryFAQItem {
    id: number;
    question: string;
    answer: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
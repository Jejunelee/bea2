// /apps/types/StoryFoundation/FAQ.ts

export interface FoundationFAQSettings {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface FoundationFAQItem {
    id: number;
    question: string;
    answer: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
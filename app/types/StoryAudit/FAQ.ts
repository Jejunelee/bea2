// /apps/types/Audit/FAQ.ts

export interface FAQSettings {
  id: number;
  section_title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
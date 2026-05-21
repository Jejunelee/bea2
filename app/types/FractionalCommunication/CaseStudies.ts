// /apps/types/Fractional/CaseStudies.ts

export interface CaseStudySettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface CaseStudy {
    id: number;
    title: string;
    description: string;
    category: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
// /apps/types/Advisory/ConsiderThisIf.ts

export interface AdvisoryConsiderSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface AdvisoryConsiderItem {
    id: number;
    text: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
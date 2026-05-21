// /apps/types/Fractional/ConsiderThisIf.ts

export interface FractionalConsiderSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface FractionalConsiderItem {
    id: number;
    text: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
// /apps/types/Audit/Outcomes.ts

export interface OutcomesSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Outcome {
    id: number;
    text: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
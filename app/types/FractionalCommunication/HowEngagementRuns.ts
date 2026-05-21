// /apps/types/Fractional/HowEngagementRuns.ts

export interface FractionalEngagementSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface EngagementStep {
    id: number;
    title: string;
    description: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
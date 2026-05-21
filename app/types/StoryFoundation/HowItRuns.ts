// /apps/types/StoryFoundation/HowItRuns.ts

export interface HowItRunsSettings {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Phase {
    id: number;
    title: string;
    description: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
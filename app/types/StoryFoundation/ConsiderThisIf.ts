// /apps/types/StoryFoundation/ConsiderThisIf.ts

export interface FoundationConsiderSettings {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface FoundationConsiderItem {
    id: number;
    text: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
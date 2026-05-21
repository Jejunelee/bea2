// /apps/types/Audit/Timeline.ts

export interface TimelineSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface TimelineWeek {
    id: number;
    week_number: number;
    title: string;
    description: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
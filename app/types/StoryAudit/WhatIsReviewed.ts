// /apps/types/Audit/WhatIsReviewed.ts

export interface WhatIsReviewedSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface ReviewArea {
    id: number;
    title: string;
    description: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
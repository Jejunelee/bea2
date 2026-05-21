// /apps/types/StoryFoundation/WhatYouWalkAwayWith.ts

export interface FoundationWalkAwaySettings {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface WalkAwayItem {
    id: number;
    text: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
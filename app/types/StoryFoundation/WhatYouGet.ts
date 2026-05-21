// /apps/types/StoryFoundation/WhatYouGet.ts

export interface FoundationGetSettings {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface FoundationGetItem {
    id: number;
    text: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
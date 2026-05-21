// /apps/types/Fractional/WhatYouGet.ts

export interface FractionalGetSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface FractionalGetItem {
    id: number;
    text: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
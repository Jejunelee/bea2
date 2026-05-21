// /apps/types/Audit/WhatYouGet.ts

export interface WhatYouGetSettings {
  id: number;
  section_title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Deliverable {
  id: number;
  title: string;
  description: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
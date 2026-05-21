// /apps/types/Audit/ConsiderThisIf.ts

export interface ConsiderThisIfSettings {
  id: number;
  section_title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ConsiderThisIfItem {
  id: number;
  text: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
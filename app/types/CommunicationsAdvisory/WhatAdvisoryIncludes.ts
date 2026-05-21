// /apps/types/Advisory/WhatAdvisoryIncludes.ts

export interface AdvisoryIncludesSettings {
    id: number;
    section_title?: string | null;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface AdvisoryInclude {
    id: number;
    title: string;
    description: string;
    display_order: number;
    created_at?: string;
    updated_at?: string;
  }
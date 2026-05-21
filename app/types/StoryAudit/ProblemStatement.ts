// /apps/types/Audit/ProblemStatement.ts

export interface ProblemStatementSettings {
    id: number;
    section_title?: string | null;
    opening_statement?: string | null;
    fragmented_items?: string[] | null;
    consequence_statement?: string | null;
    resolution_statement?: string | null;
    created_at?: string;
    updated_at?: string;
  }
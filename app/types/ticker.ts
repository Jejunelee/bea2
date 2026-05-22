// app/types/ticker.ts
export interface TickerItem {
  id: string;        // Unique identifier that never changes
  text: string;      // The display text (can be edited)
  logo_url?: string; // Logo URL that stays with the ID even if text changes
}

export interface TickerSettings {
  id: number;
  items: TickerItem[];  // Array of objects instead of strings
  background_color: string;
  text_color: string;
  separator: string;
  animation_duration: number;
  logo_height?: string;
  updated_at: string;
}
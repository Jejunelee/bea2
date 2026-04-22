export interface StatsSettings {
    id: number;
    background_color: string;
    text_color: string;
    number_color: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface StatsItem {
    id: number;
    display_order: number;
    number_value: number;
    number_suffix: string;
    text: string;
    created_at: string;
    updated_at: string;
  }
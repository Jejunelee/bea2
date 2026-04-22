export interface StyledWord {
    word: string;
    style: string;
  }
  
  export interface QuoteSettings {
    id: number;
    quote_text: string;
    styled_words: StyledWord[];
    background_gradient_start: string;
    background_gradient_mid: string;
    background_gradient_end: string;
    typing_speed: number;
    text_color: string;
    text_size_desktop: string;
    text_size_mobile: string;
    show_arrow_icon: boolean;
    arrow_icon_url: string;
    created_at: string;
    updated_at: string;
  }
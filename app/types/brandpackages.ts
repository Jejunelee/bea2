export interface BrandPackagesSettings {
    id: number;
    background_color: string;
    section_title: string;
    cta_title: string;
    cta_subtitle: string;
    cta_button_text: string;
    cta_button_color: string;
    cta_button_text_color: string;
    calendar_event_title: string;
    calendar_event_details: string;
    calendar_event_location: string;
    calendar_event_email: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface BrandPackagesItem {
    id: number;
    display_order: number;
    tag: string;
    tag_color: string;
    title: string;
    subtitle: string;
    description: string;
    bullets: string[];
    button_text: string;
    bg_image_url: string;
    created_at: string;
    updated_at: string;
  }
export interface SocialFeedSettings {
    id: number;
    background_gradient_start: string;
    background_gradient_end: string;
    search_placeholder: string;
    expand_all_text: string;
    collapse_all_text: string;
    no_results_text: string;
    clear_search_text: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface SocialFeedPlatform {
    id: number;
    platform_key: string;
    display_name: string;
    icon_class: string;
    icon_gradient: string;
    follow_link: string | null;
    follow_text: string | null;
    is_spotify: boolean;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface SocialFeedPost {
    id: number;
    platform_key: string;
    post_url: string | null;
    embed_url: string | null;
    caption: string | null;
    title: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface SocialFeedSocialLink {
    id: number;
    name: string;
    url: string;
    icon_svg: string | null;
    background_color: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
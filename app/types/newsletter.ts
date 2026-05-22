// /app/types/newsletter.ts

export interface NewsletterContent {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    callout: string;
    button_text: string;
    archive_url: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface SubstackTile {
    id: number;
    title: string;
    description: string;
    date: string;
    readTime: string;
    imageUrl: string;
    articleUrl: string;
  }
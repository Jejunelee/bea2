import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('audit_review_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching review settings:', error);
    return NextResponse.json({ error: 'Failed to fetch review settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      section_title,
      italic_word,
      background_color,
      text_color,
      muted_text_color,
      accent_color,
      glow_intensity,
      title_emphasis_words,
      image_url,
      quote_text,
      quote_author
    } = body;

    const { data, error } = await supabase
      .from('audit_review_settings')
      .update({
        section_title,
        italic_word,
        background_color,
        text_color,
        muted_text_color,
        accent_color,
        glow_intensity,
        title_emphasis_words,
        image_url,
        quote_text,
        quote_author,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating review settings:', error);
    return NextResponse.json({ error: 'Failed to update review settings' }, { status: 500 });
  }
}
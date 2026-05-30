import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('advisory_includes_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching advisory includes settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
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
      checkmark_background_color,
      checkmark_icon_color,
      title_emphasis_words,
      quote_text,
      quote_author,
      image_url,
      footer_text,
      footer_link
    } = body;

    const { data, error } = await supabase
      .from('advisory_includes_settings')
      .update({
        section_title,
        italic_word,
        background_color,
        text_color,
        muted_text_color,
        accent_color,
        glow_intensity,
        checkmark_background_color,
        checkmark_icon_color,
        title_emphasis_words,
        quote_text,
        quote_author,
        image_url,
        footer_text,
        footer_link,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating advisory includes settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
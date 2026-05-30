import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('foundation_bridge_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bridge statement settings:', error);
    return NextResponse.json({ error: 'Failed to fetch bridge statement settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      pre_title,
      section_title,
      italic_word,
      main_text,
      main_emphasis_phrases,
      closing_text,
      background_color,
      text_color,
      muted_text_color,
      accent_color,
      glow_intensity,
      image_url
    } = body;

    const { data, error } = await supabase
      .from('foundation_bridge_settings')
      .update({
        pre_title,
        section_title,
        italic_word,
        main_text,
        main_emphasis_phrases,
        closing_text,
        background_color,
        text_color,
        muted_text_color,
        accent_color,
        glow_intensity,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating bridge statement settings:', error);
    return NextResponse.json({ error: 'Failed to update bridge statement settings' }, { status: 500 });
  }
}
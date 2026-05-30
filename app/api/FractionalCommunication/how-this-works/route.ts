import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('fractional_howitworks_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching fractional how it works settings:', error);
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
      card_background_color,
      card_border_color,
      card_text_color,
      paragraph_one,
      paragraph_one_emphasis,
      paragraph_two,
      paragraph_two_emphasis,
      callout_text,
      callout_emphasis
    } = body;

    const { data, error } = await supabase
      .from('fractional_howitworks_settings')
      .update({
        section_title,
        italic_word,
        background_color,
        text_color,
        muted_text_color,
        accent_color,
        glow_intensity,
        card_background_color,
        card_border_color,
        card_text_color,
        paragraph_one,
        paragraph_one_emphasis,
        paragraph_two,
        paragraph_two_emphasis,
        callout_text,
        callout_emphasis,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating fractional how it works settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
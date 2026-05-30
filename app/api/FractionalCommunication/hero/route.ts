import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('fractional_hero_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching fractional hero settings:', error);
    return NextResponse.json({ error: 'Failed to fetch hero settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      headline,
      italic_words,
      description,
      button_text,
      booking_url,
      background_color,
      background_gradient_colors,
      text_color,
      muted_text_color,
      accent_color,
      glow_color,
      glow_intensity,
      button_background_color,
      button_text_color
    } = body;

    const { data, error } = await supabase
      .from('fractional_hero_settings')
      .update({
        headline,
        italic_words,
        description,
        button_text,
        booking_url,
        background_color,
        background_gradient_colors,
        text_color,
        muted_text_color,
        accent_color,
        glow_color,
        glow_intensity,
        button_background_color,
        button_text_color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating fractional hero settings:', error);
    return NextResponse.json({ error: 'Failed to update hero settings' }, { status: 500 });
  }
}
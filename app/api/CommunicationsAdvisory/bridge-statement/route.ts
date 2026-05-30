import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('advisory_bridge_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching advisory bridge settings:', error);
    return NextResponse.json({ error: 'Failed to fetch bridge settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
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
      .from('advisory_bridge_settings')
      .update({
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
    console.error('Error updating advisory bridge settings:', error);
    return NextResponse.json({ error: 'Failed to update bridge settings' }, { status: 500 });
  }
}
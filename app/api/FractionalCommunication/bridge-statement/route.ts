import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('fractional_bridge_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching fractional bridge settings:', error);
    return NextResponse.json({ error: 'Failed to fetch bridge settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      paragraph_one,
      paragraph_one_emphasis,
      paragraph_two,
      paragraph_two_emphasis,
      closing_text,
      background_color,
      text_color,
      muted_text_color,
      accent_color,
      glow_intensity,
      image_url
    } = body;

    const { data, error } = await supabase
      .from('fractional_bridge_settings')
      .update({
        paragraph_one,
        paragraph_one_emphasis,
        paragraph_two,
        paragraph_two_emphasis,
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
    console.error('Error updating fractional bridge settings:', error);
    return NextResponse.json({ error: 'Failed to update bridge settings' }, { status: 500 });
  }
}
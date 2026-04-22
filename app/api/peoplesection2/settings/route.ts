import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('section2_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch section2 settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      background_color,
      text_color,
      badge_text,
      badge_text_color,
      title_prefix,
      title_suffix,
      title_color,
      description,
      description_color,
      bullets,
      bullet_color,
      button_text,
      button_background_color,
      button_text_color,
      button_hover_color
    } = body;

    const { data, error } = await supabase
      .from('section2_settings')
      .update({
        background_color,
        text_color,
        badge_text,
        badge_text_color,
        title_prefix,
        title_suffix,
        title_color,
        description,
        description_color,
        bullets,
        bullet_color,
        button_text,
        button_background_color,
        button_text_color,
        button_hover_color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update section2 settings' }, { status: 500 });
  }
}
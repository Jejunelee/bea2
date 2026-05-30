import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('section1_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch section1 settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      background_color,
      badge_text,
      badge_text_color,
      title,
      title_color,
      description,
      description_color,
      bullets,
      bullet_color,
      button_text,
      button_background_color,
      button_text_color,
      image_url,
      image_alt
    } = body;

    const { data, error } = await supabase
      .from('section1_settings')
      .update({
        background_color,
        badge_text,
        badge_text_color,
        title,
        title_color,
        description,
        description_color,
        bullets,
        bullet_color,
        button_text,
        button_background_color,
        button_text_color,
        image_url,
        image_alt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update section1 settings' }, { status: 500 });
  }
}
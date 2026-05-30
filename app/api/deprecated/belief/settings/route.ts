import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('belief_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch belief settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      background_image_url, 
      background_color, 
      overlay_opacity,
      hero_badge_text,
      hero_title_prefix,
      hero_title_italic,
      hero_title_suffix,
      content_background_color,
      text_color,
      button_text,
      button_link,
      button_background_color,
      button_text_color
    } = body;

    const { data, error } = await supabase
      .from('belief_settings')
      .update({
        background_image_url,
        background_color,
        overlay_opacity,
        hero_badge_text,
        hero_title_prefix,
        hero_title_italic,
        hero_title_suffix,
        content_background_color,
        text_color,
        button_text,
        button_link,
        button_background_color,
        button_text_color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update belief settings' }, { status: 500 });
  }
}
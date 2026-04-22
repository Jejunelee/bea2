import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('section3_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch section3 settings' }, { status: 500 });
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
      button_hover_color,
      phone_wallpaper_url,
      phone_notification1_name,
      phone_notification1_message,
      phone_notification1_time,
      phone_notification1_icon,
      phone_notification2_name,
      phone_notification2_message,
      phone_notification2_time,
      phone_notification2_icon,
      phone_notification2_badge
    } = body;

    const { data, error } = await supabase
      .from('section3_settings')
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
        phone_wallpaper_url,
        phone_notification1_name,
        phone_notification1_message,
        phone_notification1_time,
        phone_notification1_icon,
        phone_notification2_name,
        phone_notification2_message,
        phone_notification2_time,
        phone_notification2_icon,
        phone_notification2_badge,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update section3 settings' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about_me_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { title_prefix, title_name, highlight_image_url, highlight_image_animation, background_color, text_color, italic_text_color } = body;

    const { data, error } = await supabase
      .from('about_me_settings')
      .update({
        title_prefix,
        title_name,
        highlight_image_url,
        highlight_image_animation,
        background_color,
        text_color,
        italic_text_color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
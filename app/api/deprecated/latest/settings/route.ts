import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('latest_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch latest settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { background_color, title_text, social_links, podcast_title, headphones_image_url } = body;

    const { data, error } = await supabase
      .from('latest_settings')
      .update({
        background_color,
        title_text,
        social_links,
        podcast_title,
        headphones_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update latest settings' }, { status: 500 });
  }
}
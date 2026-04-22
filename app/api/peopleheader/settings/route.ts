import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('individual_header_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch individual header settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      background_gradient_start,
      background_gradient_mid,
      background_gradient_end,
      glow_color,
      glow_opacity,
      title_prefix,
      title_suffix,
      description_prefix,
      description_italic,
      description_suffix,
      scroll_arrow_icon_url
    } = body;

    const { data, error } = await supabase
      .from('individual_header_settings')
      .update({
        background_gradient_start,
        background_gradient_mid,
        background_gradient_end,
        glow_color,
        glow_opacity,
        title_prefix,
        title_suffix,
        description_prefix,
        description_italic,
        description_suffix,
        scroll_arrow_icon_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update individual header settings' }, { status: 500 });
  }
}
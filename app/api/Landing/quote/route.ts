import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('quote_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quote settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      quote_text, 
      styled_words, 
      background_gradient_start, 
      background_gradient_mid, 
      background_gradient_end,
      typing_speed,
      text_color,
      text_size_desktop,
      text_size_mobile,
      show_arrow_icon,
      arrow_icon_url
    } = body;

    const { data, error } = await supabase
      .from('quote_settings')
      .update({
        quote_text,
        styled_words,
        background_gradient_start,
        background_gradient_mid,
        background_gradient_end,
        typing_speed,
        text_color,
        text_size_desktop,
        text_size_mobile,
        show_arrow_icon,
        arrow_icon_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quote settings' }, { status: 500 });
  }
}
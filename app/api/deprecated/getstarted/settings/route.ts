import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('get_started_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch get started settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      background_color_start,
      background_color_mid,
      background_color_end,
      title_prefix,
      title_italic,
      title_suffix,
      button_text,
      button_background_color,
      button_text_color,
      button_hover_color_start,
      button_hover_color_end,
      calendar_event_title,
      calendar_event_details,
      calendar_event_location,
      calendar_event_email
    } = body;

    const { data, error } = await supabase
      .from('get_started_settings')
      .update({
        background_color_start,
        background_color_mid,
        background_color_end,
        title_prefix,
        title_italic,
        title_suffix,
        button_text,
        button_background_color,
        button_text_color,
        button_hover_color_start,
        button_hover_color_end,
        calendar_event_title,
        calendar_event_details,
        calendar_event_location,
        calendar_event_email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update get started settings' }, { status: 500 });
  }
}
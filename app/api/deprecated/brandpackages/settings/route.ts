import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('brand_packages_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brand packages settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      background_color,
      section_title,
      cta_title,
      cta_subtitle,
      cta_button_text,
      cta_button_color,
      cta_button_text_color,
      calendar_event_title,
      calendar_event_details,
      calendar_event_location,
      calendar_event_email
    } = body;

    const { data, error } = await supabase
      .from('brand_packages_settings')
      .update({
        background_color,
        section_title,
        cta_title,
        cta_subtitle,
        cta_button_text,
        cta_button_color,
        cta_button_text_color,
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
    return NextResponse.json({ error: 'Failed to update brand packages settings' }, { status: 500 });
  }
}
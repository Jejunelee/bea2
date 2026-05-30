import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('worked_with_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch worked with settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      background_color,
      text_color,
      heading_prefix,
      heading_brands_italic,
      heading_people_italic,
      heading_suffix,
      divider_color
    } = body;

    const { data, error } = await supabase
      .from('worked_with_settings')
      .update({
        background_color,
        text_color,
        heading_prefix,
        heading_brands_italic,
        heading_people_italic,
        heading_suffix,
        divider_color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update worked with settings' }, { status: 500 });
  }
}
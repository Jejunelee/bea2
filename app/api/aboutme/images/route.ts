import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about_me_images')
      .select('*')
      .order('position', { ascending: true })
      .order('layer_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, image_url, image_name, top_offset, left_offset, right_offset, bottom_offset, width, layer_order } = body;

    const { data, error } = await supabase
      .from('about_me_images')
      .update({
        image_url,
        image_name,
        top_offset,
        left_offset,
        right_offset,
        bottom_offset,
        width,
        layer_order,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}
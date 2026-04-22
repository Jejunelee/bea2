import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('brand_packages_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brand packages items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { display_order, tag, tag_color, title, subtitle, description, bullets, button_text, bg_image_url } = body;

    const { data, error } = await supabase
      .from('brand_packages_items')
      .insert({ display_order, tag, tag_color, title, subtitle, description, bullets, button_text, bg_image_url })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create brand package item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, display_order, tag, tag_color, title, subtitle, description, bullets, button_text, bg_image_url } = body;

    const { data, error } = await supabase
      .from('brand_packages_items')
      .update({ 
        display_order, 
        tag, 
        tag_color, 
        title, 
        subtitle, 
        description, 
        bullets, 
        button_text, 
        bg_image_url,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update brand package item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('brand_packages_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete brand package item' }, { status: 500 });
  }
}
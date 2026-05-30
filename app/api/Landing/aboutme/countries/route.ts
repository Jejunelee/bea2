import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about_me_countries')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { country_name, flag_emoji, display_order } = body;

    const { data, error } = await supabase
      .from('about_me_countries')
      .insert({ country_name, flag_emoji, display_order })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create country' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, country_name, flag_emoji, display_order } = body;

    const { data, error } = await supabase
      .from('about_me_countries')
      .update({ country_name, flag_emoji, display_order, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update country' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('about_me_countries')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete country' }, { status: 500 });
  }
}
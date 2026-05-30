import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('worked_with_brands')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { display_order, name, logo_url, website_url } = body;

    const { data, error } = await supabase
      .from('worked_with_brands')
      .insert({ display_order, name, logo_url, website_url })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, display_order, name, logo_url, website_url } = body;

    const { data, error } = await supabase
      .from('worked_with_brands')
      .update({ 
        display_order, 
        name, 
        logo_url, 
        website_url,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('worked_with_brands')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
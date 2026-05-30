import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('fractional_engagement_steps')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching fractional engagement steps:', error);
    return NextResponse.json({ error: 'Failed to fetch steps' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, display_order } = body;

    const { data, error } = await supabase
      .from('fractional_engagement_steps')
      .insert({ title, description, display_order })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating fractional engagement step:', error);
    return NextResponse.json({ error: 'Failed to create step' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, display_order } = body;

    const { data, error } = await supabase
      .from('fractional_engagement_steps')
      .update({ 
        title, 
        description, 
        display_order,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating fractional engagement step:', error);
    return NextResponse.json({ error: 'Failed to update step' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const { error } = await supabase
      .from('fractional_engagement_steps')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting fractional engagement step:', error);
    return NextResponse.json({ error: 'Failed to delete step' }, { status: 500 });
  }
}
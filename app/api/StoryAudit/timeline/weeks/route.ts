import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('audit_timeline_weeks')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching timeline weeks:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline weeks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { week_number, title, description, display_order } = body;

    const { data, error } = await supabase
      .from('audit_timeline_weeks')
      .insert({ week_number, title, description, display_order })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating timeline week:', error);
    return NextResponse.json({ error: 'Failed to create timeline week' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, week_number, title, description, display_order } = body;

    const { data, error } = await supabase
      .from('audit_timeline_weeks')
      .update({ 
        week_number, 
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
    console.error('Error updating timeline week:', error);
    return NextResponse.json({ error: 'Failed to update timeline week' }, { status: 500 });
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
      .from('audit_timeline_weeks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting timeline week:', error);
    return NextResponse.json({ error: 'Failed to delete timeline week' }, { status: 500 });
  }
}
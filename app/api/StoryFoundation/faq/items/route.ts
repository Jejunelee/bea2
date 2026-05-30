import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('foundation_faq_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching foundation FAQ items:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, answer, display_order } = body;

    const { data, error } = await supabase
      .from('foundation_faq_items')
      .insert({ question, answer, display_order })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating foundation FAQ item:', error);
    return NextResponse.json({ error: 'Failed to create FAQ item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, question, answer, display_order } = body;

    const { data, error } = await supabase
      .from('foundation_faq_items')
      .update({ 
        question, 
        answer, 
        display_order,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating foundation FAQ item:', error);
    return NextResponse.json({ error: 'Failed to update FAQ item' }, { status: 500 });
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
      .from('foundation_faq_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting foundation FAQ item:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ item' }, { status: 500 });
  }
}
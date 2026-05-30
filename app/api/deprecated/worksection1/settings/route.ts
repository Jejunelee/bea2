import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('social_feed_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch social feed settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      background_gradient_start,
      background_gradient_end,
      search_placeholder,
      expand_all_text,
      collapse_all_text,
      no_results_text,
      clear_search_text
    } = body;

    const { data, error } = await supabase
      .from('social_feed_settings')
      .update({
        background_gradient_start,
        background_gradient_end,
        search_placeholder,
        expand_all_text,
        collapse_all_text,
        no_results_text,
        clear_search_text,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update social feed settings' }, { status: 500 });
  }
}
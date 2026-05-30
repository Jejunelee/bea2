import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('audit_problem_statement')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch problem statement' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      section_title,
      italic_word,
      background_color,
      text_color,
      muted_text_color,
      accent_color,
      glow_intensity,
      card_background_color,
      opening_statement,
      opening_emphasis_phrase,
      fragmented_items,
      consequence_statement,
      consequence_emphasis_words,
      resolution_statement,
      image_url
    } = body;

    const { data, error } = await supabase
      .from('audit_problem_statement')
      .update({
        section_title,
        italic_word,
        background_color,
        text_color,
        muted_text_color,
        accent_color,
        glow_intensity,
        card_background_color,
        opening_statement,
        opening_emphasis_phrase,
        fragmented_items,
        consequence_statement,
        consequence_emphasis_words,
        resolution_statement,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update problem statement' }, { status: 500 });
  }
}
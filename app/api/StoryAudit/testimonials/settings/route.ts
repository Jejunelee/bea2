import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('audit_testimonials_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching testimonials settings:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      section_title,
      italic_word,
      background_gradient_start,
      background_gradient_middle,
      background_gradient_end,
      text_color,
      muted_text_color,
      author_text_color,
      accent_color,
      glow_intensity,
      quote_emphasis_phrases
    } = body;

    const { data, error } = await supabase
      .from('audit_testimonials_settings')
      .update({
        section_title,
        italic_word,
        background_gradient_start,
        background_gradient_middle,
        background_gradient_end,
        text_color,
        muted_text_color,
        author_text_color,
        accent_color,
        glow_intensity,
        quote_emphasis_phrases,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating testimonials settings:', error);
    return NextResponse.json({ error: 'Failed to update testimonials settings' }, { status: 500 });
  }
}
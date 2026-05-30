import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('social_feed_platforms')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch platforms' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, display_name, icon_class, icon_gradient, follow_link, follow_text, is_active, display_order } = body;

    const { data, error } = await supabase
      .from('social_feed_platforms')
      .update({
        display_name,
        icon_class,
        icon_gradient,
        follow_link,
        follow_text,
        is_active,
        display_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update platform' }, { status: 500 });
  }
}
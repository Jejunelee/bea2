import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('hero_images')
      .select('*');

    if (error) throw error;

    const imagesMap = (data || []).reduce((acc, img) => {
      acc[img.image_key] = img.image_url;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(imagesMap);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
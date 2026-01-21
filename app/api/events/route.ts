import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface EventFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  image: File | null;
  variationCategories: Array<{
    name: string;
    options: Array<{
      label: string;
      price: number;
    }>;
  }>;
}


export async function GET() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}


//Criar evento
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const price = formData.get("price") as string
    const image = formData.get("image") as File | null

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Title, description and category are required" },
        { status: 400 }
      )
    }

    let variationCategories = []
    const variationsRaw = formData.get("variationCategories")
    if (variationsRaw) {
      variationCategories = JSON.parse(variationsRaw as string)
    }

    let imageUrl: string | null = null

    if (image && image.size > 0) {
      const ext = image.name.split(".").pop()
      const filePath = `events/${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("upload")
        .upload(filePath, image)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from("upload")
        .getPublicUrl(filePath)

      imageUrl = data.publicUrl
    }

    const { data, error } = await supabase
      .from("events")
      .insert({
        title,
        description,
        category,
        price: variationCategories.length === 0 ? Number(price) : null,
        image: imageUrl,
        variation_categories: variationCategories,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("POST /events error:", error)
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
}

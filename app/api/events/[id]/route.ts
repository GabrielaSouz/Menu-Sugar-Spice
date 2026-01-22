import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Função para verificar e criar o bucket se não existir
async function ensureBucketExists(bucketName: string) {
  try {
    const { data: bucket, error } = await supabase.storage.getBucket(bucketName);
    
    if (error) {
      if (error.message.includes('not found')) {
        console.log(`Bucket ${bucketName} não encontrado. Tentando criar...`);
        return true;
      }
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar bucket:', error);
    return true;
  }
}

// GET - Obter um evento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Evento não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um evento específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  try {
    const formData = await request.formData()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const price = formData.get("price") as string
    const image = formData.get("image") as File | null

    console.log('PUT - Dados recebidos:', { 
      title, 
      description, 
      category, 
      price, 
      image: image ? `${image.name} (${image.size} bytes)` : null 
    })

    let variationCategories = []
    const variationsRaw = formData.get("variationCategories")
    if (variationsRaw) {
      variationCategories = JSON.parse(variationsRaw as string)
    }

    const updateData: any = {
      title,
      description,
      category,
      price: variationCategories.length === 0 ? Number(price) : null,
      variation_categories: variationCategories,
     
    }

    if (image && image.size > 0) {
      console.log('Iniciando upload da imagem:', image.name, image.size, 'bytes')
      const ext = image.name.split(".").pop()
      const filePath = `events/${crypto.randomUUID()}.${ext}`
      console.log('Caminho do arquivo:', filePath)

      const { error: uploadError } = await supabase.storage
        .from("upload")
        .upload(filePath, image)

      if (uploadError) {
        console.error('Erro no upload:', uploadError)
        throw uploadError
      }

      const { data } = supabase.storage
        .from("upload")
        .getPublicUrl(filePath)

      console.log('Upload realizado. URL:', data.publicUrl)
      updateData.image = data.publicUrl
    } else {
      console.log('Nenhuma imagem enviada ou imagem vazia')
    }

    const { data, error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("PUT /events/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    )
  }
}


// DELETE - Remover um evento específico
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  try {
    const { data: event } = await supabase
      .from("events")
      .select("image")
      .eq("id", id)
      .single()

    if (event?.image) {
      const path = event.image.split("/upload/")[1]
      if (path) {
        await supabase.storage.from("upload").remove([path])
      }
    }

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /events/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    )
  }
}

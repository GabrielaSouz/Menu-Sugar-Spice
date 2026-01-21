import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { error: 'Promotion ID is required' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete promotion' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}

// Add this code to your existing file
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
      const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    
    const { data, error } = await supabase
      .from('promotions')
      .update({
        ...updateData
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to update promotion' },
      { status: 500 }
    );
  }
}


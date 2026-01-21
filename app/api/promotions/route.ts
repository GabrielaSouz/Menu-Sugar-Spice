import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all promotions
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

// CREATE a new promotion
export async function POST(request: Request) {
  try {
    const promotionData = await request.json();
    
    // Validate required fields
    if (!promotionData.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('promotions')
      .insert([{
        message: promotionData.message,
        active: promotionData.active ?? true,
        expires_at: promotionData.expiresAt, // Make sure this matches your database column name
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to create promotion' },
      { status: 500 }
    );
  }
}



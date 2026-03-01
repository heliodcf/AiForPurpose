# Next.js API Routes (CRM Kanban)

Como solicitado, aqui estão as rotas de API para um ambiente Next.js (App Router ou Pages Router). 
No seu sistema atual (Vite SPA), nós chamamos o Supabase diretamente do frontend (`services/db.ts`), mas se você migrar para Next.js, você pode usar estas rotas.

## 1. GET e POST `/api/projects/route.ts` (App Router)

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service_role for admin routes if bypassing RLS, or anon key if passing user token
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        lead:leads(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lead_id, notes, estimated_value } = body;

    if (!lead_id) {
      return NextResponse.json({ error: 'lead_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        lead_id,
        status: 'entrada_lead',
        notes,
        estimated_value
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## 2. PATCH `/api/projects/[id]/route.ts` (App Router)

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Extrair apenas os campos permitidos para atualização
    const { status, estimated_value, probability, expected_close_date, notes } = body;
    
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (estimated_value !== undefined) updateData.estimated_value = estimated_value;
    if (probability !== undefined) updateData.probability = probability;
    if (expected_close_date !== undefined) updateData.expected_close_date = expected_close_date;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

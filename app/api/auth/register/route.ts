import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      )
    }

    console.log('Tentando criar usuário:', { email, name })

    // 1. Cria o usuário no auth (sem confirmação de email)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name, // salva como metadata do usuário
        },
        emailRedirectTo: undefined, // desabilita confirmação de email
      },
    })

    if (authError) {
      console.error('Erro no auth:', authError)
      
      // Tratamento específico para email provider disabled
      if (authError.code === 'email_provider_disabled') {
        return NextResponse.json({ 
          error: "Registros por email estão desabilitados. Entre em contato com o administrador." 
        }, { status: 400 })
      }
      
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    console.log('Usuário criado no auth:', authData.user?.id)

    // 2. Tenta criar o perfil na tabela profiles (se existir)
    if (authData.user) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: name,
            email: email,
          })

        if (profileError) {
          console.error('Erro ao criar perfil (tabela profiles pode não existir):', profileError)
          
          // Se a tabela não existir, continua sem o perfil
          if (profileError.code === 'PGRST205' || profileError.code === 'PGRST116') {
            console.log('Tabela profiles não existe, continuando sem perfil...')
            // Não retorna erro, apenas continua
          } else {
            // Outros erros
            return NextResponse.json({ 
              error: `Erro ao criar perfil: ${profileError.message}` 
            }, { status: 500 })
          }
        } else {
          console.log('Perfil criado com sucesso')
        }
      } catch (profileError) {
        console.error('Erro inesperado ao criar perfil:', profileError)
        // Continua mesmo se falhar o perfil
      }
    }

    return NextResponse.json({ 
      success: true, 
      user: authData.user,
      session: authData.session, // inclui a sessão para login automático
      message: "Usuário criado com sucesso!"
    })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json({ 
      error: `Erro interno do servidor: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}

'use server'

import { createClient } from '@/utils/supabase/server'
import { Note } from '@/lib/types'

export async function getNotes(): Promise<Note[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('notebooks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return data.map(note => ({
    id: note.id,
    category: note.category,
    content: note.content,
    updatedAt: note.created_at
  }))
}

export async function addNote(category: string, content: string): Promise<Note> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('notebooks')
    .insert([{ user_id: user.id, category, content }])
    .select()
    .single()

  if (error) throw new Error(error.message)

  return {
    id: data.id,
    category: data.category,
    content: data.content,
    updatedAt: data.created_at
  }
}

export async function updateNote(id: string, category: string, content: string): Promise<Note> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('notebooks')
    .update({ category, content })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return {
    id: data.id,
    category: data.category,
    content: data.content,
    updatedAt: data.created_at
  }
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('notebooks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}

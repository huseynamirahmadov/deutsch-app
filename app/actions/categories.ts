'use server'

import { createClient } from '@/utils/supabase/server'
import { Category } from '@/lib/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  return data
}

export async function seedDefaultCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const defaultCategories = ['Grammar', 'Vocabulary', 'Phrases', 'General']
  const inserts = defaultCategories.map(name => ({
    user_id: user.id,
    name
  }))

  const { data, error } = await supabase
    .from('categories')
    .insert(inserts)
    .select()

  if (error) throw new Error(error.message)

  return data
}

export async function addCategory(name: string): Promise<Category> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('categories')
    .insert([{ user_id: user.id, name }])
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function updateCategory(categoryId: string, oldName: string, newName: string): Promise<Category> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 1. Update the category name
  const { data, error } = await supabase
    .from('categories')
    .update({ name: newName })
    .eq('id', categoryId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // 2. Update any existing notes referencing the old category name
  const { error: notesError } = await supabase
    .from('notebooks')
    .update({ category: newName })
    .eq('user_id', user.id)
    .eq('category', oldName)

  if (notesError) {
    console.error('Failed to update notes category references:', notesError)
    // We don't necessarily throw here, as the category was successfully renamed
  }

  return data
}

export async function deleteCategory(categoryId: string, name: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 1. Ensure "General" category exists for reassignment
  let generalCategoryName = 'General'
  const { data: generalCategories } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', user.id)
    .eq('name', 'General')
    .limit(1)

  if (!generalCategories || generalCategories.length === 0) {
    // Recreate General if it doesn't exist
    await addCategory('General')
  }

  // 2. Reassign notes from the deleted category to "General"
  const { error: reassignError } = await supabase
    .from('notebooks')
    .update({ category: 'General' })
    .eq('user_id', user.id)
    .eq('category', name)

  if (reassignError) {
    throw new Error('Failed to reassign notes: ' + reassignError.message)
  }

  // 3. Delete the category itself
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}

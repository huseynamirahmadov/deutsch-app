'use server'

import { createClient } from '@/utils/supabase/server'

export async function getXp(): Promise<number> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { data, error } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single()

  if (error || !data) return 0

  return data.xp
}

export async function addXpToProfile(amount: number): Promise<number> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // We do a simple read/update here. In a production scenario, you would use
  // an RPC call in Supabase to atomically increment the XP to prevent race conditions.
  const { data: currentData, error: readError } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single()

  if (readError) throw new Error(readError.message)

  const newXp = (currentData?.xp || 0) + amount

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ xp: newXp })
    .eq('id', user.id)

  if (updateError) throw new Error(updateError.message)

  return newXp
}

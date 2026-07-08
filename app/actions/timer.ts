'use server'

import { createClient } from '@/utils/supabase/server'
import { TimerStateDB } from '@/lib/types'

const POMODORO_SECONDS = 25 * 60; // 25 minutes

export async function getOrInitTimerState(): Promise<TimerStateDB> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Try to fetch existing
  const { data, error } = await supabase
    .from('timer_states')
    .select('*')
    .eq('id', user.id)
    .single()

  if (data && !error) {
    return data as TimerStateDB
  }

  // If not found, create one
  const { data: newData, error: insertError } = await supabase
    .from('timer_states')
    .insert([{ 
      id: user.id, 
      is_running: false, 
      start_time: null, 
      duration_seconds: POMODORO_SECONDS 
    }])
    .select()
    .single()

  if (insertError) throw new Error(insertError.message)
  return newData as TimerStateDB
}

export async function updateTimerState(isRunning: boolean, durationSeconds: number, startTime: string | null): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('timer_states')
    .update({ 
      is_running: isRunning, 
      duration_seconds: durationSeconds, 
      start_time: startTime 
    })
    .eq('id', user.id)

  if (error) throw new Error(error.message)
}

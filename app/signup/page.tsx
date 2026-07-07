'use client'

import { useState } from 'react'
import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { Loader2, AlertTriangle, UserPlus } from 'lucide-react'

export default function SignupPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignup(formData: FormData) {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      await signup(formData)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign up')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-4">
      <div className="w-full max-w-md p-8 glass-card space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <span className="text-amber-500">D</span>eutschLern
          </h1>
          <p className="text-slate-400 mt-2">Create an account to start your learning journey</p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-rose-400 text-sm">{errorMsg}</p>
          </div>
        )}

        <form action={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full input-field"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full input-field"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

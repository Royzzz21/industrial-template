import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore, useSettingsStore } from '@/stores'

interface Values { email: string; password: string }

export function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)
  const admin = useSettingsStore((s) => s.settings.admin)
  const navigate = useNavigate()
  const location = useLocation()
  const [failed, setFailed] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Values>()

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const onSubmit = (v: Values) => {
    if (login(v.email, v.password)) {
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from !== '/admin/login' ? from : '/admin', { replace: true })
    } else {
      setFailed(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-steel px-4 py-10">
      <div className="w-full max-w-md">
        <Logo light className="mb-8 justify-center" />
        <div className="rounded-md bg-white p-6 shadow-xl sm:p-8">
          <h1 className="text-3xl">Sign in to admin</h1>
          <p className="mt-1 text-sm text-steel-500">Manage products, categories, carousel slides and enquiries.</p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
            <Input label="Email" type="email" autoComplete="username" error={errors.email?.message} {...register('email', { required: 'Enter your email' })} />
            <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password', { required: 'Enter your password' })} />
            {failed && (
              <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                Email or password is incorrect.
              </p>
            )}
            <Button type="submit" className="w-full" size="lg">
              Sign in
            </Button>
          </form>
          <div className="mt-6 flex gap-3 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              Demo authentication. Replace with a real backend before production. Demo login: <strong>{admin.email}</strong> / <strong>{admin.password}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

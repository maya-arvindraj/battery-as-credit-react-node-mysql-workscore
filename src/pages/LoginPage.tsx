import { useState } from 'react'
import { Logo, PrimaryButton } from '../components/shared'
import { api, setAuth } from '../api'
import { type NavigateFn } from '../types'

export default function LoginPage({ navigate }: { navigate: NavigateFn }) {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setError('')
    setBusy(true)

    try {
      const formattedMobile = mobile.startsWith('+91')
        ? mobile
        : `+91${mobile}`

      const r =
        tab === 'login'
          ? await api.login({
              mobile: formattedMobile,
              password
            })
          : await api.register({
              name: name || 'Rider',
              mobile: formattedMobile,
              email: email || undefined,
              password,
              role: 'rider'
            })

      setAuth(r.access_token, r.user)

      if (r.user.role === 'lender') {
        navigate('lender-dashboard')
      } else {
        navigate('kyc')
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <Logo navigate={navigate} />
      </header>

      <div className="flex-1 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full max-w-md p-8">

          <div className="flex bg-slate-100 rounded-xl p-1 mb-8">

            <button
              onClick={() => {
                setTab('login')
                setError('')
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-600 ${
                tab === 'login' ? 'bg-white shadow-sm' : ''
              }`}
            >
              Login
            </button>

            <button
              onClick={() => {
                setTab('signup')
                setError('')
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-600 ${
                tab === 'signup' ? 'bg-white shadow-sm' : ''
              }`}
            >
              Sign Up
            </button>

          </div>

          <h1 className="font-display font-700 text-2xl text-slate-900 mb-1">
            {tab === 'login'
              ? 'Welcome back'
              : 'Create rider account'}
          </h1>

          <p className="text-slate-500 text-sm mb-6">
            {tab === 'login'
              ? 'Use your mobile number to access Battery-as-Credit.'
              : 'Create your rider account to access Battery-as-Credit.'}
          </p>

          <div className="space-y-4">

            {tab === 'signup' && (
              <>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                />

                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                />
              </>
            )}

            <input
              value={mobile}
              onChange={e =>
                setMobile(
                  e.target.value.replace(/\D/g, '').slice(-10)
                )
              }
              placeholder="Mobile number"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
            />

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
            />

          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <PrimaryButton
            className="w-full justify-center flex mt-6"
            onClick={submit}
          >
            {busy
              ? 'Please wait…'
              : tab === 'login'
                ? 'Login'
                : 'Create Rider Account'}
          </PrimaryButton>

          <button
            onClick={() => navigate('lender-login')}
            className="w-full mt-5 text-xs text-slate-400 hover:text-green-600"
          >
            Are you a lender? Access Lender Portal →
          </button>

        </div>
      </div>
    </div>
  )
}
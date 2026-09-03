import { useState } from 'react'
import { LenderSidebar } from '../components/shared'
import { logout, user } from '../api'
import { type NavigateFn } from '../types'

export default function SettingsPage({
  navigate,
}: {
  navigate: NavigateFn
}) {
  const currentUser = user()

  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [saved, setSaved] = useState(false)

  const saveSettings = () => {
    localStorage.setItem(
      'bac_lender_notifications',
      JSON.stringify({
        notifications,
        emailAlerts,
      })
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('landing')
  }

  return (
    <div className="flex h-screen bg-slate-50">

      {/* Sidebar */}
      <LenderSidebar
        currentPage="settings"
        navigate={navigate}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="bg-white border-b px-8 py-5">
          <h1 className="font-display font-700 text-2xl text-slate-900">
            Settings
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your lender account and preferences
          </p>
        </div>

        <div className="p-8 max-w-4xl space-y-6">

          {/* Account */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            <div className="p-6 border-b">
              <h2 className="font-display font-700 text-lg">
                Account
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your lender account information
              </p>
            </div>

            <div className="p-6 space-y-5">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Name
                  </p>

                  <p className="font-600 mt-1">
                    {currentUser?.name || 'Lender'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-5">
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-600 mt-1">
                  {currentUser?.email || '—'}
                </p>
              </div>

              <div className="border-t pt-5">
                <p className="text-sm text-slate-500">
                  Account Type
                </p>

                <p className="font-600 mt-1 capitalize">
                  {currentUser?.role || 'Lender'}
                </p>
              </div>

            </div>

          </section>

          {/* Notifications */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            <div className="p-6 border-b">
              <h2 className="font-display font-700 text-lg">
                Notifications
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Control how you receive lender updates
              </p>
            </div>

            <div className="divide-y">

              {/* Notifications Toggle */}
              <div className="p-6 flex items-center justify-between">

                <div>
                  <p className="font-600">
                    Application Notifications
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Get notified when new financing applications
                    are submitted.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setNotifications(!notifications)
                  }
                  className={`relative w-12 h-6 rounded-full transition ${
                    notifications
                      ? 'bg-green-500'
                      : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      notifications
                        ? 'left-7'
                        : 'left-1'
                    }`}
                  />
                </button>

              </div>

              {/* Email Toggle */}
              <div className="p-6 flex items-center justify-between">

                <div>
                  <p className="font-600">
                    Email Alerts
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Receive important portfolio and repayment
                    updates by email.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEmailAlerts(!emailAlerts)
                  }
                  className={`relative w-12 h-6 rounded-full transition ${
                    emailAlerts
                      ? 'bg-green-500'
                      : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      emailAlerts
                        ? 'left-7'
                        : 'left-1'
                    }`}
                  />
                </button>

              </div>

            </div>

          </section>

          {/* Save */}
          <div className="flex items-center justify-end gap-4">

            {saved && (
              <span className="text-sm text-green-600 font-600">
                Settings saved ✓
              </span>
            )}

            <button
              onClick={saveSettings}
              className="px-6 py-3 rounded-xl bg-green-600 text-white font-600 hover:bg-green-700 transition"
            >
              Save Changes
            </button>

          </div>

          {/* Security */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            <div className="p-6 border-b">
              <h2 className="font-display font-700 text-lg">
                Security
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage your current session
              </p>
            </div>

            <div className="p-6">

              <button
                onClick={handleLogout}
                className="px-5 py-3 rounded-xl bg-red-50 text-red-700 font-600 hover:bg-red-100 transition"
              >
                Logout
              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  )
}
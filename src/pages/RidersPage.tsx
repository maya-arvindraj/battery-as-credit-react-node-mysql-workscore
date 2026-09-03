import { useEffect, useState } from 'react'
import { LenderSidebar, Badge } from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'

export default function RidersPage({
  navigate,
}: {
  navigate: NavigateFn
}) {
  const [riders, setRiders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.lenderRiders()
      .then((data) => {
        setRiders(data)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load riders')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex h-screen bg-slate-50">

      <LenderSidebar
        currentPage="riders"
        navigate={navigate}
      />

      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="bg-white border-b px-8 py-5">
          <h1 className="font-display font-700 text-2xl text-slate-900">
            Riders
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            View and monitor all registered riders
          </p>
        </div>

        <div className="p-8">

          {/* Loading */}
          {loading && (
            <div className="bg-white border rounded-2xl p-8 text-center text-slate-500">
              Loading riders...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
              {error}
            </div>
          )}

          {/* Riders table */}
          {!loading && !error && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

              <div className="p-6 border-b">
                <h2 className="font-display font-700 text-lg">
                  All Riders
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {riders.length} rider{riders.length !== 1 ? 's' : ''} registered
                </p>
              </div>

              {riders.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  No riders found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">

                    <thead>
                      <tr className="bg-slate-50 text-xs text-slate-500 text-left">
                        <th className="p-4">Rider</th>
                        <th className="p-4">Mobile</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">WorkScore</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {riders.map((rider) => (
                        <tr
                          key={rider.id}
                          className="border-t hover:bg-slate-50"
                        >

                          <td className="p-4">
                            <div className="font-600 text-slate-900">
                              {rider.name || 'Unknown Rider'}
                            </div>

                            <div className="text-xs text-slate-400">
                              #{rider.id}
                            </div>
                          </td>

                          <td className="p-4 text-sm text-slate-600">
                            {rider.mobile || '—'}
                          </td>

                          <td className="p-4 text-sm text-slate-600">
                            {rider.email || '—'}
                          </td>

                          <td className="p-4">
                            {rider.workscore !== undefined &&
                            rider.workscore !== null ? (
                              <span className="font-600">
                                {rider.workscore}/100
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>

                          <td className="p-4">
                            <Badge
                              variant={
                                rider.status === 'Eligible'
                                  ? 'green'
                                  : rider.status === 'Rejected'
                                  ? 'red'
                                  : 'yellow'
                              }
                            >
                              {rider.status || 'Active'}
                            </Badge>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  )
}
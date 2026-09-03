import { useEffect, useState } from 'react'
import { LenderSidebar, Badge } from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'

export default function ApplicationsPage({
  navigate,
}: {
  navigate: NavigateFn
}) {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.lenderApplications()
      .then((data) => {
        setApplications(data)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load applications')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const openApplication = (id: number) => {
    localStorage.setItem(
      'bac_selected_application',
      String(id)
    )

    navigate('application-details')
  }

  return (
    <div className="flex h-screen bg-slate-50">

      {/* Sidebar */}
      <LenderSidebar
        currentPage="applications"
        navigate={navigate}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="bg-white border-b px-8 py-5">
          <h1 className="font-display font-700 text-2xl text-slate-900">
            Applications
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Review rider financing applications
          </p>
        </div>

        <div className="p-8">

          {/* Loading */}
          {loading && (
            <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">
              Loading applications...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
              {error}
            </div>
          )}

          {/* Applications */}
          {!loading && !error && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

              {/* Card Header */}
              <div className="p-6 border-b">
                <h2 className="font-display font-700 text-lg">
                  Financing Applications
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {applications.length}{' '}
                  application
                  {applications.length !== 1 ? 's' : ''}
                </p>
              </div>

              {applications.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  No applications found.
                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>
                      <tr className="bg-slate-50 text-xs text-slate-500 text-left">

                        <th className="p-4">
                          Rider
                        </th>

                        <th className="p-4">
                          WorkScore
                        </th>

                        <th className="p-4">
                          Earnings
                        </th>

                        <th className="p-4">
                          Requested
                        </th>

                        <th className="p-4">
                          Tenure
                        </th>

                        <th className="p-4">
                          Status
                        </th>

                        <th className="p-4">
                          Action
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {applications.map((application) => (

                        <tr
                          key={application.id}
                          className="border-t hover:bg-slate-50"
                        >

                          {/* Rider */}
                          <td className="p-4">

                            <div className="font-600 text-slate-900">
                              {application.rider ||
                                application.rider_name ||
                                'Unknown Rider'}
                            </div>

                            <div className="text-xs text-slate-400">
                              #{application.id}
                            </div>

                          </td>

                          {/* WorkScore */}
                          <td className="p-4">

                            {application.workscore !== undefined &&
                            application.workscore !== null ? (
                              <span className="font-600">
                                {application.workscore}/100
                              </span>
                            ) : (
                              '—'
                            )}

                          </td>

                          {/* Earnings */}
                          <td className="p-4 text-sm">

                            {application.monthly_earnings !==
                            undefined &&
                            application.monthly_earnings !== null
                              ? `₹${Number(
                                  application.monthly_earnings
                                ).toLocaleString('en-IN')}`
                              : '—'}

                          </td>

                          {/* Requested */}
                          <td className="p-4 font-600">

                            {application.financing_requested !==
                            undefined &&
                            application.financing_requested !== null
                              ? `₹${Number(
                                  application.financing_requested
                                ).toLocaleString('en-IN')}`
                              : '—'}

                          </td>

                          {/* Tenure */}
                          <td className="p-4 text-sm">

                            {application.tenure_months
                              ? `${application.tenure_months} months`
                              : '—'}

                          </td>

                          {/* Status */}
                          <td className="p-4">

                            <Badge
                              variant={
                                application.status === 'Approved'
                                  ? 'green'
                                  : application.status === 'Rejected'
                                  ? 'red'
                                  : 'yellow'
                              }
                            >
                              {application.status || 'Pending'}
                            </Badge>

                          </td>

                          {/* Action */}
                          <td className="p-4">

                            <button
                              onClick={() =>
                                openApplication(application.id)
                              }
                              className="text-green-600 text-sm font-600 hover:text-green-700"
                            >
                              Review →
                            </button>

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
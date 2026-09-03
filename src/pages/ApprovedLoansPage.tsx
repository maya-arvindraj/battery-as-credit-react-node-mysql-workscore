import { useEffect, useState } from 'react'
import { LenderSidebar, Badge } from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'

export default function ApprovedLoansPage({
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
        const approved = data.filter(
          (application: any) =>
            application.status === 'Approved'
        )

        setApplications(approved)
      })
      .catch((err) => {
        setError(
          err.message || 'Failed to load approved loans'
        )
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
        currentPage="approved"
        navigate={navigate}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="bg-white border-b px-8 py-5">
          <h1 className="font-display font-700 text-2xl text-slate-900">
            Approved Loans
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            View all approved rider financing loans
          </p>
        </div>

        <div className="p-8">

          {/* Loading */}
          {loading && (
            <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">
              Loading approved loans...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
              {error}
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <div className="space-y-6">

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">

                <div className="bg-white border rounded-2xl p-5">
                  <div className="text-2xl">✅</div>

                  <div className="text-2xl font-display font-700 mt-2">
                    {applications.length}
                  </div>

                  <div className="text-sm text-slate-500">
                    Approved Loans
                  </div>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                  <div className="text-2xl">💰</div>

                  <div className="text-2xl font-display font-700 mt-2">
                    ₹
                    {applications
                      .reduce(
                        (
                          total: number,
                          application: any
                        ) =>
                          total +
                          Number(
                            application.financing_requested || 0
                          ),
                        0
                      )
                      .toLocaleString('en-IN')}
                  </div>

                  <div className="text-sm text-slate-500">
                    Total Financing
                  </div>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                  <div className="text-2xl">📊</div>

                  <div className="text-2xl font-display font-700 mt-2">
                    {applications.length > 0
                      ? Math.round(
                          applications.reduce(
                            (
                              total: number,
                              application: any
                            ) =>
                              total +
                              Number(
                                application.workscore || 0
                              ),
                            0
                          ) / applications.length
                        )
                      : 0}
                    /100
                  </div>

                  <div className="text-sm text-slate-500">
                    Average WorkScore
                  </div>
                </div>

              </div>

              {/* Loans Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                <div className="p-6 border-b">
                  <h2 className="font-display font-700 text-lg">
                    Approved Financing
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {applications.length} approved loan
                    {applications.length !== 1
                      ? 's'
                      : ''}
                  </p>
                </div>

                {applications.length === 0 ? (
                  <div className="p-10 text-center text-slate-500">
                    No approved loans found.
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
                            Financing
                          </th>

                          <th className="p-4">
                            Tenure
                          </th>

                          <th className="p-4">
                            Monthly Payment
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

                        {applications.map(
                          (application: any) => (

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
                                {application.workscore !==
                                  undefined &&
                                application.workscore !==
                                  null
                                  ? `${application.workscore}/100`
                                  : '—'}
                              </td>

                              {/* Financing */}
                              <td className="p-4 font-600">
                                {application.financing_requested !==
                                  undefined &&
                                application.financing_requested !==
                                  null
                                  ? `₹${Number(
                                      application.financing_requested
                                    ).toLocaleString(
                                      'en-IN'
                                    )}`
                                  : '—'}
                              </td>

                              {/* Tenure */}
                              <td className="p-4 text-sm">
                                {application.tenure_months
                                  ? `${application.tenure_months} months`
                                  : '—'}
                              </td>

                              {/* Monthly Payment */}
                              <td className="p-4 font-600">
                                {application.monthly_payment !==
                                  undefined &&
                                application.monthly_payment !==
                                  null
                                  ? `₹${Number(
                                      application.monthly_payment
                                    ).toLocaleString(
                                      'en-IN'
                                    )}`
                                  : '—'}
                              </td>

                              {/* Status */}
                              <td className="p-4">
                                <Badge variant="green">
                                  Approved
                                </Badge>
                              </td>

                              {/* Action */}
                              <td className="p-4">
                                <button
                                  onClick={() =>
                                    openApplication(
                                      application.id
                                    )
                                  }
                                  className="text-green-600 text-sm font-600 hover:text-green-700"
                                >
                                  View →
                                </button>
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  )
}
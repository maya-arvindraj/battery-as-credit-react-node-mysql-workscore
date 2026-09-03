import { useEffect, useState } from 'react'
import { LenderSidebar, Badge } from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'

export default function LenderRepaymentsPage({
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
          err.message || 'Failed to load repayments'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex h-screen bg-slate-50">

      {/* Sidebar */}
      <LenderSidebar
        currentPage="lender-repayments"
        navigate={navigate}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="bg-white border-b px-8 py-5">
          <h1 className="font-display font-700 text-2xl text-slate-900">
            Repayments
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Monitor repayment status across approved loans
          </p>
        </div>

        <div className="p-8">

          {/* Loading */}
          {loading && (
            <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">
              Loading repayments...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6">

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">

                <div className="bg-white border rounded-2xl p-5">
                  <div className="text-2xl">💳</div>

                  <div className="text-2xl font-display font-700 mt-2">
                    {applications.length}
                  </div>

                  <div className="text-sm text-slate-500">
                    Active Loans
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
                    Total Loan Value
                  </div>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                  <div className="text-2xl">📅</div>

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
                                application.monthly_payment || 0
                              ),
                            0
                          )
                        )
                      : 0}
                  </div>

                  <div className="text-sm text-slate-500">
                    Monthly Collection
                  </div>
                </div>

              </div>

              {/* Repayment Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                <div className="p-6 border-b">
                  <h2 className="font-display font-700 text-lg">
                    Loan Repayments
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Repayment information for approved loans
                  </p>
                </div>

                {applications.length === 0 ? (
                  <div className="p-10 text-center text-slate-500">
                    No active loans found.
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
                            Loan Amount
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

                              {/* Loan Amount */}
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
                                  Active
                                </Badge>
                              </td>

                              {/* Action */}
                              <td className="p-4">
                                <button
                                  onClick={() => {
                                    localStorage.setItem(
                                      'bac_selected_application',
                                      String(
                                        application.id
                                      )
                                    )

                                    navigate(
                                      'application-details'
                                    )
                                  }}
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
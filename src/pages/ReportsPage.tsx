import { useEffect, useState } from 'react'
import { LenderSidebar, BarChart } from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'

export default function ReportsPage({
  navigate,
}: {
  navigate: NavigateFn
}) {
  const [summary, setSummary] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.lenderSummary(),
      api.lenderApplications(),
    ])
      .then(([summaryData, applicationsData]) => {
        setSummary(summaryData)
        setApplications(applicationsData)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load reports')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <LenderSidebar
          currentPage="reports"
          navigate={navigate}
        />

        <main className="flex-1 p-10">
          <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">
            Loading reports...
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-slate-50">
        <LenderSidebar
          currentPage="reports"
          navigate={navigate}
        />

        <main className="flex-1 p-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
            {error}
          </div>
        </main>
      </div>
    )
  }

  const approved = applications.filter(
    (a) => a.status === 'Approved'
  ).length

  const pending = applications.filter(
    (a) => a.status === 'Pending'
  ).length

  const rejected = applications.filter(
    (a) => a.status === 'Rejected'
  ).length

  const totalFinancing = applications
    .filter((a) => a.status === 'Approved')
    .reduce(
      (total, a) =>
        total + Number(a.financing_requested || 0),
      0
    )

  const monthlyCollection = applications
    .filter((a) => a.status === 'Approved')
    .reduce(
      (total, a) =>
        total + Number(a.monthly_payment || 0),
      0
    )

  return (
    <div className="flex h-screen bg-slate-50">

      {/* Sidebar */}
      <LenderSidebar
        currentPage="reports"
        navigate={navigate}
      />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="bg-white border-b px-8 py-5">
          <h1 className="font-display font-700 text-2xl text-slate-900">
            Reports
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Portfolio performance and lending insights
          </p>
        </div>

        <div className="p-8 space-y-6">

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">

            <div className="bg-white border rounded-2xl p-5">
              <div className="text-2xl">👥</div>

              <div className="text-2xl font-display font-700 mt-2">
                {summary?.total_riders ?? 0}
              </div>

              <div className="text-sm text-slate-500">
                Total Riders
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5">
              <div className="text-2xl">✅</div>

              <div className="text-2xl font-display font-700 mt-2">
                {approved}
              </div>

              <div className="text-sm text-slate-500">
                Approved Loans
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5">
              <div className="text-2xl">💰</div>

              <div className="text-2xl font-display font-700 mt-2">
                ₹{totalFinancing.toLocaleString('en-IN')}
              </div>

              <div className="text-sm text-slate-500">
                Total Financing
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5">
              <div className="text-2xl">📅</div>

              <div className="text-2xl font-display font-700 mt-2">
                ₹{monthlyCollection.toLocaleString('en-IN')}
              </div>

              <div className="text-sm text-slate-500">
                Monthly Collection
              </div>
            </div>

          </div>

          {/* Application Overview */}
          <div className="grid lg:grid-cols-2 gap-6">

            <div className="bg-white border rounded-2xl p-6">

              <h2 className="font-display font-700 text-lg">
                Application Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1 mb-6">
                Current application status
              </p>

              <div className="space-y-5">

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">
                      Approved
                    </span>

                    <span className="font-600">
                      {approved}
                    </span>
                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: applications.length
                          ? `${(approved / applications.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">
                      Pending
                    </span>

                    <span className="font-600">
                      {pending}
                    </span>
                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: applications.length
                          ? `${(pending / applications.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">
                      Rejected
                    </span>

                    <span className="font-600">
                      {rejected}
                    </span>
                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{
                        width: applications.length
                          ? `${(rejected / applications.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Portfolio Stats */}
            <div className="bg-white border rounded-2xl p-6">

              <h2 className="font-display font-700 text-lg">
                Portfolio Summary
              </h2>

              <p className="text-sm text-slate-500 mt-1 mb-6">
                Current lending portfolio
              </p>

              <div className="space-y-4">

                <div className="flex justify-between border-b pb-4">
                  <span className="text-sm text-slate-500">
                    Eligible Riders
                  </span>

                  <span className="font-600">
                    {summary?.eligible_riders ?? 0}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <span className="text-sm text-slate-500">
                    Pending Applications
                  </span>

                  <span className="font-600">
                    {summary?.pending_applications ?? pending}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <span className="text-sm text-slate-500">
                    Approved Applications
                  </span>

                  <span className="font-600">
                    {summary?.approved_applications ?? approved}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Monthly Collection
                  </span>

                  <span className="font-600">
                    ₹{monthlyCollection.toLocaleString('en-IN')}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Applications Report */}
          <div className="bg-white border rounded-2xl overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="font-display font-700 text-lg">
                Application Report
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Detailed overview of all financing applications
              </p>

            </div>

            {applications.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No application data available.
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
                        Requested
                      </th>

                      <th className="p-4">
                        Monthly Payment
                      </th>

                      <th className="p-4">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {applications.map((application) => (

                      <tr
                        key={application.id}
                        className="border-t"
                      >

                        <td className="p-4">
                          <div className="font-600">
                            {application.rider ||
                              application.rider_name ||
                              'Unknown Rider'}
                          </div>

                          <div className="text-xs text-slate-400">
                            #{application.id}
                          </div>
                        </td>

                        <td className="p-4">
                          {application.workscore !==
                            undefined &&
                          application.workscore !== null
                            ? `${application.workscore}/100`
                            : '—'}
                        </td>

                        <td className="p-4 font-600">
                          ₹
                          {Number(
                            application.financing_requested || 0
                          ).toLocaleString('en-IN')}
                        </td>

                        <td className="p-4">
                          ₹
                          {Number(
                            application.monthly_payment || 0
                          ).toLocaleString('en-IN')}
                        </td>

                        <td className="p-4">
                          <span
                            className={
                              application.status === 'Approved'
                                ? 'text-green-600 font-600'
                                : application.status === 'Rejected'
                                ? 'text-red-600 font-600'
                                : 'text-yellow-600 font-600'
                            }
                          >
                            {application.status || 'Pending'}
                          </span>
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  )
}
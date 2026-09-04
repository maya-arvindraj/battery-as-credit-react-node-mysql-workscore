
import { useEffect, useState } from 'react'
import {
  LenderSidebar,
  Badge,
  PrimaryButton,
} from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'

type Props = {
  navigate: NavigateFn
}

export default function ApplicationDetailsPage({
  navigate,
}: Props) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedId = localStorage.getItem(
      'bac_selected_application'
    )

    const id = Number(storedId)

    console.log('Selected application ID:', id)

    if (!id) {
      setError('No application selected.')
      setLoading(false)
      return
    }

    api.lenderApplication(id)
      .then((result) => {
        console.log('Application details:', result)
        setData(result)
      })
      .catch((err) => {
        console.error('Failed to load application:', err)
        setError(
          err?.message ||
            'Failed to load application details.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const decide = async (
    status: 'Approved' | 'Rejected'
  ) => {
    if (!data?.application?.id) return

    try {
      setError('')

      const updated = await api.decide(
        data.application.id,
        status
      )

      console.log('Decision saved:', updated)

      const fresh = await api.lenderApplication(
        data.application.id
      )

      setData(fresh)
    } catch (err: any) {
      console.error('Decision failed:', err)

      setError(
        err?.message ||
          'Failed to update application.'
      )
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-slate-500">
        Loading application...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          <p className="font-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('applications')
            }
            className="mt-4 text-sm text-green-600 font-600"
          >
            ← Back to Applications
          </button>
        </div>
      </div>
    )
  }

  if (!data?.application) {
    return (
      <div className="p-10 text-slate-500">
        Application not found.
      </div>
    )
  }

  const application = data.application
  const rider = data.rider
  const kyc = data.kyc
  const workscore = data.workscore
  const repayments = data.repayments || []

  return (
    <div className="flex h-screen bg-slate-50">
      <LenderSidebar
        currentPage="application-details"
        navigate={navigate}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b px-8 py-5">
          <button
            type="button"
            onClick={() =>
              navigate('applications')
            }
            className="text-sm text-green-600 font-600"
          >
            ← Back to Applications
          </button>

          <h1 className="font-display font-700 text-2xl mt-3 text-slate-900">
            Application #{application.id}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Review rider financing application
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Rider information */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-2xl p-6">
              <h2 className="font-display font-700 text-lg mb-5">
                Rider Information
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Name
                  </span>

                  <b className="text-right">
                    {rider?.name || '—'}
                  </b>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Mobile
                  </span>

                  <b className="text-right">
                    {rider?.mobile || '—'}
                  </b>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Email
                  </span>

                  <b className="text-right">
                    {rider?.email || '—'}
                  </b>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    KYC Status
                  </span>

                  <Badge
                    variant={
                      kyc?.status === 'verified'
                        ? 'green'
                        : 'yellow'
                    }
                  >
                    {kyc?.status || 'Pending'}
                  </Badge>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    WorkScore
                  </span>

                  <b>
                    {workscore?.score !== undefined
                      ? `${Number(
                          workscore.score
                        ).toFixed(0)}/100`
                      : '—'}
                  </b>
                </div>
              </div>
            </div>

            {/* Financing */}
            <div className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-700 text-lg">
                  Financing Details
                </h2>

                <Badge
                  variant={
                    application.status === 'Approved'
                      ? 'green'
                      : application.status === 'Rejected'
                        ? 'red'
                        : 'yellow'
                  }
                >
                  {application.status}
                </Badge>
              </div>

              <div className="space-y-4 text-sm mt-5">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    EV Price
                  </span>

                  <b>
                    ₹
                    {Number(
                      application.ev_price
                    ).toLocaleString('en-IN')}
                  </b>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Down Payment
                  </span>

                  <b>
                    ₹
                    {Number(
                      application.down_payment
                    ).toLocaleString('en-IN')}
                  </b>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Financing Amount
                  </span>

                  <b>
                    ₹
                    {Number(
                      application.financing_amount
                    ).toLocaleString('en-IN')}
                  </b>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Tenure
                  </span>

                  <b>
                    {application.tenure_months} months
                  </b>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Monthly Payment
                  </span>

                  <b>
                    ₹
                    {Number(
                      application.monthly_payment
                    ).toLocaleString('en-IN')}
                  </b>
                </div>
              </div>

              {application.status === 'Pending' && (
                <div className="flex gap-3 mt-7">
                  <PrimaryButton
                    onClick={() =>
                      decide('Approved')
                    }
                  >
                    Approve
                  </PrimaryButton>

                  <button
                    type="button"
                    onClick={() =>
                      decide('Rejected')
                    }
                    className="px-5 py-2 rounded-xl bg-red-50 text-red-700 font-600 hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Repayment schedule */}
          <div className="bg-white border rounded-2xl p-6">
            <h2 className="font-display font-700 text-lg mb-5">
              Repayment Schedule
            </h2>

            {repayments.length === 0 ? (
              <p className="text-sm text-slate-500">
                Repayments are generated automatically
                after the application is approved.
              </p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {repayments.map(
                  (repayment: any) => (
                    <div
                      key={repayment.id}
                      className="bg-slate-50 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <b>
                          ₹
                          {Number(
                            repayment.amount
                          ).toLocaleString(
                            'en-IN'
                          )}
                        </b>

                        <Badge
                          variant={
                            repayment.status ===
                            'Paid'
                              ? 'green'
                              : 'yellow'
                          }
                        >
                          {repayment.status}
                        </Badge>
                      </div>

                      <div className="text-sm text-slate-500 mt-2">
                        Due{' '}
                        {new Date(
                          repayment.due_date
                        ).toLocaleDateString(
                          'en-IN'
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


import { useEffect, useState } from 'react'
import { RiderSidebar, PrimaryButton, Badge } from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'

const TENURES = [6, 12, 18, 24]

export default function EVFinancingPage({
  navigate,
}: {
  navigate: NavigateFn
}) {
  const [selected, setSelected] = useState(12)
  const [w, setW] = useState<any>()
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    api.workscore().then(setW).catch(() => {})

    api
      .applications()
      .then(setApplications)
      .catch(() => {})
  }, [])

  const amount = 70000
  const price = 85000
  const down = 15000
  const emi = Math.ceil(amount / selected)

  const hasApplication = applications.length > 0

  const latestApplication = applications[0]

  const apply = () => {
    localStorage.setItem(
      'bac_financing_draft',
      JSON.stringify({
        ev_price: price,
        down_payment: down,
        financing_amount: amount,
        tenure_months: selected,
        monthly_payment: emi,
      })
    )

    navigate('financing-application')
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <RiderSidebar
        currentPage="ev-financing"
        navigate={navigate}
      />

      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-8 py-5">
          <h1 className="font-display font-700 text-2xl">
            Get Your EV
          </h1>

          <p className="text-sm text-slate-500">
            Finance your electric vehicle through Battery-as-Credit.
          </p>
        </div>

        <div className="p-8 grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-5">

            {/* Vehicle */}
            <div className="bg-slate-900 rounded-2xl p-7 text-white">
              <div className="text-slate-400 text-xs">
                Eligible Vehicle
              </div>

              <div className="font-display font-800 text-2xl">
                Zypp Electric Scooter
              </div>

              <div className="text-slate-400 text-sm mt-1">
                Electric · 100 km range · Zero emissions
              </div>

              <div className="flex gap-3 mt-5">
                <Badge variant="green">
                  Eligible for Financing
                </Badge>

                {w && (
                  <Badge variant="slate">
                    WorkScore: {w.score}/100
                  </Badge>
                )}
              </div>
            </div>

            {/* Financing Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-display font-700 text-lg mb-5">
                Financing Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  [
                    'EV Price',
                    `₹${price.toLocaleString('en-IN')}`,
                  ],
                  [
                    'Down Payment',
                    `₹${down.toLocaleString('en-IN')}`,
                  ],
                  [
                    'Financing Amount',
                    `₹${amount.toLocaleString('en-IN')}`,
                  ],
                  [
                    'Monthly EMI',
                    `₹${emi.toLocaleString('en-IN')}`,
                  ],
                ].map((x) => (
                  <div
                    key={x[0]}
                    className="flex justify-between bg-slate-50 rounded-xl p-4"
                  >
                    <span className="text-sm text-slate-600">
                      {x[0]}
                    </span>

                    <b>{x[1]}</b>
                  </div>
                ))}
              </div>

              <div className="text-sm font-600 mt-6 mb-3">
                Repayment Period
              </div>

              <div className="grid grid-cols-4 gap-2">
                {TENURES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelected(m)}
                    className={`rounded-xl py-3 ${
                      selected === m
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <b>{m} mo</b>

                    <div className="text-xs">
                      ₹
                      {Math.ceil(
                        amount / m
                      ).toLocaleString('en-IN')}
                      /m
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">

            {/* Eligibility */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="font-600 text-green-800 mb-2">
                Eligibility Confirmed
              </div>

              <p className="text-sm text-green-700">
                Your work activity can be used to assess financing
                eligibility.
              </p>

              {w && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>WorkScore</span>
                    <b>{w.score}/100</b>
                  </div>

                  <div className="flex justify-between">
                    <span>Monthly Earnings</span>
                    <b>
                      ₹
                      {w.monthly_earnings.toLocaleString(
                        'en-IN'
                      )}
                    </b>
                  </div>
                </div>
              )}
            </div>

            {/* Show Summary ONLY if there is no application */}
            {!hasApplication && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="font-600 mb-4">
                  Summary
                </h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Vehicle</span>
                    <b>₹85,000</b>
                  </div>

                  <div className="flex justify-between">
                    <span>Down Payment</span>
                    <b>₹15,000</b>
                  </div>

                  <div className="flex justify-between">
                    <span>Financed</span>
                    <b>₹70,000</b>
                  </div>

                  <div className="border-t pt-2 flex justify-between">
                    <span>
                      EMI ({selected} months)
                    </span>

                    <b className="text-green-600">
                      ₹
                      {emi.toLocaleString('en-IN')}
                      /mo
                    </b>
                  </div>
                </div>

                <PrimaryButton
                  className="w-full flex justify-center mt-5"
                  onClick={apply}
                >
                  Apply for Financing
                </PrimaryButton>
              </div>
            )}

            {/* Show status instead when application exists */}
            {hasApplication && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="font-600 mb-3">
                  Financing Application
                </h4>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    Application #{latestApplication?.id}
                  </span>

                  <Badge
                    variant={
                      latestApplication?.status === 'Approved'
                        ? 'green'
                        : latestApplication?.status === 'Rejected'
                        ? 'red'
                        : 'yellow'
                    }
                  >
                    {latestApplication?.status}
                  </Badge>
                </div>

                <p className="text-sm text-slate-500 mt-4">
                  Your financing application has already been
                  submitted. You cannot submit another application
                  while this application exists.
                </p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
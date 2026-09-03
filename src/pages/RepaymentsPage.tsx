import { useEffect, useState } from 'react'
import { RiderSidebar, Badge } from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'

export default function RepaymentsPage({
  navigate,
}: {
  navigate: NavigateFn
}) {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payingId, setPayingId] = useState<number | null>(null)

  const load = async () => {
    try {
      setError('')

      const data = await api.repayments()

      setRows(data)
    } catch (err) {
      console.error('Failed to load repayments:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load repayments.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const pay = async (id: number) => {
    try {
      setError('')
      setPayingId(id)

      await api.payRepayment(id)

      await load()
    } catch (err) {
      console.error('Failed to make repayment:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Payment failed. Please try again.'
      )
    } finally {
      setPayingId(null)
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <RiderSidebar
        currentPage="repayments"
        navigate={navigate}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b px-8 py-5">
          <h1 className="font-display font-700 text-2xl">
            Repayments
          </h1>

          <p className="text-sm text-slate-500">
            Your live repayment schedule.
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="bg-white border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left text-xs text-slate-500">
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-slate-500"
                    >
                      No repayments yet. An approved financing
                      application will create the schedule.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="p-4 text-sm">
                        {new Date(
                          r.due_date
                        ).toLocaleDateString('en-IN')}
                      </td>

                      <td className="p-4 font-600">
                        ₹
                        {Number(r.amount).toLocaleString(
                          'en-IN'
                        )}
                      </td>

                      <td className="p-4">
                        <Badge
                          variant={
                            r.status === 'Paid'
                              ? 'green'
                              : 'yellow'
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>

                      <td className="p-4">
                        {r.status !== 'Paid' && (
                          <button
                            onClick={() => pay(r.id)}
                            disabled={payingId === r.id}
                            className="text-sm text-green-600 font-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {payingId === r.id
                              ? 'Processing...'
                              : 'Pay now'}
                          </button>
                        )}

                        {r.status === 'Paid' && (
                          <span className="text-sm text-slate-400">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
/*import { useEffect,useState } from 'react'
import { LenderSidebar,Badge,PrimaryButton } from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'
export default function ApplicationDetailsPage({navigate}:{navigate:NavigateFn}){const [d,setD]=useState<any>();const [error,setError]=useState('');const id=Number(localStorage.getItem('bac_selected_application'));useEffect(()=>{if(id)api.lenderApplication(id).then(setD).catch(e=>setError(e.message));else setError('No application selected')},[id]);const decide=async(s:string)=>{if(!d)return;await api.decide(d.application.id,s);const fresh=await api.lenderApplication(d.application.id);setD(fresh)};if(error)return <div className="p-10 text-red-600">{error}</div>;if(!d)return <div className="p-10">Loading application…</div>;const a=d.application;return <div className="flex h-screen bg-slate-50"><LenderSidebar currentPage="application-details" navigate={navigate}/><main className="flex-1 overflow-y-auto"><div className="bg-white border-b px-8 py-5"><button onClick={()=>navigate('lender-dashboard')} className="text-sm text-green-600">← Back</button><h1 className="font-display font-700 text-2xl mt-2">Application #{a.id}</h1></div><div className="p-8 grid lg:grid-cols-2 gap-6"><div className="bg-white border rounded-2xl p-6"><h2 className="font-display font-700 text-lg mb-5">Rider</h2><div className="space-y-3 text-sm">{[['Name',d.rider.name],['Mobile',d.rider.mobile],['Email',d.rider.email||'—'],['KYC',d.kyc?.status||'Pending'],['WorkScore',d.workscore?`${d.workscore.score}/100`:'—']].map(x=><div key={x[0]} className="flex justify-between"><span className="text-slate-500">{x[0]}</span><b>{x[1]}</b></div>)}</div></div><div className="bg-white border rounded-2xl p-6"><div className="flex justify-between"><h2 className="font-display font-700 text-lg">Financing</h2><Badge variant={a.status==='Approved'?'green':a.status==='Rejected'?'red':'yellow'}>{a.status}</Badge></div><div className="space-y-3 text-sm mt-5">{[['EV Price',`₹${a.ev_price.toLocaleString('en-IN')}`],['Down Payment',`₹${a.down_payment.toLocaleString('en-IN')}`],['Financing',`₹${a.financing_amount.toLocaleString('en-IN')}`],['Tenure',`${a.tenure_months} months`],['Monthly Payment',`₹${a.monthly_payment.toLocaleString('en-IN')}`]].map(x=><div key={x[0]} className="flex justify-between"><span className="text-slate-500">{x[0]}</span><b>{x[1]}</b></div>)}</div>{a.status==='Pending'&&<div className="flex gap-3 mt-6"><PrimaryButton onClick={()=>decide('Approved')}>Approve</PrimaryButton><button onClick={()=>decide('Rejected')} className="px-5 py-2 rounded-xl bg-red-50 text-red-700 font-600">Reject</button></div>}</div><div className="lg:col-span-2 bg-white border rounded-2xl p-6"><h2 className="font-display font-700 text-lg mb-4">Repayment Schedule</h2>{d.repayments?.length?<div className="grid md:grid-cols-3 gap-3">{d.repayments.map((r:any)=><div key={r.id} className="bg-slate-50 rounded-xl p-4 text-sm"><b>₹{r.amount.toLocaleString('en-IN')}</b><div className="text-slate-500">Due {new Date(r.due_date).toLocaleDateString('en-IN')}</div><Badge variant={r.status==='Paid'?'green':'yellow'}>{r.status}</Badge></div>)}</div>:<p className="text-sm text-slate-500">Repayments are generated automatically after approval.</p>}</div></div></main></div>}
*/

import { useEffect, useState } from 'react'
import { LenderSidebar, Badge } from '../components/shared'
import { api } from '../api'
import { type NavigateFn } from '../types'

type Props = {
  navigate: NavigateFn
}

export default function ApplicationsPage({ navigate }: Props) {
  const [applications, setApplications] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.lenderApplications()
      .then(setApplications)
      .catch((e) => setError(e.message))
  }, [])

  const openApplication = (id: number) => {
    localStorage.setItem('bac_selected_application', String(id))
    navigate('application-details')
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <LenderSidebar
        currentPage="applications"
        navigate={navigate}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b px-8 py-5">
          <button
            onClick={() => navigate('lender-dashboard')}
            className="text-sm text-green-600"
          >
            ← Back
          </button>

          <h1 className="font-display font-700 text-2xl mt-2">
            Applications
          </h1>

          <p className="text-slate-500 mt-1">
            View and manage financing applications.
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">
              {error}
            </div>
          )}

          {applications.length === 0 && !error && (
            <div className="bg-white border rounded-2xl p-8 text-center">
              <p className="text-slate-500">
                No applications found.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white border rounded-2xl p-6 flex items-center justify-between"
              >
                <div>
                  <h2 className="font-display font-700 text-lg">
                    Application #{application.id}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Financing: ₹
                    {application.financing_amount?.toLocaleString('en-IN')}
                  </p>

                  <div className="mt-3">
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
                </div>

                <button
                  onClick={() => openApplication(application.id)}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-white font-600"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
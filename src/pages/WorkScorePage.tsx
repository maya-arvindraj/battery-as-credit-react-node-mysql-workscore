import { useEffect, useState } from 'react'
import { RiderSidebar, Badge, PrimaryButton } from '../components/shared'
import { api, type WorkScore } from '../api'
import { type NavigateFn } from '../types'

export default function WorkScorePage({navigate}:{navigate:NavigateFn}) {
  const [w,setW]=useState<WorkScore|null>(null)
  const [error,setError]=useState('')
  useEffect(()=>{api.workscore().then(setW).catch(e=>setError(e.message))},[])
  if(error) return <div className="p-10 text-red-600">{error}</div>
  if(!w) return <div className="p-10">Loading WorkScore…</div>
  const cards=[
    ['Earnings stability',w.earnings_stability,30],
    ['Delivery consistency',w.delivery_consistency,20],
    ['Work days',w.work_days,25],
    ['Repayment history',w.repayment_history,15],
    ['EV usage / tenure',w.ev_usage_tenure,10],
  ] as const
  return <div className="flex h-screen bg-slate-50"><RiderSidebar currentPage="workscore" navigate={navigate}/><main className="flex-1 overflow-y-auto"><div className="bg-white border-b px-8 py-5"><h1 className="font-display font-700 text-2xl">Your WorkScore</h1><p className="text-sm text-slate-500">Calculated from your work and repayment behaviour.</p></div><div className="p-8 max-w-4xl space-y-6">
    <div className="bg-slate-900 rounded-2xl p-8 text-white text-center"><div className="text-slate-400">WorkScore</div><div className="text-7xl font-display font-800">{w.score.toFixed(2)}</div><div className="text-sm text-slate-400 mb-3">out of 100</div><Badge variant="green">{w.status}</Badge></div>
    <div className="bg-white border rounded-2xl p-6"><h2 className="font-display font-700 text-lg mb-4">Score breakdown</h2><div className="space-y-5">{cards.map(([label,value,max])=><div key={label}><div className="flex justify-between text-sm mb-2"><span className="text-slate-600">{label}</span><b>{value.toFixed(2)} / 100 · Weight {max}%</b></div><div className="h-3 bg-slate-100 rounded-full"><div className="h-3 bg-green-500 rounded-full" style={{width:`${Math.min(100,value)}%`}}/></div><div className="text-xs text-slate-400 mt-1">Contribution: {(value*max/100).toFixed(2)} points</div></div>)}</div></div>
    <div className="bg-white border rounded-2xl p-6 text-sm text-slate-600"><b>Formula:</b> Earnings × 0.30 + Delivery × 0.20 + Work days × 0.25 + Repayment history × 0.15 + EV usage/tenure × 0.10</div>
    <div className="bg-white border rounded-2xl p-6 text-sm text-slate-600">Deliveries: <b>{w.deliveries}</b> · Monthly earnings: <b>₹{w.monthly_earnings.toLocaleString('en-IN')}</b> · Working days: <b>{w.working_days}</b> · Payment reliability: <b>{w.payment_reliability}%</b> · EV usage score: <b>{w.ev_usage_score}/100</b></div>
    <PrimaryButton className="w-full flex justify-center" onClick={()=>navigate('ev-financing')}>Explore EV Financing →</PrimaryButton>
  </div></main></div>
}

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export type User = { id:number; name:string; mobile:string; email:string|null; role:string }
export type WorkScore = { score:number; status:string; earnings_stability:number; delivery_consistency:number; work_days:number; repayment_history:number; ev_usage_tenure:number; weights:Record<string,number>; deliveries:number; monthly_earnings:number; working_days:number; payment_reliability:number; ev_usage_score:number }
export type Application = { id:number; rider_id:number; ev_price:number; down_payment:number; financing_amount:number; tenure_months:number; monthly_payment:number; status:string; notes:string|null; created_at:string }
export type Repayment = { id:number; amount:number; due_date:string; paid_date:string|null; status:string }

export function token(){ return localStorage.getItem('bac_token') }
export function user(): User|null { try { return JSON.parse(localStorage.getItem('bac_user') || 'null') } catch { return null } }
export function setAuth(access_token:string, u:User){ localStorage.setItem('bac_token', access_token); localStorage.setItem('bac_user', JSON.stringify(u)) }
export function logout(){ localStorage.removeItem('bac_token'); localStorage.removeItem('bac_user') }

async function request<T>(path:string, options:RequestInit = {}):Promise<T>{
  const headers = new Headers(options.headers)
  headers.set('Content-Type','application/json')
  const t = token(); if(t) headers.set('Authorization', `Bearer ${t}`)
  const res = await fetch(`${API_URL}${path}`, {...options, headers})
  const body = await res.json().catch(()=>null)
  if(!res.ok) throw new Error(body?.detail || `Request failed (${res.status})`)
  return body as T
}

export const api = {
  register: (data: {
  name: string
  mobile: string
  email?: string
  password: string
  role?: 'rider' | 'lender'
}) =>
  request<{ access_token: string; user: User }>(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  ),
  login: (data:{mobile:string;password:string}) => request<{access_token:string;user:User}>('/api/auth/login',{method:'POST',body:JSON.stringify(data)}),
  me: () => request<User>('/api/me'),
  kyc: () => request<any>('/api/kyc'),
  submitKyc: (data:any) => request<any>('/api/kyc',{method:'POST',body:JSON.stringify(data)}),
  workscore: () => request<WorkScore>('/api/workscore'),
  updateWorkscore: (data:{deliveries:number;monthly_earnings:number;working_days:number;payment_reliability:number;ev_usage_score:number}) => request<WorkScore>('/api/workscore',{method:'PUT',body:JSON.stringify(data)}),
  dashboard: () => request<any>('/api/dashboard'),
  applications: () => request<Application[]>('/api/financing/applications'),
  application: (id:number) => request<Application>(`/api/financing/applications/${id}`),
  createApplication: (data:any) => request<Application>('/api/financing/applications',{method:'POST',body:JSON.stringify(data)}),
  repayments: () => request<Repayment[]>('/api/repayments'),
  payRepayment: (id:number) => request<Repayment>(`/api/repayments/${id}/pay`,{method:'POST'}),
  ownership: () => request<any>('/api/ownership'),
  lenderSummary: () => request<any>('/api/lender/summary'),
  lenderApplications: () => request<any[]>('/api/lender/applications'),
  lenderRiders: () => request<any[]>('/api/lender/riders'),
  lenderApplication: (id:number) => request<any>(`/api/lender/applications/${id}`),
  decide: (id:number,status:string,notes?:string) => request<Application>(`/api/lender/applications/${id}`,{method:'PATCH',body:JSON.stringify({status,notes})}),
}

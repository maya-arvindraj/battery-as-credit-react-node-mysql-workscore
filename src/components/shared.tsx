import { type NavigateFn } from '../types'

export function BatteryIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="7" width="18" height="10" rx="2" stroke="#22c55e" strokeWidth="1.8" />
      <rect x="19" y="10" width="3" height="4" rx="1" fill="#22c55e" />
      <rect x="3.5" y="9.5" width="9" height="5" rx="1" fill="#22c55e" />
    </svg>
  )
}

export function Logo({ navigate }: { navigate?: NavigateFn }) {
  return (
    <button
      onClick={() => navigate?.('landing')}
      className="flex items-center gap-2 group"
    >
      <BatteryIcon size={26} />
      <div className="text-left">
        <div className="font-display font-700 text-slate-900 leading-tight text-sm">
          Battery-as-Credit
        </div>
        <div className="text-xs text-green-600 font-500 leading-tight hidden sm:block">
          by Zypp Electric
        </div>
      </div>
    </button>
  )
}

export function PrimaryButton({
  children,
  onClick,
  className = '',
  disabled = false,
  size = 'md',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-green-500 hover:bg-green-600 active:bg-green-700
        text-white font-600 rounded-xl transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]} ${className}
      `}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
  className = '',
  size = 'md',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }
  return (
    <button
      onClick={onClick}
      className={`
        border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100
        text-slate-700 font-600 rounded-xl transition-all duration-150
        ${sizeClasses[size]} ${className}
      `}
    >
      {children}
    </button>
  )
}

export function Badge({
  children,
  variant = 'green',
}: {
  children: React.ReactNode
  variant?: 'green' | 'yellow' | 'red' | 'blue' | 'slate'
}) {
  const variants = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    slate: 'bg-slate-100 text-slate-600',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-600 ${variants[variant]}`}>
      {children}
    </span>
  )
}

export function StatCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  sub?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      {icon && <div className="mb-3 text-green-500">{icon}</div>}
      <div className="text-2xl font-display font-700 text-slate-900">{value}</div>
      <div className="text-sm text-slate-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-green-600 mt-1 font-500">{sub}</div>}
    </div>
  )
}

export function ProgressBar({
  value,
  max = 100,
  color = 'bg-green-500',
  label,
}: {
  value: number
  max?: number
  color?: string
  label?: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-slate-600">{label}</span>
          <span className="text-sm font-600 text-slate-900">{value}/{max}</span>
        </div>
      )}
      <div className="bg-slate-100 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function CircularScore({
  score,
  max = 100,
  size = 180,
}: {
  score: number
  max?: number
  size?: number
}) {
  const strokeWidth = 12
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const pct = score / max
  const progress = pct * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#22c55e"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${progress} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 - 6}
        textAnchor="middle"
        fill="#0f172a"
        fontSize={size * 0.22}
        fontWeight="700"
        fontFamily="Outfit, sans-serif"
      >
        {score}
      </text>
      <text
        x={size / 2}
        y={size / 2 + size * 0.12}
        textAnchor="middle"
        fill="#64748b"
        fontSize={size * 0.08}
        fontFamily="Inter, sans-serif"
      >
        out of {max}
      </text>
    </svg>
  )
}

export function BarChart({
  data,
  color = '#22c55e',
}: {
  data: { label: string; value: number; formatted?: string }[]
  color?: string
}) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="flex items-end gap-3 h-36">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <span className="text-xs font-600 text-slate-700">{d.formatted ?? d.value}</span>
          <div className="w-full flex items-end" style={{ height: 80 }}>
            <div
              className="w-full rounded-t-lg transition-all duration-500"
              style={{
                height: `${Math.max((d.value / max) * 100, 8)}%`,
                backgroundColor: color,
                opacity: 0.8 + 0.2 * (i / (data.length - 1)),
              }}
            />
          </div>
          <span className="text-xs text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

const RIDER_NAV = [
  { key: 'rider-dashboard', label: 'Dashboard', icon: GridIcon },
  { key: 'workscore', label: 'WorkScore', icon: ChartIcon },
  { key: 'ev-financing', label: 'EV Financing', icon: CarIcon },
  { key: 'repayments', label: 'Repayments', icon: CardIcon },
  { key: 'ownership', label: 'Ownership', icon: KeyIcon },
]

const RIDER_BOTTOM_NAV = [
  { key: 'profile', label: 'Profile', icon: UserIcon },
  { key: 'help', label: 'Help & Support', icon: HelpIcon },
]

export function RiderSidebar({
  currentPage,
  navigate,
}: {
  currentPage: string
  navigate: NavigateFn
}) {
  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-100">
        <Logo navigate={navigate} />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {RIDER_NAV.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => navigate(key as any)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-all
              ${currentPage === key
                ? 'bg-green-50 text-green-700 font-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <Icon size={18} active={currentPage === key} />
            {label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100 space-y-1">
        {RIDER_BOTTOM_NAV.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Icon size={18} active={false} />
            {label}
          </button>
        ))}
        <button
          onClick={() => navigate('landing')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogoutIcon size={18} active={false} />
          Logout
        </button>
      </div>
    </aside>
  )
}

const LENDER_NAV = [
  { key: 'lender-dashboard', label: 'Dashboard', icon: GridIcon },
  { key: 'applications', label: 'Applications', icon: FileIcon },
  { key: 'riders', label: 'Riders', icon: UsersIcon },
  { key: 'approved', label: 'Approved Loans', icon: CheckCircleIcon },
  { key: 'repayments', label: 'Repayments', icon: CardIcon },
  { key: 'reports', label: 'Reports', icon: ChartBarIcon },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
]

export function LenderSidebar({
  currentPage,
  navigate,
}: {
  currentPage: string
  navigate: NavigateFn
}) {
  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BatteryIcon size={24} />
          <div>
            <div className="font-display font-700 text-slate-900 text-sm leading-tight">Battery-as-Credit</div>
            <div className="text-xs text-slate-400">Lender Portal</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {LENDER_NAV.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              if (key === 'lender-dashboard') navigate('lender-dashboard')
              if (key === 'applications') navigate('application-details')
            }}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-all
              ${currentPage === key
                ? 'bg-green-50 text-green-700 font-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <Icon size={18} active={currentPage === key} />
            {label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => navigate('landing')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogoutIcon size={18} active={false} />
          Logout
        </button>
      </div>
    </aside>
  )
}

function GridIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function ChartIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-3" />
    </svg>
  )
}
function CarIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h2l3-4h6l3 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="17.5" r="2.5" />
    </svg>
  )
}
function CardIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  )
}
function KeyIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="M15.5 11l5 5M20 11l-1.5-1.5" />
    </svg>
  )
}
function UserIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
function HelpIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  )
}
function LogoutIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}
function FileIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
function UsersIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}
function CheckCircleIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
function ChartBarIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}
function SettingsIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

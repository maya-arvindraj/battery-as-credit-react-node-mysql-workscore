import { Logo, PrimaryButton, SecondaryButton, BatteryIcon } from '../components/shared'
import { type NavigateFn } from '../types'

export default function LandingPage({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo navigate={navigate} />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 font-500 transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="text-sm text-slate-600 hover:text-slate-900 font-500 transition-colors">
              Benefits
            </a>
            <button
              onClick={() => navigate('lender-login')}
              className="text-sm text-slate-600 hover:text-slate-900 font-500 transition-colors"
            >
              For Lenders
            </button>
            <button
              onClick={() => navigate('login')}
              className="text-sm text-slate-600 hover:text-slate-900 font-500 transition-colors"
            >
              Login
            </button>
          </nav>
          <PrimaryButton onClick={() => navigate('login')} size="sm">
            Check Eligibility
          </PrimaryButton>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-600 px-3 py-1.5 rounded-full mb-6">
              <BatteryIcon size={14} />
              Powered by Zypp Work Data
            </div>
            <h1 className="font-display font-800 text-5xl text-slate-900 leading-tight mb-5">
              Turn Your Gig Work Into{' '}
              <span className="text-green-500">Creditworthiness.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              Your deliveries, earnings and work consistency can help you access EV financing and move towards owning your own EV.
            </p>
            <p className="text-sm font-600 text-slate-400 italic mb-8">
              "Don't score the worker. Score the work."
            </p>
            <div className="flex items-center gap-4">
              <PrimaryButton onClick={() => navigate('login')} size="lg">
                Check Your Eligibility
              </PrimaryButton>
              <SecondaryButton size="lg">
                <a href="#how-it-works">How It Works</a>
              </SecondaryButton>
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="lg:flex justify-end hidden">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-500">Your WorkScore</div>
                  <div className="font-display font-800 text-4xl text-slate-900">82</div>
                </div>
                <div className="bg-green-100 text-green-700 text-sm font-600 px-3 py-1.5 rounded-full">Good</div>
              </div>
              <div className="bg-slate-100 rounded-full h-2 mb-4">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Deliveries', value: '245' },
                  { label: 'Monthly Earnings', value: '₹28,500' },
                  { label: 'Working Days', value: '24' },
                  { label: 'Payment Reliability', value: '95%' },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-3">
                    <div className="font-display font-700 text-slate-900 text-lg">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="text-xs font-600 text-green-700 mb-1">✓ Eligible for EV Financing</div>
                <div className="text-sm font-600 text-slate-900">Financing up to ₹70,000</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-sm font-600 text-green-600 uppercase tracking-widest mb-3">The Journey</div>
            <h2 className="font-display font-700 text-3xl text-slate-900">Three steps to EV ownership</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Build Your WorkScore',
                desc: 'Your Zypp work history helps create your WorkScore. The more consistent your deliveries and earnings, the higher your score.',
                icon: '📊',
              },
              {
                num: '02',
                title: 'Get EV Financing',
                desc: 'Use your WorkScore to support your financing application. No traditional credit history required.',
                icon: '⚡',
              },
              {
                num: '03',
                title: 'Earn, Repay & Own',
                desc: 'Work with your EV, make repayments from your earnings and eventually own it outright.',
                icon: '🛵',
              },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative">
                <div className="font-display font-800 text-6xl text-green-100 absolute top-4 right-6 select-none">
                  {step.num}
                </div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="font-display font-700 text-xl text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-sm font-600 text-green-600 uppercase tracking-widest mb-3">Why Battery-as-Credit</div>
            <h2 className="font-display font-700 text-3xl text-slate-900">Built for gig workers</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🔓',
                title: 'Easier Access to Credit',
                desc: 'No traditional credit history needed. Your work speaks for itself.',
              },
              {
                icon: '🛵',
                title: 'EV Ownership',
                desc: 'Own your vehicle outright once repayments are complete.',
              },
              {
                icon: '📅',
                title: 'Flexible Repayments',
                desc: 'Choose from 6 to 24 month plans aligned to your earnings.',
              },
              {
                icon: '🌍',
                title: 'Financial Inclusion',
                desc: 'Bringing formal credit access to gig economy workers.',
              },
            ].map((b) => (
              <div key={b.title} className="border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200">
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="font-display font-600 text-lg text-slate-900 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey flow */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
            {['Earn', 'Build WorkScore', 'Get EV', 'Repay', 'Own'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className="bg-green-500/20 text-green-400 text-sm font-600 px-4 py-2 rounded-full">{step}</div>
                {i < arr.length - 1 && <div className="text-slate-600 font-700">→</div>}
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm mb-2">The full journey from gig work to EV ownership</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-700 text-3xl text-slate-900 mb-4">
            Ready to turn your work into an opportunity?
          </h2>
          <p className="text-slate-600 mb-8">
            Check your eligibility in minutes. No impact on credit score.
          </p>
          <PrimaryButton onClick={() => navigate('login')} size="lg">
            Check Your Eligibility
          </PrimaryButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-slate-400 text-center">
            Battery-as-Credit is a prototype scoring model. Not a regulated financial product. Data used only with your consent.
          </p>
          <div className="text-xs text-slate-400">© 2026 Zypp Electric</div>
        </div>
      </footer>
    </div>
  )
}

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { query, transaction } from './db.js';
// import { auth, lenderOnly, hashPassword, verifyPassword, createToken, publicUser } from './auth.js';

// dotenv.config();
// const app = express();
// const port = Number(process.env.PORT || 8000);
// const origins = ['http://localhost:8443', 'http://localhost:5173', 'http://127.0.0.1:8443', 'http://127.0.0.1:5173'];
// app.use(cors({ origin: (origin, cb) => !origin || origins.includes(origin) ? cb(null, true) : cb(new Error('CORS blocked')), credentials: true }));
// app.use(express.json());

// const money = x => Number(Number(x).toFixed(2));
// function clamp100(value) { return Math.max(0, Math.min(100, Number(value) || 0)); }
// // Generate realistic metrics for a new driver.
// // Each driver gets a different performance profile.
// function generateDriverMetrics() {
//   const profiles = [
//     {
//       name: 'high',
//       deliveries: [250, 320],
//       earnings: [28000, 35000],
//       workingDays: [24, 27],
//       reliability: [90, 100],
//       evUsage: [85, 100]
//     },
//     {
//       name: 'average',
//       deliveries: [180, 249],
//       earnings: [21000, 27999],
//       workingDays: [20, 24],
//       reliability: [75, 89],
//       evUsage: [65, 84]
//     },
//     {
//       name: 'developing',
//       deliveries: [120, 179],
//       earnings: [15000, 20999],
//       workingDays: [16, 20],
//       reliability: [60, 74],
//       evUsage: [50, 64]
//     },
//     {
//       name: 'low',
//       deliveries: [70, 119],
//       earnings: [10000, 14999],
//       workingDays: [12, 16],
//       reliability: [45, 59],
//       evUsage: [35, 49]
//     }
//   ];

//   // Randomly select a driver profile
//   const profile = profiles[Math.floor(Math.random() * profiles.length)];

//   // Generate a random integer between min and max
//   const randomInt = (min, max) =>
//     Math.floor(Math.random() * (max - min + 1)) + min;

//   return {
//     deliveries: randomInt(...profile.deliveries),
//     monthly_earnings: randomInt(...profile.earnings),
//     working_days: randomInt(...profile.workingDays),
//     payment_reliability: randomInt(...profile.reliability),
//     ev_usage_score: randomInt(...profile.evUsage)
//   };
// }

// // WorkScore formula supplied by the project owner:
// // Earnings stability * 0.30 + Delivery consistency * 0.20
// // + Work days * 0.25 + Repayment history * 0.15 + EV usage/tenure * 0.10
// // Each component is normalized to 0-100 before applying the weight.
// function score(m) {
//   const deliveries = Number(m.deliveries || 0);
//   const monthlyEarnings = Number(m.monthly_earnings || 0);
//   const workingDays = Number(m.working_days || 0);
//   const paymentReliability = clamp100(m.payment_reliability);
//   const evUsage = clamp100(m.ev_usage_score);

//   // Project normalization baselines. These can be changed without changing the weights.
//   const earningsStability = clamp100((monthlyEarnings / 30000) * 100);
//   const deliveryConsistency = clamp100((deliveries / 300) * 100);
//   const workDays = clamp100((workingDays / 26) * 100);
//   const repaymentHistory = paymentReliability;
//   const evUsageTenure = evUsage;

//   const total = Number((
//     earningsStability * 0.30 +
//     deliveryConsistency * 0.20 +
//     workDays * 0.25 +
//     repaymentHistory * 0.15 +
//     evUsageTenure * 0.10
//   ).toFixed(2));

//   return {
//     score: total,
//     status: total >= 80 ? 'Excellent' : total >= 65 ? 'Good' : total >= 50 ? 'Fair' : 'Needs improvement',
//     earnings_stability: Number(earningsStability.toFixed(2)),
//     delivery_consistency: Number(deliveryConsistency.toFixed(2)),
//     work_days: Number(workDays.toFixed(2)),
//     repayment_history: Number(repaymentHistory.toFixed(2)),
//     ev_usage_tenure: Number(evUsageTenure.toFixed(2)),
//     weights: { earnings_stability: 0.30, delivery_consistency: 0.20, work_days: 0.25, repayment_history: 0.15, ev_usage_tenure: 0.10 },
//     deliveries, monthly_earnings: monthlyEarnings, working_days: workingDays, payment_reliability: paymentReliability, ev_usage_score: evUsage
//   };
// }
// function saveScore(userId, s) {
//   return query(`UPDATE work_metrics SET delivery_score=?, earnings_score=?, work_days_score=?, repayment_score=?, ev_usage_score_calculated=?, score=? WHERE user_id=?`,
//     [s.delivery_consistency, s.earnings_stability, s.work_days, s.repayment_history, s.ev_usage_tenure, s.score, userId]);
// }
// function appOut(a) { return { ...a, id: Number(a.id), rider_id: Number(a.rider_id), ev_price: Number(a.ev_price), down_payment: Number(a.down_payment), financing_amount: Number(a.financing_amount), tenure_months: Number(a.tenure_months), monthly_payment: Number(a.monthly_payment) }; }
// function repaymentOut(r) { return { ...r, id: Number(r.id), application_id: Number(r.application_id), amount: Number(r.amount) }; }

// app.get('/health', (req, res) => res.json({ status: 'ok', service: 'battery-as-credit-api' }));

// app.post('/api/auth/register', async (req, res, next) => {
//   try {
    
//     const { name, mobile, email, password, role } = req.body;
//     const accountRole = role === 'lender' ? 'lender' : 'rider';

//     if (!name || !mobile || !password) {
//       return res.status(400).json({
//         detail: 'Name, mobile and password are required'
//       });
//     }

//     // Only allow rider or lender accounts
//     //const accountRole = role === 'lender' ? 'lender' : 'rider';

//     // Check duplicate mobile
//     if ((await query(
//       'SELECT id FROM users WHERE mobile=?',
//       [mobile]
//     ))[0]) {
//       return res.status(409).json({
//         detail: 'Mobile number already registered'
//       });
//     }

//     // Create password hash
//     const hash = await hashPassword(password);

//     // Create user with selected role
//     const result = await query(
//       `INSERT INTO users
//        (name, mobile, email, password_hash, role)
//        VALUES (?, ?, ?, ?, ?)`,
//       [
//         name,
//         mobile,
//         email || null,
//         hash,
//         accountRole
//       ]
//     );

//     const user = {
//       id: result.insertId,
//       name,
//       mobile,
//       email: email || null,
//       role: accountRole
//     };

//     // Only riders need work metrics
//     if (accountRole === 'rider') {
//       const metrics = generateDriverMetrics();

//       await query(
//         `INSERT INTO work_metrics
//          (
//            user_id,
//            deliveries,
//            monthly_earnings,
//            working_days,
//            payment_reliability,
//            ev_usage_score
//          )
//          VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           result.insertId,
//           metrics.deliveries,
//           metrics.monthly_earnings,
//           metrics.working_days,
//           metrics.payment_reliability,
//           metrics.ev_usage_score
//         ]
//       );

//       const generatedScore = score(metrics);

//       await saveScore(
//         result.insertId,
//         generatedScore
//       );
//     }

//     res.json({
//       access_token: createToken(user),
//       token_type: 'bearer',
//       user
//     });

//   } catch (e) {
//     next(e);
//   }
// });

// app.post('/api/auth/login', async (req, res, next) => {
//   try {
//     const { mobile, password } = req.body; const rows = await query('SELECT * FROM users WHERE mobile=?', [mobile]); const u = rows[0];
//     if (!u || !(await verifyPassword(password || '', u.password_hash))) return res.status(401).json({ detail: 'Invalid mobile number or password' });
//     res.json({ access_token: createToken(u), token_type: 'bearer', user: publicUser(u) });
//   } catch (e) { next(e) }
// });
// app.get('/api/me', auth, (req, res) => res.json(publicUser(req.user)));

// app.post('/api/kyc', auth, async (req, res, next) => {
//   try {
//     const { full_name, mobile, email, government_id, date_of_birth, consent_given } = req.body;
//     await query('UPDATE users SET name=?,mobile=?,email=? WHERE id=?', [full_name, mobile, email || null, req.user.id]);
//     await query(`INSERT INTO kyc(user_id,full_name,government_id,date_of_birth,consent_given,status) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE full_name=VALUES(full_name),government_id=VALUES(government_id),date_of_birth=VALUES(date_of_birth),consent_given=VALUES(consent_given),status=VALUES(status)`, [req.user.id, full_name, government_id || null, date_of_birth || null, !!consent_given, consent_given ? 'verified' : 'pending']);
//     res.json({ status: consent_given ? 'verified' : 'pending', message: 'KYC submitted successfully' });
//   } catch (e) { next(e) }
// });
// app.get('/api/kyc', auth, async (req, res, next) => { try { const r = await query('SELECT * FROM kyc WHERE user_id=?', [req.user.id]); res.json(r[0] || { status: 'not_started' }); } catch (e) { next(e) } });

// app.get('/api/workscore', auth, async (req, res, next) => { try { const r = await query('SELECT * FROM work_metrics WHERE user_id=?', [req.user.id]); if (!r[0]) return res.status(404).json({ detail: 'Work metrics not available' }); const s = score(r[0]); await saveScore(req.user.id, s); res.json(s); } catch (e) { next(e) } });
// app.put('/api/workscore', auth, async (req, res, next) => { try { const { deliveries, monthly_earnings, working_days, payment_reliability, ev_usage_score } = req.body; const values = [Math.max(0, Number(deliveries) || 0), Math.max(0, Number(monthly_earnings) || 0), Math.max(0, Number(working_days) || 0), clamp100(payment_reliability), clamp100(ev_usage_score)]; await query(`INSERT INTO work_metrics(user_id,deliveries,monthly_earnings,working_days,payment_reliability,ev_usage_score) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE deliveries=VALUES(deliveries),monthly_earnings=VALUES(monthly_earnings),working_days=VALUES(working_days),payment_reliability=VALUES(payment_reliability),ev_usage_score=VALUES(ev_usage_score)`, [req.user.id, ...values]); const r = (await query('SELECT * FROM work_metrics WHERE user_id=?', [req.user.id]))[0]; const s = score(r); await saveScore(req.user.id, s); res.json(s); } catch (e) { next(e) } });
// app.get('/api/dashboard', auth, async (req, res, next) => { try { const m = (await query('SELECT * FROM work_metrics WHERE user_id=?', [req.user.id]))[0]; const apps = await query('SELECT * FROM financing_applications WHERE rider_id=? ORDER BY created_at DESC', [req.user.id]); res.json({ user: publicUser(req.user), workscore: m ? score(m) : null, applications: apps.map(appOut) }); } catch (e) { next(e) } });

// app.post('/api/financing/applications', auth, async (req, res, next) => { try { const { ev_price, down_payment, financing_amount, tenure_months, monthly_payment } = req.body; if (!ev_price || !financing_amount || !tenure_months || !monthly_payment) return res.status(400).json({ detail: 'Invalid financing data' }); if (Number(down_payment) + Number(financing_amount) > Number(ev_price) + 1) return res.status(400).json({ detail: 'Financing amount and down payment exceed EV price' }); const r = await query('INSERT INTO financing_applications(rider_id,ev_price,down_payment,financing_amount,tenure_months,monthly_payment) VALUES(?,?,?,?,?,?)', [req.user.id, ev_price, down_payment, financing_amount, tenure_months, monthly_payment]); const a = (await query('SELECT * FROM financing_applications WHERE id=?', [r.insertId]))[0]; res.json(appOut(a)); } catch (e) { next(e) } });
// app.get('/api/financing/applications', auth, async (req, res, next) => { try { const a = await query('SELECT * FROM financing_applications WHERE rider_id=? ORDER BY created_at DESC', [req.user.id]); res.json(a.map(appOut)); } catch (e) { next(e) } });
// app.get('/api/financing/applications/:id', auth, async (req, res, next) => { try { const a = (await query('SELECT * FROM financing_applications WHERE id=?', [req.params.id]))[0]; if (!a || (a.rider_id !== req.user.id && !['lender', 'admin'].includes(req.user.role))) return res.status(404).json({ detail: 'Application not found' }); res.json(appOut(a)); } catch (e) { next(e) } });

// app.get('/api/repayments', auth, async (req, res, next) => {
//   try {
//     const repayments = await query(
//       `SELECT
//          r.id,
//          r.application_id,
//          r.amount,
//          r.due_date,
//          r.paid_date,
//          r.status
//        FROM repayments r
//        INNER JOIN financing_applications a
//          ON a.id = r.application_id
//        WHERE a.rider_id = ?
//        ORDER BY r.due_date ASC`,
//       [req.user.id]
//     );

//     res.json(repayments.map(repaymentOut));
//   } catch (e) {
//     console.error('GET /api/repayments error:', e);
//     next(e);
//   }
// });
// app.post('/api/repayments/:id/pay', auth, async (req, res, next) => {
//   try {
//     const repayment = (
//       await query(
//         `SELECT
//            r.*
//          FROM repayments r
//          INNER JOIN financing_applications a
//            ON a.id = r.application_id
//          WHERE r.id = ?
//            AND a.rider_id = ?`,
//         [req.params.id, req.user.id]
//       )
//     )[0];

//     if (!repayment) {
//       return res.status(404).json({
//         detail: 'Repayment not found'
//       });
//     }

//     if (repayment.status === 'Paid') {
//       return res.status(400).json({
//         detail: 'This repayment has already been paid'
//       });
//     }

//     await query(
//       `UPDATE repayments
//        SET status = 'Paid',
//            paid_date = CURDATE()
//        WHERE id = ?`,
//       [repayment.id]
//     );

//     const updated = (
//       await query(
//         `SELECT *
//          FROM repayments
//          WHERE id = ?`,
//         [repayment.id]
//       )
//     )[0];

//     res.json(repaymentOut(updated));

//   } catch (e) {
//     console.error('POST /api/repayments/:id/pay error:', e);
//     next(e);
//   }
// });
// app.get('/api/ownership', auth, async (req, res, next) => { try { const rows = await query("SELECT a.financing_amount, COALESCE(SUM(CASE WHEN r.status='Paid' THEN r.amount ELSE 0 END),0) paid FROM financing_applications a LEFT JOIN repayments r ON r.application_id=a.id WHERE a.rider_id=? AND a.status='Approved' GROUP BY a.id", [req.user.id]); const total = rows.reduce((s, x) => s + Number(x.financing_amount), 0), paid = rows.reduce((s, x) => s + Number(x.paid), 0); res.json({ total_financing: money(total), paid: money(paid), remaining: money(Math.max(0, total - paid)), progress_percent: total ? Number(((paid / total) * 100).toFixed(1)) : 0 }); } catch (e) { next(e) } });

// app.get('/api/lender/summary', auth, lenderOnly, async (req, res, next) => { try { const [{ total_riders }, { pending_applications }, { approved_applications }] = await Promise.all([query("SELECT COUNT(*) total_riders FROM users WHERE role='rider'"), query("SELECT COUNT(*) pending_applications FROM financing_applications WHERE status='Pending'"), query("SELECT COUNT(*) approved_applications FROM financing_applications WHERE status='Approved'")]); const ms = await query("SELECT wm.* FROM work_metrics wm JOIN users u ON u.id=wm.user_id WHERE u.role='rider'"); const eligible = ms.filter(m => score(m).score >= 75).length; res.json({ total_riders: Number(total_riders), eligible_riders: eligible, pending_applications: Number(pending_applications), approved_applications: Number(approved_applications) }); } catch (e) { next(e) } });
// app.get('/api/lender/applications', auth, lenderOnly, async (req, res, next) => { try { const rows = await query(`SELECT a.*,u.name rider,u.mobile,wm.monthly_earnings,wm.deliveries,wm.working_days,wm.payment_reliability,wm.ev_usage_score FROM financing_applications a JOIN users u ON u.id=a.rider_id LEFT JOIN work_metrics wm ON wm.user_id=u.id ORDER BY a.created_at DESC`); res.json(rows.map(x => ({ id: Number(x.id), rider: x.rider, rider_id: Number(x.rider_id), mobile: x.mobile, workscore: x.deliveries != null ? score(x).score : 0, monthly_earnings: Number(x.monthly_earnings || 0), financing_requested: Number(x.financing_amount), status: x.status, created_at: x.created_at }))); } catch (e) { next(e) } });
// app.get('/api/lender/riders', auth, lenderOnly, async (req, res, next) => { try { const rows = await query(`SELECT u.*,k.status kyc_status,wm.deliveries,wm.monthly_earnings,wm.working_days,wm.payment_reliability,wm.ev_usage_score FROM users u LEFT JOIN kyc k ON k.user_id=u.id LEFT JOIN work_metrics wm ON wm.user_id=u.id WHERE u.role='rider'`); res.json(rows.map(x => ({ id: Number(x.id), name: x.name, mobile: x.mobile, email: x.email, kyc_status: x.kyc_status || 'pending', workscore: x.deliveries != null ? score(x).score : 0, deliveries: Number(x.deliveries || 0), monthly_earnings: Number(x.monthly_earnings || 0), working_days: Number(x.working_days || 0), payment_reliability: Number(x.payment_reliability || 0) }))); } catch (e) { next(e) } });
// app.patch('/api/lender/applications/:id', auth, lenderOnly, async (req, res, next) => {
//   try {
//     const { status, notes } = req.body;

//     if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
//       return res.status(400).json({
//         detail: 'Invalid status',
//       });
//     }

//     const applications = await query(
//       'SELECT * FROM financing_applications WHERE id=?',
//       [req.params.id]
//     );

//     const a = applications[0];

//     if (!a) {
//       return res.status(404).json({
//         detail: 'Application not found',
//       });
//     }

//     await transaction(async (c) => {
//       // Update application status
//       await c.execute(
//         `UPDATE financing_applications
//          SET status=?, notes=?
//          WHERE id=?`,
//         [
//           status,
//           notes || null,
//           a.id,
//         ]
//       );

//       // Only create repayment schedule when approved
//       if (status === 'Approved') {
//         const [existing] = await c.execute(
//           `SELECT id
//            FROM repayments
//            WHERE application_id=?
//            LIMIT 1`,
//           [a.id]
//         );

//         // Prevent duplicate repayment schedules
//         if (!existing[0]) {
//           const monthlyPayment = Number(a.monthly_payment);
//           const tenure = Number(a.tenure_months);

//           if (
//             !Number.isFinite(monthlyPayment) ||
//             monthlyPayment <= 0
//           ) {
//             throw new Error(
//               'Invalid monthly payment amount'
//             );
//           }

//           if (
//             !Number.isInteger(tenure) ||
//             tenure <= 0
//           ) {
//             throw new Error(
//               'Invalid repayment tenure'
//             );
//           }

//           for (let i = 0; i < tenure; i++) {
//             const due = new Date();

//             due.setDate(
//               due.getDate() + 30 * (i + 1)
//             );

//             const iso = due
//               .toISOString()
//               .slice(0, 10);

//             await c.execute(
//               `INSERT INTO repayments
//                (application_id, amount, due_date)
//                VALUES (?, ?, ?)`,
//               [
//                 a.id,
//                 Math.round(monthlyPayment * 100) / 100,
//                 iso,
//               ]
//             );
//           }
//         }
//       }
//     });

//     const updated = (
//       await query(
//         'SELECT * FROM financing_applications WHERE id=?',
//         [a.id]
//       )
//     )[0];

//     res.json(appOut(updated));
//   } catch (e) {
//     console.error(
//       'PATCH /api/lender/applications/:id error:',
//       e
//     );

//     next(e);
//   }
// });
// app.get('/api/lender/applications/:id', auth, lenderOnly, async (req, res, next) => { try { const a = (await query('SELECT * FROM financing_applications WHERE id=?', [req.params.id]))[0]; if (!a) return res.status(404).json({ detail: 'Application not found' }); const u = (await query('SELECT id,name,mobile,email FROM users WHERE id=?', [a.rider_id]))[0]; const k = (await query('SELECT * FROM kyc WHERE user_id=?', [a.rider_id]))[0] || null; const m = (await query('SELECT * FROM work_metrics WHERE user_id=?', [a.rider_id]))[0] || null; const reps = await query('SELECT * FROM repayments WHERE application_id=? ORDER BY due_date', [a.id]); res.json({ application: appOut(a), rider: u, kyc: k, workscore: m ? score(m) : null, repayments: reps.map(repaymentOut) }); } catch (e) { next(e) } });

// app.post('/api/dev/seed', async (req, res, next) => { try { if ((await query('SELECT COUNT(*) count FROM users'))[0].count > 0) return res.json({ message: 'Database already seeded' }); const riderHash = await hashPassword('sahana123'), lenderHash = await hashPassword('admin123'); const r = await query('INSERT INTO users(name,mobile,email,password_hash,role) VALUES(?,?,?,?,?)', ['Sahana', '+919876543210', 'sahana@email.com', riderHash, 'rider']); await query('INSERT INTO users(name,mobile,email,password_hash,role) VALUES(?,?,?,?,?)', ['Lender Admin', '+919000000000', 'lender@batterycredit.local', lenderHash, 'lender']); await query('INSERT INTO kyc(user_id,full_name,government_id,consent_given,status) VALUES(?,?,?,?,?)', [r.insertId, 'Sahana', 'DEMO-ID-001', true, 'verified']); await query('INSERT INTO work_metrics(user_id,deliveries,monthly_earnings,working_days,payment_reliability,ev_usage_score) VALUES(?,?,?,?,?,?)', [r.insertId, 245, 28500, 24, 95, 80]); await query('INSERT INTO financing_applications(rider_id,ev_price,down_payment,financing_amount,tenure_months,monthly_payment,status) VALUES(?,?,?,?,?,?,?)', [r.insertId, 85000, 15000, 70000, 12, 6200, 'Pending']); res.json({ message: 'Seed complete', rider_login: { mobile: '+919876543210', password: 'sahana123' }, lender_login: { mobile: '+919000000000', password: 'admin123' } }); } catch (e) { next(e) } });

// app.use((err, req, res, next) => { console.error(err); res.status(500).json({ detail: err.message || 'Internal server error' }); });
// app.listen(port, () => console.log(`Battery-as-Credit backend running on http://localhost:${port}`));

{/*import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query, transaction } from './db.js';
import {
  auth,
  lenderOnly,
  hashPassword,
  verifyPassword,
  createToken,
  publicUser
} from './auth.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);

const origins = [
  'http://localhost:8443',
  'http://localhost:5173',
  'http://127.0.0.1:8443',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || origins.includes(origin)
        ? cb(null, true)
        : cb(new Error('CORS blocked')),
    credentials: true
  })
);

app.use(express.json());

const money = x => Number(Number(x).toFixed(2));

function clamp100(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}


// ============================================================
// ML INTEGRATION
// ============================================================
//
// Flask ML service:
// http://127.0.0.1:5001
//
// The URL can be changed using ML_SERVICE_URL in .env.
// This keeps the Flask service address configurable.
// ============================================================

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';


// ------------------------------------------------------------
// Send rider/application data to the Flask Random Forest model
// ------------------------------------------------------------
//
// The Flask model requires exactly these 13 features:
//
// 1. months_on_zypp
// 2. days_worked_per_month
// 3. deliveries_per_month
// 4. monthly_earnings_inr
// 5. earnings_volatility
// 6. work_consistency
// 7. ev_usage_hours_per_month
// 8. missed_payments
// 9. on_time_payment_rate
// 10. rental_months_completed
// 11. loan_amount_inr
// 12. loan_term_months
// 13. monthly_emi_inr
//
// The existing MySQL database does not contain all 13 values.
// Therefore, values that are not currently stored directly are
// derived from the information already available in the app.
//
// This function does NOT change the existing WorkScore formula.
// It only obtains the separate ML repayment-risk prediction.
// ------------------------------------------------------------

async function predictWithML({
  workMetrics,
  application = null,
  repaymentRows = []
}) {
  const m = workMetrics || {};

  // Existing database metrics
  const deliveries = Number(m.deliveries || 0);
  const monthlyEarnings = Number(m.monthly_earnings || 0);
  const workingDays = Number(m.working_days || 0);
  const paymentReliability = clamp100(m.payment_reliability);
  const evUsageScore = clamp100(m.ev_usage_score);

  // ----------------------------------------------------------
  // Derived ML features
  // ----------------------------------------------------------
  //
  // These are demo-oriented mappings because the current
  // database does not store these ML fields separately.
  //
  // They are kept deterministic so the same rider data gives
  // the same model input.
  // ----------------------------------------------------------

  // The current database does not have platform tenure.
  // We use rental/payment participation as the closest
  // available proxy, with a minimum of 1 month.
  const rentalMonthsCompleted = Math.max(
    1,
    repaymentRows.length
  );

  const monthsOnZypp = Math.max(
    rentalMonthsCompleted,
    1
  );

  // Current database does not store earnings history,
  // so we use a conservative synthetic volatility estimate
  // based on the rider's WorkScore earnings stability.
  const earningsStability = clamp100(
    (monthlyEarnings / 30000) * 100
  );

  const earningsVolatility = Number(
    (1 - earningsStability / 100).toFixed(3)
  );

  // Work consistency is represented using active work days.
  const workConsistency = Number(
    Math.min(1, workingDays / 26).toFixed(3)
  );

  // Current database stores an EV usage score (0-100),
  // rather than hours. We map it to a reasonable monthly
  // usage-hour range represented in the training dataset.
  const evUsageHours = Number(
    (80 + (evUsageScore / 100) * 100).toFixed(1)
  );

  // Count missed payments from the repayment history.
  //
  // If no repayment schedule exists yet, we assume zero
  // missed payments because there is no recorded history.
  const missedPayments = repaymentRows.filter(
    r =>
      String(r.status || '').toLowerCase() === 'missed' ||
      String(r.status || '').toLowerCase() === 'overdue'
  ).length;

  // The existing payment_reliability is stored as 0-100.
  // The ML model expects a fraction from 0-1.
  const onTimePaymentRate = Number(
    (paymentReliability / 100).toFixed(3)
  );

  // Application-specific values.
  //
  // If the rider has not created a financing application yet,
  // safe demo defaults are used.
  const loanAmount = Number(
    application?.financing_amount || 70000
  );

  const loanTerm = Number(
    application?.tenure_months || 12
  );

  const monthlyEmi = Number(
    application?.monthly_payment || 0
  );

  // Build the exact 13-feature object expected by Flask.
  const features = {
    months_on_zypp: monthsOnZypp,
    days_worked_per_month: workingDays,
    deliveries_per_month: deliveries,
    monthly_earnings_inr: monthlyEarnings,
    earnings_volatility: earningsVolatility,
    work_consistency: workConsistency,
    ev_usage_hours_per_month: evUsageHours,
    missed_payments: missedPayments,
    on_time_payment_rate: onTimePaymentRate,
    rental_months_completed: rentalMonthsCompleted,
    loan_amount_inr: loanAmount,
    loan_term_months: loanTerm,
    monthly_emi_inr: monthlyEmi
  };

  try {
    // Call Flask /predict.
    const response = await fetch(
      `${ML_SERVICE_URL}/predict`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(features)
      }
    );

    const result = await response.json();
    //adding ts below
    console.log('ML RESPONSE:', result);

    if (!response.ok) {
      throw new Error(
        result?.error || 'ML prediction failed'
      );
    }

    // Return both the prediction and the features used.
    // Keeping ml_features is useful for debugging/demo purposes.
    return {
      ...result,
      ml_features: features
    };

  } catch (error) {
    console.error(
      'ML service unavailable:',
      error.message
    );

    // Do not break the existing application if Flask is
    // temporarily unavailable.
    //
    // The existing rule-based WorkScore will continue working.
    return {
      ml_prediction: null,
      ml_prediction_label: 'ML prediction unavailable',
      repayment_probability: null,
      repayment_percentage: null,
      risk_level: 'Unavailable',
      recommendation:
        'ML service is currently unavailable',
      ml_error: error.message
    };
  }
}


// ============================================================
// END ML INTEGRATION
// ============================================================


// Generate realistic metrics for a new driver.
// Each driver gets a different performance profile.
function generateDriverMetrics() {
  const profiles = [
    {
      name: 'high',
      deliveries: [250, 320],
      earnings: [28000, 35000],
      workingDays: [24, 27],
      reliability: [90, 100],
      evUsage: [85, 100]
    },
    {
      name: 'average',
      deliveries: [180, 249],
      earnings: [21000, 27999],
      workingDays: [20, 24],
      reliability: [75, 89],
      evUsage: [65, 84]
    },
    {
      name: 'developing',
      deliveries: [120, 179],
      earnings: [15000, 20999],
      workingDays: [16, 20],
      reliability: [60, 74],
      evUsage: [50, 64]
    },
    {
      name: 'low',
      deliveries: [70, 119],
      earnings: [10000, 14999],
      workingDays: [12, 16],
      reliability: [45, 59],
      evUsage: [35, 49]
    }
  ];

  const profile =
    profiles[Math.floor(Math.random() * profiles.length)];

  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    deliveries: randomInt(...profile.deliveries),
    monthly_earnings: randomInt(...profile.earnings),
    working_days: randomInt(...profile.workingDays),
    payment_reliability: randomInt(...profile.reliability),
    ev_usage_score: randomInt(...profile.evUsage)
  };
}


// WorkScore formula supplied by the project owner:
//
// Earnings stability * 0.30
// + Delivery consistency * 0.20
// + Work days * 0.25
// + Repayment history * 0.15
// + EV usage/tenure * 0.10
//
// This remains the transparent 0-100 baseline score.
function score(m) {
  const deliveries = Number(m.deliveries || 0);
  const monthlyEarnings = Number(m.monthly_earnings || 0);
  const workingDays = Number(m.working_days || 0);
  const paymentReliability =
    clamp100(m.payment_reliability);
  const evUsage = clamp100(m.ev_usage_score);

  const earningsStability = clamp100(
    (monthlyEarnings / 30000) * 100
  );

  const deliveryConsistency = clamp100(
    (deliveries / 300) * 100
  );

  const workDays = clamp100(
    (workingDays / 26) * 100
  );

  const repaymentHistory = paymentReliability;
  const evUsageTenure = evUsage;

  const total = Number(
    (
      earningsStability * 0.30 +
      deliveryConsistency * 0.20 +
      workDays * 0.25 +
      repaymentHistory * 0.15 +
      evUsageTenure * 0.10
    ).toFixed(2)
  );

  return {
    score: total,

    status:
      total >= 80
        ? 'Excellent'
        : total >= 65
          ? 'Good'
          : total >= 50
            ? 'Fair'
            : 'Needs improvement',

    earnings_stability:
      Number(earningsStability.toFixed(2)),

    delivery_consistency:
      Number(deliveryConsistency.toFixed(2)),

    work_days:
      Number(workDays.toFixed(2)),

    repayment_history:
      Number(repaymentHistory.toFixed(2)),

    ev_usage_tenure:
      Number(evUsageTenure.toFixed(2)),

    weights: {
      earnings_stability: 0.30,
      delivery_consistency: 0.20,
      work_days: 0.25,
      repayment_history: 0.15,
      ev_usage_tenure: 0.10
    },

    deliveries,
    monthly_earnings: monthlyEarnings,
    working_days: workingDays,
    payment_reliability: paymentReliability,
    ev_usage_score: evUsage
  };
}


function saveScore(userId, s) {
  return query(
    `UPDATE work_metrics
     SET delivery_score=?,
         earnings_score=?,
         work_days_score=?,
         repayment_score=?,
         ev_usage_score_calculated=?,
         score=?
     WHERE user_id=?`,
    [
      s.delivery_consistency,
      s.earnings_stability,
      s.work_days,
      s.repayment_history,
      s.ev_usage_tenure,
      s.score,
      userId
    ]
  );
}


function appOut(a) {
  return {
    ...a,
    id: Number(a.id),
    rider_id: Number(a.rider_id),
    ev_price: Number(a.ev_price),
    down_payment: Number(a.down_payment),
    financing_amount: Number(a.financing_amount),
    tenure_months: Number(a.tenure_months),
    monthly_payment: Number(a.monthly_payment)
  };
}


function repaymentOut(r) {
  return {
    ...r,
    id: Number(r.id),
    application_id: Number(r.application_id),
    amount: Number(r.amount)
  };
}


app.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    service: 'battery-as-credit-api'
  })
);


app.post('/api/auth/register', async (req, res, next) => {
  try {
    const {
      name,
      mobile,
      email,
      password,
      role
    } = req.body;

    const accountRole =
      role === 'lender'
        ? 'lender'
        : 'rider';

    if (!name || !mobile || !password) {
      return res.status(400).json({
        detail:
          'Name, mobile and password are required'
      });
    }

    if (
      (
        await query(
          'SELECT id FROM users WHERE mobile=?',
          [mobile]
        )
      )[0]
    ) {
      return res.status(409).json({
        detail:
          'Mobile number already registered'
      });
    }

    const hash = await hashPassword(password);

    const result = await query(
      `INSERT INTO users
       (name, mobile, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        mobile,
        email || null,
        hash,
        accountRole
      ]
    );

    const user = {
      id: result.insertId,
      name,
      mobile,
      email: email || null,
      role: accountRole
    };

    if (accountRole === 'rider') {
      const metrics =
        generateDriverMetrics();

      await query(
        `INSERT INTO work_metrics
         (
           user_id,
           deliveries,
           monthly_earnings,
           working_days,
           payment_reliability,
           ev_usage_score
         )
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          result.insertId,
          metrics.deliveries,
          metrics.monthly_earnings,
          metrics.working_days,
          metrics.payment_reliability,
          metrics.ev_usage_score
        ]
      );

      const generatedScore =
        score(metrics);

      await saveScore(
        result.insertId,
        generatedScore
      );
    }

    res.json({
      access_token:
        createToken(user),

      token_type:
        'bearer',

      user
    });

  } catch (e) {
    next(e);
  }
});


app.post('/api/auth/login', async (req, res, next) => {
  try {
    const {
      mobile,
      password
    } = req.body;

    const rows =
      await query(
        'SELECT * FROM users WHERE mobile=?',
        [mobile]
      );

    const u = rows[0];

    if (
      !u ||
      !(await verifyPassword(
        password || '',
        u.password_hash
      ))
    ) {
      return res.status(401).json({
        detail:
          'Invalid mobile number or password'
      });
    }

    res.json({
      access_token:
        createToken(u),

      token_type:
        'bearer',

      user:
        publicUser(u)
    });

  } catch (e) {
    next(e);
  }
});


app.get('/api/me', auth, (req, res) =>
  res.json(publicUser(req.user))
);


app.post('/api/kyc', auth, async (req, res, next) => {
  try {
    const {
      full_name,
      mobile,
      email,
      government_id,
      date_of_birth,
      consent_given
    } = req.body;

    await query(
      'UPDATE users SET name=?,mobile=?,email=? WHERE id=?',
      [
        full_name,
        mobile,
        email || null,
        req.user.id
      ]
    );

    await query(
      `INSERT INTO kyc
       (
         user_id,
         full_name,
         government_id,
         date_of_birth,
         consent_given,
         status
       )
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name=VALUES(full_name),
         government_id=VALUES(government_id),
         date_of_birth=VALUES(date_of_birth),
         consent_given=VALUES(consent_given),
         status=VALUES(status)`,
      [
        req.user.id,
        full_name,
        government_id || null,
        date_of_birth || null,
        !!consent_given,
        consent_given
          ? 'verified'
          : 'pending'
      ]
    );

    res.json({
      status:
        consent_given
          ? 'verified'
          : 'pending',

      message:
        'KYC submitted successfully'
    });

  } catch (e) {
    next(e);
  }
});


app.get('/api/kyc', auth, async (req, res, next) => {
  try {
    const r =
      await query(
        'SELECT * FROM kyc WHERE user_id=?',
        [req.user.id]
      );

    res.json(
      r[0] || {
        status: 'not_started'
      }
    );

  } catch (e) {
    next(e);
  }
});


// ============================================================
// WORKSCORE + ML PREDICTION
// ============================================================
//
// Existing WorkScore is calculated first.
//
// Then the backend calls Flask /predict.
//
// The ML result is added to the response without replacing
// the existing WorkScore fields.
// ============================================================

app.get('/api/workscore', auth, async (req, res, next) => {
  try {
    const r =
      await query(
        'SELECT * FROM work_metrics WHERE user_id=?',
        [req.user.id]
      );

    if (!r[0]) {
      return res.status(404).json({
        detail:
          'Work metrics not available'
      });
    }

    // Existing transparent WorkScore
    const s = score(r[0]);

    await saveScore(
      req.user.id,
      s
    );

    // Get latest financing application.
    // The ML model needs loan amount, term and EMI.
    const applications =
      await query(
        `SELECT *
         FROM financing_applications
         WHERE rider_id=?
         ORDER BY created_at DESC
         LIMIT 1`,
        [req.user.id]
      );

    const application =
      applications[0] || null;

    // Get repayment history for the rider.
    const repaymentRows =
      await query(
        `SELECT r.*
         FROM repayments r
         INNER JOIN financing_applications a
           ON a.id=r.application_id
         WHERE a.rider_id=?
         ORDER BY r.due_date`,
        [req.user.id]
      );

    // Call the Flask Random Forest model.
    const ml =
      await predictWithML({
        workMetrics: r[0],
        application,
        repaymentRows
      });

    // Preserve all existing WorkScore fields and
    // add the ML prediction fields.
    res.json({
      ...s,

      ml_prediction:
        ml.ml_prediction,

      ml_prediction_label:
        ml.ml_prediction_label,

      repayment_probability:
        ml.repayment_probability,

      repayment_percentage:
        ml.repayment_percentage,

      risk_level:
        ml.risk_level,

      recommendation:
        ml.recommendation

      // ml_features intentionally not returned to
      // the normal frontend response.
    });

  } catch (e) {
    next(e);
  }
});


app.put('/api/workscore', auth, async (req, res, next) => {
  try {
    const {
      deliveries,
      monthly_earnings,
      working_days,
      payment_reliability,
      ev_usage_score
    } = req.body;

    const values = [
      Math.max(
        0,
        Number(deliveries) || 0
      ),

      Math.max(
        0,
        Number(monthly_earnings) || 0
      ),

      Math.max(
        0,
        Number(working_days) || 0
      ),

      clamp100(
        payment_reliability
      ),

      clamp100(
        ev_usage_score
      )
    ];

    await query(
      `INSERT INTO work_metrics
       (
         user_id,
         deliveries,
         monthly_earnings,
         working_days,
         payment_reliability,
         ev_usage_score
       )
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         deliveries=VALUES(deliveries),
         monthly_earnings=VALUES(monthly_earnings),
         working_days=VALUES(working_days),
         payment_reliability=VALUES(payment_reliability),
         ev_usage_score=VALUES(ev_usage_score)`,
      [
        req.user.id,
        ...values
      ]
    );

    const r =
      (
        await query(
          'SELECT * FROM work_metrics WHERE user_id=?',
          [req.user.id]
        )
      )[0];

    const s = score(r);

    await saveScore(
      req.user.id,
      s
    );

    // Find latest application for ML inputs.
    const application =
      (
        await query(
          `SELECT *
           FROM financing_applications
           WHERE rider_id=?
           ORDER BY created_at DESC
           LIMIT 1`,
          [req.user.id]
        )
      )[0] || null;

    // Find repayment history.
    const repaymentRows =
      await query(
        `SELECT r.*
         FROM repayments r
         INNER JOIN financing_applications a
           ON a.id=r.application_id
         WHERE a.rider_id=?
         ORDER BY r.due_date`,
        [req.user.id]
      );

    const ml =
      await predictWithML({
        workMetrics: r,
        application,
        repaymentRows
      });

    res.json({
      ...s,

      ml_prediction:
        ml.ml_prediction,

      ml_prediction_label:
        ml.ml_prediction_label,

      repayment_probability:
        ml.repayment_probability,

      repayment_percentage:
        ml.repayment_percentage,

      risk_level:
        ml.risk_level,

      recommendation:
        ml.recommendation
    });

  } catch (e) {
    next(e);
  }
});


app.get('/api/dashboard', auth, async (req, res, next) => {
  try {
    const m =
      (
        await query(
          'SELECT * FROM work_metrics WHERE user_id=?',
          [req.user.id]
        )
      )[0];

    const apps =
      await query(
        `SELECT *
         FROM financing_applications
         WHERE rider_id=?
         ORDER BY created_at DESC`,
        [req.user.id]
      );

    res.json({
      user:
        publicUser(req.user),

      workscore:
        m
          ? score(m)
          : null,

      applications:
        apps.map(appOut)
    });

  } catch (e) {
    next(e);
  }
});


app.post('/api/financing/applications', auth, async (req, res, next) => {
  try {
    const {
      ev_price,
      down_payment,
      financing_amount,
      tenure_months,
      monthly_payment
    } = req.body;

    if (
      !ev_price ||
      !financing_amount ||
      !tenure_months ||
      !monthly_payment
    ) {
      return res.status(400).json({
        detail:
          'Invalid financing data'
      });
    }

    if (
      Number(down_payment) +
        Number(financing_amount) >
      Number(ev_price) + 1
    ) {
      return res.status(400).json({
        detail:
          'Financing amount and down payment exceed EV price'
      });
    }

    const r =
      await query(
        `INSERT INTO financing_applications
         (
           rider_id,
           ev_price,
           down_payment,
           financing_amount,
           tenure_months,
           monthly_payment
         )
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          ev_price,
          down_payment,
          financing_amount,
          tenure_months,
          monthly_payment
        ]
      );

    const a =
      (
        await query(
          'SELECT * FROM financing_applications WHERE id=?',
          [r.insertId]
        )
      )[0];

    res.json(appOut(a));

  } catch (e) {
    next(e);
  }
});


app.get('/api/financing/applications', auth, async (req, res, next) => {
  try {
    const a =
      await query(
        `SELECT *
         FROM financing_applications
         WHERE rider_id=?
         ORDER BY created_at DESC`,
        [req.user.id]
      );

    res.json(
      a.map(appOut)
    );

  } catch (e) {
    next(e);
  }
});


app.get('/api/financing/applications/:id', auth, async (req, res, next) => {
  try {
    const a =
      (
        await query(
          'SELECT * FROM financing_applications WHERE id=?',
          [req.params.id]
        )
      )[0];

    if (
      !a ||
      (
        a.rider_id !== req.user.id &&
        !['lender', 'admin'].includes(
          req.user.role
        )
      )
    ) {
      return res.status(404).json({
        detail:
          'Application not found'
      });
    }

    res.json(
      appOut(a)
    );

  } catch (e) {
    next(e);
  }
});


app.get('/api/repayments', auth, async (req, res, next) => {
  try {
    const repayments =
      await query(
        `SELECT
           r.id,
           r.application_id,
           r.amount,
           r.due_date,
           r.paid_date,
           r.status
         FROM repayments r
         INNER JOIN financing_applications a
           ON a.id=r.application_id
         WHERE a.rider_id=?
         ORDER BY r.due_date ASC`,
        [req.user.id]
      );

    res.json(
      repayments.map(
        repaymentOut
      )
    );

  } catch (e) {
    console.error(
      'GET /api/repayments error:',
      e
    );

    next(e);
  }
});


app.post('/api/repayments/:id/pay', auth, async (req, res, next) => {
  try {
    const repayment =
      (
        await query(
          `SELECT r.*
           FROM repayments r
           INNER JOIN financing_applications a
             ON a.id=r.application_id
           WHERE r.id=?
             AND a.rider_id=?`,
          [
            req.params.id,
            req.user.id
          ]
        )
      )[0];

    if (!repayment) {
      return res.status(404).json({
        detail:
          'Repayment not found'
      });
    }

    if (
      repayment.status === 'Paid'
    ) {
      return res.status(400).json({
        detail:
          'This repayment has already been paid'
      });
    }

    await query(
      `UPDATE repayments
       SET status='Paid',
           paid_date=CURDATE()
       WHERE id=?`,
      [repayment.id]
    );

    const updated =
      (
        await query(
          `SELECT *
           FROM repayments
           WHERE id=?`,
          [repayment.id]
        )
      )[0];

    res.json(
      repaymentOut(updated)
    );

  } catch (e) {
    console.error(
      'POST /api/repayments/:id/pay error:',
      e
    );

    next(e);
  }
});


app.get('/api/ownership', auth, async (req, res, next) => {
  try {
    const rows =
      await query(
        `SELECT
           a.financing_amount,
           COALESCE(
             SUM(
               CASE
                 WHEN r.status='Paid'
                 THEN r.amount
                 ELSE 0
               END
             ),
             0
           ) paid
         FROM financing_applications a
         LEFT JOIN repayments r
           ON r.application_id=a.id
         WHERE a.rider_id=?
           AND a.status='Approved'
         GROUP BY a.id`,
        [req.user.id]
      );

    const total =
      rows.reduce(
        (s, x) =>
          s + Number(x.financing_amount),
        0
      );

    const paid =
      rows.reduce(
        (s, x) =>
          s + Number(x.paid),
        0
      );

    res.json({
      total_financing:
        money(total),

      paid:
        money(paid),

      remaining:
        money(
          Math.max(
            0,
            total - paid
          )
        ),

      progress_percent:
        total
          ? Number(
              (
                (paid / total) *
                100
              ).toFixed(1)
            )
          : 0
    });

  } catch (e) {
    next(e);
  }
});


app.get('/api/lender/summary', auth, lenderOnly, async (req, res, next) => {
  try {
    const [
      { total_riders },
      { pending_applications },
      { approved_applications }
    ] =
      await Promise.all([
        query(
          "SELECT COUNT(*) total_riders FROM users WHERE role='rider'"
        ),

        query(
          "SELECT COUNT(*) pending_applications FROM financing_applications WHERE status='Pending'"
        ),

        query(
          "SELECT COUNT(*) approved_applications FROM financing_applications WHERE status='Approved'"
        )
      ]);

    const ms =
      await query(
        `SELECT wm.*
         FROM work_metrics wm
         JOIN users u
           ON u.id=wm.user_id
         WHERE u.role='rider'`
      );

    const eligible =
      ms.filter(
        m =>
          score(m).score >= 75
      ).length;

    res.json({
      total_riders:
        Number(total_riders),

      eligible_riders:
        eligible,

      pending_applications:
        Number(pending_applications),

      approved_applications:
        Number(approved_applications)
    });

  } catch (e) {
    next(e);
  }
});


app.get('/api/lender/applications', auth, lenderOnly, async (req, res, next) => {
  try {
    const rows =
      await query(
        `SELECT
           a.*,
           u.name rider,
           u.mobile,
           wm.monthly_earnings,
           wm.deliveries,
           wm.working_days,
           wm.payment_reliability,
           wm.ev_usage_score
         FROM financing_applications a
         JOIN users u
           ON u.id=a.rider_id
         LEFT JOIN work_metrics wm
           ON wm.user_id=u.id
         ORDER BY a.created_at DESC`
      );

    res.json(
      rows.map(x => ({
        id:
          Number(x.id),

        rider:
          x.rider,

        rider_id:
          Number(x.rider_id),

        mobile:
          x.mobile,

        workscore:
          x.deliveries != null
            ? score(x).score
            : 0,

        monthly_earnings:
          Number(
            x.monthly_earnings || 0
          ),

        financing_requested:
          Number(
            x.financing_amount
          ),

        status:
          x.status,

        created_at:
          x.created_at
      }))
    );

  } catch (e) {
    next(e);
  }
});


app.get('/api/lender/riders', auth, lenderOnly, async (req, res, next) => {
  try {
    const rows =
      await query(
        `SELECT
           u.*,
           k.status kyc_status,
           wm.deliveries,
           wm.monthly_earnings,
           wm.working_days,
           wm.payment_reliability,
           wm.ev_usage_score
         FROM users u
         LEFT JOIN kyc k
           ON k.user_id=u.id
         LEFT JOIN work_metrics wm
           ON wm.user_id=u.id
         WHERE u.role='rider'`
      );

    res.json(
      rows.map(x => ({
        id:
          Number(x.id),

        name:
          x.name,

        mobile:
          x.mobile,

        email:
          x.email,

        kyc_status:
          x.kyc_status || 'pending',

        workscore:
          x.deliveries != null
            ? score(x).score
            : 0,

        deliveries:
          Number(x.deliveries || 0),

        monthly_earnings:
          Number(
            x.monthly_earnings || 0
          ),

        working_days:
          Number(
            x.working_days || 0
          ),

        payment_reliability:
          Number(
            x.payment_reliability || 0
          )
      }))
    );

  } catch (e) {
    next(e);
  }
});


app.patch('/api/lender/applications/:id', auth, lenderOnly, async (req, res, next) => {
  try {
    const {
      status,
      notes
    } = req.body;

    if (
      ![
        'Approved',
        'Rejected',
        'Pending'
      ].includes(status)
    ) {
      return res.status(400).json({
        detail:
          'Invalid status'
      });
    }

    const applications =
      await query(
        'SELECT * FROM financing_applications WHERE id=?',
        [req.params.id]
      );

    const a =
      applications[0];

    if (!a) {
      return res.status(404).json({
        detail:
          'Application not found'
      });
    }

    await transaction(async c => {
      await c.execute(
        `UPDATE financing_applications
         SET status=?,
             notes=?
         WHERE id=?`,
        [
          status,
          notes || null,
          a.id
        ]
      );

      if (
        status === 'Approved'
      ) {
        const [existing] =
          await c.execute(
            `SELECT id
             FROM repayments
             WHERE application_id=?
             LIMIT 1`,
            [a.id]
          );

        if (!existing[0]) {
          const monthlyPayment =
            Number(
              a.monthly_payment
            );

          const tenure =
            Number(
              a.tenure_months
            );

          if (
            !Number.isFinite(
              monthlyPayment
            ) ||
            monthlyPayment <= 0
          ) {
            throw new Error(
              'Invalid monthly payment amount'
            );
          }

          if (
            !Number.isInteger(
              tenure
            ) ||
            tenure <= 0
          ) {
            throw new Error(
              'Invalid repayment tenure'
            );
          }

          for (
            let i = 0;
            i < tenure;
            i++
          ) {
            const due =
              new Date();

            due.setDate(
              due.getDate() +
                30 * (i + 1)
            );

            const iso =
              due
                .toISOString()
                .slice(0, 10);

            await c.execute(
              `INSERT INTO repayments
               (
                 application_id,
                 amount,
                 due_date
               )
               VALUES (?, ?, ?)`,
              [
                a.id,
                Math.round(
                  monthlyPayment *
                    100
                ) / 100,
                iso
              ]
            );
          }
        }
      }
    });

    const updated =
      (
        await query(
          'SELECT * FROM financing_applications WHERE id=?',
          [a.id]
        )
      )[0];

    res.json(
      appOut(updated)
    );

  } catch (e) {
    console.error(
      'PATCH /api/lender/applications/:id error:',
      e
    );

    next(e);
  }
});


app.get('/api/lender/applications/:id', auth, lenderOnly, async (req, res, next) => {
  try {
    const a =
      (
        await query(
          'SELECT * FROM financing_applications WHERE id=?',
          [req.params.id]
        )
      )[0];

    if (!a) {
      return res.status(404).json({
        detail:
          'Application not found'
      });
    }

    const u =
      (
        await query(
          `SELECT
             id,
             name,
             mobile,
             email
           FROM users
           WHERE id=?`,
          [a.rider_id]
        )
      )[0];

    const k =
      (
        await query(
          'SELECT * FROM kyc WHERE user_id=?',
          [a.rider_id]
        )
      )[0] || null;

    const m =
      (
        await query(
          'SELECT * FROM work_metrics WHERE user_id=?',
          [a.rider_id]
        )
      )[0] || null;

    const reps =
      await query(
        `SELECT *
         FROM repayments
         WHERE application_id=?
         ORDER BY due_date`,
        [a.id]
      );

    res.json({
      application:
        appOut(a),

      rider:
        u,

      kyc:
        k,

      workscore:
        m
          ? score(m)
          : null,

      repayments:
        reps.map(
          repaymentOut
        )
    });

  } catch (e) {
    next(e);
  }
});


app.post('/api/dev/seed', async (req, res, next) => {
  try {
    if (
      (
        await query(
          'SELECT COUNT(*) count FROM users'
        )
      )[0].count > 0
    ) {
      return res.json({
        message:
          'Database already seeded'
      });
    }

    const riderHash =
      await hashPassword(
        'sahana123'
      );

    const lenderHash =
      await hashPassword(
        'admin123'
      );

    const r =
      await query(
        `INSERT INTO users
         (
           name,
           mobile,
           email,
           password_hash,
           role
         )
         VALUES (?, ?, ?, ?, ?)`,
        [
          'Sahana',
          '+919876543210',
          'sahana@email.com',
          riderHash,
          'rider'
        ]
      );

    await query(
      `INSERT INTO users
       (
         name,
         mobile,
         email,
         password_hash,
         role
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Lender Admin',
        '+919000000000',
        'lender@batterycredit.local',
        lenderHash,
        'lender'
      ]
    );

    await query(
      `INSERT INTO kyc
       (
         user_id,
         full_name,
         government_id,
         consent_given,
         status
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        r.insertId,
        'Sahana',
        'DEMO-ID-001',
        true,
        'verified'
      ]
    );

    await query(
      `INSERT INTO work_metrics
       (
         user_id,
         deliveries,
         monthly_earnings,
         working_days,
         payment_reliability,
         ev_usage_score
       )
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        r.insertId,
        245,
        28500,
        24,
        95,
        80
      ]
    );

    await query(
      `INSERT INTO financing_applications
       (
         rider_id,
         ev_price,
         down_payment,
         financing_amount,
         tenure_months,
         monthly_payment,
         status
       )
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        r.insertId,
        85000,
        15000,
        70000,
        12,
        6200,
        'Pending'
      ]
    );

    res.json({
      message:
        'Seed complete',

      rider_login: {
        mobile:
          '+919876543210',
        password:
          'sahana123'
      },

      lender_login: {
        mobile:
          '+919000000000',
        password:
          'admin123'
      }
    });

  } catch (e) {
    next(e);
  }
});


app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    detail:
      err.message ||
      'Internal server error'
  });
});


app.listen(
  port,
  () =>
    console.log(
      `Battery-as-Credit backend running on http://localhost:${port}`
    )
);
*/}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query, transaction } from './db.js';
import {
  auth,
  lenderOnly,
  hashPassword,
  verifyPassword,
  createToken,
  publicUser
} from './auth.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);

const origins = [
  'http://localhost:8443',
  'http://localhost:5173',
  'http://127.0.0.1:8443',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || origins.includes(origin)
        ? cb(null, true)
        : cb(new Error('CORS blocked')),
    credentials: true
  })
);

app.use(express.json());

const money = x => Number(Number(x).toFixed(2));

function clamp100(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';

async function predictWithML({
  workMetrics,
  application = null,
  repaymentRows = []
}) {
  const m = workMetrics || {};

  const deliveries = Number(m.deliveries || 0);
  const monthlyEarnings = Number(m.monthly_earnings || 0);
  const workingDays = Number(m.working_days || 0);
  const paymentReliability = clamp100(m.payment_reliability);
  const evUsageScore = clamp100(m.ev_usage_score);

  const rentalMonthsCompleted = Math.max(
    1,
    repaymentRows.length
  );

  const monthsOnZypp = Math.max(
    rentalMonthsCompleted,
    1
  );

  const earningsStability = clamp100(
    (monthlyEarnings / 30000) * 100
  );

  const earningsVolatility = Number(
    (1 - earningsStability / 100).toFixed(3)
  );

  const workConsistency = Number(
    Math.min(1, workingDays / 26).toFixed(3)
  );

  const evUsageHours = Number(
    (80 + (evUsageScore / 100) * 100).toFixed(1)
  );

  const missedPayments = repaymentRows.filter(
    r =>
      String(r.status || '').toLowerCase() === 'missed' ||
      String(r.status || '').toLowerCase() === 'overdue'
  ).length;

  const onTimePaymentRate = Number(
    (paymentReliability / 100).toFixed(3)
  );

  const loanAmount = Number(
    application?.financing_amount || 70000
  );

  const loanTerm = Number(
    application?.tenure_months || 12
  );

  const monthlyEmi = Number(
    application?.monthly_payment || 0
  );

  const features = {
    months_on_zypp: monthsOnZypp,
    days_worked_per_month: workingDays,
    deliveries_per_month: deliveries,
    monthly_earnings_inr: monthlyEarnings,
    earnings_volatility: earningsVolatility,
    work_consistency: workConsistency,
    ev_usage_hours_per_month: evUsageHours,
    missed_payments: missedPayments,
    on_time_payment_rate: onTimePaymentRate,
    rental_months_completed: rentalMonthsCompleted,
    loan_amount_inr: loanAmount,
    loan_term_months: loanTerm,
    monthly_emi_inr: monthlyEmi
  };

  try {
    const response = await fetch(
      `${ML_SERVICE_URL}/predict`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(features)
      }
    );

    const result = await response.json();

    console.log('ML RESPONSE:', result);

    if (!response.ok) {
      throw new Error(
        result?.error || 'ML prediction failed'
      );
    }

    return {
      ...result,
      ml_features: features
    };
  } catch (error) {
    console.error(
      'ML service unavailable:',
      error.message
    );

    return {
      prediction: null,
      prediction_label: 'ML prediction unavailable',
      repayment_probability: null,
      repayment_percentage: null,
      risk_level: 'Unavailable',
      recommendation:
        'ML service is currently unavailable',
      ml_error: error.message
    };
  }
}

function generateDriverMetrics() {
  const profiles = [
    {
      name: 'high',
      deliveries: [250, 320],
      earnings: [28000, 35000],
      workingDays: [24, 27],
      reliability: [90, 100],
      evUsage: [85, 100]
    },
    {
      name: 'average',
      deliveries: [180, 249],
      earnings: [21000, 27999],
      workingDays: [20, 24],
      reliability: [75, 89],
      evUsage: [65, 84]
    },
    {
      name: 'developing',
      deliveries: [120, 179],
      earnings: [15000, 20999],
      workingDays: [16, 20],
      reliability: [60, 74],
      evUsage: [50, 64]
    },
    {
      name: 'low',
      deliveries: [70, 119],
      earnings: [10000, 14999],
      workingDays: [12, 16],
      reliability: [45, 59],
      evUsage: [35, 49]
    }
  ];

  const profile =
    profiles[Math.floor(Math.random() * profiles.length)];

  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    deliveries: randomInt(...profile.deliveries),
    monthly_earnings: randomInt(...profile.earnings),
    working_days: randomInt(...profile.workingDays),
    payment_reliability: randomInt(...profile.reliability),
    ev_usage_score: randomInt(...profile.evUsage)
  };
}

function score(m) {
  const deliveries = Number(m.deliveries || 0);
  const monthlyEarnings = Number(m.monthly_earnings || 0);
  const workingDays = Number(m.working_days || 0);
  const paymentReliability =
    clamp100(m.payment_reliability);
  const evUsage = clamp100(m.ev_usage_score);

  const earningsStability = clamp100(
    (monthlyEarnings / 30000) * 100
  );

  const deliveryConsistency = clamp100(
    (deliveries / 300) * 100
  );

  const workDays = clamp100(
    (workingDays / 26) * 100
  );

  const repaymentHistory = paymentReliability;
  const evUsageTenure = evUsage;

  const total = Number(
    (
      earningsStability * 0.30 +
      deliveryConsistency * 0.20 +
      workDays * 0.25 +
      repaymentHistory * 0.15 +
      evUsageTenure * 0.10
    ).toFixed(2)
  );

  return {
    score: total,

    status:
      total >= 80
        ? 'Excellent'
        : total >= 65
          ? 'Good'
          : total >= 50
            ? 'Fair'
            : 'Needs improvement',

    earnings_stability:
      Number(earningsStability.toFixed(2)),

    delivery_consistency:
      Number(deliveryConsistency.toFixed(2)),

    work_days:
      Number(workDays.toFixed(2)),

    repayment_history:
      Number(repaymentHistory.toFixed(2)),

    ev_usage_tenure:
      Number(evUsageTenure.toFixed(2)),

    weights: {
      earnings_stability: 0.30,
      delivery_consistency: 0.20,
      work_days: 0.25,
      repayment_history: 0.15,
      ev_usage_tenure: 0.10
    },

    deliveries,
    monthly_earnings: monthlyEarnings,
    working_days: workingDays,
    payment_reliability: paymentReliability,
    ev_usage_score: evUsage
  };
}

function saveScore(userId, s) {
  return query(
    `UPDATE work_metrics
     SET delivery_score=?,
         earnings_score=?,
         work_days_score=?,
         repayment_score=?,
         ev_usage_score_calculated=?,
         score=?
     WHERE user_id=?`,
    [
      s.delivery_consistency,
      s.earnings_stability,
      s.work_days,
      s.repayment_history,
      s.ev_usage_tenure,
      s.score,
      userId
    ]
  );
}

function appOut(a) {
  return {
    ...a,
    id: Number(a.id),
    rider_id: Number(a.rider_id),
    ev_price: Number(a.ev_price),
    down_payment: Number(a.down_payment),
    financing_amount: Number(a.financing_amount),
    tenure_months: Number(a.tenure_months),
    monthly_payment: Number(a.monthly_payment)
  };
}

function repaymentOut(r) {
  return {
    ...r,
    id: Number(r.id),
    application_id: Number(r.application_id),
    amount: Number(r.amount)
  };
}

app.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    service: 'battery-as-credit-api'
  })
);

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const {
      name,
      mobile,
      email,
      password,
      role
    } = req.body;

    const accountRole =
      role === 'lender'
        ? 'lender'
        : 'rider';

    if (!name || !mobile || !password) {
      return res.status(400).json({
        detail:
          'Name, mobile and password are required'
      });
    }

    if (
      (
        await query(
          'SELECT id FROM users WHERE mobile=?',
          [mobile]
        )
      )[0]
    ) {
      return res.status(409).json({
        detail:
          'Mobile number already registered'
      });
    }

    const hash = await hashPassword(password);

    const result = await query(
      `INSERT INTO users
       (name, mobile, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        mobile,
        email || null,
        hash,
        accountRole
      ]
    );

    const user = {
      id: result.insertId,
      name,
      mobile,
      email: email || null,
      role: accountRole
    };

    if (accountRole === 'rider') {
      const metrics =
        generateDriverMetrics();

      await query(
        `INSERT INTO work_metrics
         (
           user_id,
           deliveries,
           monthly_earnings,
           working_days,
           payment_reliability,
           ev_usage_score
         )
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          result.insertId,
          metrics.deliveries,
          metrics.monthly_earnings,
          metrics.working_days,
          metrics.payment_reliability,
          metrics.ev_usage_score
        ]
      );

      const generatedScore =
        score(metrics);

      await saveScore(
        result.insertId,
        generatedScore
      );
    }

    res.json({
      access_token:
        createToken(user),

      token_type:
        'bearer',

      user
    });
  } catch (e) {
    next(e);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const {
      mobile,
      password
    } = req.body;

    const rows =
      await query(
        'SELECT * FROM users WHERE mobile=?',
        [mobile]
      );

    const u = rows[0];

    if (
      !u ||
      !(await verifyPassword(
        password || '',
        u.password_hash
      ))
    ) {
      return res.status(401).json({
        detail:
          'Invalid mobile number or password'
      });
    }

    res.json({
      access_token:
        createToken(u),

      token_type:
        'bearer',

      user:
        publicUser(u)
    });
  } catch (e) {
    next(e);
  }
});

app.get('/api/me', auth, (req, res) =>
  res.json(publicUser(req.user))
);

app.post('/api/kyc', auth, async (req, res, next) => {
  try {
    const {
      full_name,
      mobile,
      email,
      government_id,
      date_of_birth,
      consent_given
    } = req.body;

    await query(
      'UPDATE users SET name=?,mobile=?,email=? WHERE id=?',
      [
        full_name,
        mobile,
        email || null,
        req.user.id
      ]
    );

    await query(
      `INSERT INTO kyc
       (
         user_id,
         full_name,
         government_id,
         date_of_birth,
         consent_given,
         status
       )
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name=VALUES(full_name),
         government_id=VALUES(government_id),
         date_of_birth=VALUES(date_of_birth),
         consent_given=VALUES(consent_given),
         status=VALUES(status)`,
      [
        req.user.id,
        full_name,
        government_id || null,
        date_of_birth || null,
        !!consent_given,
        consent_given
          ? 'verified'
          : 'pending'
      ]
    );

    res.json({
      status:
        consent_given
          ? 'verified'
          : 'pending',

      message:
        'KYC submitted successfully'
    });
  } catch (e) {
    next(e);
  }
});

app.get('/api/kyc', auth, async (req, res, next) => {
  try {
    const r =
      await query(
        'SELECT * FROM kyc WHERE user_id=?',
        [req.user.id]
      );

    res.json(
      r[0] || {
        status: 'not_started'
      }
    );
  } catch (e) {
    next(e);
  }
});

app.get('/api/workscore', auth, async (req, res, next) => {
  try {
    const r =
      await query(
        'SELECT * FROM work_metrics WHERE user_id=?',
        [req.user.id]
      );

    if (!r[0]) {
      return res.status(404).json({
        detail:
          'Work metrics not available'
      });
    }

    const s = score(r[0]);

    await saveScore(
      req.user.id,
      s
    );

    const applications =
      await query(
        `SELECT *
         FROM financing_applications
         WHERE rider_id=?
         ORDER BY created_at DESC
         LIMIT 1`,
        [req.user.id]
      );

    const application =
      applications[0] || null;

    const repaymentRows =
      await query(
        `SELECT r.*
         FROM repayments r
         INNER JOIN financing_applications a
           ON a.id=r.application_id
         WHERE a.rider_id=?
         ORDER BY r.due_date`,
        [req.user.id]
      );

    const ml =
      await predictWithML({
        workMetrics: r[0],
        application,
        repaymentRows
      });

    res.json({
      ...s,

      ml_prediction:
        ml.prediction,

      ml_prediction_label:
        ml.prediction_label,

      repayment_probability:
        ml.repayment_probability,

      repayment_percentage:
        ml.repayment_percentage,

      risk_level:
        ml.risk_level,

      recommendation:
        ml.recommendation
    });
  } catch (e) {
    next(e);
  }
});

app.put('/api/workscore', auth, async (req, res, next) => {
  try {
    const {
      deliveries,
      monthly_earnings,
      working_days,
      payment_reliability,
      ev_usage_score
    } = req.body;

    const values = [
      Math.max(
        0,
        Number(deliveries) || 0
      ),

      Math.max(
        0,
        Number(monthly_earnings) || 0
      ),

      Math.max(
        0,
        Number(working_days) || 0
      ),

      clamp100(
        payment_reliability
      ),

      clamp100(
        ev_usage_score
      )
    ];

    await query(
      `INSERT INTO work_metrics
       (
         user_id,
         deliveries,
         monthly_earnings,
         working_days,
         payment_reliability,
         ev_usage_score
       )
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         deliveries=VALUES(deliveries),
         monthly_earnings=VALUES(monthly_earnings),
         working_days=VALUES(working_days),
         payment_reliability=VALUES(payment_reliability),
         ev_usage_score=VALUES(ev_usage_score)`,
      [
        req.user.id,
        ...values
      ]
    );

    const r =
      (
        await query(
          'SELECT * FROM work_metrics WHERE user_id=?',
          [req.user.id]
        )
      )[0];

    const s = score(r);

    await saveScore(
      req.user.id,
      s
    );

    const application =
      (
        await query(
          `SELECT *
           FROM financing_applications
           WHERE rider_id=?
           ORDER BY created_at DESC
           LIMIT 1`,
          [req.user.id]
        )
      )[0] || null;

    const repaymentRows =
      await query(
        `SELECT r.*
         FROM repayments r
         INNER JOIN financing_applications a
           ON a.id=r.application_id
         WHERE a.rider_id=?
         ORDER BY r.due_date`,
        [req.user.id]
      );

    const ml =
      await predictWithML({
        workMetrics: r,
        application,
        repaymentRows
      });

    res.json({
      ...s,

      ml_prediction:
        ml.prediction,

      ml_prediction_label:
        ml.prediction_label,

      repayment_probability:
        ml.repayment_probability,

      repayment_percentage:
        ml.repayment_percentage,

      risk_level:
        ml.risk_level,

      recommendation:
        ml.recommendation
    });
  } catch (e) {
    next(e);
  }
});

app.get('/api/dashboard', auth, async (req, res, next) => {
  try {
    const m =
      (
        await query(
          'SELECT * FROM work_metrics WHERE user_id=?',
          [req.user.id]
        )
      )[0];

    const apps =
      await query(
        `SELECT *
         FROM financing_applications
         WHERE rider_id=?
         ORDER BY created_at DESC`,
        [req.user.id]
      );

    res.json({
      user:
        publicUser(req.user),

      workscore:
        m
          ? score(m)
          : null,

      applications:
        apps.map(appOut)
    });
  } catch (e) {
    next(e);
  }
});

app.post('/api/financing/applications', auth, async (req, res, next) => {
  try {
    const {
      ev_price,
      down_payment,
      financing_amount,
      tenure_months,
      monthly_payment
    } = req.body;

    if (
      !ev_price ||
      !financing_amount ||
      !tenure_months ||
      !monthly_payment
    ) {
      return res.status(400).json({
        detail:
          'Invalid financing data'
      });
    }

    if (
      Number(down_payment) +
        Number(financing_amount) >
      Number(ev_price) + 1
    ) {
      return res.status(400).json({
        detail:
          'Financing amount and down payment exceed EV price'
      });
    }

    const r =
      await query(
        `INSERT INTO financing_applications
         (
           rider_id,
           ev_price,
           down_payment,
           financing_amount,
           tenure_months,
           monthly_payment
         )
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          ev_price,
          down_payment,
          financing_amount,
          tenure_months,
          monthly_payment
        ]
      );

    const a =
      (
        await query(
          'SELECT * FROM financing_applications WHERE id=?',
          [r.insertId]
        )
      )[0];

    res.json(appOut(a));
  } catch (e) {
    next(e);
  }
});

app.get('/api/financing/applications', auth, async (req, res, next) => {
  try {
    const a =
      await query(
        `SELECT *
         FROM financing_applications
         WHERE rider_id=?
         ORDER BY created_at DESC`,
        [req.user.id]
      );

    res.json(
      a.map(appOut)
    );
  } catch (e) {
    next(e);
  }
});

app.get('/api/financing/applications/:id', auth, async (req, res, next) => {
  try {
    const a =
      (
        await query(
          'SELECT * FROM financing_applications WHERE id=?',
          [req.params.id]
        )
      )[0];

    if (
      !a ||
      (
        a.rider_id !== req.user.id &&
        !['lender', 'admin'].includes(
          req.user.role
        )
      )
    ) {
      return res.status(404).json({
        detail:
          'Application not found'
      });
    }

    res.json(
      appOut(a)
    );
  } catch (e) {
    next(e);
  }
});

app.get('/api/repayments', auth, async (req, res, next) => {
  try {
    const repayments =
      await query(
        `SELECT
           r.id,
           r.application_id,
           r.amount,
           r.due_date,
           r.paid_date,
           r.status
         FROM repayments r
         INNER JOIN financing_applications a
           ON a.id=r.application_id
         WHERE a.rider_id=?
         ORDER BY r.due_date ASC`,
        [req.user.id]
      );

    res.json(
      repayments.map(
        repaymentOut
      )
    );
  } catch (e) {
    console.error(
      'GET /api/repayments error:',
      e
    );

    next(e);
  }
});

app.post('/api/repayments/:id/pay', auth, async (req, res, next) => {
  try {
    const repayment =
      (
        await query(
          `SELECT r.*
           FROM repayments r
           INNER JOIN financing_applications a
             ON a.id=r.application_id
           WHERE r.id=?
             AND a.rider_id=?`,
          [
            req.params.id,
            req.user.id
          ]
        )
      )[0];

    if (!repayment) {
      return res.status(404).json({
        detail:
          'Repayment not found'
      });
    }

    if (
      repayment.status === 'Paid'
    ) {
      return res.status(400).json({
        detail:
          'This repayment has already been paid'
      });
    }

    await query(
      `UPDATE repayments
       SET status='Paid',
           paid_date=CURDATE()
       WHERE id=?`,
      [repayment.id]
    );

    const updated =
      (
        await query(
          `SELECT *
           FROM repayments
           WHERE id=?`,
          [repayment.id]
        )
      )[0];

    res.json(
      repaymentOut(updated)
    );
  } catch (e) {
    console.error(
      'POST /api/repayments/:id/pay error:',
      e
    );

    next(e);
  }
});

app.get('/api/ownership', auth, async (req, res, next) => {
  try {
    const rows =
      await query(
        `SELECT
           a.financing_amount,
           COALESCE(
             SUM(
               CASE
                 WHEN r.status='Paid'
                 THEN r.amount
                 ELSE 0
               END
             ),
             0
           ) paid
         FROM financing_applications a
         LEFT JOIN repayments r
           ON r.application_id=a.id
         WHERE a.rider_id=?
           AND a.status='Approved'
         GROUP BY a.id`,
        [req.user.id]
      );

    const total =
      rows.reduce(
        (s, x) =>
          s + Number(x.financing_amount),
        0
      );

    const paid =
      rows.reduce(
        (s, x) =>
          s + Number(x.paid),
        0
      );

    res.json({
      total_financing:
        money(total),

      paid:
        money(paid),

      remaining:
        money(
          Math.max(
            0,
            total - paid
          )
        ),

      progress_percent:
        total
          ? Number(
              (
                (paid / total) *
                100
              ).toFixed(1)
            )
          : 0
    });
  } catch (e) {
    next(e);
  }
});

app.get('/api/lender/summary', auth, lenderOnly, async (req, res, next) => {
  try {
    const [
      { total_riders },
      { pending_applications },
      { approved_applications }
    ] =
      await Promise.all([
        query(
          "SELECT COUNT(*) total_riders FROM users WHERE role='rider'"
        ),

        query(
          "SELECT COUNT(*) pending_applications FROM financing_applications WHERE status='Pending'"
        ),

        query(
          "SELECT COUNT(*) approved_applications FROM financing_applications WHERE status='Approved'"
        )
      ]);

    const ms =
      await query(
        `SELECT wm.*
         FROM work_metrics wm
         JOIN users u
           ON u.id=wm.user_id
         WHERE u.role='rider'`
      );

    const eligible =
      ms.filter(
        m =>
          score(m).score >= 75
      ).length;

    res.json({
      total_riders:
        Number(total_riders),

      eligible_riders:
        eligible,

      pending_applications:
        Number(pending_applications),

      approved_applications:
        Number(approved_applications)
    });
  } catch (e) {
    next(e);
  }
});

app.get('/api/lender/applications', auth, lenderOnly, async (req, res, next) => {
  try {
    const rows =
      await query(
        `SELECT
           a.*,
           u.name rider,
           u.mobile,
           wm.monthly_earnings,
           wm.deliveries,
           wm.working_days,
           wm.payment_reliability,
           wm.ev_usage_score
         FROM financing_applications a
         JOIN users u
           ON u.id=a.rider_id
         LEFT JOIN work_metrics wm
           ON wm.user_id=u.id
         ORDER BY a.created_at DESC`
      );

    res.json(
      rows.map(x => ({
        id:
          Number(x.id),

        rider:
          x.rider,

        rider_id:
          Number(x.rider_id),

        mobile:
          x.mobile,

        workscore:
          x.deliveries != null
            ? score(x).score
            : 0,

        monthly_earnings:
          Number(
            x.monthly_earnings || 0
          ),

        financing_requested:
          Number(
            x.financing_amount
          ),

        status:
          x.status,

        created_at:
          x.created_at
      }))
    );
  } catch (e) {
    next(e);
  }
});

app.get('/api/lender/riders', auth, lenderOnly, async (req, res, next) => {
  try {
    const rows =
      await query(
        `SELECT
           u.*,
           k.status kyc_status,
           wm.deliveries,
           wm.monthly_earnings,
           wm.working_days,
           wm.payment_reliability,
           wm.ev_usage_score
         FROM users u
         LEFT JOIN kyc k
           ON k.user_id=u.id
         LEFT JOIN work_metrics wm
           ON wm.user_id=u.id
         WHERE u.role='rider'`
      );

    res.json(
      rows.map(x => ({
        id:
          Number(x.id),

        name:
          x.name,

        mobile:
          x.mobile,

        email:
          x.email,

        kyc_status:
          x.kyc_status || 'pending',

        workscore:
          x.deliveries != null
            ? score(x).score
            : 0,

        deliveries:
          Number(x.deliveries || 0),

        monthly_earnings:
          Number(
            x.monthly_earnings || 0
          ),

        working_days:
          Number(
            x.working_days || 0
          ),

        payment_reliability:
          Number(
            x.payment_reliability || 0
          )
      }))
    );
  } catch (e) {
    next(e);
  }
});

app.patch('/api/lender/applications/:id', auth, lenderOnly, async (req, res, next) => {
  try {
    const {
      status,
      notes
    } = req.body;

    if (
      ![
        'Approved',
        'Rejected',
        'Pending'
      ].includes(status)
    ) {
      return res.status(400).json({
        detail:
          'Invalid status'
      });
    }

    const applications =
      await query(
        'SELECT * FROM financing_applications WHERE id=?',
        [req.params.id]
      );

    const a =
      applications[0];

    if (!a) {
      return res.status(404).json({
        detail:
          'Application not found'
      });
    }

    await transaction(async c => {
      await c.execute(
        `UPDATE financing_applications
         SET status=?,
             notes=?
         WHERE id=?`,
        [
          status,
          notes || null,
          a.id
        ]
      );

      if (
        status === 'Approved'
      ) {
        const [existing] =
          await c.execute(
            `SELECT id
             FROM repayments
             WHERE application_id=?
             LIMIT 1`,
            [a.id]
          );

        if (!existing[0]) {
          const monthlyPayment =
            Number(
              a.monthly_payment
            );

          const tenure =
            Number(
              a.tenure_months
            );

          if (
            !Number.isFinite(
              monthlyPayment
            ) ||
            monthlyPayment <= 0
          ) {
            throw new Error(
              'Invalid monthly payment amount'
            );
          }

          if (
            !Number.isInteger(
              tenure
            ) ||
            tenure <= 0
          ) {
            throw new Error(
              'Invalid repayment tenure'
            );
          }

          for (
            let i = 0;
            i < tenure;
            i++
          ) {
            const due =
              new Date();

            due.setDate(
              due.getDate() +
                30 * (i + 1)
            );

            const iso =
              due
                .toISOString()
                .slice(0, 10);

            await c.execute(
              `INSERT INTO repayments
               (
                 application_id,
                 amount,
                 due_date
               )
               VALUES (?, ?, ?)`,
              [
                a.id,
                Math.round(
                  monthlyPayment *
                    100
                ) / 100,
                iso
              ]
            );
          }
        }
      }
    });

    const updated =
      (
        await query(
          'SELECT * FROM financing_applications WHERE id=?',
          [a.id]
        )
      )[0];

    res.json(
      appOut(updated)
    );
  } catch (e) {
    console.error(
      'PATCH /api/lender/applications/:id error:',
      e
    );

    next(e);
  }
});

app.get('/api/lender/applications/:id', auth, lenderOnly, async (req, res, next) => {
  try {
    const a =
      (
        await query(
          'SELECT * FROM financing_applications WHERE id=?',
          [req.params.id]
        )
      )[0];

    if (!a) {
      return res.status(404).json({
        detail:
          'Application not found'
      });
    }

    const u =
      (
        await query(
          `SELECT
             id,
             name,
             mobile,
             email
           FROM users
           WHERE id=?`,
          [a.rider_id]
        )
      )[0];

    const k =
      (
        await query(
          'SELECT * FROM kyc WHERE user_id=?',
          [a.rider_id]
        )
      )[0] || null;

    const m =
      (
        await query(
          'SELECT * FROM work_metrics WHERE user_id=?',
          [a.rider_id]
        )
      )[0] || null;

    const reps =
      await query(
        `SELECT *
         FROM repayments
         WHERE application_id=?
         ORDER BY due_date`,
        [a.id]
      );

    res.json({
      application:
        appOut(a),

      rider:
        u,

      kyc:
        k,

      workscore:
        m
          ? score(m)
          : null,

      repayments:
        reps.map(
          repaymentOut
        )
    });
  } catch (e) {
    next(e);
  }
});

app.post('/api/dev/seed', async (req, res, next) => {
  try {
    if (
      (
        await query(
          'SELECT COUNT(*) count FROM users'
        )
      )[0].count > 0
    ) {
      return res.json({
        message:
          'Database already seeded'
      });
    }

    const riderHash =
      await hashPassword(
        'sahana123'
      );

    const lenderHash =
      await hashPassword(
        'admin123'
      );

    const r =
      await query(
        `INSERT INTO users
         (
           name,
           mobile,
           email,
           password_hash,
           role
         )
         VALUES (?, ?, ?, ?, ?)`,
        [
          'Sahana',
          '+919876543210',
          'sahana@email.com',
          riderHash,
          'rider'
        ]
      );

    await query(
      `INSERT INTO users
       (
         name,
         mobile,
         email,
         password_hash,
         role
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Lender Admin',
        '+919000000000',
        'lender@batterycredit.local',
        lenderHash,
        'lender'
      ]
    );

    await query(
      `INSERT INTO kyc
       (
         user_id,
         full_name,
         government_id,
         consent_given,
         status
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        r.insertId,
        'Sahana',
        'DEMO-ID-001',
        true,
        'verified'
      ]
    );

    await query(
      `INSERT INTO work_metrics
       (
         user_id,
         deliveries,
         monthly_earnings,
         working_days,
         payment_reliability,
         ev_usage_score
       )
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        r.insertId,
        245,
        28500,
        24,
        95,
        80
      ]
    );

    await query(
      `INSERT INTO financing_applications
       (
         rider_id,
         ev_price,
         down_payment,
         financing_amount,
         tenure_months,
         monthly_payment,
         status
       )
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        r.insertId,
        85000,
        15000,
        70000,
        12,
        6200,
        'Pending'
      ]
    );

    res.json({
      message:
        'Seed complete',

      rider_login: {
        mobile:
          '+919876543210',
        password:
          'sahana123'
      },

      lender_login: {
        mobile:
          '+919000000000',
        password:
          'admin123'
      }
    });
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    detail:
      err.message ||
      'Internal server error'
  });
});

app.listen(
  port,
  () =>
    console.log(
      `Battery-as-Credit backend running on http://localhost:${port}`
    )
);

import { Router } from "express";
import { pool } from "../config/db.js";
import { requireRole } from "../middleware/requireAuth.js";

const ALL_ADMIN = requireRole("admin", "guruji", "superadmin");

const router = Router();

/* ──────────────────────────────────────────────────────────────────────────
   GET /api/dashboard/today — Today command center cards (PRD §13)
────────────────────────────────────────────────────────────────────────── */
router.get("/today", ALL_ADMIN, async (_req, res) => {
  try {
    const q = (sql, params = []) => pool.query(sql, params).then(r => r.rows[0]?.n ?? 0);

    const [
      todaysAppointments, gurujiReviewPending, followupsDue, newIntake,
      missingInfo, reportsToPublish, urgentCases, noshowsYesterday,
      totalDevotees, openCases,
    ] = await Promise.all([
      q(`SELECT COUNT(*)::int n FROM appointments WHERE start_time::date = CURRENT_DATE AND status NOT IN ('Cancelled','Closed')`),
      q(`SELECT COUNT(*)::int n FROM trikala_readings WHERE status IN ('Awaiting Guruji Review','Under Review','AI Draft Generated')`),
      q(`SELECT COUNT(*)::int n FROM case_followups WHERE status IN ('Scheduled','Planned','Reminder Sent') AND date_time::date <= CURRENT_DATE`),
      q(`SELECT COUNT(*)::int n FROM trikala_readings WHERE status = 'Submitted'`),
      q(`SELECT COUNT(*)::int n FROM trikala_readings WHERE status = 'Incomplete'`),
      q(`SELECT COUNT(*)::int n FROM trikala_readings WHERE status = 'Finalized'`),
      q(`SELECT COUNT(*)::int n FROM trikala_readings WHERE priority IN ('Urgent','Emergency') AND status NOT IN ('Closed','Published / Shared')`),
      q(`SELECT COUNT(*)::int n FROM appointments WHERE status = 'No-show' AND start_time::date = CURRENT_DATE - 1`),
      q(`SELECT COUNT(*)::int n FROM devotees`),
      q(`SELECT COUNT(*)::int n FROM trikala_readings WHERE status NOT IN ('Closed','Published / Shared')`),
    ]);

    res.json({
      success: true,
      data: {
        todaysAppointments, gurujiReviewPending, followupsDue, newIntake,
        missingInfo, reportsToPublish, urgentCases, noshowsYesterday,
        totalDevotees, openCases,
      },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ──────────────────────────────────────────────────────────────────────────
   GET /api/dashboard/analytics — reports dashboard metrics (PRD §16)
────────────────────────────────────────────────────────────────────────── */
router.get("/analytics", ALL_ADMIN, async (_req, res) => {
  try {
    const one = (sql) => pool.query(sql).then(r => r.rows[0]?.n ?? 0);
    const [newThisWeek, pendingReview, followupsOverdue, closedThisMonth, totalDevotees] = await Promise.all([
      one(`SELECT COUNT(*)::int n FROM trikala_readings WHERE created_at >= NOW() - INTERVAL '7 days'`),
      one(`SELECT COUNT(*)::int n FROM trikala_readings WHERE status IN ('Awaiting Guruji Review','Under Review')`),
      one(`SELECT COUNT(*)::int n FROM case_followups WHERE status NOT IN ('Completed','Closed') AND date_time < NOW()`),
      one(`SELECT COUNT(*)::int n FROM trikala_readings WHERE status IN ('Closed','Published / Shared') AND updated_at >= date_trunc('month', NOW())`),
      one(`SELECT COUNT(*)::int n FROM devotees`),
    ]);

    const byCategory = await pool.query(
      `SELECT COALESCE(problem_category,'unknown') AS category, COUNT(*)::int AS count
       FROM trikala_readings GROUP BY problem_category ORDER BY count DESC`
    );
    const remediesByCategory = await pool.query(
      `SELECT category, COUNT(*)::int AS count FROM case_remedies
       WHERE category IS NOT NULL GROUP BY category ORDER BY count DESC`
    );

    res.json({
      success: true,
      data: {
        newThisWeek, pendingReview, followupsOverdue, closedThisMonth, totalDevotees,
        byCategory: byCategory.rows,
        remediesByCategory: remediesByCategory.rows,
      },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;

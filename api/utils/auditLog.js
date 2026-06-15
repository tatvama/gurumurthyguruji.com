import { pool } from "../config/db.js";

/**
 * Log an admin action to audit_logs.
 * Call this from any controller on create / update / delete.
 *
 * @param {object} opts
 * @param {number|null}  opts.userId     - admin_users.id (null = system)
 * @param {string}       opts.userName   - display name of the actor
 * @param {string}       opts.action     - e.g. "create", "update", "delete", "status_change"
 * @param {string}       opts.entityType - e.g. "trikala_case", "appointment", "devotee", "remedy"
 * @param {string}       opts.entityId   - primary key / reference of the affected record
 * @param {any}          [opts.oldValue] - previous value (will be JSON-stringified if object)
 * @param {any}          [opts.newValue] - new value
 */
export async function logAudit({ userId = null, userName = "system", action, entityType, entityId, oldValue, newValue }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_name, action, entity_type, entity_id, old_value, new_value)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        userName,
        action,
        entityType,
        String(entityId),
        oldValue != null ? (typeof oldValue === "string" ? oldValue : JSON.stringify(oldValue)) : null,
        newValue != null ? (typeof newValue === "string" ? newValue : JSON.stringify(newValue)) : null,
      ]
    );
  } catch (_) {
    /* Audit logging must never crash the main operation */
  }
}

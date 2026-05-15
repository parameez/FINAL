const router = require("express").Router();
const db = require("../db");

/**
 * บอร์ดยิงมา: POST /api/iot/grip
 * Headers:
 *   x-api-key: <IOT_API_KEY>
 * Body JSON:
 *   { device_id, grip_value, hand, user_id(optional) }
 */
router.post("/grip", async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (apiKey !== process.env.IOT_API_KEY) {
      return res.status(401).json({ msg: "Unauthorized device" });
    }

    const { device_id, grip_value, hand = "right", user_id = null } = req.body;

    if (!device_id || grip_value === undefined) {
      return res.status(400).json({ msg: "Missing device_id or grip_value" });
    }

    if (!["left", "right"].includes(hand)) {
      return res.status(400).json({ msg: "hand must be left or right" });
    }

    const valueNum = Number(grip_value);

    if (Number.isNaN(valueNum) || valueNum < 0) {
      return res.status(400).json({ msg: "Invalid grip_value" });
    }

    await db.query(
      `
      INSERT INTO tp_user_grip 
        (user_id, device_id, hand, grip_value, measured_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [user_id, device_id, hand, valueNum]
    );

    res.json({
      msg: "Saved",
      user_id,
      device_id,
      grip_value: valueNum,
      hand,
    });
  } catch (err) {
    console.error("IOT GRIP ERROR:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/**
 * ดึงค่าล่าสุดจากเครื่องบีบมือ
 * GET /api/iot/grip/latest
 */
router.get("/grip/latest", async (req, res) => {
  try {
    const rows = await db.query(
      `
      SELECT 
        g.grip_id,
        g.user_id,
        u.username,
        u.full_name,
        u.gender,
        g.device_id,
        g.hand,
        g.grip_value,
        g.measured_at
      FROM tp_user_grip g
      LEFT JOIN tp_user u 
        ON g.user_id = u.user_id
      ORDER BY g.measured_at DESC, g.grip_id DESC
      LIMIT 1
      `
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.error("IOT LATEST ERROR:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/**
 * ดึงประวัติย้อนหลัง
 * GET /api/iot/grip/history?limit=20
 */
router.get("/grip/history", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 200);

    const rows = await db.query(
      `
      SELECT 
        g.grip_id,
        g.user_id,
        u.username,
        u.full_name,
        u.gender,
        g.device_id,
        g.hand,
        g.grip_value,
        g.measured_at
      FROM tp_user_grip g
      LEFT JOIN tp_user u 
        ON g.user_id = u.user_id
      ORDER BY g.measured_at DESC, g.grip_id DESC
      LIMIT ?
      `,
      [limit]
    );

    res.json(rows);
  } catch (err) {
    console.error("IOT HISTORY ERROR:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
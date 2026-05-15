const router = require("express").Router();
const db = require("../db");

// ดึงค่าล่าสุดของผู้ใช้แต่ละคน
router.get("/latest", async (req, res) => {
  try {
    const rows = await db.query(`
      SELECT 
        u.user_id,
        u.username,
        u.full_name,
        u.gender,
        g.grip_id,
        g.device_id,
        g.grip_value AS handgrip_strength,
        g.hand,
        g.measured_at
      FROM tp_user u
      LEFT JOIN tp_user_grip g 
        ON g.grip_id = (
          SELECT g2.grip_id
          FROM tp_user_grip g2
          WHERE g2.user_id = u.user_id
          ORDER BY g2.measured_at DESC
          LIMIT 1
        )
      ORDER BY u.user_id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GRIP LATEST ERROR:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ดึงประวัติ grip ของ user ตาม userId
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

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
      WHERE g.user_id = ?
      ORDER BY g.measured_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("GRIP USER ERROR:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// บันทึกค่า grip ใหม่
router.post("/", async (req, res) => {
  try {
    const { user_id, device_id, hand, grip_value } = req.body;

    if (!user_id || !hand || grip_value === undefined) {
      return res.status(400).json({
        msg: "user_id, hand, grip_value required",
      });
    }

    if (!["left", "right"].includes(hand)) {
      return res.status(400).json({
        msg: "hand must be left or right",
      });
    }

    const valueNum = Number(grip_value);

    if (Number.isNaN(valueNum) || valueNum <= 0) {
      return res.status(400).json({
        msg: "grip_value must be more than 0",
      });
    }

    const result = await db.query(
      `
      INSERT INTO tp_user_grip 
        (user_id, device_id, hand, grip_value, measured_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [user_id, device_id || null, hand, valueNum]
    );

    res.status(201).json({
      msg: "Grip saved",
      grip_id: result.insertId,
      user_id,
      device_id: device_id || null,
      hand,
      grip_value: valueNum,
    });
  } catch (err) {
    console.error("GRIP SAVE ERROR:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
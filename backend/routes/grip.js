const router = require("express").Router();
const db = require("../db");

const gripNorms = {
  male: {
    "10-11": { weakBelow: 12.6, strongAbove: 22.4 },
    "12-13": { weakBelow: 19.4, strongAbove: 31.2 },
    "14-15": { weakBelow: 28.5, strongAbove: 44.3 },
    "16-17": { weakBelow: 32.6, strongAbove: 52.4 },
    "18-19": { weakBelow: 35.7, strongAbove: 55.5 },
    "20-24": { weakBelow: 36.8, strongAbove: 56.6 },
    "25-29": { weakBelow: 37.7, strongAbove: 57.5 },
    "30-34": { weakBelow: 36.0, strongAbove: 55.8 },
    "35-39": { weakBelow: 35.8, strongAbove: 55.6 },
    "40-44": { weakBelow: 35.5, strongAbove: 55.3 },
    "45-49": { weakBelow: 34.7, strongAbove: 54.5 },
    "50-54": { weakBelow: 32.9, strongAbove: 50.7 },
    "55-59": { weakBelow: 30.7, strongAbove: 48.5 },
    "60-64": { weakBelow: 30.2, strongAbove: 48.0 },
    "65-69": { weakBelow: 28.2, strongAbove: 44.0 },
    "70-99": { weakBelow: 21.3, strongAbove: 35.1 },
  },
  female: {
    "10-11": { weakBelow: 11.8, strongAbove: 21.6 },
    "12-13": { weakBelow: 14.6, strongAbove: 24.4 },
    "14-15": { weakBelow: 15.5, strongAbove: 27.3 },
    "16-17": { weakBelow: 17.2, strongAbove: 29.0 },
    "18-19": { weakBelow: 19.2, strongAbove: 31.0 },
    "20-24": { weakBelow: 21.5, strongAbove: 35.3 },
    "25-29": { weakBelow: 25.6, strongAbove: 41.4 },
    "30-34": { weakBelow: 21.5, strongAbove: 35.3 },
    "35-39": { weakBelow: 20.3, strongAbove: 34.1 },
    "40-44": { weakBelow: 18.9, strongAbove: 32.7 },
    "45-49": { weakBelow: 18.6, strongAbove: 32.4 },
    "50-54": { weakBelow: 18.1, strongAbove: 31.9 },
    "55-59": { weakBelow: 17.7, strongAbove: 31.5 },
    "60-64": { weakBelow: 17.2, strongAbove: 31.0 },
    "65-69": { weakBelow: 15.4, strongAbove: 27.2 },
    "70-99": { weakBelow: 14.7, strongAbove: 24.5 },
  },
};

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

function getAgeGroup(age) {
  if (age >= 10 && age <= 11) return "10-11";
  if (age >= 12 && age <= 13) return "12-13";
  if (age >= 14 && age <= 15) return "14-15";
  if (age >= 16 && age <= 17) return "16-17";
  if (age >= 18 && age <= 19) return "18-19";
  if (age >= 20 && age <= 24) return "20-24";
  if (age >= 25 && age <= 29) return "25-29";
  if (age >= 30 && age <= 34) return "30-34";
  if (age >= 35 && age <= 39) return "35-39";
  if (age >= 40 && age <= 44) return "40-44";
  if (age >= 45 && age <= 49) return "45-49";
  if (age >= 50 && age <= 54) return "50-54";
  if (age >= 55 && age <= 59) return "55-59";
  if (age >= 60 && age <= 64) return "60-64";
  if (age >= 65 && age <= 69) return "65-69";
  if (age >= 70) return "70-99";
  return null;
}

function calcGripAssessment({ gender, age_group, grip_value }) {
  const norm = gripNorms[gender]?.[age_group];

  if (!norm) {
    return {
      score: 0,
      result: "ไม่สามารถประเมินได้",
      advice: "ไม่พบเกณฑ์ประเมินของเพศหรือช่วงอายุนี้",
    };
  }

  const grip = Number(grip_value);

  if (grip < norm.weakBelow) {
    return {
      score: 40,
      result: "อ่อน",
      advice: `แรงบีบมือต่ำกว่าเกณฑ์ของช่วงอายุ ${age_group} ควรฝึกกล้ามเนื้อมือและแขนเพิ่มเติม`,
    };
  }

  if (grip > norm.strongAbove) {
    return {
      score: 100,
      result: "แข็งแรง",
      advice: `แรงบีบมือสูงกว่าเกณฑ์ของช่วงอายุ ${age_group} ถือว่าอยู่ในระดับดี`,
    };
  }

  return {
    score: 80,
    result: "ปกติ",
    advice: `แรงบีบมืออยู่ในช่วงปกติของช่วงอายุ ${age_group}`,
  };
}

// ดึงค่าล่าสุดของผู้ใช้แต่ละคน
router.get("/latest", async (req, res) => {
  try {
    const rows = await db.query(`
      SELECT 
        u.user_id,
        u.username,
        u.full_name,
        u.gender,
        u.birth_date,
        g.grip_id,
        g.device_id,
        g.grip_value AS handgrip_strength,
        g.hand,
        g.age,
        g.age_group,
        g.result,
        g.score,
        g.advice,
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
        u.birth_date,
        g.device_id,
        g.hand,
        g.grip_value,
        g.age,
        g.age_group,
        g.result,
        g.score,
        g.advice,
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

// บอร์ดยิงค่าเข้ามา
// body: { device_id, hand, grip_value }
router.post("/", async (req, res) => {
  try {
    const { device_id, hand, grip_value } = req.body;

    if (!device_id || !hand || grip_value === undefined) {
      return res.status(400).json({
        msg: "device_id, hand, grip_value required",
      });
    }

    if (!["left", "right"].includes(hand)) {
      return res.status(400).json({
        msg: "hand must be left or right",
      });
    }

    const deviceIdNum = Number(device_id);
    const valueNum = Number(grip_value);

    if (Number.isNaN(deviceIdNum) || deviceIdNum <= 0) {
      return res.status(400).json({
        msg: "device_id must be more than 0",
      });
    }

    if (Number.isNaN(valueNum) || valueNum <= 0) {
      return res.status(400).json({
        msg: "grip_value must be more than 0",
      });
    }

    const users = await db.query(
      `
      SELECT user_id, username, full_name, gender, birth_date
      FROM tp_user
      WHERE device_id = ?
      `,
      [deviceIdNum]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({
        msg: "ยังไม่มีผู้ใช้เชื่อมต่อ Device ID นี้",
      });
    }

    const savedUsers = [];

    for (const user of users) {
      const age = user.birth_date ? calculateAge(user.birth_date) : null;
      const ageGroup = age ? getAgeGroup(age) : null;

      const assessment = calcGripAssessment({
        gender: user.gender,
        age_group: ageGroup,
        grip_value: valueNum,
      });

      const result = await db.query(
        `
        INSERT INTO tp_user_grip 
          (
            user_id, 
            device_id, 
            hand, 
            grip_value, 
            age,
            age_group,
            result,
            score,
            advice,
            measured_at
          )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          user.user_id,
          deviceIdNum,
          hand,
          valueNum,
          age,
          ageGroup,
          assessment.result,
          assessment.score,
          assessment.advice,
        ]
      );

      savedUsers.push({
        user_id: user.user_id,
        grip_id: result.insertId,
        age,
        age_group: ageGroup,
        result: assessment.result,
        score: assessment.score,
        advice: assessment.advice,
      });
    }

    res.status(201).json({
      msg: "Grip saved and assessed",
      device_id: deviceIdNum,
      hand,
      grip_value: valueNum,
      total_saved: savedUsers.length,
      saved_users: savedUsers,
    });
  } catch (err) {
    console.error("GRIP SAVE ERROR:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
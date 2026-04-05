import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/UserSchema.js"
import auth from "../middlewares/auth.js"

const userrouter = express.Router()

// ──────────────────────────────────────────
// POST /api/users/register  ← إنشاء حساب
// ──────────────────────────────────────────
userrouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "❌ يجب ملء جميع الحقول" })
    }

    // نتحقق إذا كان الإيميل موجود مسبقاً
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "❌ هذا الإيميل مستخدم مسبقاً" })
    }

    // نشفر كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user"     ,
        workerStatus: user.workerStatus  // ✅ أضف هذا السطر
    })

    await user.save()

    // ننشئ التوكن
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(201).json({
      message: "✅ تم إنشاء الحساب بنجاح",
      token,
      role: user.role,
      name: user.name
    })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء إنشاء الحساب")
    res.status(500).json({ message: "❌ حدث خطأ أثناء إنشاء الحساب" })
  }
})

// ──────────────────────────────────────────
// POST /api/users/login  ← تسجيل الدخول
// ──────────────────────────────────────────
userrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "❌ يجب ملء جميع الحقول" })
    }

    // نبحث عن المستخدم
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "❌ الإيميل أو كلمة المرور خاطئة" })
    }

    // نتحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "❌ الإيميل أو كلمة المرور خاطئة" })
    }

    // ننشئ التوكن
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.status(200).json({
      message: "✅ تم تسجيل الدخول بنجاح",
      token,
      role: user.role,
      name: user.name,
      workerStatus: user.workerStatus
    })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء تسجيل الدخول")
    res.status(500).json({ message: "❌ حدث خطأ أثناء تسجيل الدخول" })
  }
})

// ──────────────────────────────────────────
// GET /api/users/me  ← جلب بيانات المستخدم الحالي
// ──────────────────────────────────────────
userrouter.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "❌ المستخدم غير موجود" })
    }
    res.status(200).json(user)
  } catch (err) {
    console.log(err, "❌ خطأ أثناء جلب بيانات المستخدم")
    res.status(500).json({ message: "❌ حدث خطأ أثناء جلب البيانات" })
  }
})

export default userrouter
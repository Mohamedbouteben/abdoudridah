import express from "express"
import Report from "../models/ReportSchema.js"
import User from "../models/UserSchema.js"
import auth from "../middlewares/auth.js"

const reportrouter = express.Router()


// ──────────────────────────────────────────
// POST /api/reports/send  ← المشرف يرسل تقرير
// ──────────────────────────────────────────
reportrouter.post("/send", auth, async (req, res) => {
  try {
    const userid = req.user.id

    // نتحقق أن المستخدم مشرف
    const user = await User.findById(userid)
    if (!user) {
      return res.status(404).json({ message: "❌ المستخدم غير موجود" })
    }
    if (user.role !== "supervisor") {
      return res.status(403).json({ message: "❌ هذا الإجراء للمشرفين فقط" })
    }

    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: "❌ يجب ملء جميع الحقول" })
    }

    // نحفظ التقرير
    const report = new Report({
      supervisorId: userid,
      supervisorName: user.name,
      title: title,
      content: content,
      status: "pending"
    })

    await report.save()

    res.status(201).json({ message: "✅ تم إرسال التقرير بنجاح", report })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء إرسال التقرير")
    res.status(500).json({ message: "❌ حدث خطأ أثناء إرسال التقرير" })
  }
})


// ──────────────────────────────────────────
// GET /api/reports/myreports  ← المشرف يجلب تقاريره هو فقط
// ──────────────────────────────────────────
reportrouter.get("/myreports", auth, async (req, res) => {
  try {
    const userid = req.user.id

    const user = await User.findById(userid)
    if (!user) {
      return res.status(404).json({ message: "❌ المستخدم غير موجود" })
    }
    if (user.role !== "supervisor") {
      return res.status(403).json({ message: "❌ هذا الإجراء للمشرفين فقط" })
    }

    // نجلب تقارير هذا المشرف فقط، الأحدث أولاً
    const reports = await Report.find({ supervisorId: userid }).sort({ createdAt: -1 })

    res.status(200).json({ message: "✅ تم جلب التقارير", reports })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء جلب التقارير")
    res.status(500).json({ message: "❌ حدث خطأ أثناء جلب التقارير" })
  }
})


// ──────────────────────────────────────────
// GET /api/reports/all  ← المدير يجلب كل التقارير
// ──────────────────────────────────────────
reportrouter.get("/all", auth, async (req, res) => {
  try {
    const userid = req.user.id

    const user = await User.findById(userid)
    if (!user) {
      return res.status(404).json({ message: "❌ المستخدم غير موجود" })
    }
    if (user.role !== "boss" && user.role !== "admin") {
      return res.status(403).json({ message: "❌ هذا الإجراء للمدير فقط" })
    }

    // نجلب كل التقارير، الأحدث أولاً
    const reports = await Report.find().sort({ createdAt: -1 })

    res.status(200).json({ message: "✅ تم جلب التقارير", reports })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء جلب التقارير")
    res.status(500).json({ message: "❌ حدث خطأ أثناء جلب التقارير" })
  }
})


// ──────────────────────────────────────────
// PUT /api/reports/markread/:id  ← المدير يعلم التقرير كمقروء
// ──────────────────────────────────────────
reportrouter.put("/markread/:id", auth, async (req, res) => {
  try {
    const userid = req.user.id

    const user = await User.findById(userid)
    if (!user) {
      return res.status(404).json({ message: "❌ المستخدم غير موجود" })
    }
    if (user.role !== "boss" && user.role !== "admin") {
      return res.status(403).json({ message: "❌ هذا الإجراء للمدير فقط" })
    }

    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: "❌ التقرير غير موجود" })
    }

    report.status = "read"
    await report.save()

    res.status(200).json({ message: "✅ تم تعليم التقرير كمقروء", report })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء تحديث التقرير")
    res.status(500).json({ message: "❌ حدث خطأ أثناء تحديث التقرير" })
  }
})


export default reportrouter
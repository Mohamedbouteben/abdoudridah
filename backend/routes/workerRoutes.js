import express from "express"
import User from "../models/UserSchema.js"
import Worker from '../models/Workerschema.js'
import Supervisor from "../models/Supervisorschema.js"
import auth from "../middlewares/auth.js"
import upload from "../config/multerConfig.js"
import fs from "fs"

const workerrouter = express.Router()

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}

// ──────────────────────────────────────────────────────────────
// POST /api/workers/newworker  ← تقديم طلب عامل أو مشرف
// ──────────────────────────────────────────────────────────────
workerrouter.post("/newworker", auth, upload.single("photo"), async (req, res) => {
  try {
    const { name, familyname, email, adress, phonenumber, selectedrole, specialization, supervisionarea } = req.body
    const userid = req.user.id

    const user = await User.findById(userid)
    if (!user) {
      return res.status(404).json({ message: "❌ المستخدم غير موجود" })
    }

    if (user.role !== "user") {
      return res.status(400).json({ message: "❌ لقد قدمت طلباً مسبقاً" })
    }

    if (!name || !familyname || !email || !adress || !phonenumber) {
      return res.status(400).json({ message: "❌ يجب ملء جميع الحقول" })
    }

    const photopath = req.file ? req.file.filename : ""

    if (selectedrole === "worker") {
      if (!specialization) {
        return res.status(400).json({ message: "❌ يجب اختيار التخصص" })
      }

      const worker = new Worker({ userid, name, familyname, email, adress, phonenumber, specialization, photo: photopath })
      await worker.save()
      await User.findByIdAndUpdate(userid, { role: "worker", workerStatus: "approved" })

      return res.status(201).json({
        message: "✅ مبروك! أصبحت عاملاً في منصتنا",
        role: "worker",
        workerStatus: "approved"
      })
    }

    if (selectedrole === "supervisor") {
      if (!supervisionarea) {
        return res.status(400).json({ message: "❌ يجب اختيار مجال الإشراف" })
      }

      const supervisor = new Supervisor({ userid, name, familyname, email, adress, phonenumber, supervisionarea, photo: photopath })
      await supervisor.save()
      await User.findByIdAndUpdate(userid, { role: "supervisor", workerStatus: "approved" })

      return res.status(201).json({
        message: "✅ مبروك! أصبحت مشرفاً في منصتنا",
        role: "supervisor",
        workerStatus: "approved"
      })
    }

    res.status(400).json({ message: "❌ نوع الطلب غير صحيح" })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء تقديم الطلب")
    res.status(500).json({ message: "❌ حدث خطأ أثناء تقديم الطلب" })
  }
})


// ──────────────────────────────────────────────────────────────
// GET /api/workers/workerinfo  ← بيانات العامل أو المشرف الحالي
// ──────────────────────────────────────────────────────────────
workerrouter.get("/workerinfo", auth, async (req, res) => {
  try {
    const userid = req.user.id
    const user = await User.findById(userid)

    if (!user) {
      return res.status(404).json({ message: "❌ المستخدم غير موجود" })
    }

    if (user.role === "worker") {
      const worker = await Worker.findOne({ userid })
      return res.status(200).json({ message: "✅ تم جلب البيانات", worker })
    }

    if (user.role === "supervisor") {
      const supervisor = await Supervisor.findOne({ userid })
      return res.status(200).json({ message: "✅ تم جلب البيانات", supervisor })
    }

    res.status(404).json({ message: "❌ لا توجد بيانات لهذا المستخدم" })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء جلب البيانات")
    res.status(500).json({ message: "❌ حدث خطأ أثناء جلب البيانات" })
  }
})


// ──────────────────────────────────────────────────────────────
// GET /api/workers/workers  ← كل العمال (للمشرف والمدير)
// ──────────────────────────────────────────────────────────────
workerrouter.get("/workers", async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 })
    res.status(200).json({ message: "✅ تم جلب البيانات", workers })
  } catch (err) {
    console.log(err, "❌ خطأ أثناء جلب العمال")
    res.status(500).json({ message: "❌ حدث خطأ أثناء جلب البيانات" })
  }
})


// ──────────────────────────────────────────────────────────────
// GET /api/workers/supervisors  ← كل المشرفين
// ──────────────────────────────────────────────────────────────
workerrouter.get("/supervisors", async (req, res) => {
  try {
    const supervisors = await Supervisor.find().sort({ createdAt: -1 })
    res.status(200).json({ message: "✅ تم جلب البيانات", supervisors })
  } catch (err) {
    console.log(err, "❌ خطأ أثناء جلب المشرفين")
    res.status(500).json({ message: "❌ حدث خطأ أثناء جلب البيانات" })
  }
})


// ──────────────────────────────────────────────────────────────
// POST /api/workers/addtoteam  ← المشرف يضيف عامل لفريقه
// ──────────────────────────────────────────────────────────────
workerrouter.post("/addtoteam", auth, async (req, res) => {
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

    const { workerId } = req.body
    if (!workerId) {
      return res.status(400).json({ message: "❌ يجب تحديد العامل" })
    }

    // نجلب بيانات المشرف
    const supervisor = await Supervisor.findOne({ userid })
    if (!supervisor) {
      return res.status(404).json({ message: "❌ بيانات المشرف غير موجودة" })
    }

    // نتحقق أن العامل موجود
    const worker = await Worker.findById(workerId)
    if (!worker) {
      return res.status(404).json({ message: "❌ العامل غير موجود" })
    }

    // نتحقق أن العامل ليس في الفريق مسبقاً
    // supervisor.team هو array من IDs — نحوله لـ strings للمقارنة
    const teamAsStrings = supervisor.team.map(id => id.toString())
    if (teamAsStrings.includes(workerId)) {
      return res.status(400).json({ message: "❌ هذا العامل موجود في فريقك مسبقاً" })
    }

    // نضيف العامل للفريق
    supervisor.team.push(workerId)
    await supervisor.save()

    res.status(200).json({ message: "✅ تم إضافة العامل للفريق", team: supervisor.team })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء إضافة العامل للفريق")
    res.status(500).json({ message: "❌ حدث خطأ أثناء إضافة العامل" })
  }
})


// ──────────────────────────────────────────────────────────────
// DELETE /api/workers/removefromteam  ← المشرف يحذف عامل من فريقه
// ──────────────────────────────────────────────────────────────
workerrouter.delete("/removefromteam", auth, async (req, res) => {
  try {
    const userid = req.user.id

    const user = await User.findById(userid)
    if (!user) {
      return res.status(404).json({ message: "❌ المستخدم غير موجود" })
    }
    if (user.role !== "supervisor") {
      return res.status(403).json({ message: "❌ هذا الإجراء للمشرفين فقط" })
    }

    const { workerId } = req.body
    if (!workerId) {
      return res.status(400).json({ message: "❌ يجب تحديد العامل" })
    }

    const supervisor = await Supervisor.findOne({ userid })
    if (!supervisor) {
      return res.status(404).json({ message: "❌ بيانات المشرف غير موجودة" })
    }

    // نحذف العامل من المصفوفة
    supervisor.team = supervisor.team.filter(id => id.toString() !== workerId)
    await supervisor.save()

    res.status(200).json({ message: "✅ تم حذف العامل من الفريق", team: supervisor.team })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء حذف العامل من الفريق")
    res.status(500).json({ message: "❌ حدث خطأ أثناء حذف العامل" })
  }
})


// ──────────────────────────────────────────────────────────────
// GET /api/workers/myteam  ← المشرف يجلب فريقه
// ──────────────────────────────────────────────────────────────
workerrouter.get("/myteam", auth, async (req, res) => {
  try {
    const userid = req.user.id

    const user = await User.findById(userid)
    if (!user) {
      return res.status(404).json({ message: "❌ المستخدم غير موجود" })
    }
    if (user.role !== "supervisor") {
      return res.status(403).json({ message: "❌ هذا الإجراء للمشرفين فقط" })
    }

    // نجلب بيانات المشرف مع populate لتفاصيل كل عامل في الفريق
    const supervisor = await Supervisor.findOne({ userid }).populate("team")

    if (!supervisor) {
      return res.status(404).json({ message: "❌ بيانات المشرف غير موجودة" })
    }

    res.status(200).json({ message: "✅ تم جلب الفريق", team: supervisor.team })

  } catch (err) {
    console.log(err, "❌ خطأ أثناء جلب الفريق")
    res.status(500).json({ message: "❌ حدث خطأ أثناء جلب الفريق" })
  }
})


export default workerrouter
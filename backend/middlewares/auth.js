import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
  try {
    // نجيب التوكن من الـ header
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "❌ لا يوجد توكن، الرجاء تسجيل الدخول" })
    }

    // نفك التوكن ونجيب بيانات المستخدم
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // decoded يحتوي على id و role

    next()
  } catch (err) {
    console.log(err, "❌ خطأ في التحقق من التوكن")
    res.status(401).json({ message: "❌ توكن غير صالح أو منتهي الصلاحية" })
  }
}

export default auth
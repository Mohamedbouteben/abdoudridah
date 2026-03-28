import multer from "multer"
import path from "path"

// نحفظ الصور في مجلد uploads داخل backend
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    // اسم الملف: timestamp + الاسم الأصلي لتجنب التكرار
    const uniquename = Date.now() + "-" + file.originalname
    cb(null, uniquename)
  }
})

// نقبل فقط الصور
const filefilter = (req, file, cb) => {
  const allowedtypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  if (allowedtypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("❌ يجب رفع صورة بصيغة jpeg أو png أو webp فقط"), false)
  }
}

const upload = multer({ storage, fileFilter: filefilter })

export default upload
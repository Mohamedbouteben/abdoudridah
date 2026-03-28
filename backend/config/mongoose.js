import mongoose from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ MongoDB متصل بنجاح")
  } catch (err) {
    console.log(err, "❌ خطأ في الاتصال بقاعدة البيانات")
    process.exit(1)
  }
}

export default connectDB
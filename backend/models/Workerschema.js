import mongoose from "mongoose"

const WorkerSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  familyname: { type: String, required: true },
  email: { type: String, required: true },
  adress: { type: String, required: true },
  phonenumber: { type: String, required: true },
  // تخصص الفني
  specialization: { type: String, required: true },
  // صورة العامل - نحفظ المسار
  photo: { type: String, default: "" },
  // حالة الطلب
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true })

const Worker = mongoose.model("Worker", WorkerSchema)

export default Worker
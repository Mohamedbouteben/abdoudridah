import mongoose from "mongoose"

const ReportSchema = new mongoose.Schema(
  {
    // من أرسل التقرير (المشرف)
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // اسم المشرف (نحفظه مباشرة حتى لا نحتاج populate في كل مرة)
    supervisorName: {
      type: String,
      required: true
    },

    // عنوان التقرير
    title: {
      type: String,
      required: true
    },

    // محتوى التقرير
    content: {
      type: String,
      required: true
    },

    // حالة التقرير - pending = لم يقرأه المدير بعد
    status: {
      type: String,
      enum: ["pending", "read"],
      default: "pending"
    }
  },
  { timestamps: true }
)

const Report = mongoose.model("Report", ReportSchema)

export default Report
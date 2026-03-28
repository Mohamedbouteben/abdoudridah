import mongoose from "mongoose"

const SupervisorSchema = new mongoose.Schema({
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
  supervisionarea: { type: String, required: true },
  photo: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  // قائمة العمال في فريق هذا المشرف — مصفوفة من IDs
  team: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker"
    }
  ]

}, { timestamps: true })

const Supervisor = mongoose.model("Supervisor", SupervisorSchema)

export default Supervisor
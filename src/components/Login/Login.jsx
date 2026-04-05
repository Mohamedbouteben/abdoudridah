import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css"
import toast from "react-hot-toast"

function Login() {
  const navigate = useNavigate()

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const handlelogin = async () => {
    if (!email || !password) {
      toast.error("يجب ملء جميع الحقول!")
      return
    }

    try {
const res = await axios.post(`https://abdoudridah-api.onrender.com/api/users/login`, {

        password
      })

      const token = res.data.token
      const role = res.data.role
      const name = res.data.name
      const workerStatus = res.data.workerStatus

      localStorage.setItem("token", token)
      localStorage.setItem("role", role)
      localStorage.setItem("name", name)
      localStorage.setItem("workerStatus", workerStatus)

      toast.success("✅ تم تسجيل الدخول بنجاح!")

      if (role === "user") {
        navigate("/beworker")
      } else {
        navigate("/home")
      }

    } catch (err) {
      console.log(err, "❌ خطأ أثناء تسجيل الدخول")
      toast.error(err.response?.data?.message || "❌ حدث خطأ أثناء تسجيل الدخول")
    }
  }

  return (
    <div className={styles.loginpage}>
      <div className={styles.logincard}>

        <h2 className={styles.title}>تسجيل الدخول</h2>

        <div className={styles.form}>

          <label htmlFor="email">الإيميل</label>
          <input
            id="email"
            type="email"
            placeholder="أدخل إيميلك"
            onChange={(e) => setemail(e.target.value)}
          />

          <label htmlFor="password">كلمة المرور</label>
          <input
            id="password"
            type="password"
            placeholder="أدخل كلمة المرور"
            onChange={(e) => setpassword(e.target.value)}
          />

          <button className={styles.submitbutton} onClick={handlelogin}>
            تسجيل الدخول
          </button>

          <p className={styles.registerlink}>
            ليس لديك حساب؟{" "}
            <span onClick={() => navigate("/register")}>أنشئ حساباً</span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
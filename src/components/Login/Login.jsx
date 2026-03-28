import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css"

function Login() {
  const navigate = useNavigate()

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const handlelogin = async () => {
    if (!email || !password) {
      alert("يجب ملء جميع الحقول!")
      return
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
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

      alert("✅ تم تسجيل الدخول بنجاح!")
              { role === "user" ? navigate("/beworker")  :  navigate("/home")}
      window.location.reload()

    } catch (err) {
      console.log(err, "❌ خطأ أثناء تسجيل الدخول")
      alert(err.response?.data?.message || "❌ حدث خطأ أثناء تسجيل الدخول")
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
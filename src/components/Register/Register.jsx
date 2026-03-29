import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Register.module.css"

function Register() {
  const navigate = useNavigate()

  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const handleregister = async () => {
    if (!name || !email || !password) {
      alert("يجب ملء جميع الحقول!")
      return
    }

    try {
const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
          name,
        email,
        password
      })

      const token = res.data.token
      const role = res.data.role
      const username = res.data.name

      localStorage.setItem("token", token)
      localStorage.setItem("role", role)
      localStorage.setItem("name", username)

      alert("✅ تم إنشاء الحساب بنجاح!")
      navigate("/beworker")

    } catch (err) {
      console.log(err, "❌ خطأ أثناء إنشاء الحساب")
      alert(err.response?.data?.message || "❌ حدث خطأ أثناء إنشاء الحساب")
    }
  }

  return (
    <div className={styles.registerpage}>
      <div className={styles.registercard}>

        <h2 className={styles.title}>إنشاء حساب</h2>

        <div className={styles.form}>

          <label htmlFor="name">الاسم</label>
          <input
            id="name"
            type="text"
            placeholder="أدخل اسمك"
            onChange={(e) => setname(e.target.value)}
          />

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

          <button className={styles.submitbutton} onClick={handleregister}>
            إنشاء الحساب
          </button>

          <p className={styles.loginlink}>
            لديك حساب بالفعل؟{" "}
            <span onClick={() => navigate("/login")}>سجل الدخول</span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register
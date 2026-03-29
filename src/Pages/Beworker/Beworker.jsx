import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./BeWorker.module.css"

const workertypes = [
  "فني حفر",
  "فني صيانة ميكانيكية",
  "فني كهرباء وأتمتة",
  "فني أنابيب ومعالجة",
  "فني مختبر وتحاليل",
  "فني سلامة وبيئة",
  "فني لحام وتشكيل",
  "فني تبريد وتكييف"
]

const supervisiontypes = [
  "مشرف على فريق الحفر",
  "مشرف على الصيانة",
  "مشرف على الإنتاج",
  "مشرف على السلامة والبيئة",
  "مشرف على المستودعات",
  "مشرف على الجودة"
]

function BeWorker() {
  const navigate = useNavigate()

  const [name, setname] = useState("")
  const [familyname, setfamilyname] = useState("")
  const [email, setemail] = useState("")
  const [adress, setadress] = useState("")
  const [phonenumber, setphonenumber] = useState("")
  const [selectedrole, setselectedrole] = useState("worker")
  const [specialization, setspecialization] = useState("")
  const [supervisionarea, setsupervisionarea] = useState("")
  const [photo, setphoto] = useState(null)
  const [photopreview, setphotopreview] = useState(null)

  const token = localStorage.getItem("token")

  const handlephotochange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setphoto(file)
      setphotopreview(URL.createObjectURL(file))
    }
  }

  const handlebeworker = async () => {
    if (!name || !familyname || !email || !adress || !phonenumber) {
      alert("يجب ملء جميع الحقول قبل إرسال الطلب!")
      return
    }
    if (selectedrole === "worker" && !specialization) {
      alert("يجب اختيار التخصص!")
      return
    }
    if (selectedrole === "supervisor" && !supervisionarea) {
      alert("يجب اختيار مجال الإشراف!")
      return
    }

    try {
      const formdata = new FormData()
      formdata.append("name", name)
      formdata.append("familyname", familyname)
      formdata.append("email", email)
      formdata.append("adress", adress)
      formdata.append("phonenumber", phonenumber)
      formdata.append("selectedrole", selectedrole)
      formdata.append("specialization", specialization)
      formdata.append("supervisionarea", supervisionarea)
      if (photo) formdata.append("photo", photo)

   const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/workers/newworker`,
  formdata,
  { headers: { Authorization: `Bearer ${token}` } }
)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("workerStatus", res.data.workerStatus)
      alert(res.data.message)
      navigate("/home")
      window.location.reload()

    } catch (err) {
      console.log(err)
      alert(err.response?.data?.message || "❌ حدث خطأ أثناء إرسال الطلب")
    }
  }

  return (
    <div className={styles.beworkerpage}>
      <div className={styles.userinformationcard}>

        {/* ── شعار صغير ── */}
        <div className={styles.cardLogo}>
          <div className={styles.cardLogoIcon}>
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="24,4 44,14 44,34 24,44 4,34 4,14" stroke="#f59e0b" strokeWidth="2" fill="none"/>
              <circle cx="24" cy="24" r="5" fill="#f59e0b"/>
            </svg>
          </div>
          <span className={styles.cardLogoText}>Abdoudridah</span>
        </div>

        <h2 className={styles.title}>استمارة الانضمام</h2>

        <div className={styles.userinformation}>

          {/* ── اختيار الدور ── */}
          <label>نوع الطلب</label>
          <div className={styles.roleselector}>
            <button
              className={selectedrole === "worker" ? styles.roleactive : styles.rolebtn}
              onClick={() => setselectedrole("worker")}
            >
              👷 عامل / فني
            </button>
            <button
              className={selectedrole === "supervisor" ? styles.roleactive : styles.rolebtn}
              onClick={() => setselectedrole("supervisor")}
            >
              🧑‍💼 مشرف
            </button>
          </div>

          {/* ── التخصص ── */}
          {selectedrole === "worker" && (
            <>
              <label htmlFor="specialization">التخصص</label>
              <div className={styles.selectWrapper}>
                <select
                  id="specialization"
                  className={styles.customSelect}
                  onChange={(e) => setspecialization(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>اختر تخصصك</option>
                  {workertypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* ── مجال الإشراف ── */}
          {selectedrole === "supervisor" && (
            <>
              <label htmlFor="supervisionarea">مجال الإشراف</label>
              <div className={styles.selectWrapper}>
                <select
                  id="supervisionarea"
                  className={styles.customSelect}
                  onChange={(e) => setsupervisionarea(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>اختر مجال إشرافك</option>
                  {supervisiontypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* ── الصورة ── */}
          <label>الصورة الشخصية</label>
          <div className={styles.photoupload}>
            {photopreview ? (
              <img src={photopreview} alt="معاينة" className={styles.photopreview} />
            ) : (
              <div className={styles.photoplaceholder}>📷</div>
            )}
            <input
              type="file"
              accept="image/*"
              id="photo"
              onChange={handlephotochange}
              className={styles.fileinput}
            />
            <label htmlFor="photo" className={styles.filelabel}>
              {photo ? "تغيير الصورة" : "رفع صورة"}
            </label>
          </div>

          {/* ── الحقول ── */}
          <label htmlFor="name">الاسم</label>
          <input id="name" type="text" placeholder="الاسم" onChange={(e) => setname(e.target.value)} />

          <label htmlFor="familyname">اللقب</label>
          <input id="familyname" type="text" placeholder="اللقب" onChange={(e) => setfamilyname(e.target.value)} />

          <label htmlFor="email">الإيميل</label>
          <input id="email" type="text" placeholder="الإيميل" onChange={(e) => setemail(e.target.value)} />

          <label htmlFor="adress">العنوان</label>
          <input id="adress" type="text" placeholder="العنوان" onChange={(e) => setadress(e.target.value)} />

          <label htmlFor="phonenumber">رقم الهاتف</label>
          <input id="phonenumber" type="text" placeholder="07 XX XX XX XX" onChange={(e) => setphonenumber(e.target.value)} />

        </div>

        <div className={styles.submitbutton}>
          <button onClick={handlebeworker}>إرسال الطلب</button>
        </div>

      </div>
    </div>
  )
}

export default BeWorker
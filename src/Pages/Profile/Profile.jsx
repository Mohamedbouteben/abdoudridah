import axios from "axios"
import { useState, useEffect } from "react"
import styles from "./Profile.module.css"

function Profile() {
  const [profiledata, setprofiledata] = useState(null)
  const [loading, setloading] = useState(true)

  const role = localStorage.getItem("role")
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchprofile = async () => {
      try {
const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/workers/workerinfo`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        // الباك اند يرجع worker أو supervisor حسب الـ role
        setprofiledata(res.data.worker || res.data.supervisor)
      } catch (err) {
        console.log(err, "❌ خطأ أثناء جلب البيانات")
      } finally {
        setloading(false)
      }
    }

    fetchprofile()
  }, [])

  if (loading) {
    return (
      <div className={styles.profilepage}>
        <p className={styles.loading}>جارٍ التحميل...</p>
      </div>
    )
  }

  if (!profiledata) {
    return (
      <div className={styles.profilepage}>
        <p className={styles.nodata}>❌ لم يتم العثور على بيانات</p>
      </div>
    )
  }

  return (
    <div className={styles.profilepage}>
      <div className={styles.profilecard}>

        {/* ─── الصورة الشخصية ─── */}
        <div className={styles.photocontainer}>
          {profiledata.photo ? (
            <img
              src={`http://localhost:5000/uploads/${profiledata.photo}`}
              alt="صورة شخصية"
              className={styles.photo}
            />
          ) : (
            <div className={styles.nophoto}>
              {role === "worker" ? "👷" : "🧑‍💼"}
            </div>
          )}
        </div>

        {/* ─── الاسم والدور ─── */}
        <h2 className={styles.fullname}>
          {profiledata.name} {profiledata.familyname}
        </h2>
        <span className={styles.rolebadge}>
          {role === "worker" ? "عامل / فني" : "مشرف"}
        </span>

        {/* ─── المعلومات ─── */}
        <div className={styles.infolist}>

          <div className={styles.inforow}>
            <span className={styles.infolabel}>📧 الإيميل</span>
            <span className={styles.infovalue}>{profiledata.email}</span>
          </div>

          <div className={styles.inforow}>
            <span className={styles.infolabel}>📍 العنوان</span>
            <span className={styles.infovalue}>{profiledata.adress}</span>
          </div>

          <div className={styles.inforow}>
            <span className={styles.infolabel}>📞 الهاتف</span>
            <span className={styles.infovalue}>{profiledata.phonenumber}</span>
          </div>

          {/* التخصص - للعامل فقط */}
          {role === "worker" && (
            <div className={styles.inforow}>
              <span className={styles.infolabel}>🔧 التخصص</span>
              <span className={styles.infovalue}>{profiledata.specialization}</span>
            </div>
          )}

          {/* مجال الإشراف - للمشرف فقط */}
          {role === "supervisor" && (
            <div className={styles.inforow}>
              <span className={styles.infolabel}>📋 مجال الإشراف</span>
              <span className={styles.infovalue}>{profiledata.supervisionarea}</span>
            </div>
          )}

          <div className={styles.inforow}>
            <span className={styles.infolabel}>📅 تاريخ الانضمام</span>
            <span className={styles.infovalue}>
              {new Date(profiledata.createdAt).toLocaleDateString("ar-DZ")}
            </span>
          </div>

        
        </div>
      </div>
    </div>
  )
}

export default Profile
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "./Workerhome.module.css"

const API = import.meta.env.VITE_API_URL
const todayTasks = [
  { id: 1, title: "صيانة مكيف", location: "حي النور، عمارة 5", time: "09:00", status: "done" },
  { id: 2, title: "تركيب لوحة كهربائية", location: "شارع الجمهورية", time: "11:30", status: "inprogress" },
  { id: 3, title: "إصلاح تسرب مياه", location: "حي السلام، فيلا 12", time: "14:00", status: "pending" },
  { id: 4, title: "فحص شبكة الغاز", location: "مجمع الورود", time: "16:30", status: "pending" },
]

const notifications = [
  { id: 1, text: "تم تعيين مهمة جديدة لك", time: "منذ 10 دقائق", type: "task" },
  { id: 2, text: "العميل قيّم عملك بـ ⭐⭐⭐⭐⭐", time: "منذ ساعة", type: "rating" },
  { id: 3, text: "تذكير: مهمة الساعة 11:30", time: "منذ 3 ساعات", type: "reminder" },
]

const messages = [
  { id: 1, sender: "أحمد المشرف", text: "تأكد من إحضار الأدوات الكاملة", time: "08:15", avatar: "أ", unread: 2 },
  { id: 2, sender: "الدعم الفني", text: "تم تحديث جدولك لهذا الأسبوع", time: "أمس", avatar: "د", unread: 0 },
]

const statusLabel = { done: "مكتمل", inprogress: "جارٍ", pending: "قادم" }

function WorkerHome({ activeTab }) {
  const navigate = useNavigate()
  const name = localStorage.getItem("name") || "الفني"
  const token = localStorage.getItem("token")

  const [workerInfo, setWorkerInfo] = useState(null)
  const [loadingInfo, setLoadingInfo] = useState(true)

  // GET /api/workers/workerinfo — جلب بيانات العامل
  useEffect(() => {
    const fetchWorkerInfo = async () => {
      try {
        const res = await axios.get(`${API}/api/workers/workerinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setWorkerInfo(res.data.worker)
      } catch (err) {
        console.log("خطأ في جلب بيانات العامل:", err)
      } finally {
        setLoadingInfo(false)
      }
    }
    fetchWorkerInfo()
  }, [])

  // تسجيل الخروج
  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    localStorage.removeItem("workerStatus")
    navigate("/")
  }
  return (
    <div className={styles.container}>

      {/* ─── الرئيسية ─── */}
      {activeTab === "home" && (
        <div className={styles.section}>
          <div className={styles.greeting}>
            <div>
              <h2 className={styles.greetName}>{name}</h2>
            </div>
            <div className={styles.avatarBig}>
              {name.charAt(0)}
              <span className={styles.onlineDot}></span>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={`${styles.statCard} ${styles.statGold}`}>
              <span className={styles.statNum}>7</span>
              <span className={styles.statLbl}>مهام هذا الأسبوع</span>
            </div>
            <div className={`${styles.statCard} ${styles.statGreen}`}>
              <span className={styles.statNum}>4.8</span>
              <span className={styles.statLbl}>تقييمك</span>
            </div>
            <div className={`${styles.statCard} ${styles.statBlue}`}>
              <span className={styles.statNum}>23</span>
              <span className={styles.statLbl}>مهمة منجزة</span>
            </div>
          </div>

          <div className={styles.sectionHeader}>
            <h3>أعمال اليوم</h3>
            <span className={styles.badge}>{todayTasks.length}</span>
          </div>
          <div className={styles.tasksList}>
            {todayTasks.map((t) => (
              <div key={t.id} className={styles.taskCard}>
                <div className={`${styles.taskStatus} ${styles[t.status]}`}>
                  {statusLabel[t.status]}
                </div>
                <div className={styles.taskInfo}>
                  <p className={styles.taskTitle}>{t.title}</p>
                  <p className={styles.taskMeta}>{t.location}</p>
                </div>
                <div className={styles.taskTime}>{t.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── المهام ─── */}
      {activeTab === "tasks" && (
        <div className={styles.section}>
          <h2 className={styles.pageTitle}>مهامي</h2>
          <div className={styles.filterRow}>
            {["الكل", "قادم", "جارٍ", "مكتمل"].map(f => (
              <button key={f} className={`${styles.filterBtn} ${f === "الكل" ? styles.filterActive : ""}`}>{f}</button>
            ))}
          </div>
          <div className={styles.tasksList}>
            {todayTasks.map((t) => (
              <div key={t.id} className={styles.taskCard}>
                <div className={`${styles.taskStatus} ${styles[t.status]}`}>
                  {statusLabel[t.status]}
                </div>
                <div className={styles.taskInfo}>
                  <p className={styles.taskTitle}>{t.title}</p>
                  <p className={styles.taskMeta}>{t.location}</p>
                  <p className={styles.taskMeta}>{t.time}</p>
                </div>
                <button className={styles.detailBtn}>تفاصيل</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── الرسائل ─── */}
      {activeTab === "messages" && (
        <div className={styles.section}>
          <h2 className={styles.pageTitle}>الرسائل</h2>
          <div className={styles.msgList}>
            {messages.map(m => (
              <div key={m.id} className={styles.msgCard}>
                <div className={styles.msgAvatar}>{m.avatar}</div>
                <div className={styles.msgBody}>
                  <div className={styles.msgTop}>
                    <span className={styles.msgSender}>{m.sender}</span>
                    <span className={styles.msgTime}>{m.time}</span>
                  </div>
                  <p className={styles.msgText}>{m.text}</p>
                </div>
                {m.unread > 0 && <span className={styles.unreadBadge}>{m.unread}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── الإشعارات ─── */}
      {activeTab === "notifications" && (
        <div className={styles.section}>
          <h2 className={styles.pageTitle}>الإشعارات</h2>
          <div className={styles.notifList}>
            {notifications.map(n => (
              <div key={n.id} className={styles.notifCard}>
                <div className={`${styles.notifIcon} ${styles["notif_" + n.type]}`}>
                  {n.type === "task" && "📋"}
                  {n.type === "rating" && "⭐"}
                  {n.type === "reminder" && "⏰"}
                </div>
                <div className={styles.notifBody}>
                  <p className={styles.notifText}>{n.text}</p>
                  <p className={styles.notifTime}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── الملف الشخصي ─── */}
      {activeTab === "profile" && (
        <div className={styles.section}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>{name.charAt(0)}</div>
            <h2 className={styles.profileName}>{name}</h2>
            <p className={styles.profileRole}>فني خبير</p>
            <div className={styles.profileStars}>⭐⭐⭐⭐⭐ <span>4.8</span></div>
          </div>

          {/* بيانات حقيقية من الباكند */}
          {loadingInfo ? (
            <p className={styles.loadingText}>جاري تحميل البيانات...</p>
          ) : workerInfo ? (
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>الاسم الكامل</span>
                <span className={styles.infoValue}>{workerInfo.name} {workerInfo.familyname}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>البريد الإلكتروني</span>
                <span className={styles.infoValue}>{workerInfo.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>رقم الهاتف</span>
                <span className={styles.infoValue}>{workerInfo.phonenumber}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>التخصص</span>
                <span className={styles.infoValue}>{workerInfo.specialization}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>العنوان</span>
                <span className={styles.infoValue}>{workerInfo.adress}</span>
              </div>
            </div>
          ) : (
            <p className={styles.loadingText}>لا توجد بيانات</p>
          )}

          <div className={styles.profileStats}>
            <div className={styles.pStat}><span>23</span><small>مهمة منجزة</small></div>
            <div className={styles.pStat}><span>7</span><small>هذا الأسبوع</small></div>
            <div className={styles.pStat}><span>98%</span><small>اكمال المهام</small></div>
          </div>

          <div className={styles.profileMenu}>
            <button className={styles.menuItem}>تعديل الملف الشخصي</button>
            <button className={styles.menuItem}>الإعدادات</button>
            <button className={styles.menuItem}>سياسة الخصوصية</button>
            <button onClick={handleLogout} className={`${styles.menuItem} ${styles.logout}`}>
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default WorkerHome
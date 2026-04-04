import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "./BossHome.module.css"

const API = import.meta.env.VITE_API_URL
const monthlyRevenue = [
  { month: "أكتوبر", value: 82 },
  { month: "نوفمبر", value: 68 },
  { month: "ديسمبر", value: 91 },
  { month: "يناير", value: 74 },
  { month: "فبراير", value: 88 },
  { month: "مارس", value: 95 },
]

const recentActivity = [
  { text: "تم تعيين مشرف جديد في المنطقة الشمالية", time: "منذ 30 دقيقة", type: "new" },
  { text: "إكمال 50 مهمة في أسبوع — رقم قياسي!", time: "منذ 2 ساعة", type: "record" },
  { text: "تقرير شهر فبراير جاهز للمراجعة", time: "منذ 5 ساعات", type: "report" },
]

function BossHome({ activeTab }) {
  const navigate = useNavigate()
  const name = localStorage.getItem("name") || "المدير"
  const token = localStorage.getItem("token")

  const [allReports, setAllReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [openReportId, setOpenReportId] = useState(null)
  const [innerTab, setInnerTab] = useState("reports")

  const [allWorkers, setAllWorkers] = useState([])
  const [allSupervisors, setAllSupervisors] = useState([])
  const [workersLoading, setWorkersLoading] = useState(true)

  // GET /api/reports/all — كل التقارير الواردة
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API}/api/reports/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAllReports(res.data.reports)
      } catch (err) {
        console.log("خطأ في جلب التقارير:", err)
      } finally {
        setReportsLoading(false)
      }
    }
    fetchReports()
  }, [])

  // GET /api/workers/workers — كل العمال
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get(`${API}/api/workers/workers`)
        setAllWorkers(res.data.workers)
      } catch (err) {
        console.log("خطأ في جلب العمال:", err)
      }
    }
    fetchWorkers()
  }, [])

  // GET /api/workers/supervisors — كل المشرفين
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await axios.get(`${API}/api/workers/supervisors`)
        setAllSupervisors(res.data.supervisors)
      } catch (err) {
        console.log("خطأ في جلب المشرفين:", err)
      } finally {
        setWorkersLoading(false)
      }
    }
    fetchSupervisors()
  }, [])

  // PUT /api/reports/markread/:id — فتح التقرير ويتعلم مقروء تلقائياً
  const handleOpenReport = async (report) => {
    if (openReportId === report._id) {
      setOpenReportId(null)
      return
    }
    setOpenReportId(report._id)

    if (report.status === "pending") {
      try {
        await axios.put(
          `${API}/api/reports/markread/${report._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setAllReports((prev) =>
          prev.map((r) =>
            r._id === report._id ? { ...r, status: "read" } : r
          )
        )
      } catch (err) {
        console.log("خطأ في تعليم التقرير:", err)
      }
    }
  }

  // تسجيل الخروج
  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    localStorage.removeItem("workerStatus")
    navigate("/")
  }

  const unreadCount = allReports.filter((r) => r.status === "pending").length
  return (
    <div className={styles.container}>

      {/* ─── الرئيسية ─── */}
      {activeTab === "home" && (
        <div className={styles.section}>
          <div className={styles.greeting}>
            <div>
              <p className={styles.greetSub}>لوحة القيادة 🏢</p>
              <h2 className={styles.greetName}>{name}</h2>
            </div>
            <div className={styles.avatarBig}>{name.charAt(0)}</div>
          </div>

          {/* KPIs حقيقية */}
          <div className={styles.kpiGrid}>
            <div className={`${styles.kpiCard} ${styles.kpi_gold}`}>
              <span className={styles.kpiIcon}>👷</span>
              <span className={styles.kpiValue}>{workersLoading ? "..." : allWorkers.length}</span>
              <span className={styles.kpiLabel}>إجمالي الفنيين</span>
            </div>
            <div className={`${styles.kpiCard} ${styles.kpi_blue}`}>
              <span className={styles.kpiIcon}>🗂</span>
              <span className={styles.kpiValue}>{workersLoading ? "..." : allSupervisors.length}</span>
              <span className={styles.kpiLabel}>المشرفون</span>
            </div>
            <div className={`${styles.kpiCard} ${styles.kpi_green}`}>
              <span className={styles.kpiIcon}>📋</span>
              <span className={styles.kpiValue}>{reportsLoading ? "..." : allReports.length}</span>
              <span className={styles.kpiLabel}>إجمالي التقارير</span>
            </div>
            <div className={`${styles.kpiCard} ${styles.kpi_green}`}>
              <span className={styles.kpiIcon}>📬</span>
              <span className={styles.kpiValue}>{reportsLoading ? "..." : unreadCount}</span>
              <span className={styles.kpiLabel}>تقارير غير مقروءة</span>
            </div>
          </div>

          {/* الأداء الشهري - ديكور */}
          <div className={styles.sectionHeader}><h3>الأداء الشهري</h3></div>
          <div className={styles.revenueChart}>
            {monthlyRevenue.map((m) => (
              <div key={m.month} className={styles.revItem}>
                <div className={styles.revBarWrap}>
                  <div className={styles.revBar} style={{ height: `${m.value}%` }}>
                    <span className={styles.revVal}>{m.value}%</span>
                  </div>
                </div>
                <span className={styles.revMonth}>{m.month}</span>
              </div>
            ))}
          </div>

          {/* آخر النشاطات - ديكور */}
          <div className={styles.sectionHeader}><h3>آخر الأحداث</h3></div>
          {recentActivity.map((a, i) => (
            <div key={i} className={styles.activityRow}>
              <div className={styles.actIcon}>
                {a.type === "new" && "➕"}
                {a.type === "record" && "🏆"}
                {a.type === "report" && "📄"}
              </div>
              <div>
                <p className={styles.actText}>{a.text}</p>
                <p className={styles.actTime}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── التواصل ─── */}
      {activeTab === "messages" && (
        <div className={styles.section}>
          <h2 className={styles.pageTitle}>التواصل</h2>

          {/* navbar داخلي */}
          <div className={styles.innerNav}>
            <button
              className={`${styles.innerNavBtn} ${innerTab === "reports" ? styles.innerNavActive : ""}`}
              onClick={() => setInnerTab("reports")}
            >
              التقارير
              {unreadCount > 0 && <span className={styles.innerBadge}>{unreadCount}</span>}
            </button>
            <button
              className={`${styles.innerNavBtn} ${innerTab === "messages" ? styles.innerNavActive : ""}`}
              onClick={() => setInnerTab("messages")}
            >
              الرسائل
            </button>
          </div>

          {/* ─── التقارير ─── */}
          {innerTab === "reports" && (
            <div>
              {reportsLoading ? (
                <p className={styles.loadingText}>جاري التحميل...</p>
              ) : allReports.length === 0 ? (
                <p className={styles.emptyText}>لا توجد تقارير بعد</p>
              ) : (
                allReports.map(r => (
                  <div key={r._id}>
                    <div
                      className={`${styles.reportCard} ${r.status === "pending" ? styles.reportUnread : ""} ${openReportId === r._id ? styles.reportOpen : ""}`}
                      onClick={() => handleOpenReport(r)}
                    >
                      <div className={styles.reportIcon}>📄</div>
                      <div className={styles.reportInfo}>
                        <p className={styles.reportTitle}>{r.title}</p>
                        <p className={styles.reportDate}>
                          {r.supervisorName} · {new Date(r.createdAt).toLocaleDateString("ar-DZ")}
                        </p>
                      </div>
                      <div className={styles.reportActions}>
                        <span className={`${styles.reportStatus} ${r.status === "read" ? styles.approved : styles.sent}`}>
                          {r.status === "read" ? "مقروء" : "جديد"}
                        </span>
                        <span className={styles.reportArrow}>
                          {openReportId === r._id ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>

                    {/* محتوى التقرير */}
                    {openReportId === r._id && (
                      <div className={styles.reportExpanded}>
                        <p className={styles.reportExpandedContent}>{r.content}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ─── الرسائل ديكور ─── */}
         {innerTab === "messages" && (
  <div>
    {[
      { name: "أحمد المشرف", text: "تم إنهاء مهام المنطقة الشمالية", time: "09:15", avatar: "أ", unread: 3 },
      { name: "سامي الفني", text: "هل يمكن تأجيل مهمة الغد؟", time: "أمس", avatar: "س", unread: 1 },
      { name: "كريم المشرف", text: "التقرير الأسبوعي جاهز للمراجعة", time: "أمس", avatar: "ك", unread: 0 },
      { name: "يوسف الفني", text: "وصلت للموقع وبدأت العمل", time: "الاثنين", avatar: "ي", unread: 0 },
    ].map((m, i) => (
      <div key={i} className={styles.msgCard}>
        <div className={styles.msgAvatar}>{m.avatar}</div>
        <div className={styles.msgBody}>
          <div className={styles.msgTop}>
            <span className={styles.msgSender}>{m.name}</span>
            <span className={styles.msgTime}>{m.time}</span>
          </div>
          <p className={styles.msgText}>{m.text}</p>
        </div>
        {m.unread > 0 && <span className={styles.unreadBadge}>{m.unread}</span>}
      </div>
    ))}
  </div>
)}
        </div>
      )}

      {/* ─── العمال ─── */}
      {activeTab === "workers" && (
        <div className={styles.section}>
          <h2 className={styles.pageTitle}>الفنيون والمشرفون</h2>

          <div className={styles.sectionHeader}><h3>الفنيون ({allWorkers.length})</h3></div>
          {workersLoading ? (
            <p className={styles.loadingText}>جاري التحميل...</p>
          ) : allWorkers.length === 0 ? (
            <p className={styles.emptyText}>لا يوجد عمال مسجلون</p>
          ) : (
            allWorkers.map((w, i) => (
              <div key={w._id} className={styles.workerCard}>
                <div className={styles.workerRank}>#{i + 1}</div>
                <div className={styles.workerAvatar}>{w.name.charAt(0)}</div>
                <div className={styles.workerInfo}>
                  <p className={styles.workerName}>{w.name} {w.familyname}</p>
                  <p className={styles.workerSpec}>{w.specialization} · {w.phonenumber}</p>
                </div>
              </div>
            ))
          )}

          <div className={styles.sectionHeader} style={{ marginTop: "24px" }}>
            <h3>المشرفون ({allSupervisors.length})</h3>
          </div>
          {workersLoading ? (
            <p className={styles.loadingText}>جاري التحميل...</p>
          ) : allSupervisors.length === 0 ? (
            <p className={styles.emptyText}>لا يوجد مشرفون مسجلون</p>
          ) : (
            allSupervisors.map((s, i) => (
              <div key={s._id} className={styles.workerCard}>
                <div className={styles.workerRank} style={{ color: "#3b82f6" }}>#{i + 1}</div>
                <div className={styles.workerAvatar} style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
                  {s.name.charAt(0)}
                </div>
                <div className={styles.workerInfo}>
                  <p className={styles.workerName}>{s.name} {s.familyname}</p>
                  <p className={styles.workerSpec}>{s.supervisionarea} · {s.phonenumber}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── المالية - ديكور ─── */}
      {activeTab === "finance" && (
        <div className={styles.section}>
          <h2 className={styles.pageTitle}>المالية</h2>
          <div className={styles.financeCards}>
            <div className={styles.finCard}>
              <p className={styles.finLabel}>إجمالي الإيرادات (مارس)</p>
              <p className={styles.finValue}>184,500 <span>دج</span></p>
              <p className={styles.finDelta}>↑ 12% عن الشهر الماضي</p>
            </div>
            <div className={styles.finCard}>
              <p className={styles.finLabel}>المصروفات</p>
              <p className={styles.finValue} style={{ color: "#ef4444" }}>42,300 <span>دج</span></p>
              <p className={styles.finDelta} style={{ color: "#ef4444" }}>↑ 3% عن الشهر الماضي</p>
            </div>
            <div className={styles.finCard}>
              <p className={styles.finLabel}>صافي الربح</p>
              <p className={styles.finValue} style={{ color: "#10b981" }}>142,200 <span>دج</span></p>
              <p className={styles.finDelta} style={{ color: "#10b981" }}>↑ 18% نمو</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── الملف الشخصي ─── */}
      {activeTab === "profile" && (
        <div className={styles.section}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>{name.charAt(0)}</div>
            <h2 className={styles.profileName}>{name}</h2>
            <p className={styles.profileRole}>مدير عام</p>
          </div>

          <div className={styles.profileStats}>
            <div className={styles.pStat}><span>{allWorkers.length}</span><small>عامل</small></div>
            <div className={styles.pStat}><span>{allSupervisors.length}</span><small>مشرف</small></div>
            <div className={styles.pStat}><span>{allReports.length}</span><small>تقرير</small></div>
          </div>

          <div className={styles.profileMenu}>
            <button className={styles.menuItem}>إعدادات الشركة</button>
            <button className={styles.menuItem}>إدارة المستخدمين</button>
            <button onClick={handleLogout} className={`${styles.menuItem} ${styles.logout}`}>
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default BossHome
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "./SupervisorHome.module.css"

const API = "http://localhost:5000"

const weekSchedule = [
  { day: "السبت", count: 5, done: 5 },
  { day: "الأحد", count: 7, done: 6 },
  { day: "الاثنين", count: 4, done: 3 },
  { day: "الثلاثاء", count: 6, done: 2 },
  { day: "الأربعاء", count: 3, done: 0 },
  { day: "الخميس", count: 5, done: 0 },
]

function SupervisorHome({ activeTab }) {
  const navigate = useNavigate()
  const name = localStorage.getItem("name") || "المشرف"
  const token = localStorage.getItem("token")

  const [allWorkers, setAllWorkers] = useState([])
  const [myTeam, setMyTeam] = useState([])
  const [searchText, setSearchText] = useState("")
  const [workersLoading, setWorkersLoading] = useState(true)
  const [teamLoading, setTeamLoading] = useState(true)
  const [teamMsg, setTeamMsg] = useState("")

  const [myReports, setMyReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportTitle, setReportTitle] = useState("")
  const [reportContent, setReportContent] = useState("")
  const [reportMsg, setReportMsg] = useState("")
  const [sendingReport, setSendingReport] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)

  const [supervisorInfo, setSupervisorInfo] = useState(null)
  const [infoLoading, setInfoLoading] = useState(true)

  // GET /api/workers/workers — كل عمال الشركة
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get(`${API}/api/workers/workers`)
        setAllWorkers(res.data.workers)
      } catch (err) {
        console.log("خطأ في جلب العمال:", err)
      } finally {
        setWorkersLoading(false)
      }
    }
    fetchWorkers()
  }, [])

  // GET /api/workers/myteam — فريقي فقط
  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const res = await axios.get(`${API}/api/workers/myteam`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setMyTeam(res.data.team)
      } catch (err) {
        console.log("خطأ في جلب الفريق:", err)
      } finally {
        setTeamLoading(false)
      }
    }
    fetchMyTeam()
  }, [])

  // GET /api/reports/myreports — تقاريري السابقة
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API}/api/reports/myreports`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setMyReports(res.data.reports)
      } catch (err) {
        console.log("خطأ في جلب التقارير:", err)
      } finally {
        setReportsLoading(false)
      }
    }
    fetchReports()
  }, [])

  // GET /api/workers/workerinfo — بيانات المشرف
  useEffect(() => {
    const fetchSupervisorInfo = async () => {
      try {
        const res = await axios.get(`${API}/api/workers/workerinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSupervisorInfo(res.data.supervisor)
      } catch (err) {
        console.log("خطأ في جلب بيانات المشرف:", err)
      } finally {
        setInfoLoading(false)
      }
    }
    fetchSupervisorInfo()
  }, [])

  // POST /api/workers/addtoteam — إضافة عامل للفريق
  const handleAddToTeam = async (workerId) => {
    setTeamMsg("")
    try {
      const res = await axios.post(
        `${API}/api/workers/addtoteam`,
        { workerId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTeamMsg(res.data.message)
      // نعيد جلب الفريق بعد الإضافة
      const res2 = await axios.get(`${API}/api/workers/myteam`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMyTeam(res2.data.team)
    } catch (err) {
      setTeamMsg(err.response?.data?.message || "❌ حدث خطأ")
    }
  }

  // DELETE /api/workers/removefromteam — حذف عامل من الفريق
  const handleRemoveFromTeam = async (workerId) => {
    setTeamMsg("")
    try {
      const res = await axios.delete(`${API}/api/workers/removefromteam`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { workerId }, // axios delete — الـ body يكون في data
      })
      setTeamMsg(res.data.message)
      setMyTeam((prev) => prev.filter((w) => w._id !== workerId))
    } catch (err) {
      setTeamMsg(err.response?.data?.message || "❌ حدث خطأ")
    }
  }

  // POST /api/reports/send — إرسال تقرير جديد
  const handleSendReport = async () => {
    if (!reportTitle.trim() || !reportContent.trim()) {
      setReportMsg("❌ يجب ملء جميع الحقول")
      return
    }
    setSendingReport(true)
    setReportMsg("")
    try {
      const res = await axios.post(
        `${API}/api/reports/send`,
        { title: reportTitle, content: reportContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReportMsg(res.data.message)
      setMyReports((prev) => [res.data.report, ...prev])
      setReportTitle("")
      setReportContent("")
      setShowReportForm(false)
    } catch (err) {
      setReportMsg(err.response?.data?.message || "❌ حدث خطأ")
    } finally {
      setSendingReport(false)
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
const workerserchinfo=allWorkers.map((w)=>{
 const fullnamewithspace= w.name+" "+w.familyname
  const fullnamewithoutspace= w.name+w.familyname
return {
  fullnamewithspace,
  fullnamewithoutspace,
  specialization:w.specialization,
  phonenumber:w.phonenumber,
    adress:w.adress,
  _id: w._id,
  name: w.name,
  familyname: w.familyname
}})

  const filteredWorkers = workerserchinfo.filter((w) =>
    w.fullnamewithspace.toLowerCase().includes(searchText.toLowerCase()) ||
      w.fullnamewithoutspace.toLowerCase().includes(searchText.toLowerCase()) ||
      w.specialization.toLowerCase().includes(searchText.toLowerCase())
  )

  const myTeamIds = myTeam.map((w) => w._id)
  return (
    <div className={styles.container}>

      {/* ─── الرئيسية ─── */}
      {activeTab === "home" && (
        <div className={styles.section}>
          <div className={styles.greeting}>
            <div>
              <p className={styles.greetSub}>لوحة الإشراف 🗂</p>
              <h2 className={styles.greetName}>{name}</h2>
            </div>
            <div className={styles.avatarBig}>{name.charAt(0)}</div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statNum} style={{ color: "#f59e0b" }}>{myTeam.length}</span>
              <span className={styles.statLbl}>فريقي</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum} style={{ color: "#10b981" }}>16</span>
              <span className={styles.statLbl}>مهام هذا الأسبوع</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum} style={{ color: "#3b82f6" }}>94%</span>
              <span className={styles.statLbl}>نسبة الإنجاز</span>
            </div>
          </div>

          {/* أداء الأسبوع - ديكور */}
          <div className={styles.sectionHeader}><h3>أداء الأسبوع</h3></div>
          <div className={styles.barChart}>
            {weekSchedule.map((d) => (
              <div key={d.day} className={styles.barItem}>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ height: `${(d.done / d.count) * 100}%` }}></div>
                </div>
                <span className={styles.barDay}>{d.day}</span>
              </div>
            ))}
          </div>

          {/* ملخص الفريق */}
          <div className={styles.sectionHeader}><h3>فريقي</h3></div>
          {teamLoading ? (
            <p className={styles.loadingText}>جاري التحميل...</p>
          ) : myTeam.length === 0 ? (
            <p className={styles.emptyText}>لم تضف أي عامل لفريقك بعد</p>
          ) : (
            myTeam.slice(0, 3).map(w => (
              <div key={w._id} className={styles.teamRow}>
                <div className={styles.teamAvatar}>{w.name.charAt(0)}</div>
                <div className={styles.teamInfo}>
                  <p className={styles.teamName}>{w.name} {w.familyname}</p>
                  <p className={styles.teamSpec}>{w.specialization}</p>
                </div>
                <span className={`${styles.teamStatus} ${styles.active}`}>نشط</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── الفريق ─── */}
      {activeTab === "team" && (
        <div className={styles.section}>
          <h2 className={styles.pageTitle}>إدارة الفريق</h2>

          {teamMsg && <p className={styles.feedbackMsg}>{teamMsg}</p>}

          {/* فريقي الحالي */}
          <div className={styles.sectionHeader}><h3>فريقي الحالي ({myTeam.length})</h3></div>
          {teamLoading ? (
            <p className={styles.loadingText}>جاري التحميل...</p>
          ) : myTeam.length === 0 ? (
            <p className={styles.emptyText}>لم تضف أي عامل بعد</p>
          ) : (
            myTeam.map(w => (
              <div key={w._id} className={styles.teamCard}>
                <div className={styles.teamCardAvatar}>{w.name.charAt(0)}</div>
                <div className={styles.teamCardInfo}>
                  <p className={styles.teamName}>{w.name} {w.familyname}</p>
                  <p className={styles.teamSpec}>{w.specialization}</p>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveFromTeam(w._id)}
                >
                  حذف
                </button>
              </div>
            ))
          )}

          {/* البحث عن عمال */}
          <div className={styles.sectionHeader} style={{ marginTop: "24px" }}>
            <h3>البحث عن عمال</h3>
          </div>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="ابحث بالاسم أو التخصص..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />

          {workersLoading ? (
            <p className={styles.loadingText}>جاري التحميل...</p>
          ) : filteredWorkers.length === 0 ? (
            <p className={styles.emptyText}>لا توجد نتائج</p>
          ) : (
            filteredWorkers.map(w => {
              const inTeam = myTeamIds.includes(w._id)
              return (
                <div key={w._id} className={styles.workerSearchCard}>
                  <div className={styles.teamCardAvatar}>{w.name.charAt(0)}</div>
                  <div className={styles.teamCardInfo}>
                    <p className={styles.teamName}>{w.name} {w.familyname}</p>
                    <p className={styles.teamSpec}>{w.specialization} · {w.phonenumber}</p>
                  </div>
                  {inTeam ? (
                    <span className={styles.inTeamBadge}>في فريقك</span>
                  ) : (
                    <button
                      className={styles.addBtn}
                      onClick={() => handleAddToTeam(w._id)}
                    >
                      إضافة
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ─── التقارير ─── */}
      {activeTab === "reports" && (
        <div className={styles.section}>
          <h2 className={styles.pageTitle}>التقارير</h2>

          {/* زر إنشاء تقرير جديد */}
          <button
            className={styles.newReportBtn}
            onClick={() => setShowReportForm(!showReportForm)}
          >
            {showReportForm ? "إلغاء" : "+ إنشاء تقرير جديد"}
          </button>

          {/* فورم التقرير */}
          {showReportForm && (
            <div className={styles.reportForm}>
              <input
                className={styles.reportInput}
                type="text"
                placeholder="عنوان التقرير"
                value={reportTitle}
                onChange={e => setReportTitle(e.target.value)}
              />
              <textarea
                className={styles.reportTextarea}
                placeholder="محتوى التقرير..."
                rows={5}
                value={reportContent}
                onChange={e => setReportContent(e.target.value)}
              />
              {reportMsg && <p className={styles.feedbackMsg}>{reportMsg}</p>}
              <button
                className={styles.sendBtn}
                onClick={handleSendReport}
                disabled={sendingReport}
              >
                {sendingReport ? "جاري الإرسال..." : "إرسال التقرير"}
              </button>
            </div>
          )}

          {/* قائمة التقارير */}
          {reportsLoading ? (
            <p className={styles.loadingText}>جاري التحميل...</p>
          ) : myReports.length === 0 ? (
            <p className={styles.emptyText}>لم ترسل أي تقرير بعد</p>
          ) : (
            myReports.map(r => (
              <div key={r._id} className={styles.reportCard}>
                <div className={styles.reportIcon}>📄</div>
                <div className={styles.reportInfo}>
                  <p className={styles.reportTitle}>{r.title}</p>
                  <p className={styles.reportDate}>
                    {new Date(r.createdAt).toLocaleDateString("ar-DZ")}
                  </p>
                </div>
                <span className={`${styles.reportStatus} ${r.status === "read" ? styles.approved : styles.sent}`}>
                  {r.status === "read" ? "مقروء" : "مرسل"}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── الجدول - ديكور ─── */}
      {activeTab === "schedule" && (
        <div className={styles.section}>
          <h2 className={styles.pageTitle}>جدول الأسبوع</h2>
          <div className={styles.scheduleList}>
            {weekSchedule.map(d => (
              <div key={d.day} className={styles.scheduleRow}>
                <span className={styles.scheduleDay}>{d.day}</span>
                <div className={styles.scheduleBar}>
                  <div
                    className={styles.scheduleBarFill}
                    style={{ width: `${(d.done / d.count) * 100}%` }}
                  ></div>
                </div>
                <span className={styles.scheduleCount}>{d.done}/{d.count}</span>
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
            <p className={styles.profileRole}>مشرف معتمد</p>
          </div>

          {infoLoading ? (
            <p className={styles.loadingText}>جاري التحميل...</p>
          ) : supervisorInfo ? (
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>الاسم الكامل</span>
                <span className={styles.infoValue}>{supervisorInfo.name} {supervisorInfo.familyname}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>البريد الإلكتروني</span>
                <span className={styles.infoValue}>{supervisorInfo.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>رقم الهاتف</span>
                <span className={styles.infoValue}>{supervisorInfo.phonenumber}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>مجال الإشراف</span>
                <span className={styles.infoValue}>{supervisorInfo.supervisionarea}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>العنوان</span>
                <span className={styles.infoValue}>{supervisorInfo.adress}</span>
              </div>
            </div>
          ) : null}

          <div className={styles.profileStats}>
            <div className={styles.pStat}><span>{myTeam.length}</span><small>فنيون</small></div>
            <div className={styles.pStat}><span>{myReports.length}</span><small>تقرير</small></div>
            <div className={styles.pStat}><span>2</span><small>سنوات خبرة</small></div>
          </div>

          <div className={styles.profileMenu}>
            <button className={styles.menuItem}>تعديل الملف الشخصي</button>
            <button className={styles.menuItem}>الإعدادات</button>
            <button onClick={handleLogout} className={`${styles.menuItem} ${styles.logout}`}>
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default SupervisorHome
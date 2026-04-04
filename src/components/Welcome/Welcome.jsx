import { useNavigate } from "react-router-dom"
import styles from "./Welcome.module.css"

function Welcome() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>

      {/* خلفية متحركة */}
      <div className={styles.bgGrid}></div>
      <div className={styles.bgGlow1}></div>
      <div className={styles.bgGlow2}></div>

      {/* المحتوى الرئيسي */}
      <div className={styles.content}>

        {/* الشعار */}
        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="24,4 44,14 44,34 24,44 4,34 4,14" stroke="#f59e0b" strokeWidth="2" fill="none"/>
              <polygon points="24,12 36,18 36,30 24,36 12,30 12,18" stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245,158,11,0.08)"/>
              <circle cx="24" cy="24" r="5" fill="#f59e0b"/>
            </svg>
          </div>
          <span className={styles.logoText}>Vario</span>
        </div>

        {/* العنوان */}
        <div className={styles.heroText}>
          <h1 className={styles.title}>
            <span className={styles.titleLine1}>نظام  ذكي </span>
            <span className={styles.titleLine2}> لإدارة الصيانة</span>
          </h1>
          <p className={styles.subtitle}>
  المنصة الداخلية لإدارة الفنيين والمشرفين ومتابعة المهام اليومية
          </p>
        </div>

        {/* الأزرار */}
        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate("/register")}
          >
            <span>إنشاء حساب جديد</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <button
            className={styles.btnSecondary}
            onClick={() => navigate("/login")}
          >
            تسجيل الدخول
          </button>
        </div>

        {/* الإحصائيات */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+50</span>
            <span className={styles.statLabel}>فني معتمد</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+12</span>
            <span className={styles.statLabel}>مشرف</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+200</span>
            <span className={styles.statLabel}>مهمة منجزة</span>
          </div>
        </div>

      </div>

      {/* الزخارف الهندسية */}
      <div className={styles.decorTopRight}></div>
      <div className={styles.decorBottomLeft}></div>

    </div>
  )
}

export default Welcome
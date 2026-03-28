import { useState } from "react"
import styles from "./Home.module.css"
import BottomNav from "../Bottomnav/Bottomnav"
import WorkerHome from "../Workerhome/Workerhome"
import SupervisorHome from "../SupervisorHome/SupervisorHome"
import BossHome from "../BossHome/BossHome"

function Home() {
  const role = localStorage.getItem("role") || "worker"



  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className={styles.wrapper}>

      {/* ─── المحتوى حسب الـ role ─── */}
      {role === "worker" && (
        <WorkerHome activeTab={activeTab} />
      )}
      {role === "supervisor" && (
        <SupervisorHome activeTab={activeTab} />
      )}
      {role === "boss" && (
        <BossHome activeTab={activeTab} />
      )}

      {/* ─── الـ BottomNav ─── */}
      <BottomNav
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  )
}

export default Home
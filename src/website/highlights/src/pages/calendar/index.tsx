import PageLayout from "@/components/PageLayout/PageLayout";
import { ReactNode } from "react";
import MyCalendar from "@/components/Calendar/Calendar";
// import 'bootstrap/dist/css/bootstrap.min.css';
import style from "./index.module.css"; 

export default function Calendar() {
    return (
        <div className={style.calendarContainer}>
            {/* <div className={styles.leftPlane}>
                <DaySchedule />
            </div> */}
            <div className={style.middleBorder}></div> {/* Middle border element */}
            <div className={style.rightPlane}>
                <MyCalendar />
            </div>
        </div>
    )
}

Calendar.getLayout = function getLayout(page: ReactNode) {
    return (
        <PageLayout>
            {page}
        </PageLayout>
    );
}

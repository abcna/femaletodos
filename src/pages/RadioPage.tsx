import React, { useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonDatetime,
} from "@ionic/react";
import MenstrualCycle, {
  MenstrualCycleRef,
} from "../components/MenstrualCycle.tsx";
import moment from "moment-jalaali";
import "./RadioPage.css";

const RadioPage: React.FC = () => {
  const menstrualCycleRef = useRef<MenstrualCycleRef>(null);
  const [periods, setPeriods] = useState<string[]>([]);

  const handleReset = () => {
    menstrualCycleRef.current?.resetData();
    setPeriods([]);
  };

  const toPersianNumber = (number: number) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return number.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
  };

  const formatDate = (dateString: string) => {
    const m = moment(dateString);
    const year = m.jYear();
    const month = m.jMonth() + 1; // months are 0-based
    const day = m.jDate();

    return `${toPersianNumber(year)}/${toPersianNumber(
      month
    )}/${toPersianNumber(day)}`;
  };

  const updatePeriods = () => {
    const nextPeriods = menstrualCycleRef.current?.getNextPeriods() || [];
    setPeriods(nextPeriods);
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>تقویم</IonTitle>
          <IonButton slot="end" onClick={handleReset}>
            بازنشانی
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>تقویم دوره‌های قاعدگی</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonDatetime
              presentation="date"
              value={getCurrentDate()}
              highlightedDates={periods.map((date, index) => ({
                date,
                textColor: index % 2 === 0 ? "#800080" : "#09721b",
                backgroundColor: index % 2 === 0 ? "#ffc0cb" : "#c8e5d0",
              }))}
            ></IonDatetime>
          </IonCardContent>
        </IonCard>

        <MenstrualCycle
          ref={menstrualCycleRef}
          onPeriodsCalculated={updatePeriods}
        />

        {periods.length > 0 && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>تاریخ‌های پیش‌بینی شده</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {periods.map((date, index) => (
                  <IonItem key={date}>
                    <IonLabel>
                      <h2>دوره {toPersianNumber(index + 1)}</h2>
                      <p>{formatDate(date)}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RadioPage;

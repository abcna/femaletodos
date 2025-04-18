import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonDatetime,
} from "@ionic/react";
import { close } from "ionicons/icons";
import "./MenstrualCycle.css";

interface MenstrualCycleProps {
  onPeriodsCalculated?: () => void;
}

export interface MenstrualCycleRef {
  resetData: () => void;
  getNextPeriods: () => string[];
}

const MenstrualCycle = forwardRef<MenstrualCycleRef, MenstrualCycleProps>(
  (props, ref) => {
    const [lastPeriod, setLastPeriod] = useState("");
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [nextPeriods, setNextPeriods] = useState<string[]>([]);

    const { onPeriodsCalculated } = props;

    useEffect(() => {
      if (lastPeriod) {
        const periods: string[] = [];
        let currentDate = new Date(lastPeriod);

        // Add the initial period date
        periods.push(currentDate.toISOString().split("T")[0]);

        // Calculate next 12 periods
        for (let i = 0; i < 12; i++) {
          // Add 27 days for each subsequent period
          currentDate.setDate(currentDate.getDate() + 27);
          const periodDate = new Date(currentDate);
          const formattedDate = periodDate.toISOString().split("T")[0];
          periods.push(formattedDate);
        }

        setNextPeriods(periods);
      }
    }, [lastPeriod]);

    // Separate effect for calling onPeriodsCalculated
    useEffect(() => {
      if (nextPeriods.length > 0) {
        onPeriodsCalculated?.();
      }
    }, [nextPeriods, onPeriodsCalculated]);

    const handleDateChange = (date: string) => {
      setLastPeriod(date);
      setShowQuestionnaire(false);
    };

    const handleReset = () => {
      setLastPeriod("");
      setShowQuestionnaire(false);
      setNextPeriods([]);
    };

    useImperativeHandle(ref, () => ({
      resetData: handleReset,
      getNextPeriods: () => nextPeriods,
    }));

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>پیگیری دوره قاعدگی</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="selected-date">
              {lastPeriod ? (
                <p>
                  آخرین دوره: {new Date(lastPeriod).toLocaleDateString("fa-IR")}
                </p>
              ) : (
                <p>تاریخ آخرین دوره انتخاب نشده است</p>
              )}
            </div>

            <IonButton
              expand="block"
              onClick={() => setShowQuestionnaire(true)}
            >
              {lastPeriod ? "تغییر تاریخ" : "مشخص کردن آخرین دوره"}
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonModal
          isOpen={showQuestionnaire}
          onDidDismiss={() => setShowQuestionnaire(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>انتخاب تاریخ آخرین دوره</IonTitle>
              <IonButton slot="end" onClick={() => setShowQuestionnaire(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">تاریخ آخرین روز قاعدگی</IonLabel>
                <IonDatetime
                  presentation="date"
                  value={lastPeriod}
                  onIonChange={(e) =>
                    handleDateChange(e.detail.value as string)
                  }
                  locale="fa-IR"
                  dir="rtl"
                  firstDayOfWeek={6}
                  formatOptions={{
                    date: {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  }}
                ></IonDatetime>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>

        {nextPeriods.length > 0 && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>تاریخ‌های پیش‌بینی شده</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {nextPeriods.map((date, index) => (
                  <IonItem key={date}>
                    <IonLabel>
                      <h2>دوره {index + 1}:</h2>
                      <p>{formatDate(date)}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}
      </>
    );
  }
);

export default MenstrualCycle;

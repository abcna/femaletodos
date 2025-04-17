import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonList,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { refresh } from "ionicons/icons";
import useTaskStore from "./taskState.ts";
import "./LibraryPage.css";

const LibraryPage: React.FC = () => {
  const { completedTasks, refreshTasks } = useTaskStore();

  // Function to determine if text should be white based on background color
  const getTextColor = (backgroundColor: string) => {
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128 ? "white" : "black";
  };

  // Sort completed tasks by completion date (most recent first)
  const sortedCompletedTasks = [...completedTasks].sort((a, b) => {
    // If both tasks have completion dates, sort by date
    if (a.completedAt && b.completedAt) {
      return (
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
    }
    // If only one has a completion date, put it first
    if (a.completedAt && !b.completedAt) return -1;
    if (!a.completedAt && b.completedAt) return 1;
    // If neither has a completion date, maintain original order
    return 0;
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Completed Tasks</IonTitle>
          <IonButton slot="end" onClick={refreshTasks}>
            <IonIcon icon={refresh}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {sortedCompletedTasks.map((task) => {
            const textColor = getTextColor(task.color);
            return (
              <IonCard key={task.id} style={{ backgroundColor: task.color }}>
                <IonCardHeader>
                  <div className="task-card">
                    <div className="task-content">
                      <IonCardTitle style={{ color: textColor }}>
                        {task.name}
                      </IonCardTitle>
                      <IonCardSubtitle style={{ color: textColor }}>
                        {task.category}
                      </IonCardSubtitle>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent
                  className="task-description"
                  style={{ color: textColor }}
                >
                  {task.description}
                </IonCardContent>
              </IonCard>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default LibraryPage;

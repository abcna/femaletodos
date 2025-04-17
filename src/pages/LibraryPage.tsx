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
  IonButtons,
} from "@ionic/react";
import { trashOutline, refreshOutline } from "ionicons/icons";
import useTaskStore from "./taskState.ts";

const LibraryPage: React.FC = () => {
  const { completedTasks, clearCompletedTasks, refreshTasks } = useTaskStore();

  // Function to determine if text should be white based on background color
  const getTextColor = (backgroundColor: string) => {
    // Convert hex to RGB
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return white for dark backgrounds, black for light backgrounds
    return brightness < 128 ? "white" : "black";
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Completed Tasks</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={refreshTasks} color="primary">
              <IonIcon icon={refreshOutline} />
            </IonButton>
            <IonButton onClick={clearCompletedTasks} color="danger">
              <IonIcon icon={trashOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {completedTasks.map((task) => {
            const textColor = getTextColor(task.color);
            return (
              <IonCard key={task.id} style={{ backgroundColor: task.color }}>
                <IonCardHeader>
                  <IonCardTitle style={{ color: textColor }}>
                    {task.name}
                  </IonCardTitle>
                  <IonCardSubtitle style={{ color: textColor }}>
                    {task.category}
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent style={{ color: textColor }}>
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

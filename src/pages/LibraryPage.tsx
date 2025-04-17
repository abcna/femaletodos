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
  IonItem,
  IonLabel,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import {
  trash,
  body,
  school,
  heart,
  people,
  happy,
  apps,
} from "ionicons/icons";
import useTaskStore from "./taskState.ts";
import "./LibraryPage.css";

const LibraryPage: React.FC = () => {
  const { completedTasks, clearCompletedTasks, refreshTasks } = useTaskStore();

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refreshTasks();
    event.detail.complete();
  };

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

  // Define category icons and colors
  const categoryConfig = {
    جسمی: { icon: body, color: "danger" },
    "ذهنی - آموزشی": { icon: school, color: "tertiary" },
    روحی: { icon: heart, color: "success" },
    "رابطه ای": { icon: people, color: "warning" },
    تفریح: { icon: happy, color: "primary" },
    متفرقه: { icon: apps, color: "secondary" },
  };

  // Calculate completed tasks count for each category
  const categoryStats = completedTasks.reduce((acc, task) => {
    // Ensure the category exists in our config, otherwise use "متفرقه"
    const category = task.category in categoryConfig ? task.category : "متفرقه";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>کتابخانه</IonTitle>
          <IonButton
            slot="end"
            onClick={clearCompletedTasks}
            className="clear-button"
          >
            <IonIcon icon={trash}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Category Statistics Section */}
        <IonList inset={true}>
          {Object.entries(categoryStats).map(([category, count]) => {
            const config =
              categoryConfig[category as keyof typeof categoryConfig] ||
              categoryConfig["متفرقه"];
            return (
              <IonItem key={category} button={true}>
                <IonIcon
                  color={config.color}
                  slot="start"
                  icon={config.icon}
                  size="large"
                ></IonIcon>
                <IonLabel>{category}</IonLabel>
                <IonNote slot="end">{count}</IonNote>
              </IonItem>
            );
          })}
        </IonList>

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

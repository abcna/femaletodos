import React, { useState } from "react";
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
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonCheckbox,
  IonLabel,
  IonList,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonModal,
} from "@ionic/react";
import {
  add,
  document,
  colorPalette,
  globe,
  arrowUp,
  caretUpCircle,
} from "ionicons/icons";
import useTaskStore from "./taskState.ts";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const { activeTasks, addTask, completeTask } = useTaskStore();
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("other");
  const [color, setColor] = useState("#FFB8E0");
  const [description, setDescription] = useState("No description provided");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName) {
      const newTask = {
        id: Date.now(),
        name: taskName,
        category: category || "other",
        color: color || "#FFB8E0",
        description: description || "No description provided",
        completed: false,
      };
      addTask(newTask);
      // Reset form
      setTaskName("");
      setCategory("other");
      setColor("#FFB8E0");
      setDescription("No description provided");
    }
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todo App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {activeTasks.map((task) => {
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
                    <IonCheckbox
                      checked={task.completed}
                      onIonChange={() => completeTask(task.id)}
                      className="task-checkbox"
                    />
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

        <div className="task-input-container">
          <form onSubmit={handleSubmit} className="task-form">
            <IonButton
              type="submit"
              className="submit-button"
              fill="solid"
              shape="round"
            >
              <IonIcon icon={caretUpCircle} />
            </IonButton>
            <IonItem className="task-input-item">
              <IonInput
                value={taskName}
                onIonChange={(e) => setTaskName(e.detail.value!)}
                placeholder="Task Name *"
                className="task-input"
                required
              />
            </IonItem>
          </form>
        </div>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton onClick={() => setIsCategoryModalOpen(true)}>
              <IonIcon icon={document}></IonIcon>
            </IonFabButton>
            <IonFabButton onClick={() => setIsColorModalOpen(true)}>
              <IonIcon icon={colorPalette}></IonIcon>
            </IonFabButton>
            <IonFabButton onClick={() => setIsDescriptionModalOpen(true)}>
              <IonIcon icon={globe}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>

        {/* Category Modal */}
        <IonModal
          isOpen={isCategoryModalOpen}
          onDidDismiss={() => setIsCategoryModalOpen(false)}
          initialBreakpoint={0.25}
          breakpoints={[0, 0.25, 0.5, 0.75]}
          handleBehavior="cycle"
        >
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel>Category</IonLabel>
              <IonSelect
                value={category}
                onIonChange={(e) => setCategory(e.detail.value)}
                placeholder="Select Category"
              >
                <IonSelectOption value="work">Work</IonSelectOption>
                <IonSelectOption value="personal">Personal</IonSelectOption>
                <IonSelectOption value="shopping">Shopping</IonSelectOption>
                <IonSelectOption value="other">Other</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonContent>
        </IonModal>

        {/* Color Modal */}
        <IonModal
          isOpen={isColorModalOpen}
          onDidDismiss={() => setIsColorModalOpen(false)}
          initialBreakpoint={0.25}
          breakpoints={[0, 0.25, 0.5, 0.75]}
          handleBehavior="cycle"
        >
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel>Color</IonLabel>
              <IonInput
                type="color"
                value={color}
                onIonChange={(e) => setColor(e.detail.value!)}
                style={{ width: "50px", height: "30px" }}
              />
            </IonItem>
            <div
              className="color-preview"
              style={{ backgroundColor: color }}
            ></div>
          </IonContent>
        </IonModal>

        {/* Description Modal */}
        <IonModal
          isOpen={isDescriptionModalOpen}
          onDidDismiss={() => setIsDescriptionModalOpen(false)}
          initialBreakpoint={0.25}
          breakpoints={[0, 0.25, 0.5, 0.75]}
          handleBehavior="cycle"
        >
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="floating">Description</IonLabel>
              <IonInput
                value={description}
                onIonChange={(e) => setDescription(e.detail.value!)}
              />
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;

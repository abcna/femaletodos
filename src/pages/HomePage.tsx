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
} from "@ionic/react";
import useTaskStore from "./taskState.ts";

interface Task {
  id: number;
  name: string;
  category: string;
  color: string;
  description: string;
  completed: boolean;
}

const HomePage: React.FC = () => {
  const { activeTasks, addTask, completeTask } = useTaskStore();
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("other");
  const [color, setColor] = useState("#3880ff");
  const [description, setDescription] = useState("No description provided");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName) {
      const newTask = {
        id: Date.now(),
        name: taskName,
        category: category || "other",
        color: color || "#3880ff",
        description: description || "No description provided",
        completed: false,
      };
      addTask(newTask);
      // Reset form
      setTaskName("");
      setCategory("other");
      setColor("#3880ff");
      setDescription("No description provided");
    }
  };

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
          <IonTitle>Todo App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Task Name *</IonLabel>
            <IonInput
              value={taskName}
              onIonChange={(e) => setTaskName(e.detail.value!)}
              required
            />
          </IonItem>

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

          <IonItem>
            <IonLabel>Color</IonLabel>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: "50px", height: "30px", marginLeft: "10px" }}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Description</IonLabel>
            <IonInput
              value={description}
              onIonChange={(e) => setDescription(e.detail.value!)}
            />
          </IonItem>

          <IonButton expand="block" type="submit" className="ion-margin">
            Add Task
          </IonButton>
        </form>

        <IonList>
          {activeTasks.map((task) => {
            const textColor = getTextColor(task.color);
            return (
              <IonCard key={task.id} style={{ backgroundColor: task.color }}>
                <IonCardHeader>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
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
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
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

export default HomePage;

import React, { useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonToast,
  IonSelect,
  IonSelectOption,
  IonFooter,
} from "@ionic/react";
import { send } from "ionicons/icons";
import "./SearchPage.css";

// Add type declaration for import.meta.env
declare global {
  interface ImportMetaEnv {
    VITE_GROQ_API_KEY: string;
  }
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Available Groq models
const GROQ_MODELS = [
  { value: "llama3-70b-8192", label: "Llama 3 70B (8192 tokens)" },
  { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B (32768 tokens)" },
  { value: "llama2-70b-4096", label: "Llama 2 70B (4096 tokens)" },
  { value: "gemma-7b-it", label: "Gemma 7B" },
];

const SearchPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState("llama3-70b-8192");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Groq API key - ensure it's properly formatted
  const GROQ_API_KEY =
    "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";
  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test the API key when component mounts
  useEffect(() => {
    const testApiKey = async () => {
      try {
        console.log("Testing API key...");
        const response = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY.trim()}`,
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: "system", content: "You are a test." },
              { role: "user", content: "Test" },
            ],
            max_tokens: 10,
          }),
        });

        console.log("API test response status:", response.status);

        if (response.ok) {
          console.log("API key is valid");
          setApiKeyValid(true);
        } else {
          const errorText = await response.text();
          console.error("API key test failed:", errorText);
          setApiKeyValid(false);
          setErrorMessage(
            `API key validation failed: ${response.status} - ${errorText}`
          );
          setShowToast(true);
        }
      } catch (error) {
        console.error("API key test error:", error);
        setApiKeyValid(false);
        setErrorMessage(
          `API key test error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        setShowToast(true);
      }
    };

    testApiKey();
  }, [selectedModel]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (apiKeyValid === false) {
      setErrorMessage("API key is invalid. Please check your API key.");
      setShowToast(true);
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending request to Groq API...");
      console.log("Using model:", selectedModel);

      // Create a simple request with minimal parameters
      const requestBody = {
        model: selectedModel,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that speaks Persian (Farsi). Please respond in Persian.",
          },
          ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
          { role: "user", content: input },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      };

      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      console.log("API URL:", GROQ_API_URL);
      console.log(
        "API Key (first 10 chars):",
        GROQ_API_KEY.substring(0, 10) + "..."
      );

      // Make the API request
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY.trim()}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        JSON.stringify(Object.fromEntries([...response.headers]), null, 2)
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected API response format:", data);
        throw new Error("Unexpected API response format");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.choices[0].message.content || "متاسفانه پاسخی دریافت نشد.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error details:", error);
      const errorText = error instanceof Error ? error.message : String(error);
      setErrorMessage(`خطا: ${errorText}`);
      setShowToast(true);

      const errorMessage: Message = {
        role: "assistant",
        content: "متاسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModelChange = (event: CustomEvent) => {
    setSelectedModel(event.detail.value);
    console.log("Model changed to:", event.detail.value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>دستیار هوشمند</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="chat-content">
        {apiKeyValid === false && (
          <div className="api-key-error">
            <p>API key validation failed. Please check your API key.</p>
          </div>
        )}

        <div className="model-selector">
          <IonItem>
            <IonLabel>انتخاب مدل:</IonLabel>
            <IonSelect
              value={selectedModel}
              onIonChange={handleModelChange}
              interface="popover"
            >
              {GROQ_MODELS.map((model) => (
                <IonSelectOption key={model.value} value={model.value}>
                  {model.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <IonCard
              key={index}
              className={`message-card ${
                message.role === "user" ? "user-message" : "assistant-message"
              }`}
            >
              <IonCardContent>
                <p className="message-text">{message.content}</p>
              </IonCardContent>
            </IonCard>
          ))}
          {isLoading && (
            <div className="loading-container">
              <IonSpinner name="dots" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </IonContent>

      <IonFooter className="chat-footer">
        <div className="input-container">
          <IonInput
            value={input}
            onIonChange={(e) => setInput(e.detail.value!)}
            onKeyPress={handleKeyPress}
            placeholder="پیام خود را بنویسید..."
            className="message-input"
          />
          <IonButton
            onClick={handleSend}
            disabled={isLoading || !input.trim() || apiKeyValid === false}
            className="send-button"
          >
            <IonIcon icon={send} />
          </IonButton>
        </div>
      </IonFooter>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={errorMessage}
        duration={5000}
        position="bottom"
        color="danger"
      />
    </IonPage>
  );
};

export default SearchPage;

import React, { useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonToast,
  IonSelect,
  IonSelectOption,
  IonFooter,
  IonTextarea,
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
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

// Available Groq models
const GROQ_MODELS = [
  { value: "llama3-70b-8192", label: "Llama 3 70B (8192 tokens)" },
  { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B (32768 tokens)" },
  { value: "llama2-70b-4096", label: "Llama 2 70B (4096 tokens)" },
  { value: "gemma-7b-it", label: "Gemma 7B" },
];

const SYSTEM_PROMPT =
  "You are a helpful assistant that speaks Persian (Farsi). Please respond in Persian.";

const SearchPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState("llama3-70b-8192");
  const [textareaHeight, setTextareaHeight] = useState("auto");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLIonTextareaElement>(null);

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

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.setFocus();
      }, 500);
    }
  }, []);

  // Test the API key when component mounts
  useEffect(() => {
    const testApiKey = async () => {
      try {
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

        if (response.ok) {
          setApiKeyValid(true);
        } else {
          const errorText = await response.text();
          setApiKeyValid(false);
          setErrorMessage(
            `API key validation failed: ${response.status} - ${errorText}`
          );
          setShowToast(true);
        }
      } catch (error) {
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

    const timestamp = Date.now();
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTextareaHeight("auto");
    setIsLoading(true);

    try {
      const requestBody = {
        model: selectedModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
          { role: "user", content: input },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      };

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY.trim()}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Unexpected API response format");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.choices[0].message.content || "متاسفانه پاسخی دریافت نشد.",
        timestamp: Date.now(),
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
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.setFocus();
        }, 100);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLIonTextareaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSend();
    }
  };

  const handleModelChange = (event: CustomEvent) => {
    setSelectedModel(event.detail.value);
  };

  const handleInputChange = (e: CustomEvent) => {
    const value = e.detail.value!;
    setInput(value);

    if (inputRef.current) {
      const textarea = inputRef.current;
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(`${newHeight}px`);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          {messages.length === 0 && (
            <div className="welcome-message">
              <h2>به دستیار هوشمند خوش آمدید</h2>
              <p>لطفاً سوال یا درخواست خود را به فارسی بنویسید.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <IonCard
              key={index}
              className={`message-card ${
                message.role === "user" ? "user-message" : "assistant-message"
              }`}
            >
              <IonCardContent>
                <p className="message-text">{message.content}</p>
                <div className="message-timestamp">
                  {formatDate(message.timestamp)}
                </div>
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
          <IonTextarea
            ref={inputRef}
            value={input}
            onIonChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="پیام خود را بنویسید..."
            className="message-input"
            rows={1}
            style={{ height: textareaHeight }}
            enterkeyhint="send"
            autoGrow={true}
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

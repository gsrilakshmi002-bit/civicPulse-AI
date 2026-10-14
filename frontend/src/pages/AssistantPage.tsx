import React, { useState } from "react";
import { Icon } from "../components/Icons";
import { askAssistant } from "../api";

interface Message {
  role: "user" | "assistant";
  content: string;
  groundedData?: any;
  timestamp: string;
}

export function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your **CivicAI Community Intelligence Assistant**. I have live, grounded access to the municipal SQLite database. You can ask me about real-time complaint counts, top reported problems, waste management recommendations, or reporting procedures.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQueries = [
    "How many complaints are currently pending?",
    "What is the most frequently reported community problem?",
    "Which municipal ward logs the highest issue volume?",
    "What actions could help reduce recurring garbage problems?",
    "How can I report a potable water leakage?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setIsLoading(true);

    try {
      const res = await askAssistant(textToSend.trim());
      const botMsg: Message = {
        role: "assistant",
        content: res.answer,
        groundedData: res.grounded_data,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: Message = {
        role: "assistant",
        content: "I apologize, but I had trouble reaching the CivicAI backend service. Please ensure the local server is running.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Icon name="bot" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              AI Community Intelligence Assistant
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Grounded in live municipal database records • No synthetic hallucination for statistical facts
            </p>
          </div>
        </div>

        {/* Suggested Queries */}
        <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
          <p className="text-[11px] font-bold uppercase text-[var(--text-dim)] mb-2">
            Suggested Prompts:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] hover:bg-teal-500/15 text-slate-300 hover:text-teal-300 border border-[var(--border-color)] text-xs font-medium transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Panel */}
      <div className="glass-panel rounded-2xl border border-[var(--border-color)] flex flex-col h-[520px]">
        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  <Icon name="bot" className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-xl p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-teal-600 text-white rounded-tr-none shadow-md shadow-teal-600/20"
                    : "bg-[var(--bg-surface)] text-slate-200 border border-[var(--border-color)] rounded-tl-none"
                }`}
              >
                {m.content}
                <div
                  className={`text-[9px] mt-2 ${
                    m.role === "user" ? "text-teal-200" : "text-[var(--text-dim)]"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold flex-shrink-0">
                <Icon name="bot" className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-slate-400 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing municipal database records...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-[var(--border-color)] flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about community stats, waste management, or reporting procedures..."
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary text-xs px-5"
          >
            <Icon name="send" className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

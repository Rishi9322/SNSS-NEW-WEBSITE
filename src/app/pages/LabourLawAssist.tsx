import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { NAVY, AMBER, LABOUR_ASSIST_DISCLAIMER, LABOUR_ASSIST_SHORT_DISCLAIMER, DEFAULT_PROFILE, COMMON_STATES, ISSUE_QUICKSTARTS, ESCALATION_MESSAGE } from "../constants";
import { useSEO } from "../hooks/useSEO";
import { retrieveRelevantChunks, type DatasetEntry, getDatasetLastUpdated } from "../../lib/rag";
import { buildRagContext } from "../../lib/prompts";
import { checkQueryGuardrails, applyResponseGuardrails, checkRateLimit, checkQueryLength } from "../../lib/guardrails";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ act: string; section: string; source: string }>;
  timestamp: string;
  feedback?: "up" | "down" | null;
  usedWebSearch?: boolean;
  webSources?: string[];
}

interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  profile: Profile;
  createdAt: string;
  updatedAt: string;
}

interface Profile {
  name?: string;
  role: "employee" | "employer";
  state: string;
  sector?: string;
}

const STORAGE_KEYS = {
  threads: "lla_threads",
  currentThreadId: "lla_current_thread",
  profile: "lla_profile",
};

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function truncate(str: string, len = 48) {
  return str.length > len ? str.slice(0, len - 1) + "…" : str;
}

// LLM replies arrive with markdown-style **bold** — render it instead of showing raw asterisks
function renderInlineMarkdown(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

// Strong grounded response generator for MVP (no external dependency required)
function generateGroundedResponse(
  userQuery: string,
  profile: Profile,
  _history: Message[],
  chunks: Array<{ entry: DatasetEntry; relevance: number }>
): { content: string; citations: Array<{ act: string; section: string; source: string }>; escalation: boolean } {
  const citations: Array<{ act: string; section: string; source: string }> = [];
  let escalation = false;

  if (chunks.length === 0) {
    return {
      content: `I don't have highly relevant sections in the current knowledge base for that specific query. ${LABOUR_ASSIST_SHORT_DISCLAIMER}\n\nYou can try providing more details (state, employment type, timeline) or ask about one of the core areas I cover: wages, termination, PF/ESI, gratuity, maternity, POSH, working hours, or leave.`,
      citations: [],
      escalation: false,
    };
  }

  // Build structured response
  let response = "";

  // 1. Acknowledge
  response += `Thank you for sharing your situation. `;

  // 2. Cite + explain (use top 2-3 chunks)
  const used = chunks.slice(0, 3);
  const keyPoints: string[] = [];

  used.forEach((c) => {
    const e = c.entry;
    citations.push({ act: e.act, section: e.section, source: e.source });

    if (e.implementation_status) {
      keyPoints.push(`${e.act} (${e.section}): ${e.summary} (Implementation note: ${e.implementation_status})`);
    } else {
      keyPoints.push(`${e.act} (${e.section}): ${e.summary}`);
    }
  });

  response += `Based on the applicable provisions:\n\n`;
  keyPoints.forEach((p) => {
    response += `• ${p}\n`;
  });

  // 3. Personalize for this user
  response += `\nFor your profile (${profile.role}, ${profile.state}${profile.sector ? `, ${profile.sector}` : ""}):\n`;

  // Simple personalization heuristics
  const lowerQuery = userQuery.toLowerCase();
  if (lowerQuery.includes("termination") || lowerQuery.includes("fired") || lowerQuery.includes("retrench")) {
    response += `In most cases under the Industrial Disputes Act (for workmen), retrenchment requires notice or pay in lieu plus compensation of 15 days' wages per completed year. The 'last come, first go' principle generally applies. Managerial employees are often governed by contract notice periods under state Shops & Establishments Acts.\n`;
    escalation = true;
  } else if (lowerQuery.includes("pf") || lowerQuery.includes("provident")) {
    response += `EPF contributions are typically 12% from employee and 12% from employer (split between EPF and EPS). You can withdraw advances for specific purposes after meeting membership criteria, and full withdrawal is allowed after leaving employment (subject to rules).\n`;
  } else if (lowerQuery.includes("maternity") || lowerQuery.includes("pregnant")) {
    response += `Under the Maternity Benefit Act, eligible women are generally entitled to 26 weeks of paid maternity benefit for the first two children (12 weeks thereafter). Employers with 10+ employees must provide this benefit.\n`;
  } else if (lowerQuery.includes("posh") || lowerQuery.includes("harass")) {
    response += `Workplaces with 10 or more employees must constitute an Internal Complaints Committee (ICC) under the POSH Act. Employers have specific duties to prevent and redress sexual harassment.\n`;
    escalation = true;
  } else if (lowerQuery.includes("wage") || lowerQuery.includes("salary") || lowerQuery.includes("payment")) {
    response += `Wages must generally be paid within the timelines prescribed under the Payment of Wages Act (by the 7th or 10th of the following month depending on establishment size). Minimum wages are fixed by the state and vary by scheduled employment.\n`;
  } else if (lowerQuery.includes("leave") || lowerQuery.includes("earned leave")) {
    response += `Leave entitlements (earned leave, casual leave, sick leave) are primarily governed by the applicable state Shops & Establishments Act or the Factories Act. Entitlements differ by state and nature of establishment.\n`;
  } else {
    response += `The provisions above apply based on the facts of your employment (state, designation, length of service, etc.). Exact entitlements can vary.\n`;
  }

  // 4. Practical next steps
  response += `\nRecommended next steps:\n`;
  response += `• Document all relevant dates, communications, and payslips.\n`;
  response += `• Check your appointment letter, offer letter, or employment contract for specific clauses.\n`;
  response += `• For PF/ESI/gratuity issues, approach the respective regional offices or use the EPFO/ESIC portals.\n`;
  response += `• For workplace disputes, consider raising the issue internally in writing first (where appropriate).\n`;

  // 5. Escalation / disclaimer
  if (escalation || lowerQuery.includes("termination") || lowerQuery.includes("posh")) {
    response += `\n⚠️ ${ESCALATION_MESSAGE}\n`;
  }

  response += `\n${LABOUR_ASSIST_SHORT_DISCLAIMER}`;

  return { content: response, citations, escalation };
}

export function LabourLawAssist() {
  useSEO({
    title: "Labour Law Assist — Free AI Tool for Indian Labour Law Questions",
    description: "Ask questions about Indian labour law: PF, ESIC, termination rights, gratuity, maternity leave, minimum wages, and more. AI-powered, state-aware, and built on verified legal sources. Not legal advice.",
    path: "/assist",
  });

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  // Responsive sidebar handling
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentThread = threads.find((t) => t.id === currentThreadId) || null;
  const messages = currentThread?.messages || [];

  // Load from localStorage
  useEffect(() => {
    const savedThreads = localStorage.getItem(STORAGE_KEYS.threads);
    const savedCurrent = localStorage.getItem(STORAGE_KEYS.currentThreadId);
    const savedProfile = localStorage.getItem(STORAGE_KEYS.profile);

    if (savedThreads) {
      try {
        setThreads(JSON.parse(savedThreads));
      } catch {}
    }
    if (savedCurrent) setCurrentThreadId(savedCurrent);
    if (savedProfile) {
      try {
        setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(savedProfile) });
      } catch {}
    }
  }, []);

  // Persist threads (always — so deletions survive a reload too)
  const threadsLoaded = useRef(false);
  useEffect(() => {
    if (!threadsLoaded.current) {
      threadsLoaded.current = true;
      return;
    }
    localStorage.setItem(STORAGE_KEYS.threads, JSON.stringify(threads));
  }, [threads]);

  // Persist current thread id
  useEffect(() => {
    if (currentThreadId) {
      localStorage.setItem(STORAGE_KEYS.currentThreadId, currentThreadId);
    }
  }, [currentThreadId]);

  // Persist profile
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Create new thread
  function createNewThread(initialMessage?: string) {
    const id = generateId();
    const now = new Date().toISOString();

    const newThread: ChatThread = {
      id,
      title: initialMessage ? truncate(initialMessage) : "New conversation",
      messages: [],
      profile: { ...profile },
      createdAt: now,
      updatedAt: now,
    };

    setThreads((prev) => [newThread, ...prev]);
    setCurrentThreadId(id);
    return id;
  }

  // Switch thread
  function switchThread(id: string) {
    setCurrentThreadId(id);
  }

  // Delete thread
  function deleteThread(id: string) {
    setThreads((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (currentThreadId === id) {
        setCurrentThreadId(remaining.length > 0 ? remaining[0].id : null);
        if (remaining.length === 0) {
          localStorage.removeItem(STORAGE_KEYS.currentThreadId);
        }
      }
      return remaining;
    });
  }

  // Add message to a specific thread. The thread id is passed explicitly so a
  // message never lands in the wrong thread when state updates are still in flight.
  function addMessage(threadId: string, msg: Message) {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              // First user message names a thread that was created empty via "New Chat"
              title: t.title === "New conversation" && msg.role === "user" ? truncate(msg.content) : t.title,
              messages: [...t.messages, msg],
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }

  // Update feedback on a message
  function setFeedback(messageId: string, feedback: "up" | "down") {
    if (!currentThreadId) return;

    setThreads((prev) =>
      prev.map((t) =>
        t.id === currentThreadId
          ? {
              ...t,
              messages: t.messages.map((m) =>
                m.id === messageId ? { ...m, feedback } : m
              ),
            }
          : t
      )
    );
  }

  // Main send handler
  async function sendMessage(customQuery?: string) {
    const query = (customQuery || input).trim();
    if (!query || isTyping) return;

    // Token-budget: query length guard
    const lenCheck = checkQueryLength(query);
    if (!lenCheck.allowed) {
      setInput(query); // keep text so user can edit
      setInputError(lenCheck.reason || "Please refine your question.");
      return;
    }

    // Rate limit guard
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setInputError(rateCheck.reason || "Too many requests. Please try again later.");
      return;
    }

    setInputError(null);

    // Ensure we have a thread; keep the id locally so every message in this
    // send lands in the same thread even before React state settles.
    const threadId = currentThreadId ?? createNewThread(query);

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
    };

    addMessage(threadId, userMsg);
    setInput("");
    setIsTyping(true);

    // Scope / content guardrails
    const guard = checkQueryGuardrails(query);
    if (!guard.allowed) {
      addMessage(threadId, {
        id: generateId(),
        role: "assistant",
        content: guard.suggestedNote || "I can only assist with Indian labour law questions.",
        timestamp: new Date().toISOString(),
      });
      setIsTyping(false);
      return;
    }

    // Retrieve relevant legal chunks (RAG)
    const chunks = retrieveRelevantChunks(query, 4);

    // Ask for state clarification early in a conversation when profile is incomplete
    const needsClarify =
      (!profile.state || profile.state === "Other") &&
      !query.toLowerCase().match(/maharashtra|delhi|karnataka|gujarat|bengal|telangana|rajasthan|punjab|kerala|tamil/i) &&
      chunks.length > 0 &&
      messages.length < 3;

    if (needsClarify) {
      addMessage(threadId, {
        id: generateId(),
        role: "assistant",
        content: `To give you an accurate answer, could you confirm:\n• Your state\n• Whether you are an employee or employer/HR\n• Type of employment (permanent, contract, probation, etc.)\n\nYou can update your profile using the button above, or just reply with the details.`,
        timestamp: new Date().toISOString(),
      });
      setIsTyping(false);
      return;
    }

    // Build RAG context string for the API
    const ragContext = buildRagContext(chunks);

    // Max relevance score — tells the server whether to trigger web search
    const ragScore = chunks.length > 0 ? Math.max(...chunks.map((c) => c.relevance)) : 0;

    // Serialize recent history for the API (last 6 messages = 3 turns)
    const historyForApi = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Citations always come from the RAG chunks we already retrieved
    const citations: Array<{ act: string; section: string; source: string }> = chunks
      .slice(0, 3)
      .map((c) => ({ act: c.entry.act, section: c.entry.section, source: c.entry.source }));

    // Try the real AI endpoint; fall back to local grounded response on failure
    let finalContent: string;
    let usedWebSearch = false;
    let webSources: string[] = [];

    try {
      const res = await fetch("/api/labour-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, profile, history: historyForApi, ragContext, ragScore }),
      });

      if (res.ok) {
        const data = await res.json();
        finalContent = data.content || "";
        usedWebSearch = !!data.usedWebSearch;
        webSources = Array.isArray(data.webSources) ? data.webSources : [];
      } else {
        throw new Error("api_unavailable");
      }
    } catch {
      // Local grounded fallback (works without any API key)
      const local = generateGroundedResponse(query, profile, messages, chunks);
      const { response } = applyResponseGuardrails(local.content, citations.length > 0, local.escalation || guard.escalation);
      finalContent = response;
    }

    addMessage(threadId, {
      id: generateId(),
      role: "assistant",
      content: finalContent,
      citations: citations.length ? citations : undefined,
      usedWebSearch,
      webSources: webSources.length ? webSources : undefined,
      timestamp: new Date().toISOString(),
    });

    setIsTyping(false);
    textareaRef.current?.focus();
  }

  // Handle Enter key
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Quick start — sendMessage creates the thread itself when needed
  function useQuickStart(q: string) {
    sendMessage(q);
  }

  // Update profile
  function updateProfile(updates: Partial<Profile>) {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);

    // If current thread exists, optionally snapshot profile
    if (currentThreadId) {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === currentThreadId ? { ...t, profile: newProfile, updatedAt: new Date().toISOString() } : t
        )
      );
    }
  }

  // New chat button
  function handleNewChat() {
    createNewThread();
    setShowSidebar(true);
  }

  // Render message
  function renderMessage(msg: Message) {
    const isUser = msg.role === "user";

    return (
      <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed`}
          style={{
            background: isUser ? AMBER : "#f8fafc",
            color: isUser ? "#fff" : NAVY,
            border: isUser ? "none" : "1px solid rgba(15,42,74,0.08)",
          }}
        >
          <div className="whitespace-pre-wrap">{renderInlineMarkdown(msg.content)}</div>

          {/* RAG citations */}
          {msg.citations && msg.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(15,42,74,0.1)" }}>
              <div className="text-[10px] uppercase tracking-widest mb-1.5 opacity-60">Legal references</div>
              <div className="flex flex-wrap gap-1.5">
                {msg.citations.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-block text-[10px] px-2 py-0.5 rounded font-medium"
                    style={{ background: "rgba(15,42,74,0.06)", color: NAVY }}
                  >
                    {c.act} — {c.section}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Web sources */}
          {msg.webSources && msg.webSources.length > 0 && (
            <div className="mt-2 pt-2 border-t" style={{ borderColor: "rgba(15,42,74,0.1)" }}>
              <div className="text-[10px] uppercase tracking-widest mb-1.5 opacity-60 flex items-center gap-1">
                <span>🔍</span> Web sources
              </div>
              <div className="flex flex-col gap-1">
                {msg.webSources.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] truncate underline opacity-60 hover:opacity-100 transition"
                    style={{ color: NAVY }}
                  >
                    {url}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Web search badge */}
          {!isUser && msg.usedWebSearch && (
            <div className="mt-2">
              <span
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: "rgba(232,135,26,0.1)", color: AMBER }}
              >
                🔍 Supplemented with web search
              </span>
            </div>
          )}

          {/* Feedback for assistant */}
          {!isUser && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="opacity-50">{formatTime(msg.timestamp)}</span>
              <button
                onClick={() => setFeedback(msg.id, "up")}
                className={`px-1.5 py-0.5 rounded transition ${msg.feedback === "up" ? "bg-emerald-100" : "hover:bg-white/60"}`}
                title="Helpful"
              >
                👍
              </button>
              <button
                onClick={() => setFeedback(msg.id, "down")}
                className={`px-1.5 py-0.5 rounded transition ${msg.feedback === "down" ? "bg-red-100" : "hover:bg-white/60"}`}
                title="Not helpful"
              >
                👎
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const datasetUpdated = getDatasetLastUpdated();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white" style={{ color: NAVY }}>
      {/* Top bar */}
      <div className="border-b" style={{ borderColor: "rgba(15,42,74,0.08)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-[2px] uppercase" style={{ color: AMBER }}>SNSS Global Services</div>
            <h1 className="text-2xl font-bold tracking-tight">Labour Law Assist</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNewChat}
              className="px-4 py-2 text-sm font-bold rounded transition active:scale-[0.985]"
              style={{ background: NAVY, color: "#fff" }}
            >
              New Chat
            </button>

            <button
              onClick={() => setShowProfile(true)}
              className="px-4 py-2 text-sm font-medium rounded border transition hover:bg-slate-50"
              style={{ borderColor: "rgba(15,42,74,0.15)" }}
            >
              Profile: {profile.role} • {profile.state}
            </button>

            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden px-3 py-2 text-sm border rounded"
              style={{ borderColor: "rgba(15,42,74,0.15)" }}
            >
              {showSidebar ? "Hide" : "History"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[280px,1fr] gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {(showSidebar || isDesktop) && (
              <motion.aside
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="lg:block bg-white border rounded-xl p-4 self-start"
                style={{ borderColor: "rgba(15,42,74,0.1)" }}
              >
                <div className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(15,42,74,0.5)" }}>
                  Your Conversations
                </div>

                {threads.length === 0 && (
                  <div className="text-sm text-slate-500 py-6">No conversations yet. Start by asking a question below.</div>
                )}

                <div className="space-y-1 max-h-[420px] overflow-auto pr-1">
                  {threads.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => switchThread(t.id)}
                      className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition ${currentThreadId === t.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
                    >
                      <div className="truncate pr-2">{t.title}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteThread(t.id); }}
                        className="opacity-40 hover:opacity-100 text-xs px-1"
                        title="Delete thread"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t text-[11px] leading-relaxed" style={{ color: "rgba(15,42,74,0.45)", borderColor: "rgba(15,42,74,0.08)" }}>
                  Dataset last updated: {datasetUpdated}<br />
                  All information is for reference only.
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Chat Area */}
          <div className="flex flex-col min-h-[620px] bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "rgba(15,42,74,0.1)" }}>
            {/* Chat header */}
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ background: "rgba(15,42,74,0.02)", borderColor: "rgba(15,42,74,0.06)" }}>
              <div className="text-sm font-semibold">Ask about Indian labour law</div>
              <div className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(232,135,26,0.1)", color: AMBER }}>
                Grounded in curated legal data
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-5 space-y-1 bg-white" style={{ background: "#fafbfc" }}>
              {messages.length === 0 && (
                <div className="max-w-2xl mx-auto pt-8">
                  <div className="text-center mb-6">
                    <div className="inline-block px-3 py-1 text-xs tracking-widest rounded-full mb-3" style={{ background: "rgba(15,42,74,0.06)" }}>
                      FREE • INFORMATIONAL • NO ACCOUNT REQUIRED
                    </div>
                    <h2 className="text-2xl font-bold mb-2">What would you like to know?</h2>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Describe your workplace situation. I will ask clarifying questions when needed and cite the relevant law.
                    </p>
                  </div>

                  {/* Quick starts */}
                  <div className="grid sm:grid-cols-2 gap-2">
                    {ISSUE_QUICKSTARTS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => useQuickStart(q)}
                        className="text-left px-4 py-3 text-sm rounded-xl border transition hover:border-amber-200 hover:bg-white"
                        style={{ borderColor: "rgba(15,42,74,0.1)" }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500">{LABOUR_ASSIST_SHORT_DISCLAIMER}</p>
                  </div>
                </div>
              )}

              {messages.map(renderMessage)}

              {isTyping && (
                <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-2xl w-fit" style={{ background: "#f1f5f9", color: NAVY }}>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
                  Thinking…
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Disclaimer bar */}
            <div className="px-4 py-2 text-[11px] border-t" style={{ background: "rgba(15,42,74,0.015)", borderColor: "rgba(15,42,74,0.06)", color: "rgba(15,42,74,0.6)" }}>
              {LABOUR_ASSIST_SHORT_DISCLAIMER} Dataset: {datasetUpdated}. 
              <Link to="/contact" className="ml-1 underline">Talk to an SNSS expert</Link> for complex matters.
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white" style={{ borderColor: "rgba(15,42,74,0.08)" }}>
              {inputError && (
                <div
                  role="alert"
                  className="mb-2 px-3 py-2 text-xs rounded-lg border"
                  style={{ background: "rgba(220,38,38,0.05)", borderColor: "rgba(220,38,38,0.25)", color: "#b91c1c" }}
                >
                  {inputError}
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your situation (e.g. 'I was terminated without notice after 3 years in Mumbai')"
                  className="flex-1 resize-y min-h-[52px] max-h-32 rounded-2xl border px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: "rgba(15,42,74,0.15)" }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="self-end px-6 py-3 rounded-2xl text-sm font-bold transition disabled:opacity-50"
                  style={{ background: AMBER, color: "#fff" }}
                >
                  {isTyping ? "…" : "Send"}
                </button>
              </div>
              <div className="mt-2 text-[10px] text-center" style={{ color: "rgba(15,42,74,0.4)" }}>
                Press Enter to send. Shift+Enter for new line.
              </div>
            </div>
          </div>
        </div>

        {/* Full-width disclaimer */}
        <div className="mt-8 text-xs max-w-3xl mx-auto text-center leading-relaxed" style={{ color: "rgba(15,42,74,0.55)" }}>
          {LABOUR_ASSIST_DISCLAIMER}
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onClick={() => setShowProfile(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b" style={{ background: NAVY, color: "#fff" }}>
                <div className="font-semibold">Your Profile</div>
                <div className="text-xs opacity-70">Used to personalize answers. Change anytime.</div>
              </div>

              <div className="p-5 space-y-4 text-sm">
                <div>
                  <label className="block text-xs mb-1 opacity-70">Name (optional)</label>
                  <input
                    value={profile.name || ""}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1 opacity-70">I am</label>
                  <div className="flex gap-2">
                    {(["employee", "employer"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => updateProfile({ role: r })}
                        className={`flex-1 py-2 rounded border text-sm ${profile.role === r ? "font-semibold" : ""}`}
                        style={{
                          borderColor: profile.role === r ? AMBER : "rgba(15,42,74,0.15)",
                          background: profile.role === r ? "rgba(232,135,26,0.08)" : "white",
                        }}
                      >
                        {r === "employee" ? "Employee / Worker" : "Employer / HR"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs mb-1 opacity-70">State</label>
                  <select
                    value={profile.state}
                    onChange={(e) => updateProfile({ state: e.target.value })}
                    className="w-full border rounded px-3 py-2 bg-white"
                  >
                    {COMMON_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs mb-1 opacity-70">Sector / Industry (optional)</label>
                  <input
                    value={profile.sector || ""}
                    onChange={(e) => updateProfile({ sector: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. IT, Manufacturing, Retail"
                  />
                </div>
              </div>

              <div className="p-4 border-t flex justify-end gap-2 bg-slate-50">
                <button onClick={() => setShowProfile(false)} className="px-4 py-2 text-sm">Done</button>
                <button
                  onClick={() => {
                    setProfile(DEFAULT_PROFILE);
                    setShowProfile(false);
                  }}
                  className="px-4 py-2 text-sm text-red-600"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

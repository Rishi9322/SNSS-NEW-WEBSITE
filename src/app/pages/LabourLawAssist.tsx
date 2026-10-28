import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Container, PageHeader, Btn } from "../components/kit";
import { LABOUR_ASSIST_DISCLAIMER, LABOUR_ASSIST_SHORT_DISCLAIMER, DEFAULT_PROFILE, COMMON_STATES, ISSUE_QUICKSTARTS, ESCALATION_MESSAGE } from "../constants";
import { useSEO } from "../hooks/useSEO";
import { retrieveRelevantChunks, type DatasetEntry, getDatasetLastUpdated } from "../../lib/rag";
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
        body: JSON.stringify({ query, profile, history: historyForApi }),
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

  function clearAllChats() {
    if (!window.confirm("Delete all saved conversations on this device?")) return;
    setThreads([]);
    setCurrentThreadId(null);
    try { Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k)); } catch { /* storage blocked */ }
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
        <div className={`max-w-[88%] rounded-[10px] px-4 py-3 text-[15px] leading-relaxed ${isUser ? "bg-ink text-white" : "bg-concrete text-ink"}`}>
          <div className="whitespace-pre-wrap">{renderInlineMarkdown(msg.content)}</div>

          {/* RAG citations */}
          {msg.citations && msg.citations.length > 0 && (
            <div className="mt-3 border-t-2 border-ink pt-2">
              <div className="mb-1 text-sm font-bold">Legal references</div>
              <ul>
                {msg.citations.map((c, idx) => (
                  <li key={idx} className="border-b border-ink/20 py-1.5 text-sm text-steel last:border-b-0">
                    {c.act} — {c.section}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Web sources */}
          {msg.webSources && msg.webSources.length > 0 && (
            <div className="mt-2 border-t-2 border-ink pt-2">
              <div className="mb-1 text-sm font-bold">Web sources</div>
              <ul>
                {msg.webSources.map((url, idx) => (
                  <li key={idx} className="border-b border-ink/20 py-1.5 last:border-b-0">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="block truncate text-sm text-steel underline underline-offset-2 hover:text-ink">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Web search badge */}
          {!isUser && msg.usedWebSearch && (
            <div className="mt-2">
              <span className="inline-block rounded-[3px] bg-hivis px-2 py-0.5 text-sm font-semibold text-ink">Supplemented with web search</span>
            </div>
          )}

          {/* Feedback for assistant */}
          {!isUser && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-steel">{formatTime(msg.timestamp)}</span>
              <button
                onClick={() => setFeedback(msg.id, "up")}
                aria-pressed={msg.feedback === "up"}
                className={`min-h-[44px] rounded-[4px] border-2 border-ink px-3 font-semibold ${msg.feedback === "up" ? "bg-hivis text-ink" : "bg-white text-ink hover:bg-ink hover:text-white"}`}
              >
                Helpful
              </button>
              <button
                onClick={() => setFeedback(msg.id, "down")}
                aria-pressed={msg.feedback === "down"}
                className={`min-h-[44px] rounded-[4px] border-2 border-ink px-3 font-semibold ${msg.feedback === "down" ? "bg-hivis text-ink" : "bg-white text-ink hover:bg-ink hover:text-white"}`}
              >
                Not helpful
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const datasetUpdated = getDatasetLastUpdated();
  const outlineBtn = "inline-flex min-h-[48px] items-center rounded-[4px] border-2 border-ink px-4 text-[15px] font-bold text-ink hover:bg-ink hover:text-white";

  return (
    <div className="bg-white text-ink">
      <PageHeader
        path={[{ label: "Home", to: "/" }, { label: "Labour Law Assist" }]}
        title="Labour Law Assist"
        lede="Describe your workplace situation. I will ask clarifying questions when needed and cite the relevant law."
      />

      <Container className="py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Btn onClick={handleNewChat}>New Chat</Btn>
          <button onClick={() => setShowProfile(true)} className={outlineBtn}>
            Profile: {profile.role} • {profile.state}
          </button>
          <button onClick={() => setShowSidebar(!showSidebar)} className={`lg:hidden ${outlineBtn}`}>
            {showSidebar ? "Hide" : "History"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          {/* Sidebar */}
          <AnimatePresence>
            {(showSidebar || isDesktop) && (
              <motion.aside
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="self-start lg:block"
              >
                <div className="border-b-2 border-ink pb-2 text-lg font-bold">Your conversations</div>

                {threads.length === 0 && (
                  <div className="py-6 text-[15px] text-steel">No conversations yet. Start by asking a question below.</div>
                )}

                <ul className="max-h-[420px] overflow-auto">
                  {threads.map((t) => (
                    <li
                      key={t.id}
                      onClick={() => switchThread(t.id)}
                      className={`flex min-h-[48px] cursor-pointer items-center justify-between gap-2 border-b border-ink/20 px-2 text-[15px] ${currentThreadId === t.id ? "bg-concrete font-bold" : "hover:bg-concrete"}`}
                    >
                      <div className="truncate pr-2">{t.title}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteThread(t.id); }}
                        className="min-h-[44px] min-w-[44px] text-lg text-steel hover:text-ink"
                        title="Delete thread"
                        aria-label="Delete thread"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t-2 border-ink pt-3 text-sm leading-relaxed text-steel">
                  Dataset last updated: {datasetUpdated}<br />
                  All information is for reference only.<br />
                  Chats are saved only in this browser. Questions are sent to an AI service to generate answers.
                  {threads.length > 0 && (
                    <button onClick={clearAllChats} className="mt-2 block min-h-[44px] font-bold text-ink underline underline-offset-4">Clear all chats</button>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Chat Area */}
          <div className="flex min-h-[620px] flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-white">
            {/* Chat header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink px-5 py-3">
              <div className="font-bold">Ask about Indian labour law</div>
              <div className="rounded-[3px] bg-hivis px-2 py-0.5 text-sm font-semibold text-ink">Grounded in curated legal data</div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-1 overflow-auto bg-white p-5">
              {messages.length === 0 && (
                <div className="mx-auto max-w-2xl pt-4">
                  <div className="mb-6">
                    <p className="mb-3 text-sm font-bold text-steel">FREE • INFORMATIONAL • NO ACCOUNT REQUIRED</p>
                    <h2 className="display mb-2 text-[clamp(1.8rem,3.6vw,2.6rem)]">What would you like to know?</h2>
                    <p className="max-w-[60ch] text-[17px] text-steel">
                      Describe your workplace situation. I will ask clarifying questions when needed and cite the relevant law.
                    </p>
                  </div>

                  {/* Quick starts */}
                  <div className="flex flex-wrap gap-2">
                    {ISSUE_QUICKSTARTS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => useQuickStart(q)}
                        className="min-h-[44px] rounded-[4px] border-2 border-ink px-4 py-2 text-left text-[15px] font-semibold text-ink hover:bg-ink hover:text-white"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <p className="mt-8 text-sm text-steel">{LABOUR_ASSIST_SHORT_DISCLAIMER}</p>
                </div>
              )}

              {messages.map(renderMessage)}

              {isTyping && (
                <div className="flex w-fit items-center gap-2 rounded-[10px] bg-concrete px-4 py-2 text-[15px] text-ink">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  Thinking…
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Disclaimer bar */}
            <div className="border-t-2 border-ink bg-concrete px-4 py-3 text-sm text-steel">
              {LABOUR_ASSIST_SHORT_DISCLAIMER} Dataset: {datasetUpdated}.{" "}
              <Link to="/contact" className="font-bold text-ink underline underline-offset-4">Talk to an Sentinel expert</Link> for complex matters.
            </div>

            {/* Input */}
            <div className="border-t-2 border-ink bg-white p-4">
              {inputError && (
                <div role="alert" className="mb-2 rounded-[4px] border-2 border-red-700 bg-white px-3 py-2 text-sm font-semibold text-red-700">
                  {inputError}
                </div>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  aria-label="Your question"
                  placeholder="Describe your situation (e.g. 'I was terminated without notice after 3 years in Mumbai')"
                  className="max-h-32 min-h-[56px] flex-1 resize-y rounded-[4px] border-2 border-ink px-4 py-3 text-[16px] text-ink placeholder:text-steel focus:outline-2 focus:outline-offset-2 focus:outline-ink"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="min-h-[56px] self-end rounded-[4px] bg-hivis px-8 text-[15px] font-bold text-ink hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
                >
                  {isTyping ? "…" : "Send"}
                </button>
              </div>
              <div className="mt-2 text-sm text-steel">
                Press Enter to send. Shift+Enter for new line.
              </div>
            </div>
          </div>
        </div>

        {/* Full-width disclaimer */}
        <div className="mx-auto mt-8 max-w-3xl border-t-2 border-ink pt-4 text-sm leading-relaxed text-steel">
          {LABOUR_ASSIST_DISCLAIMER}
        </div>
      </Container>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-4" onClick={() => setShowProfile(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md overflow-hidden rounded-[10px] border-2 border-ink bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b-2 border-ink bg-hivis px-5 py-4 text-ink">
                <div className="display text-2xl">Your Profile</div>
                <div className="text-sm">Used to personalize answers. Change anytime.</div>
              </div>

              <div className="space-y-4 p-5 text-[15px]">
                <div>
                  <label className="mb-1 block text-sm font-bold">Name (optional)</label>
                  <input
                    value={profile.name || ""}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="min-h-[48px] w-full rounded-[4px] border-2 border-ink px-3 placeholder:text-steel"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold">I am</label>
                  <div className="flex gap-2">
                    {(["employee", "employer"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => updateProfile({ role: r })}
                        aria-pressed={profile.role === r}
                        className={`min-h-[48px] flex-1 rounded-[4px] border-2 border-ink text-[15px] font-bold ${profile.role === r ? "bg-ink text-white" : "bg-white text-ink"}`}
                      >
                        {r === "employee" ? "Employee / Worker" : "Employer / HR"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold">State</label>
                  <select
                    value={profile.state}
                    onChange={(e) => updateProfile({ state: e.target.value })}
                    className="min-h-[48px] w-full rounded-[4px] border-2 border-ink bg-white px-3"
                  >
                    {COMMON_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold">Sector / Industry (optional)</label>
                  <input
                    value={profile.sector || ""}
                    onChange={(e) => updateProfile({ sector: e.target.value })}
                    className="min-h-[48px] w-full rounded-[4px] border-2 border-ink px-3 placeholder:text-steel"
                    placeholder="e.g. IT, Manufacturing, Retail"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t-2 border-ink bg-concrete p-4">
                <button onClick={() => setShowProfile(false)} className="min-h-[48px] rounded-[4px] bg-hivis px-5 text-[15px] font-bold text-ink">Done</button>
                <button
                  onClick={() => {
                    setProfile(DEFAULT_PROFILE);
                    setShowProfile(false);
                  }}
                  className="min-h-[48px] rounded-[4px] border-2 border-ink px-5 text-[15px] font-bold text-ink"
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

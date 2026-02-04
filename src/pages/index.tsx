import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  NotebookPen,
  FileText,
  Brain,
} from "lucide-react";

/* ---------- Voir Dire Template ---------- */
/* ---------- Voir Dire Template (Generic Car Accident) ---------- */
const VOIR_DIRE_TEMPLATE = `VOIR DIRE SCRIPT – VEHICLE ACCIDENT (Plaintiff)

Good morning, everyone. My name is [Attorney Name], and along with my colleague, [Co-Counsel Name], we have the privilege of representing our client, [Client Name], in this case.

Let’s begin with a few introductions:
• Does anyone here know me, my co-counsel, or my client?

During this trial, you’ll hear from several witnesses, including the parties involved, law enforcement, medical professionals, and accident reconstruction experts.
• Does anyone here know or recognize any of the potential witnesses or experts who may testify?

The purpose of jury selection is not to pry into your personal lives, and there are no right or wrong answers. The only wrong answer would be not sharing your honest feelings.

Our goal in this process is to find jurors who can evaluate the evidence fairly and objectively, without favoring either side.

---

### FAIRNESS & PERSONAL EXPERIENCES

We all bring our life experiences into the courtroom. Sometimes, those experiences can shape how we view certain issues — and that’s okay. What matters is recognizing those biases and being honest about them.

Let me give you an example.

Imagine you’re judging a contest to find the best pizza. I love pizza, but I personally prefer thin crust. If I’m asked to judge between a deep-dish pizza and a thin-crust pizza, even if I try to be fair, my personal taste might influence my decision.

That doesn’t make me unfair — it makes me human. But it also means I should acknowledge that bias before judging the contest.

• Does everyone agree that self-awareness and honesty about our own preferences are essential to fairness?
• Can you all promise to be upfront if there’s anything in your background or experiences that might affect how you see this case?

---

### OVERVIEW OF THE CASE

This is a civil case involving a motor vehicle collision. The plaintiff alleges that the defendant’s negligence caused the crash and resulting injuries. The defendant disputes responsibility.

The question for this jury will be: what happened, who was at fault, and what is fair compensation if the plaintiff proves their case?

---

### FULL JUSTICE

If the plaintiff proves their case, the law requires that they receive **full and fair compensation** — not partial justice.

This is their only opportunity to be made whole. They can’t come back in five or ten years to ask for another chance. The verdict you render will be final.

• Does everyone agree that if the plaintiff proves their case, they’re entitled to full and fair compensation for their injuries?
• Does anyone believe there should be a cap on damages, regardless of the evidence?

---

### BURDEN OF PROOF

This is a civil case, not a criminal one. The burden of proof is **the greater weight of the evidence** — meaning just more likely than not.

It’s not “beyond a reasonable doubt.” Think of it as one side’s scale tipping slightly more than the other.

• Does everyone understand that “more likely than not” is a lower standard than in a criminal case?
• Does anyone feel that both sides should have to prove their case equally?

---

### FEELINGS ABOUT PERSONAL INJURY CASES

How many of you have personal or philosophical feelings about injury or accident lawsuits?

• Some people believe there are too many lawsuits.
• Others may think people are too quick to claim injury.
• Some may feel large verdicts raise insurance rates or hurt businesses.

There are no wrong answers — but we need to know how you feel.

• Who here feels skeptical about personal injury claims in general?
• For those who do, can you share why?
• Would those feelings make it harder for you to evaluate this case fairly?

---

### DAMAGES & MONEY

Some people are uncomfortable talking about money or awarding it as damages. Others feel pain and suffering are difficult to measure.

• Does anyone here feel uneasy about awarding money for pain, suffering, or the loss of enjoyment of life?
• Would anyone have difficulty awarding the full amount if the evidence supports it?

Remember, damages are how the civil justice system measures accountability and fairness — they are the only way to restore what has been lost.

---

### MEDICAL CARE & INJURIES

This case involves claims of physical injuries, such as neck and back pain, possibly from herniated discs or soft-tissue trauma.

• Has anyone here or someone close to you ever suffered a neck or back injury?
• What kind of treatment did they receive — physical therapy, chiropractic care, injections, or surgery?
• Did you feel those treatments were reasonable and helpful?

• Does anyone here believe that soft-tissue or “invisible” injuries are less serious than those that show up on an X-ray?
• Does anyone feel chiropractic treatment isn’t real medicine or isn’t effective?

---

### LIABILITY & RESPONSIBILITY

We’ll hear evidence about how this crash occurred. There may be conflicting testimony about who was at fault and what the traffic laws required.

• Has anyone here ever been involved in a car crash — as a driver, passenger, or pedestrian?
• How was that experience handled?
• Did it shape how you think about accident cases?

• Do you believe that if two drivers make mistakes, neither should recover?
• Do you believe people should always “walk it off” rather than seek medical care?

---

### JUDGING THE PLAINTIFF

During this trial, my client will be sitting right over there. At first glance, they may look fine — able to move, talk, and smile.

But looks can be deceiving. Some injuries, especially to the spine or soft tissue, aren’t always visible.

• Can everyone agree not to judge my client’s pain based solely on appearance or body language?
• Can you promise to wait until all the evidence is presented before forming an opinion?

---

### EMPLOYMENT, INSURANCE & HEALTHCARE CONNECTIONS

Does anyone here, or someone close to you, work in:
• Insurance claims or underwriting?
• Law enforcement or legal defense?
• The healthcare field — particularly orthopedics, physical therapy, or pain management?

If so:
• Do you think those experiences might influence how you view this type of case?
• Could you still evaluate the evidence fairly and independently?

---

### FAIRNESS & OPEN-MINDEDNESS

At the end of this trial, the judge will instruct you on the law, and your duty will be to apply it — even if you personally disagree with it.

• Can everyone commit to following the law as instructed, even if it doesn’t align with your personal beliefs?
• Can you promise to keep an open mind until the very end of the case?

---

### FINAL QUESTIONS

Before we conclude:
• Is there anything about your background, experiences, or beliefs that might make it difficult to sit as a fair and impartial juror?
• Is there anything I haven’t asked that you think we should know about?

On behalf of my client and our team, thank you for your honesty and your time. We appreciate your willingness to serve and your commitment to fairness.`;

type StrikeType = "none" | "peremptory" | "for_cause";

/* ---------- Demo seed ---------- */
const NAMES = [
  "Alice","Bob","Carol","David","Emma","Frank","Grace","Hank","Ivy","Jack",
  "Kate","Leo","Mia","Nick","Olivia","Paul","Quinn","Rose","Sam","Tina",
  "Uma","Vince","Wendy","Xander","Yara","Zane","Aaron","Bella","Cody","Diana",
];

export default function JuryMessagingApp() {
  /* ---------- State ---------- */
  const jurors = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: NAMES[i] })),
    []
  );

  const initialMessages: Record<number, { text: string; sender: string }[]> = {
    1: [{ text: "Close the loop here on this juror.", sender: "Team" }],
    3: [{ text: "Seems hesitant about corporate responsibility.", sender: "Paralegal" }],
    7: [{ text: "Juror smiled when opposing counsel spoke.", sender: "Assistant" }],
    10: [{ text: "Strong opinions on law enforcement — potential bias.", sender: "Team" }],
    14: [{ text: "Check body language again during next round.", sender: "Lead Counsel" }],
  };

  const [selectedJuror, setSelectedJuror] = useState<number | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [unread, setUnread] = useState<Record<number, boolean>>({ 1: true, 3: true, 7: true, 10: true, 14: true });
  const [approvals, setApprovals] = useState<Record<number, { lead: boolean; second: boolean }>>({});
  const [strike, setStrike] = useState<Record<number, StrikeType>>({});
  const [staffNotes, setStaffNotes] = useState("");
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [notesCollapsed, setNotesCollapsed] = useState(false);

  // Tabs + Script
  const [activeTab, setActiveTab] = useState<"script" | "juror">("script");
  const [scriptText, setScriptText] = useState(VOIR_DIRE_TEMPLATE);

  // AI drawer
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  // Storage
  const STORAGE_KEY = "juryStateV3";
  const SCRIPT_KEY = "voirDireScriptV1";

  /* ---------- Load / Save ---------- */
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.approvals) setApprovals(parsed.approvals);
        if (parsed.strike) setStrike(parsed.strike);
        if (parsed.staffNotes) setStaffNotes(parsed.staffNotes);
      } catch {}
    }
    const s = localStorage.getItem(SCRIPT_KEY);
    if (s) setScriptText(s);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages, approvals, strike, staffNotes })
    );
  }, [messages, approvals, strike, staffNotes]);

  useEffect(() => {
    localStorage.setItem(SCRIPT_KEY, scriptText);
  }, [scriptText]);

  /* ---------- Helpers ---------- */
  const isApproved = (id: number) => !!approvals[id]?.lead && !!approvals[id]?.second;

  const handleSelectJuror = (id: number) => {
    setSelectedJuror(id);
    setActiveTab("juror");
    setUnread((prev) => ({ ...prev, [id]: false }));
  };

  const handleSend = () => {
    if (!newMessage.trim() || selectedJuror === null) return;
    setMessages((prev) => ({
      ...prev,
      [selectedJuror]: [...(prev[selectedJuror] || []), { text: newMessage, sender: "You" }],
    }));
    setNewMessage("");
  };

  const toggleApproval = (id: number, role: "lead" | "second") => {
    setApprovals((prev) => ({
      ...prev,
      [id]: { lead: prev[id]?.lead || false, second: prev[id]?.second || false, [role]: !prev[id]?.[role] },
    }));
  };

  const setStrikeType = (id: number, value: StrikeType) => {
    setStrike((prev) => ({ ...prev, [id]: value }));
  };

  const buildCSV = () => {
    const headers = ["juror_id", "name", "approved", "strike_type", "unread", "message_count", "last_message"];
    const rows = jurors.map((j) => {
      const approved = isApproved(j.id);
      const unreadFlag = !!unread[j.id];
      const list = messages[j.id] || [];
      const last = list.length ? list[list.length - 1].text : "";
      return [j.id, j.name, approved, strike[j.id] || "none", unreadFlag, list.length, last].join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  };

  const downloadCSV = () => {
    const csv = buildCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jury_selection.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SCRIPT_KEY);
    window.location.reload();
  };

  /* ---------- AI suggestions (calls /api/suggest) ---------- */
  useEffect(() => {
    if (!selectedJuror) return;

    const recent = (messages[selectedJuror] || []).slice(-5);
    const chatText = recent.map((m) => `${m.sender}: ${m.text}`).join("\n");
    const notesSnippet = staffNotes.slice(0, 800);
    if (!chatText && !notesSnippet) {
      setAiSuggestions([]);
      return;
    }

    const payload = { recentChat: chatText, notes: notesSnippet };

    const t = setTimeout(async () => {
      try {
        setAiLoading(true);
        setAiError(null);
        const res = await fetch("/api/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setAiSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      } catch (e: any) {
        setAiError("Failed to load suggestions");
        setAiSuggestions([]);
      } finally {
        setAiLoading(false);
      }
    }, 600);

    return () => clearTimeout(t);
  }, [selectedJuror, staffNotes, messages]);

  /* ---------- Grid: numbers start bottom-left ---------- */
  const COLUMNS = 7;
  const totalRows = Math.ceil(jurors.length / COLUMNS);
  const totalCells = totalRows * COLUMNS;
  const gridCells: (typeof jurors[number] | null)[] = Array(totalCells).fill(null);
  jurors.forEach((j) => {
    const col = (j.id - 1) % COLUMNS;                      // 0..6
    const rFromBottom = Math.floor((j.id - 1) / COLUMNS);  // 0 = bottom row
    const rFromTop = (totalRows - 1) - rFromBottom;
    gridCells[rFromTop * COLUMNS + col] = j;
  });

  /* ---------- Render ---------- */
  return (
    <div className="relative p-4 h-screen bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden text-black">
      <style jsx global>{`
        @keyframes softPulse { 0%{background:#fee2e2;} 50%{background:#fff;} 100%{background:#fee2e2;} }
        .pulse-red { animation: softPulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* Logo */}
      <div className="absolute top-3 right-6">
        <div className="relative w-[200px] h-[70px]">
          <Image src="/logo.png" alt="Light & Wyatt" fill className="object-contain" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 h-full pt-20">
        {/* LEFT COLUMN: summary + grid */}
        <div className="col-span-1 flex flex-col overflow-hidden">
          {/* Notification summary */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-100 to-transparent pb-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <div className="rounded-md border bg-white px-2 py-1">New msgs: {Object.values(unread).filter(Boolean).length}</div>
              <div className="rounded-md border bg-white px-2 py-1">Approved: {jurors.filter(j => isApproved(j.id)).length}</div>
              <div className="rounded-md border bg-white px-2 py-1">Struck (Peremptory): {Object.values(strike).filter(s => s === "peremptory").length}</div>
              <div className="rounded-md border bg-white px-2 py-1">Struck (For Cause): {Object.values(strike).filter(s => s === "for_cause").length}</div>
            </div>
          </div>

          {/* Grid anchored to bottom */}
          <div
            className="grid grid-cols-7 gap-2 overflow-y-auto overflow-x-visible pb-8 place-content-end"
            style={{ gridAutoRows: "6.5rem" }}
          >
            {gridCells.map((cell, idx) => {
              if (!cell) return <div key={`empty-${idx}`} className="invisible" />;
              const j = cell;
              const selected = selectedJuror === j.id;
              const unreadFlag = unread[j.id];
              const approved = isApproved(j.id);
              const strikeType = (strike[j.id] || "none") as StrikeType;
              const isStruck = strikeType !== "none";

              const borderColor = isStruck
                ? "border-red-600"
                : approved
                ? "border-green-600"
                : unreadFlag
                ? "border-red-600"
                : selected
                ? "border-blue-600"
                : "border-gray-300 hover:border-gray-400";

              const bgClass = isStruck
                ? "bg-red-100"
                : approved
                ? "bg-green-100"
                : unreadFlag
                ? "pulse-red"
                : "bg-white";

              return (
                <Card
                  key={j.id}
                  onClick={() => handleSelectJuror(j.id)}
                  className={`relative flex flex-col items-center justify-center text-center border-2 rounded-lg shadow-sm transition-all hover:shadow-md ${borderColor} ${bgClass}`}
                >
                  {/* Big X overlay when struck */}
                  {isStruck && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="text-black font-extrabold text-8xl leading-none select-none opacity-60">×</span>
                    </div>
                  )}

                  <CardContent className="p-2 text-sm font-medium flex flex-col items-center">
                    <User className="w-6 h-6 text-gray-700 mb-1" />
                    <div className="font-semibold text-gray-800 leading-tight">{j.name}</div>
                    <div className="text-xs text-gray-500">Juror {j.id}</div>
                    {!isStruck && !approved && unreadFlag && (
                      <div className="text-xs text-red-600 mt-1">New msg</div>
                    )}
                    {approved && !isStruck && (
                      <div className="text-xs text-green-700 mt-1">Approved</div>
                    )}
                    {isStruck && (
                      <div className="text-[11px] text-red-700 mt-1">
                        {strikeType === "peremptory" ? "Struck — Peremptory" : "Struck — For Cause"}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* RIGHT: tabs + panel */}
        <div className="col-span-2 flex flex-col bg-white rounded-xl shadow p-4 relative h-full">
          {/* Top actions */}
          <div className="mb-3 flex items-center gap-2">
            <button
              className={`px-3 py-1.5 text-sm rounded border ${activeTab==='script' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'}`}
              onClick={() => { setActiveTab('script'); setSelectedJuror(null); }}
            >
              <span className="inline-flex items-center gap-1"><FileText className="w-4 h-4" /> Voir Dire Script</span>
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded border ${activeTab==='juror' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('juror')}
              disabled={selectedJuror == null}
              title={selectedJuror == null ? 'Select a juror from the left' : ''}
            >
              Juror Panel
            </button>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="secondary" onClick={() => setAiOpen(v => !v)}>
                <Brain className="w-4 h-4 mr-1" /> AI
              </Button>
              <Button variant="secondary" onClick={downloadCSV}>Export CSV</Button>
              <Button variant="outline" className="text-red-600" onClick={resetDemo}>Reset Demo</Button>
            </div>
          </div>

          {/* Script Tab */}
          {activeTab === "script" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">Vehicle Accident – Voir Dire Script</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setScriptText(VOIR_DIRE_TEMPLATE)}>Reset to template</Button>
                </div>
              </div>
              <textarea
                className="w-full h-full p-3 text-sm border rounded resize-none bg-gray-50 text-gray-800"
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Type or edit your voir dire script here…"
              />
            </div>
          )}

          {/* Juror Tab */}
          {activeTab === "juror" && selectedJuror ? (
            <motion.div
              key={selectedJuror}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              className="flex flex-col flex-1 min-h-0"
            >
              {/* Header: approvals + strike */}
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {jurors.find((j) => j.id === selectedJuror)?.name}
                </h2>

                <div className="bg-gray-50 border rounded-md px-3 py-2 flex items-center gap-3 text-sm shadow-sm text-black">
                  <div className="font-medium">Select Juror</div>

                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-green-600"
                      checked={!!approvals[selectedJuror]?.lead}
                      onChange={() => toggleApproval(selectedJuror, "lead")}
                    />
                    Lead
                  </label>

                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-green-600"
                      checked={!!approvals[selectedJuror]?.second}
                      onChange={() => toggleApproval(selectedJuror, "second")}
                    />
                    Second
                  </label>

                  {/* Strike */}
                  <label className="inline-flex items-center gap-2">
                    <span>Strike:</span>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={strike[selectedJuror] || "none"}
                      onChange={(e) => setStrikeType(selectedJuror, e.target.value as StrikeType)}
                    >
                      <option value="none">None</option>
                      <option value="peremptory">Peremptory</option>
                      <option value="for_cause">For Cause</option>
                    </select>
                  </label>

                  {isApproved(selectedJuror) && (strike[selectedJuror] || "none") === "none" && (
                    <span className="text-green-700 font-medium">✓ Both approved</span>
                  )}
                </div>
              </div>

              {/* Split view */}
              <div className="flex flex-col flex-1 min-h-0">
                {/* Chat header */}
                <button
                  onClick={() => setChatCollapsed((v) => !v)}
                  className="flex items-center justify-between mb-1 w-full bg-gray-100 rounded px-2 py-1 border hover:bg-gray-200"
                  aria-expanded={!chatCollapsed}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <MessageSquare className="w-4 h-4" /> Chat
                  </span>
                  {chatCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>

                {/* Chat */}
                <div className={`transition-all duration-300 ${chatCollapsed ? "h-10" : notesCollapsed ? "flex-1" : "h-[45%]"}`}>
                  {!chatCollapsed && (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50">
                        {(messages[selectedJuror] || []).map((m, i) => (
                          <div key={i} className="mb-1 text-sm text-gray-800">
                            <strong>{m.sender}: </strong>{m.text}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          aria-label="Chat message"
                          className="text-gray-800 placeholder-gray-500"
                          placeholder="Type a message to your team about this juror…"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button onClick={handleSend}>Send</Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes header */}
                <button
                  onClick={() => setNotesCollapsed((v) => !v)}
                  className="mt-3 flex items-center justify-between w-full bg-gray-100 rounded px-2 py-1 border hover:bg-gray-200"
                  aria-expanded={!notesCollapsed}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <NotebookPen className="w-4 h-4" /> Staff Notes (shared)
                  </span>
                  {notesCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>

                {/* Notes */}
                <div className={`mt-1 transition-all duration-300 ${notesCollapsed ? "h-10" : chatCollapsed ? "flex-1" : "h-[45%]"}`}>
                  {!notesCollapsed && (
                    <textarea
                      className="w-full h-full p-2 text-sm border rounded resize-none bg-gray-50 text-gray-800 placeholder-gray-500"
                      placeholder="Add shared notes here..."
                      value={staffNotes}
                      onChange={(e) => setStaffNotes(e.target.value)}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ) : activeTab === "juror" ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a juror from the left.
            </div>
          ) : null}
        </div>
      </div>

      {/* AI Drawer */}
      {aiOpen && (
        <div className="absolute right-0 top-0 w-[340px] h-full bg-white border-l shadow-xl p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">AI Suggestions</h3>
            <Button size="sm" onClick={() => setAiOpen(false)}>Close</Button>
          </div>

          {!selectedJuror ? (
            <p className="text-gray-500">Select a juror to generate context-based suggestions.</p>
          ) : aiLoading ? (
            <p className="text-gray-500">Analyzing juror context…</p>
          ) : aiError ? (
            <p className="text-red-600">{aiError}</p>
          ) : aiSuggestions.length ? (
            <ul className="space-y-3">
              {aiSuggestions.map((s, i) => (
                <li key={i} className="border rounded p-2 bg-gray-50">
                  <div className="text-sm mb-2">{s}</div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setNewMessage((prev) => (prev ? prev + " " + s : s));
                        setActiveTab("juror");
                      }}
                    >
                      Use in Chat
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setStaffNotes((prev) => (prev ? prev + "\n• " + s : "• " + s));
                        setActiveTab("juror");
                      }}
                    >
                      Add to Notes
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No suggestions yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
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
  Settings,
  X,
  Plus,
  Trash2,
  Scale,
  Shield,
  Users,
  Sun,
  Moon,
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
  const [jurors, setJurors] = useState(() => {
    const initialSize = 7 * 5; // gridColumns * gridRows
    return Array.from({ length: initialSize }, (_, i) => ({ id: i + 1, name: NAMES[i % NAMES.length], deleted: false }));
  });
  const [draggedJuror, setDraggedJuror] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  type MessageType = 'normal' | 'alert' | 'flag';
  type Message = { text: string; sender: string; type: MessageType; timestamp: number };

  const initialMessages: Record<number, Message[]> = {
    1: [{ text: "Close the loop here on this juror.", sender: "Team", type: "normal", timestamp: Date.now() - 3600000 }],
    3: [{ text: "Seems hesitant about corporate responsibility.", sender: "Paralegal", type: "alert", timestamp: Date.now() - 7200000 }],
    7: [{ text: "Juror smiled when opposing counsel spoke.", sender: "Assistant", type: "flag", timestamp: Date.now() - 1800000 }],
    10: [{ text: "Strong opinions on law enforcement — potential bias.", sender: "Team", type: "alert", timestamp: Date.now() - 5400000 }],
    14: [{ text: "Check body language again during next round.", sender: "Lead Counsel", type: "normal", timestamp: Date.now() - 900000 }],
  };

  const [selectedJuror, setSelectedJuror] = useState<number | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>('normal');
  const [unread, setUnread] = useState<Record<number, boolean>>({ 1: true, 3: true, 7: true, 10: true, 14: true });
  const [approvals, setApprovals] = useState<Record<number, { lead: boolean; second: boolean }>>({});
  const [strike, setStrike] = useState<Record<number, StrikeType>>({});
  const [strikeParty, setStrikeParty] = useState<Record<number, 'plaintiff' | 'defense' | null>>({});
  const [scores, setScores] = useState<Record<number, number>>({});
  const [staffNotes, setStaffNotes] = useState("");
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [notesCollapsed, setNotesCollapsed] = useState(false);

  // Strike tracker state
  const [maxPeremptory, setMaxPeremptory] = useState(6);
  const [plaintiffPeremptory, setPlaintiffPeremptory] = useState(0);
  const [defensePeremptory, setDefensePeremptory] = useState(0);
  const [plaintiffCause, setPlaintiffCause] = useState(0);
  const [defenseCause, setDefenseCause] = useState(0);
  const maxPeremptoryStrikes = maxPeremptory;

  // Tabs + Script
  const [activeTab, setActiveTab] = useState<"script" | "juror" | "compare">("script");
  const [scriptText, setScriptText] = useState(VOIR_DIRE_TEMPLATE);

  // AI drawer
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  // Juror editing
  const [editingName, setEditingName] = useState(false);
  const [editingNumber, setEditingNumber] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempNumber, setTempNumber] = useState("");

  // Theme
  const [darkMode, setDarkMode] = useState(false);

  // Settings modal
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [caseName, setCaseName] = useState("Vehicle Accident Case");
  const [gridColumns, setGridColumns] = useState(7);
  const [gridRows, setGridRows] = useState(5);
  const [gridStartPosition, setGridStartPosition] = useState<"bottom-left" | "bottom-right" | "top-left" | "top-right">("bottom-left");
  const [seatedJurySize, setSeatedJurySize] = useState(12);
  const [alternateCount, setAlternateCount] = useState(2);
  const [teamMembers, setTeamMembers] = useState([
    { name: "Lead Counsel", role: "attorney" },
    { name: "Co-Counsel", role: "attorney" },
  ]);

  // Temporary string states for number inputs to allow free typing
  const [gridColumnsInput, setGridColumnsInput] = useState(String(gridColumns));
  const [gridRowsInput, setGridRowsInput] = useState(String(gridRows));
  const [seatedJurySizeInput, setSeatedJurySizeInput] = useState(String(seatedJurySize));
  const [alternateCountInput, setAlternateCountInput] = useState(String(alternateCount));
  const [maxPeremptoryInput, setMaxPeremptoryInput] = useState(String(maxPeremptory));

  // Compare jurors (up to 6)
  const [compareJurors, setCompareJurors] = useState<number[]>([]);

  // Notifications
  type Notification = { id: number; jurorId: number; jurorName: string; message: string; type: MessageType };
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Storage
  const STORAGE_KEY = "juryStateV3";
  const SCRIPT_KEY = "voirDireScriptV1";
  const SETTINGS_KEY = "caseSettingsV1";

  /* ---------- Load / Save ---------- */
  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save and apply theme when it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.approvals) setApprovals(parsed.approvals);
        if (parsed.strike) setStrike(parsed.strike);
        if (parsed.strikeParty) setStrikeParty(parsed.strikeParty);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.staffNotes) setStaffNotes(parsed.staffNotes);
        if (parsed.plaintiffPeremptory !== undefined) setPlaintiffPeremptory(parsed.plaintiffPeremptory);
        if (parsed.defensePeremptory !== undefined) setDefensePeremptory(parsed.defensePeremptory);
        if (parsed.plaintiffCause !== undefined) setPlaintiffCause(parsed.plaintiffCause);
        if (parsed.defenseCause !== undefined) setDefenseCause(parsed.defenseCause);
      } catch {}
    }
    const s = localStorage.getItem(SCRIPT_KEY);
    if (s) setScriptText(s);

    const settings = localStorage.getItem(SETTINGS_KEY);
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.caseName) setCaseName(parsed.caseName);
        if (parsed.gridColumns) setGridColumns(parsed.gridColumns);
        if (parsed.gridRows) setGridRows(parsed.gridRows);
        if (parsed.gridStartPosition) setGridStartPosition(parsed.gridStartPosition);
        if (parsed.maxPeremptory) setMaxPeremptory(parsed.maxPeremptory);
        if (parsed.seatedJurySize) setSeatedJurySize(parsed.seatedJurySize);
        if (parsed.alternateCount) setAlternateCount(parsed.alternateCount);
        if (parsed.teamMembers) setTeamMembers(parsed.teamMembers);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        messages, approvals, strike, strikeParty, scores, staffNotes,
        plaintiffPeremptory, defensePeremptory, plaintiffCause, defenseCause
      })
    );
  }, [messages, approvals, strike, strikeParty, scores, staffNotes, plaintiffPeremptory, defensePeremptory, plaintiffCause, defenseCause]);

  useEffect(() => {
    localStorage.setItem(SCRIPT_KEY, scriptText);
  }, [scriptText]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      caseName, gridColumns, gridRows, gridStartPosition, maxPeremptory, seatedJurySize, alternateCount, teamMembers
    }));
  }, [caseName, gridColumns, gridRows, gridStartPosition, maxPeremptory, seatedJurySize, alternateCount, teamMembers]);

  // Resize jurors array when grid size changes
  useEffect(() => {
    const newSize = gridColumns * gridRows;
    if (newSize !== jurors.length) {
      setJurors(prevJurors => {
        if (newSize > prevJurors.length) {
          // Add more jurors
          const additionalJurors = Array.from({ length: newSize - prevJurors.length }, (_, i) => ({
            id: prevJurors.length + i + 1,
            name: NAMES[(prevJurors.length + i) % NAMES.length],
            deleted: false
          }));
          return [...prevJurors, ...additionalJurors];
        } else {
          // Remove excess jurors
          return prevJurors.slice(0, newSize);
        }
      });
    }
  }, [gridColumns, gridRows]);

  /* ---------- Helpers ---------- */
  const isApproved = (id: number) => !!approvals[id]?.lead && !!approvals[id]?.second;

  const getScore = (id: number) => scores[id] || 5;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 5) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/20 border-emerald-500/40';
    if (score >= 5) return 'bg-amber-500/20 border-amber-500/40';
    return 'bg-red-500/20 border-red-500/40';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/20 border-emerald-500/40';
    if (score >= 5) return 'bg-amber-500/20 border-amber-500/40';
    return 'bg-red-500/20 border-red-500/40';
  };

  const handleStrike = (id: number, type: StrikeType, party: 'plaintiff' | 'defense') => {
    const currentStrike = strike[id];
    const currentParty = strikeParty[id];

    // If removing strike
    if (currentStrike !== 'none' && currentStrike === type) {
      setStrike((prev) => ({ ...prev, [id]: 'none' }));
      setStrikeParty((prev) => ({ ...prev, [id]: null }));

      // Decrement strike counter
      if (currentStrike === 'peremptory' && currentParty) {
        if (currentParty === 'plaintiff') {
          setPlaintiffPeremptory(Math.max(0, plaintiffPeremptory - 1));
        } else {
          setDefensePeremptory(Math.max(0, defensePeremptory - 1));
        }
      } else if (currentStrike === 'for_cause' && currentParty) {
        if (currentParty === 'plaintiff') {
          setPlaintiffCause(Math.max(0, plaintiffCause - 1));
        } else {
          setDefenseCause(Math.max(0, defenseCause - 1));
        }
      }
      return;
    }

    // Check if can strike (for peremptory only)
    if (type === 'peremptory') {
      const current = party === 'plaintiff' ? plaintiffPeremptory : defensePeremptory;
      if (current >= maxPeremptoryStrikes) {
        alert(`${party === 'plaintiff' ? 'Plaintiff' : 'Defense'} has no remaining peremptory strikes.`);
        return;
      }
    }

    // Remove previous strike if exists
    if (currentStrike !== 'none' && currentParty) {
      if (currentStrike === 'peremptory') {
        if (currentParty === 'plaintiff') {
          setPlaintiffPeremptory(Math.max(0, plaintiffPeremptory - 1));
        } else {
          setDefensePeremptory(Math.max(0, defensePeremptory - 1));
        }
      } else if (currentStrike === 'for_cause') {
        if (currentParty === 'plaintiff') {
          setPlaintiffCause(Math.max(0, plaintiffCause - 1));
        } else {
          setDefenseCause(Math.max(0, defenseCause - 1));
        }
      }
    }

    // Apply new strike
    setStrike((prev) => ({ ...prev, [id]: type }));
    setStrikeParty((prev) => ({ ...prev, [id]: party }));

    // Increment strike counter
    if (type === 'peremptory') {
      if (party === 'plaintiff') {
        setPlaintiffPeremptory(plaintiffPeremptory + 1);
      } else {
        setDefensePeremptory(defensePeremptory + 1);
      }
    } else if (type === 'for_cause') {
      if (party === 'plaintiff') {
        setPlaintiffCause(plaintiffCause + 1);
      } else {
        setDefenseCause(defenseCause + 1);
      }
    }
  };

  const updateScore = (id: number, score: number) => {
    const validScore = Math.max(1, Math.min(10, score));
    setScores((prev) => ({ ...prev, [id]: validScore }));
  };

  const updateJurorName = (id: number, newName: string) => {
    setJurors((prev) => prev.map((j) => (j.id === id ? { ...j, name: newName } : j)));
  };

  const updateJurorId = (oldId: number, newId: number) => {
    // Prevent duplicate IDs
    if (jurors.some((j) => j.id === newId && j.id !== oldId)) {
      alert(`Juror #${newId} already exists!`);
      return;
    }

    // Update juror ID
    const juror = jurors.find((j) => j.id === oldId);
    if (!juror) return;

    // Update all related state with new ID
    setJurors((prev) => prev.map((j) => (j.id === oldId ? { ...j, id: newId } : j)));

    // Transfer messages
    setMessages((prev) => {
      const { [oldId]: oldMessages, ...rest } = prev;
      return oldMessages ? { ...rest, [newId]: oldMessages } : rest;
    });

    // Transfer other state
    setUnread((prev) => {
      const { [oldId]: oldUnread, ...rest } = prev;
      return oldUnread !== undefined ? { ...rest, [newId]: oldUnread } : rest;
    });

    setStrike((prev) => {
      const { [oldId]: oldStrike, ...rest } = prev;
      return oldStrike ? { ...rest, [newId]: oldStrike } : rest;
    });

    setStrikeParty((prev) => {
      const { [oldId]: oldParty, ...rest } = prev;
      return oldParty ? { ...rest, [newId]: oldParty } : rest;
    });

    setScores((prev) => {
      const { [oldId]: oldScore, ...rest } = prev;
      return oldScore !== undefined ? { ...rest, [newId]: oldScore } : rest;
    });

    setApprovals((prev) => {
      const { [oldId]: oldApproval, ...rest } = prev;
      return oldApproval ? { ...rest, [newId]: oldApproval } : rest;
    });

    // Update selected juror if needed
    if (selectedJuror === oldId) {
      setSelectedJuror(newId);
    }
  };

  const deleteJuror = (id: number) => {
    if (confirm(`Are you sure you want to delete juror #${id} (${jurors.find(j => j.id === id)?.name})?`)) {
      // Mark juror as deleted (becomes empty square)
      setJurors((prev) => prev.map((j) => (j.id === id ? { ...j, deleted: true } : j)));

      // Clear all data for this juror
      setMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[id];
        return newMessages;
      });
      setUnread((prev) => {
        const newUnread = { ...prev };
        delete newUnread[id];
        return newUnread;
      });
      setApprovals((prev) => {
        const newApprovals = { ...prev };
        delete newApprovals[id];
        return newApprovals;
      });
      setStrike((prev) => {
        const newStrike = { ...prev };
        delete newStrike[id];
        return newStrike;
      });
      setStrikeParty((prev) => {
        const newParty = { ...prev };
        delete newParty[id];
        return newParty;
      });
      setScores((prev) => {
        const newScores = { ...prev };
        delete newScores[id];
        return newScores;
      });

      // Close the juror panel if this juror was selected
      if (selectedJuror === id) {
        setSelectedJuror(null);
        setActiveTab('script');
      }
    }
  };

  const restoreJuror = (id: number) => {
    setJurors(jurors.map(j => j.id === id ? { ...j, deleted: false } : j));
  };

  const handleSelectJuror = (id: number) => {
    const juror = jurors.find(j => j.id === id);
    if (juror?.deleted) return; // Don't select deleted jurors

    // If compare tab is active, add/remove from comparison
    if (activeTab === "compare") {
      if (compareJurors.includes(id)) {
        setCompareJurors(compareJurors.filter(jid => jid !== id));
      } else if (compareJurors.length < 6) {
        setCompareJurors([...compareJurors, id].sort((a, b) => a - b));
      }
    } else {
      // Normal juror selection
      setSelectedJuror(id);
      setActiveTab("juror");
      setUnread((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleEmptySquareClick = (id: number) => {
    const juror = jurors.find(j => j.id === id);
    if (juror?.deleted) {
      // Restore deleted juror
      restoreJuror(id);
    }
  };

  // Drag and drop handlers - FIXED to allow dropping in empty slots
  const handleDragStart = (e: React.DragEvent, jurorId: number) => {
    const juror = jurors.find(j => j.id === jurorId);
    if (juror?.deleted) return; // Don't allow dragging deleted jurors
    setDraggedJuror(jurorId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedJuror === null) return;

    const draggedJurorObj = jurors.find(j => j.id === draggedJuror);
    if (!draggedJurorObj) return;

    const targetCell = gridCells[targetIndex];

    // If target is empty (null or deleted), move the juror there
    if (!targetCell || targetCell.deleted) {
      // Calculate new position based on grid layout
      const col = targetIndex % COLUMNS;
      const rFromTop = Math.floor(targetIndex / COLUMNS);
      const rFromBottom = (totalRows - 1) - rFromTop;
      const newId = (rFromBottom * COLUMNS) + col + 1;

      // Only update if the new ID is different from current ID
      if (newId !== draggedJuror) {
        // Check if target position already has a juror (even if deleted)
        const existingJuror = jurors.find(j => j.id === newId);
        if (existingJuror) {
          // If there's a deleted juror, swap IDs
          if (existingJuror.deleted) {
            const draggedIndex = jurors.findIndex(j => j.id === draggedJuror);
            const targetIndex = jurors.findIndex(j => j.id === newId);

            const newJurors = [...jurors];
            const tempId = newJurors[draggedIndex].id;
            newJurors[draggedIndex] = { ...newJurors[draggedIndex], id: newId };
            newJurors[targetIndex] = { ...newJurors[targetIndex], id: tempId };
            setJurors(newJurors);
          }
        } else {
          // Safe to update ID - no conflict
          updateJurorId(draggedJuror, newId);
        }
      }
    } else {
      // Swap with existing juror
      const draggedIndex = jurors.findIndex(j => j.id === draggedJuror);
      const targetJurorIndex = jurors.findIndex(j => j.id === targetCell.id);

      if (draggedIndex !== -1 && targetJurorIndex !== -1 && draggedIndex !== targetJurorIndex) {
        // Swap the IDs to swap positions in the grid
        const newJurors = [...jurors];
        const tempId = newJurors[draggedIndex].id;
        newJurors[draggedIndex] = { ...newJurors[draggedIndex], id: newJurors[targetJurorIndex].id };
        newJurors[targetJurorIndex] = { ...newJurors[targetJurorIndex], id: tempId };
        setJurors(newJurors);
      }
    }

    setDraggedJuror(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedJuror(null);
    setDragOverIndex(null);
  };

  const handleSend = () => {
    if (!newMessage.trim() || selectedJuror === null) return;

    const newMsg = {
      text: newMessage,
      sender: "You",
      type: messageType,
      timestamp: Date.now()
    };

    setMessages((prev) => ({
      ...prev,
      [selectedJuror]: [...(prev[selectedJuror] || []), newMsg],
    }));

    // Show notification
    const jurorName = jurors.find(j => j.id === selectedJuror)?.name || `Juror #${selectedJuror}`;
    const notifId = Date.now();
    setNotifications(prev => [...prev, {
      id: notifId,
      jurorId: selectedJuror,
      jurorName,
      message: newMessage,
      type: messageType
    }]);

    // Auto-dismiss notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notifId));
    }, 5000);

    setNewMessage("");
    setMessageType('normal');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  /* ---------- Grid: dynamic starting position ---------- */
  const COLUMNS = gridColumns;
  const totalRows = gridRows;
  const totalCells = totalRows * COLUMNS;
  const gridCells: (typeof jurors[number] | null)[] = Array(totalCells).fill(null);

  jurors.forEach((j) => {
    let gridIndex: number;
    const jurorIndex = j.id - 1;
    const col = jurorIndex % COLUMNS;
    const row = Math.floor(jurorIndex / COLUMNS);

    switch (gridStartPosition) {
      case "bottom-left":
        // Start bottom-left, go right then up
        gridIndex = (totalRows - 1 - row) * COLUMNS + col;
        break;
      case "bottom-right":
        // Start bottom-right, go left then up
        gridIndex = (totalRows - 1 - row) * COLUMNS + (COLUMNS - 1 - col);
        break;
      case "top-left":
        // Start top-left, go right then down
        gridIndex = row * COLUMNS + col;
        break;
      case "top-right":
        // Start top-right, go left then down
        gridIndex = row * COLUMNS + (COLUMNS - 1 - col);
        break;
      default:
        gridIndex = (totalRows - 1 - row) * COLUMNS + col;
    }

    gridCells[gridIndex] = j;
  });

  /* ---------- Keyboard shortcuts ---------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete or Backspace key to delete selected juror
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedJuror) {
        // Don't delete if user is typing in an input field
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        e.preventDefault();
        deleteJuror(selectedJuror);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedJuror]);

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

  /* ---------- Render ---------- */
  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden text-white flex flex-col">
      <style jsx global>{`
        @keyframes subtleGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 12px 2px rgba(251, 191, 36, 0.2); }
        }
        .glow-amber { animation: subtleGlow 2.5s ease-in-out infinite; }
      `}</style>

      {/* Header Bar with Case Name */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">{caseName}</h1>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">Jury Selection Panel</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setDarkMode(!darkMode)}
              className="bg-slate-700/50 border-slate-600/40 hover:bg-slate-700 text-slate-300 font-semibold text-xs h-8 px-2.5"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
            <Button variant="secondary" onClick={() => setSettingsOpen(true)} className="bg-slate-700/50 border-slate-600/40 hover:bg-slate-700 text-slate-300 font-semibold text-xs h-8 px-2.5">
              <Settings className="w-3.5 h-3.5 mr-1.5" /> Settings
            </Button>
            <Button variant="secondary" onClick={() => setAiOpen(v => !v)} className="bg-slate-700/50 border-slate-600/40 hover:bg-slate-700 text-amber-400 font-semibold text-xs h-8 px-2.5">
              <Brain className="w-3.5 h-3.5 mr-1.5" /> AI
            </Button>
            <Button variant="secondary" onClick={downloadCSV} className="bg-slate-700/50 border-slate-600/40 hover:bg-slate-700 text-slate-300 font-semibold text-xs h-8 px-2.5">Export CSV</Button>
            <Button variant="outline" className="text-red-400 border-red-500/40 hover:bg-red-950/30 font-semibold text-xs h-8 px-2.5" onClick={resetDemo}>Reset</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 h-[calc(100%-80px)] p-4">
        {/* LEFT COLUMN: strike tracker + grid */}
        <div className="col-span-1 flex flex-col h-full">
          {/* Strike Tracker - Static at top */}
          <div className="flex-shrink-0 mb-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-slate-600/40 p-4 shadow-xl">
              <h2 className="text-sm font-bold text-slate-300 mb-3 tracking-tight">Strike Tracker</h2>
              <div className="grid grid-cols-2 gap-3">
                {/* Plaintiff */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Scale className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-slate-300 font-semibold">Plaintiff</span>
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-slate-400">Peremptory</span>
                        <span className={`text-[10px] font-bold ${(maxPeremptoryStrikes - plaintiffPeremptory) > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                          {plaintiffPeremptory} of {maxPeremptoryStrikes} used
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${(plaintiffPeremptory / maxPeremptoryStrikes) * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">For Cause</span>
                      <span className="text-[10px] font-bold text-slate-300">{plaintiffCause}</span>
                    </div>
                  </div>
                </div>

                {/* Defense */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Shield className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-slate-300 font-semibold">Defense</span>
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-slate-400">Peremptory</span>
                        <span className={`text-[10px] font-bold ${(maxPeremptoryStrikes - defensePeremptory) > 0 ? 'text-red-400' : 'text-red-600'}`}>
                          {defensePeremptory} of {maxPeremptoryStrikes} used
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all" style={{ width: `${(defensePeremptory / maxPeremptoryStrikes) * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">For Cause</span>
                      <span className="text-[10px] font-bold text-slate-300">{defenseCause}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Grid */}
          <div className="flex-1 overflow-y-auto overflow-x-visible">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`, gridAutoRows: "6.5rem" }}
            >
            {gridCells.map((cell, idx) => {
              if (!cell) return <div key={`empty-${idx}`} className="invisible" />;
              const j = cell;

              // If juror is deleted, show empty square with add option
              if (j.deleted) {
                return (
                  <div
                    key={j.id}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onClick={() => handleEmptySquareClick(j.id)}
                    className={`relative flex flex-col items-center justify-center text-center border rounded-lg shadow-lg border-slate-700/30 bg-slate-900/30 backdrop-blur-sm cursor-pointer hover:border-amber-500/40 hover:bg-slate-800/40 transition-all group ${dragOverIndex === idx ? 'ring-2 ring-amber-500' : ''}`}
                  >
                    <Plus className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors mb-1" />
                    <div className="text-slate-600 group-hover:text-slate-400 text-[10px] font-semibold transition-colors">Add Juror</div>
                    <div className="text-slate-700 group-hover:text-slate-500 text-[8px] mt-0.5 transition-colors">#{j.id}</div>
                  </div>
                );
              }

              const selected = selectedJuror === j.id;
              const unreadFlag = unread[j.id];
              const approved = isApproved(j.id);
              const strikeType = (strike[j.id] || "none") as StrikeType;
              const isStruck = strikeType !== "none";
              const isInComparison = compareJurors.includes(j.id);

              const borderColor = isStruck
                ? "border-red-500/50"
                : approved
                ? "border-emerald-500/50"
                : isInComparison && activeTab === "compare"
                ? "border-blue-500 ring-2 ring-blue-400/50"
                : selected
                ? "border-amber-400"
                : unreadFlag
                ? "border-amber-400/60 glow-amber"
                : "border-slate-600/40 hover:border-slate-500/60";

              const bgClass = isStruck
                ? "bg-gradient-to-br from-slate-800/50 to-red-900/30"
                : approved
                ? "bg-gradient-to-br from-slate-800/50 to-emerald-900/30"
                : unreadFlag
                ? "bg-gradient-to-br from-slate-800 to-slate-700"
                : "bg-gradient-to-br from-slate-800 to-slate-700";

              const messageCount = messages[j.id]?.length || 0;

              return (
                <Card
                  key={j.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, j.id)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleSelectJuror(j.id)}
                  className={`relative flex flex-col items-center justify-center text-center border rounded-lg shadow-lg transition-all cursor-move hover:shadow-2xl hover:scale-[1.03] backdrop-blur-sm ${borderColor} ${bgClass} ${draggedJuror === j.id ? 'opacity-50' : ''} ${dragOverIndex === idx ? 'ring-2 ring-amber-500' : ''}`}
                >
                  {/* Struck overlay with refined design */}
                  {isStruck && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-red-950/40">
                      <div className="w-full h-0.5 bg-red-500 rotate-45 scale-150"></div>
                    </div>
                  )}

                  {/* Unread message indicator */}
                  {!isStruck && unreadFlag && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
                      <span className="text-slate-900 text-[10px] font-bold">{messageCount}</span>
                    </div>
                  )}

                  <CardContent className="p-3.5 text-sm font-medium flex flex-col items-center gap-1 relative z-10 w-full">
                    {/* Juror number badge - smaller, top-left */}
                    <div className="absolute top-1 left-1 text-[8px] font-bold text-slate-500 bg-slate-900/50 px-1.5 py-0.5 rounded">
                      #{j.id}
                    </div>

                    {/* Score badge - smaller, bottom-left */}
                    {!isStruck && (
                      <div className={`absolute bottom-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-900/50 ${getScoreColor(getScore(j.id))}`}>
                        {getScore(j.id)}
                      </div>
                    )}

                    {/* Name - prominent display */}
                    <div className="font-bold text-white leading-tight mt-3 text-base tracking-tight">{j.name}</div>

                    {/* Status indicators */}
                    <div className="flex flex-col gap-1 mt-1 w-full items-center">
                      {approved && !isStruck && (
                        <div className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/40 uppercase tracking-wider">
                          Approved
                        </div>
                      )}
                      {isStruck && (
                        <div className="px-2.5 py-0.5 bg-red-500/20 text-red-300 text-[10px] font-bold rounded border border-red-500/40 uppercase tracking-wider">
                          {strikeType === "peremptory" ? "Struck" : "Cause"}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          </div>
        </div>

        {/* RIGHT: tabs + panel */}
        <div className="col-span-2 flex flex-col bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-2xl border border-slate-600/40 p-3 relative h-full">
          {/* Tabs */}
          <div className="mb-2 flex items-center gap-2">
            <button
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all uppercase tracking-wide ${activeTab==='script' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 border-amber-600 shadow-lg shadow-amber-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600/40 hover:border-amber-500/50 hover:bg-slate-700'}`}
              onClick={() => setActiveTab('script')}
            >
              <span className="inline-flex items-center gap-1.5"><FileText className="w-3 h-3" /> Voir Dire Script</span>
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all uppercase tracking-wide ${activeTab==='juror' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 border-amber-600 shadow-lg shadow-amber-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600/40 hover:border-amber-500/50 hover:bg-slate-700'} ${selectedJuror == null ? 'opacity-40 cursor-not-allowed' : ''}`}
              onClick={() => selectedJuror && setActiveTab('juror')}
              title={selectedJuror == null ? 'Select a juror from the left' : ''}
            >
              Juror Panel
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all uppercase tracking-wide ${activeTab==='compare' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 border-amber-600 shadow-lg shadow-amber-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600/40 hover:border-amber-500/50 hover:bg-slate-700'}`}
              onClick={() => setActiveTab('compare')}
            >
              <span className="inline-flex items-center gap-1.5"><Users className="w-3 h-3" /> Compare Jurors</span>
            </button>
          </div>

          {/* Script Tab */}
          {activeTab === "script" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-white tracking-tight">Vehicle Accident – Voir Dire Script</h2>
                <div className="flex gap-1.5">
                  <Button onClick={() => setScriptText(VOIR_DIRE_TEMPLATE)} className="bg-slate-700/50 border-slate-600/40 hover:bg-slate-700 text-slate-300 font-semibold text-xs h-8 px-2.5">Reset to template</Button>
                </div>
              </div>
              <textarea
                className="w-full h-full p-3 text-xs border border-slate-600/40 rounded-lg resize-none bg-slate-900/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 font-mono leading-snug"
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
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col gap-0.5">
                  {/* Editable Name */}
                  {editingName ? (
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={() => {
                        if (tempName.trim()) {
                          updateJurorName(selectedJuror, tempName.trim());
                        }
                        setEditingName(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (tempName.trim()) {
                            updateJurorName(selectedJuror, tempName.trim());
                          }
                          setEditingName(false);
                        } else if (e.key === 'Escape') {
                          setEditingName(false);
                        }
                      }}
                      autoFocus
                      className="text-base font-bold bg-slate-900/50 border-amber-500 text-white h-7 w-48"
                    />
                  ) : (
                    <h2
                      className="text-base font-bold text-white hover:text-amber-400 cursor-pointer transition-colors"
                      onClick={() => {
                        setTempName(jurors.find((j) => j.id === selectedJuror)?.name || "");
                        setEditingName(true);
                      }}
                      title="Click to edit name"
                    >
                      {jurors.find((j) => j.id === selectedJuror)?.name}
                    </h2>
                  )}

                  {/* Editable Number */}
                  {editingNumber ? (
                    <Input
                      value={tempNumber}
                      onChange={(e) => setTempNumber(e.target.value)}
                      onBlur={() => {
                        const newId = parseInt(tempNumber);
                        if (!isNaN(newId) && newId > 0) {
                          updateJurorId(selectedJuror, newId);
                        }
                        setEditingNumber(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const newId = parseInt(tempNumber);
                          if (!isNaN(newId) && newId > 0) {
                            updateJurorId(selectedJuror, newId);
                          }
                          setEditingNumber(false);
                        } else if (e.key === 'Escape') {
                          setEditingNumber(false);
                        }
                      }}
                      autoFocus
                      type="number"
                      className="text-xs bg-slate-900/50 border-amber-500 text-slate-300 h-6 w-28"
                    />
                  ) : (
                    <span
                      className="text-xs text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
                      onClick={() => {
                        setTempNumber(selectedJuror.toString());
                        setEditingNumber(true);
                      }}
                      title="Click to edit juror number"
                    >
                      Juror #{selectedJuror}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-lg border font-bold text-sm ${getScoreBg(getScore(selectedJuror))} ${getScoreColor(getScore(selectedJuror))}`}>
                    {getScore(selectedJuror)}/10
                  </div>
                  <Button
                    onClick={() => deleteJuror(selectedJuror)}
                    variant="outline"
                    className="bg-red-950/30 border-red-500/40 hover:bg-red-900/50 text-red-400 font-semibold text-xs h-8 px-2.5"
                  >
                    Delete Juror
                  </Button>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">

                {/* LEFT COLUMN - STAFF NOTES (Full Height, Most Important) */}
                <div className="flex flex-col min-h-0">
                  <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-xl border border-slate-600/40 p-3 shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <NotebookPen className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-bold text-white">Staff Notes</h3>
                        <span className="text-[10px] text-slate-400 bg-slate-900/50 px-1.5 py-0.5 rounded-full">
                          Shared with team
                        </span>
                      </div>
                      <button
                        onClick={() => setNotesCollapsed((v) => !v)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {notesCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                      </button>
                    </div>

                    {!notesCollapsed && (
                      <div className="flex-1 min-h-[200px]">
                        <textarea
                          className="w-full h-full p-3 text-xs border border-slate-700/50 rounded-lg resize-none bg-slate-950/30 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 leading-snug"
                          placeholder="Document key observations, concerns, or strategy notes about this juror. These notes are shared with your entire team..."
                          value={staffNotes}
                          onChange={(e) => setStaffNotes(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN - MESSAGES (Top Half) + CONTROLS (Bottom Half) */}
                <div className="flex flex-col min-h-0 space-y-3">
                  {/* Messages - Larger Size */}
                  <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-xl border border-slate-600/40 p-3 shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Team Communication</h3>
                        <span className="text-[10px] text-slate-400 bg-slate-900/50 px-1.5 py-0.5 rounded-full">
                          {(messages[selectedJuror] || []).length}
                        </span>
                      </div>
                    </div>

                    {/* Message Type Selector */}
                    <div className="flex gap-1.5 mb-2">
                      <button
                        onClick={() => setMessageType('normal')}
                        className={`flex-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          messageType === 'normal'
                            ? 'bg-slate-600 text-white border-2 border-slate-500'
                            : 'bg-slate-900/30 text-slate-400 border border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        💬 Normal
                      </button>
                      <button
                        onClick={() => setMessageType('alert')}
                        className={`flex-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          messageType === 'alert'
                            ? 'bg-amber-600 text-white border-2 border-amber-500'
                            : 'bg-slate-900/30 text-slate-400 border border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        ⚠️ Alert
                      </button>
                      <button
                        onClick={() => setMessageType('flag')}
                        className={`flex-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          messageType === 'flag'
                            ? 'bg-red-600 text-white border-2 border-red-500'
                            : 'bg-slate-900/30 text-slate-400 border border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        🚩 Flag
                      </button>
                    </div>

                    {/* Messages Display */}
                    <div className="flex-1 overflow-y-auto border border-slate-700/50 rounded-lg p-2 bg-slate-950/30 mb-2 space-y-1">
                      {(messages[selectedJuror] || []).length === 0 ? (
                        <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                          No messages yet. Start a conversation.
                        </div>
                      ) : (
                        (messages[selectedJuror] || []).map((m, i) => {
                          const messageTypeColors = {
                            normal: 'bg-slate-800/50 border-slate-700',
                            alert: 'bg-amber-950/30 border-amber-700/50',
                            flag: 'bg-red-950/30 border-red-700/50'
                          };
                          const iconEmoji = {
                            normal: '💬',
                            alert: '⚠️',
                            flag: '🚩'
                          };

                          return (
                            <div key={i} className={`p-1.5 rounded-lg border ${messageTypeColors[m.type]}`}>
                              <div className="flex items-start justify-between mb-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs">{iconEmoji[m.type]}</span>
                                  <span className="text-xs font-bold text-amber-400">{m.sender}</span>
                                </div>
                                <span className="text-[9px] text-slate-500">{formatTimestamp(m.timestamp)}</span>
                              </div>
                              <p className="text-xs text-slate-200 leading-snug">{m.text}</p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="flex flex-col gap-1.5">
                      <Input
                        aria-label="Chat message"
                        className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder-slate-500 focus:ring-amber-500/50 focus:border-amber-500/50 h-8 text-xs"
                        placeholder={`Send ${messageType === 'alert' ? 'an alert' : messageType === 'flag' ? 'a flag' : 'a message'}...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      />
                      <Button
                        onClick={handleSend}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold h-8 text-xs"
                        disabled={!newMessage.trim()}
                      >
                        Send {messageType === 'alert' ? 'Alert' : messageType === 'flag' ? 'Flag' : 'Message'}
                      </Button>
                    </div>
                  </div>

                  {/* Score & Strike Management - Below Messages */}
                  <div className="flex flex-col space-y-2">
                    {/* Score Slider */}
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600/40">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300">Juror Rating</label>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={getScore(selectedJuror)}
                        onChange={(e) => updateScore(selectedJuror, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 mt-1.5 px-1">
                        <span className="text-red-400">Unfavorable</span>
                        <span className="text-amber-400">Neutral</span>
                        <span className="text-emerald-400">Favorable</span>
                      </div>
                    </div>

                    {/* Strike Management */}
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600/40">
                      <h3 className="text-xs font-semibold text-slate-300 mb-2">Strike Management</h3>
                      <div className="space-y-2">
                        {/* Plaintiff Strikes */}
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase mb-1 block">Plaintiff</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleStrike(selectedJuror, 'peremptory', 'plaintiff')}
                              className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                                strike[selectedJuror] === 'peremptory' && strikeParty[selectedJuror] === 'plaintiff'
                                  ? 'bg-blue-600 text-white border-blue-700'
                                  : 'bg-slate-700/50 text-slate-300 border-slate-600/40 hover:bg-slate-700'
                              } border`}
                            >
                              Peremptory ({maxPeremptoryStrikes - plaintiffPeremptory} left)
                            </button>
                            <button
                              onClick={() => handleStrike(selectedJuror, 'for_cause', 'plaintiff')}
                              className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                                strike[selectedJuror] === 'for_cause' && strikeParty[selectedJuror] === 'plaintiff'
                                  ? 'bg-blue-600 text-white border-blue-700'
                                  : 'bg-slate-700/50 text-slate-300 border-slate-600/40 hover:bg-slate-700'
                              } border`}
                            >
                              For Cause
                            </button>
                          </div>
                        </div>

                        {/* Defense Strikes */}
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase mb-1 block">Defense</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleStrike(selectedJuror, 'peremptory', 'defense')}
                              className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                                strike[selectedJuror] === 'peremptory' && strikeParty[selectedJuror] === 'defense'
                                  ? 'bg-red-600 text-white border-red-700'
                                  : 'bg-slate-700/50 text-slate-300 border-slate-600/40 hover:bg-slate-700'
                              } border`}
                            >
                              Peremptory ({maxPeremptoryStrikes - defensePeremptory} left)
                            </button>
                            <button
                              onClick={() => handleStrike(selectedJuror, 'for_cause', 'defense')}
                              className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                                strike[selectedJuror] === 'for_cause' && strikeParty[selectedJuror] === 'defense'
                                  ? 'bg-red-600 text-white border-red-700'
                                  : 'bg-slate-700/50 text-slate-300 border-slate-600/40 hover:bg-slate-700'
                              } border`}
                            >
                              For Cause
                            </button>
                          </div>
                        </div>

                        {/* Current Strike Status */}
                        {strike[selectedJuror] && strike[selectedJuror] !== 'none' && (
                          <div className="mt-3 p-3 bg-red-950/30 border border-red-500/30 rounded-lg">
                            <div className="text-xs text-red-300">
                              <strong>Struck:</strong> {strike[selectedJuror] === 'peremptory' ? 'Peremptory' : 'For Cause'} by {strikeParty[selectedJuror] === 'plaintiff' ? 'Plaintiff' : 'Defense'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "juror" ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-lg">
              Select a juror from the grid to view details.
            </div>
          ) : activeTab === "compare" ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="mb-3">
                <h2 className="text-sm font-bold text-white tracking-tight mb-1">Compare Jurors</h2>
                <p className="text-xs text-slate-400">
                  Click or drag jurors from the grid to compare (up to 6 jurors)
                  {compareJurors.length > 0 && ` • ${compareJurors.length} selected`}
                </p>
              </div>

              {compareJurors.length > 0 ? (
                <div
                  className="flex-1 overflow-y-auto"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedJuror !== null && compareJurors.length < 6 && !compareJurors.includes(draggedJuror)) {
                      setCompareJurors([...compareJurors, draggedJuror].sort((a, b) => a - b));
                    }
                  }}
                >
                  <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(compareJurors.length, 3)}, minmax(0, 1fr))` }}>
                    {compareJurors.sort((a, b) => a - b).map(jurorId => {
                      const juror = jurors.find(j => j.id === jurorId);
                      if (!juror || juror.deleted) return null;
                      const score = getScore(juror.id);
                      const jurorMessages = messages[juror.id] || [];

                      return (
                        <div key={juror.id} className="bg-slate-900/50 rounded-xl border border-slate-600/40 overflow-hidden">
                          {/* Juror Header */}
                          <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600/40 relative">
                            <button
                              onClick={() => setCompareJurors(compareJurors.filter(id => id !== juror.id))}
                              className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-600/40 transition-colors"
                            >
                              <X className="w-3 h-3 text-slate-400 hover:text-white" />
                            </button>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-slate-400">#{String(juror.id).padStart(3, '0')}</span>
                              <span className="text-sm font-bold text-white">{juror.name}</span>
                            </div>
                            <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold border ${getScoreBgColor(score)}`}>
                              <span className={getScoreColor(score)}>{score}/10</span>
                            </div>
                          </div>

                          {/* Juror Details */}
                          <div className="p-3 space-y-3 text-xs">
                            {/* Rating Score */}
                            <div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Rating</div>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] text-slate-400">Juror Score</span>
                                <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}/10</span>
                              </div>
                            </div>

                            {/* Approval Status */}
                            <div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Approval</div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-400">Lead Counsel</span>
                                  <span className={approvals[juror.id]?.lead ? 'text-emerald-400' : 'text-slate-500'}>
                                    {approvals[juror.id]?.lead ? '✓ Approved' : '○ Pending'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-400">Co-Counsel</span>
                                  <span className={approvals[juror.id]?.second ? 'text-emerald-400' : 'text-slate-500'}>
                                    {approvals[juror.id]?.second ? '✓ Approved' : '○ Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Strike Status */}
                            {strike[juror.id] && strike[juror.id] !== 'none' && (
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Strike</div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-red-950/50 border border-red-500/40 rounded text-[11px] text-red-300 font-semibold">
                                    {strike[juror.id] === 'peremptory' ? 'Peremptory' : 'For Cause'} - {strikeParty[juror.id] === 'plaintiff' ? 'Plaintiff' : 'Defense'}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Messages */}
                            {jurorMessages.length > 0 ? (
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Team Messages ({jurorMessages.length})</div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {jurorMessages.slice(-4).map((msg, idx) => (
                                    <div key={idx} className="text-[10px] bg-slate-800/50 rounded p-2 border-l-2 border-amber-500/30">
                                      <div className="font-semibold text-slate-300 mb-0.5">{msg.sender}</div>
                                      <div className="text-slate-400">{msg.text}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-slate-500 text-[11px]">No team messages yet</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div
                  className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-600/40 rounded-lg"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedJuror !== null && !compareJurors.includes(draggedJuror)) {
                      setCompareJurors([draggedJuror].sort((a, b) => a - b));
                    }
                  }}
                >
                  <Users className="w-16 h-16 mb-3 opacity-30" />
                  <p className="text-sm font-semibold mb-1">No jurors selected</p>
                  <p className="text-xs text-slate-500">Click jurors in the grid or drag them here to compare</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl border border-slate-600/40 w-full max-w-2xl max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-600/40">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white">Case Settings</h2>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-600/40 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-140px)]">
              <div className="space-y-4">
                {/* Case Information */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600/40">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Case Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Case Name</label>
                      <Input
                        value={caseName}
                        onChange={(e) => setCaseName(e.target.value)}
                        className="bg-slate-950/30 border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500/50 focus:border-amber-500/50"
                        placeholder="Enter case name..."
                      />
                    </div>
                  </div>
                </div>

                {/* Grid Configuration */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600/40">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-400" />
                    Grid Layout
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Columns</label>
                      <Input
                        type="text"
                        value={gridColumnsInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGridColumnsInput(val);

                          // Update the actual number state if valid
                          if (val === '') {
                            return;
                          }
                          const num = parseInt(val);
                          if (!isNaN(num) && num >= 3 && num <= 10) {
                            setGridColumns(num);
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.target.value;
                          if (val === '' || isNaN(parseInt(val)) || parseInt(val) < 3) {
                            setGridColumns(3);
                            setGridColumnsInput('3');
                          } else if (parseInt(val) > 10) {
                            setGridColumns(10);
                            setGridColumnsInput('10');
                          } else {
                            setGridColumnsInput(String(gridColumns));
                          }
                        }}
                        className="bg-slate-950/30 border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500/50 focus:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Rows</label>
                      <Input
                        type="text"
                        value={gridRowsInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGridRowsInput(val);

                          // Update the actual number state if valid
                          if (val === '') {
                            return;
                          }
                          const num = parseInt(val);
                          if (!isNaN(num) && num >= 3 && num <= 10) {
                            setGridRows(num);
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.target.value;
                          if (val === '' || isNaN(parseInt(val)) || parseInt(val) < 3) {
                            setGridRows(3);
                            setGridRowsInput('3');
                          } else if (parseInt(val) > 10) {
                            setGridRows(10);
                            setGridRowsInput('10');
                          } else {
                            setGridRowsInput(String(gridRows));
                          }
                        }}
                        className="bg-slate-950/30 border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500/50 focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-slate-300 mb-2 block">Grid Start Position</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setGridStartPosition("top-left")}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          gridStartPosition === "top-left"
                            ? 'bg-amber-500 text-slate-900 border-2 border-amber-400'
                            : 'bg-slate-700/50 text-slate-300 border border-slate-600/40 hover:border-amber-500/50'
                        }`}
                      >
                        Top Left
                      </button>
                      <button
                        onClick={() => setGridStartPosition("top-right")}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          gridStartPosition === "top-right"
                            ? 'bg-amber-500 text-slate-900 border-2 border-amber-400'
                            : 'bg-slate-700/50 text-slate-300 border border-slate-600/40 hover:border-amber-500/50'
                        }`}
                      >
                        Top Right
                      </button>
                      <button
                        onClick={() => setGridStartPosition("bottom-left")}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          gridStartPosition === "bottom-left"
                            ? 'bg-amber-500 text-slate-900 border-2 border-amber-400'
                            : 'bg-slate-700/50 text-slate-300 border border-slate-600/40 hover:border-amber-500/50'
                        }`}
                      >
                        Bottom Left
                      </button>
                      <button
                        onClick={() => setGridStartPosition("bottom-right")}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          gridStartPosition === "bottom-right"
                            ? 'bg-amber-500 text-slate-900 border-2 border-amber-400'
                            : 'bg-slate-700/50 text-slate-300 border border-slate-600/40 hover:border-amber-500/50'
                        }`}
                      >
                        Bottom Right
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Total jury pool size: {gridColumns * gridRows} jurors
                  </p>
                </div>

                {/* Jury Configuration */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600/40">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    Jury Configuration
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Seated Jury Size</label>
                      <Input
                        type="text"
                        value={seatedJurySizeInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSeatedJurySizeInput(val);

                          // Update the actual number state if valid
                          if (val === '') {
                            return;
                          }
                          const num = parseInt(val);
                          if (!isNaN(num) && num >= 6 && num <= 24) {
                            setSeatedJurySize(num);
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.target.value;
                          if (val === '' || isNaN(parseInt(val)) || parseInt(val) < 6) {
                            setSeatedJurySize(6);
                            setSeatedJurySizeInput('6');
                          } else if (parseInt(val) > 24) {
                            setSeatedJurySize(24);
                            setSeatedJurySizeInput('24');
                          } else {
                            setSeatedJurySizeInput(String(seatedJurySize));
                          }
                        }}
                        className="bg-slate-950/30 border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500/50 focus:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Alternates</label>
                      <Input
                        type="text"
                        value={alternateCountInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAlternateCountInput(val);

                          // Update the actual number state if valid
                          if (val === '') {
                            return;
                          }
                          const num = parseInt(val);
                          if (!isNaN(num) && num >= 0 && num <= 6) {
                            setAlternateCount(num);
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.target.value;
                          if (val === '' || isNaN(parseInt(val)) || parseInt(val) < 0) {
                            setAlternateCount(0);
                            setAlternateCountInput('0');
                          } else if (parseInt(val) > 6) {
                            setAlternateCount(6);
                            setAlternateCountInput('6');
                          } else {
                            setAlternateCountInput(String(alternateCount));
                          }
                        }}
                        className="bg-slate-950/30 border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500/50 focus:border-amber-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Strike Configuration */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600/40">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-400" />
                    Peremptory Challenges
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Maximum Per Side</label>
                    <Input
                      type="text"
                      value={maxPeremptoryInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMaxPeremptoryInput(val);

                        // Update the actual number state if valid
                        if (val === '') {
                          return;
                        }
                        const num = parseInt(val);
                        if (!isNaN(num) && num >= 1 && num <= 20) {
                          setMaxPeremptory(num);
                        }
                      }}
                      onBlur={(e) => {
                        const val = e.target.value;
                        if (val === '' || isNaN(parseInt(val)) || parseInt(val) < 1) {
                          setMaxPeremptory(1);
                          setMaxPeremptoryInput('1');
                        } else if (parseInt(val) > 20) {
                          setMaxPeremptory(20);
                          setMaxPeremptoryInput('20');
                        } else {
                          setMaxPeremptoryInput(String(maxPeremptory));
                        }
                      }}
                      className="bg-slate-950/30 border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500/50 focus:border-amber-500/50 w-48"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Each side will have {maxPeremptory} peremptory strikes
                    </p>
                  </div>
                </div>

                {/* Team Members */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600/40">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    Team Members
                  </h3>
                  <div className="space-y-3">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Input
                          value={member.name}
                          onChange={(e) => {
                            const newMembers = [...teamMembers];
                            newMembers[idx].name = e.target.value;
                            setTeamMembers(newMembers);
                          }}
                          className="flex-1 bg-slate-950/30 border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500/50 focus:border-amber-500/50"
                          placeholder="Name"
                        />
                        <Input
                          value={member.role}
                          onChange={(e) => {
                            const newMembers = [...teamMembers];
                            newMembers[idx].role = e.target.value;
                            setTeamMembers(newMembers);
                          }}
                          className="flex-1 bg-slate-950/30 border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500/50 focus:border-amber-500/50"
                          placeholder="Role"
                        />
                        <button
                          onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== idx))}
                          className="p-2 rounded-lg bg-red-950/30 border border-red-500/40 hover:bg-red-900/50 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setTeamMembers([...teamMembers, { name: "", role: "" }])}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/40 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Team Member
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-600/40 bg-slate-900/50">
              <Button
                onClick={() => setSettingsOpen(false)}
                variant="outline"
                className="bg-slate-700/50 border-slate-600/40 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Apply settings and close
                  setSettingsOpen(false);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
              >
                Save Settings
              </Button>
            </div>
          </motion.div>
        </div>
      )}

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

      {/* iOS-Style Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {notifications.map((notif) => {
          const bgColors = {
            normal: 'from-slate-800 to-slate-700 border-slate-600',
            alert: 'from-amber-900 to-amber-800 border-amber-600',
            flag: 'from-red-900 to-red-800 border-red-600'
          };
          const iconEmoji = {
            normal: '💬',
            alert: '⚠️',
            flag: '🚩'
          };

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="pointer-events-auto w-96"
            >
              <div className={`relative bg-gradient-to-br ${bgColors[notif.type]} border-2 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden`}>
                {/* iOS blur effect */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>

                {/* Content */}
                <div className="relative p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 text-2xl">
                      {iconEmoji[notif.type]}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          {notif.jurorName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Just now
                        </span>
                      </div>
                      <p className="text-sm text-white font-medium line-clamp-2">
                        {notif.message}
                      </p>
                    </div>

                    {/* Close button */}
                    <button
                      onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <span className="text-white text-xs">×</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
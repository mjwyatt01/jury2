// src/pages/api/suggest.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Reusable fallback (so the UI still works)
const FAKE_SUGGESTIONS = [
  "Can you share any experiences that shape how you view injury claims and fairness?",
  "How do you think about symptoms that appear days after a crash?",
  "What would help you feel comfortable following the judge’s instructions about damages?",
];

type SuggestResponse = { suggestions: string[] };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuggestResponse | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { notes = "", recentChat = "" } = (req.body ?? {}) as {
    notes?: string;
    recentChat?: string;
  };

  // If there's no context, don't call the model
  const hasContext =
    (typeof notes === "string" && notes.trim().length > 0) ||
    (typeof recentChat === "string" && recentChat.trim().length > 0);
  if (!hasContext) {
    return res.status(200).json({ suggestions: [] });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[/api/suggest] OPENAI_API_KEY missing – returning FAKE_SUGGESTIONS");
    return res.status(200).json({ suggestions: FAKE_SUGGESTIONS });
  }

  try {
    const openai = new OpenAI({ apiKey });

    // Ask for strict JSON (object with suggestions: string[])
    const prompt = `
You are helping a trial team during voir dire (jury selection).
Based ONLY on the snippets below, propose 3 short, concrete follow-up questions
for counsel to ask THIS juror. Focus on bias, fairness, prior experiences,
and ability to follow instructions. Keep each under 140 chars.

Recent team chat (last few lines):
${recentChat || "(none)"}

Shared notes (snippet):
${notes || "(none)"}

Return ONLY valid JSON:
{"suggestions":["...","...","..."]}
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: "You produce concise voir dire follow-ups as JSON." },
        { role: "user", content: prompt },
      ],
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() || "";

    let suggestions: string[] = [];
    try {
      // Expect a JSON object with { suggestions: string[] }
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.suggestions)) {
        suggestions = parsed.suggestions
          .map((s: unknown) => String(s).trim())
          .filter(Boolean);
      }
    } catch (e) {
      // If the model didn’t return parseable JSON, try a simple fallback:
      suggestions = text
        .split(/\n+/)
        .map((s) => s.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 3);
    }

    if (!suggestions.length) {
      console.warn("[/api/suggest] Model returned no suggestions – falling back to FAKE_SUGGESTIONS");
      return res.status(200).json({ suggestions: FAKE_SUGGESTIONS });
    }

    return res.status(200).json({ suggestions });
  } catch (err: any) {
    console.error("[/api/suggest] OpenAI error – falling back:", err?.message || err);
    return res.status(200).json({ suggestions: FAKE_SUGGESTIONS });
  }
}
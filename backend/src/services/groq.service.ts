import Groq from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

const MODEL = "groq/llama-3.3-70b-versatile";

async function generate(prompt: string): Promise<string> {
  if (!env.GROQ_API_KEY) {
    return fallbackResponse(prompt);
  }
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 100,
    });
    return completion.choices[0]?.message?.content?.trim() || fallbackResponse(prompt);
  } catch {
    return fallbackResponse(prompt);
  }
}

export async function placeDescription(lat: number, lng: number): Promise<string> {
  return generate(
    `Given GPS coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}) somewhere in Mumbai, name 2-3 notable landmarks or places within 500m. Respond in one short sentence. Be specific.`
  );
}

export async function leavePrediction(deviceName: string): Promise<string> {
  return generate(
    `Generate a friendly 1-sentence reminder: a user is leaving home but their "${deviceName}" hasn't moved from its last known location. Suggest they might have forgotten it.`
  );
}

export async function anomalyDescription(deviceName: string, lat: number, lng: number): Promise<string> {
  return generate(
    `In one short sentence: ${deviceName} at (${lat.toFixed(4)}, ${lng.toFixed(4)}) seems to be at an unusual location. Mention this could be unexpected movement.`
  );
}

export async function searchSuggestion(lat: number, lng: number, heading: number): Promise<string> {
  return generate(
    `In one short sentence: a tracking device was last seen at (${lat.toFixed(4)}, ${lng.toFixed(4)}) heading ${Math.round(heading)}°. Suggest a search area description.`
  );
}

export async function sessionSummary(totalPoints: number, distanceM: number, durationMs: number, lat: number, lng: number): Promise<string> {
  return generate(
    `Write a 1-sentence activity summary for a tracking session that covered ${(distanceM / 1000).toFixed(2)}km over ${Math.floor(durationMs / 60000)} minutes with ${totalPoints} location points, ending near (${lat.toFixed(4)}, ${lng.toFixed(4)}) in Mumbai.`
  );
}

export async function generateText(prompt: string, fallback: string): Promise<string> {
  if (!env.GROQ_API_KEY) return fallback;
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 60,
    });
    return completion.choices[0]?.message?.content?.trim() || fallback;
  } catch {
    return fallback;
  }
}

function fallbackResponse(prompt: string): string {
  if (prompt.includes("landmark") || prompt.includes("GPS")) {
    return "Near a commercial district in Mumbai — several offices and shops nearby.";
  }
  if (prompt.includes("forgotten") || prompt.includes("leave")) {
    return "You may have left your device behind — it hasn't moved from its last known spot.";
  }
  if (prompt.includes("unusual")) {
    return "This device is at a location it doesn't typically visit during this time.";
  }
  if (prompt.includes("search area")) {
    return "Check within 100m of the last known position — the device likely disconnected while stationary.";
  }
  if (prompt.includes("summary")) {
    return "The device traveled through several areas in Mumbai during this session.";
  }
  return "AI insight generated for your tracking session.";
}

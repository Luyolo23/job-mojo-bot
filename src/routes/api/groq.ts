import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().min(1).max(60000),
      }),
    )
    .min(1)
    .max(40),
  json: z.boolean().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(64).max(8000).optional(),
});

export const Route = createFileRoute("/api/groq")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["GROQ_API_KEY"];
        if (!apiKey) {
          return Response.json({ error: "AI is not configured yet." }, { status: 500 });
        }

        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: parsed.messages,
            temperature: parsed.temperature ?? 0.4,
            max_tokens: parsed.maxTokens ?? 4000,
            ...(parsed.json ? { response_format: { type: "json_object" } } : {}),
          }),
        });

        if (!res.ok) {
          const detail = await res.text();
          const message =
            res.status === 429
              ? "The AI service is busy right now. Try again in a moment."
              : "The AI service returned an error.";
          console.error("Groq error", res.status, detail.slice(0, 500));
          return Response.json({ error: message }, { status: res.status === 429 ? 429 : 502 });
        }

        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const content = data.choices?.[0]?.message?.content ?? "";
        return Response.json({ content });
      },
    },
  },
});

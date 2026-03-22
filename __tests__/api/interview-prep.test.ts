/**
 * @jest-environment node
 *
 * Unit tests for the Interview Prep API route.
 * Mocks Supabase auth and Groq API to test auth, validation, and response handling.
 */

// Mock Supabase server client
jest.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: jest.fn(),
}));

// Mock global fetch for Groq API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { POST } from "@/app/api/interview-prep/route";
import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const mockSupabase = createServerSupabaseClient as jest.Mock;

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/interview-prep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockAuthUser(user: { id: string } | null) {
  mockSupabase.mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user },
      }),
    },
  });
}

describe("POST /api/interview-prep", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, GROQ_API_KEY: "test-key" };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 401 if user is not authenticated", async () => {
    mockAuthUser(null);

    const req = createRequest({ jobTitle: "Software Engineer", type: "technical" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 400 if jobTitle is missing", async () => {
    mockAuthUser({ id: "user-123" });

    const req = createRequest({ type: "technical" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Job title");
  });

  it("returns 500 if GROQ_API_KEY is not configured", async () => {
    delete process.env.GROQ_API_KEY;
    mockAuthUser({ id: "user-123" });

    const req = createRequest({ jobTitle: "Software Engineer", type: "technical" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("API key");
  });

  it("returns technical prep data on success", async () => {
    mockAuthUser({ id: "user-123" });

    const mockPrepData = {
      codingChallenges: [{ question: "Reverse a linked list", difficulty: "medium", tip: "Use two pointers", sampleAnswer: "..." }],
      systemDesign: [{ question: "Design a URL shortener", tip: "Focus on hashing", sampleAnswer: "..." }],
      conceptual: [],
      debugging: [],
      toolsAndTech: [],
      tips: ["Practice whiteboarding"],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify(mockPrepData) } }],
      }),
    });

    const req = createRequest({
      jobTitle: "Software Engineer",
      company: "Google",
      skills: ["JavaScript", "React"],
      type: "technical",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.prep).toBeDefined();
    expect(data.prep.codingChallenges).toHaveLength(1);
    expect(data.prep.tips).toContain("Practice whiteboarding");
  });

  it("returns behavioral prep data on success", async () => {
    mockAuthUser({ id: "user-123" });

    const mockPrepData = {
      starQuestions: [{ question: "Tell me about a time...", category: "leadership", tip: "Use STAR", sampleAnswer: "..." }],
      situational: [],
      cultureFit: [],
      questionsToAsk: [{ question: "What does success look like?", why: "Shows initiative" }],
      tips: ["Be specific with examples"],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify(mockPrepData) } }],
      }),
    });

    const req = createRequest({
      jobTitle: "Product Manager",
      type: "behavioral",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.prep.starQuestions).toHaveLength(1);
    expect(data.prep.questionsToAsk).toHaveLength(1);
  });

  it("handles Groq API failure gracefully", async () => {
    mockAuthUser({ id: "user-123" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: { message: "Rate limit exceeded" },
      }),
    });

    const req = createRequest({
      jobTitle: "Data Scientist",
      type: "technical",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("Rate limit");
  });

  it("handles empty AI response", async () => {
    mockAuthUser({ id: "user-123" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: null } }],
      }),
    });

    const req = createRequest({
      jobTitle: "Engineer",
      type: "technical",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("No response");
  });

  it("sends correct model and parameters to Groq", async () => {
    mockAuthUser({ id: "user-123" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "{}" } }],
      }),
    });

    const req = createRequest({
      jobTitle: "Backend Developer",
      skills: ["Python", "Django"],
      type: "technical",
    });

    await POST(req);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.groq.com/openai/v1/chat/completions");
    const body = JSON.parse(options.body);
    expect(body.model).toBe("llama-3.3-70b-versatile");
    expect(body.response_format.type).toBe("json_object");
  });

  it("includes skills in technical prompt", async () => {
    mockAuthUser({ id: "user-123" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "{}" } }],
      }),
    });

    const req = createRequest({
      jobTitle: "Full Stack Developer",
      skills: ["React", "Node.js", "PostgreSQL"],
      type: "technical",
    });

    await POST(req);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const prompt = body.messages[0].content;
    expect(prompt).toContain("React");
    expect(prompt).toContain("Node.js");
    expect(prompt).toContain("PostgreSQL");
  });
});

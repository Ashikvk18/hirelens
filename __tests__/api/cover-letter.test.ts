/**
 * @jest-environment node
 *
 * Unit tests for the Cover Letter Generation API route.
 * Mocks the Groq SDK to test request validation, response parsing, and error handling.
 */

// Mock Groq SDK before imports
jest.mock("groq-sdk", () => {
  const mockCreate = jest.fn();
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

import { POST } from "@/app/api/ai/cover-letter/route";
import { NextRequest } from "next/server";
import Groq from "groq-sdk";

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/ai/cover-letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getMockCreate() {
  const instance = new Groq({ apiKey: "test" });
  return instance.chat.completions.create as jest.Mock;
}

describe("POST /api/ai/cover-letter", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, GROQ_API_KEY: "test-key" };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("returns 400 if resume is missing", async () => {
    const req = createRequest({ jobDescription: "Some job" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("required");
  });

  it("returns 400 if jobDescription is missing", async () => {
    const req = createRequest({ resume: "My resume" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("required");
  });

  it("returns 200 with valid JSON response from AI", async () => {
    const mockResponse = {
      coverLetter: "Dear Hiring Manager...",
      highlights: ["React experience", "AWS knowledge"],
      wordCount: 250,
    };

    getMockCreate().mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockResponse),
          },
        },
      ],
    });

    const req = createRequest({
      resume: "Software Engineer with React experience",
      jobDescription: "Looking for a React developer",
      tone: "professional",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.coverLetter).toBe("Dear Hiring Manager...");
    expect(data.result.highlights).toHaveLength(2);
  });

  it("handles non-JSON AI response gracefully", async () => {
    // When the AI returns plain text without JSON braces, the regex match returns null
    // and result becomes an empty object. The route still returns 200 with that object.
    const plainText = "Dear Hiring Manager, I am excited to apply...";

    getMockCreate().mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: plainText,
          },
        },
      ],
    });

    const req = createRequest({
      resume: "My resume text",
      jobDescription: "Job posting",
      tone: "confident",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.result).toBeDefined();
  });

  it("handles AI API errors gracefully", async () => {
    getMockCreate().mockRejectedValueOnce(new Error("API rate limit exceeded"));

    const req = createRequest({
      resume: "My resume",
      jobDescription: "Job posting",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("rate limit");
  });

  it("passes correct tone instruction for 'enthusiastic'", async () => {
    getMockCreate().mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              coverLetter: "I'm thrilled...",
              highlights: [],
              wordCount: 100,
            }),
          },
        },
      ],
    });

    const req = createRequest({
      resume: "Resume text",
      jobDescription: "Job text",
      tone: "enthusiastic",
    });

    await POST(req);

    const createCall = getMockCreate();
    expect(createCall).toHaveBeenCalledTimes(1);
    const prompt = createCall.mock.calls[0][0].messages[0].content;
    expect(prompt).toContain("enthusiastic");
  });

  it("truncates very long resume and job description", async () => {
    const longResume = "x".repeat(10000);
    const longJob = "y".repeat(10000);

    getMockCreate().mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              coverLetter: "Cover letter",
              highlights: [],
              wordCount: 50,
            }),
          },
        },
      ],
    });

    const req = createRequest({
      resume: longResume,
      jobDescription: longJob,
    });

    await POST(req);

    const prompt = getMockCreate().mock.calls[0][0].messages[0].content;
    // Resume is sliced to 4000, job to 2500
    expect(prompt.length).toBeLessThan(longResume.length + longJob.length);
  });
});

/**
 * @jest-environment node
 *
 * Integration tests for the Auth Callback route.
 * Tests that the callback correctly resolves the public origin
 * and handles code exchange success/failure.
 */

// Mock next/headers
const mockGet = jest.fn();
jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: (key: string) => mockGet(key),
  }),
}));

// Mock Supabase server client
const mockExchangeCode = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: jest.fn().mockResolvedValue({
    auth: {
      exchangeCodeForSession: (...args: unknown[]) => mockExchangeCode(...args),
    },
  }),
}));

import { GET } from "@/app/auth/callback/route";

function createRequest(url: string): Request {
  return new Request(url, { method: "GET" });
}

describe("GET /auth/callback", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Public Origin Resolution", () => {
    it("uses x-forwarded-host when available (production on Render)", async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "x-forwarded-host") return "hirelens-1-g304.onrender.com";
        if (key === "x-forwarded-proto") return "https";
        return null;
      });
      mockExchangeCode.mockResolvedValueOnce({ error: null });

      const req = createRequest("http://localhost:10000/auth/callback?code=abc123");
      const res = await GET(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toContain("https://hirelens-1-g304.onrender.com");
      expect(location).not.toContain("localhost");
    });

    it("falls back to NEXT_PUBLIC_SITE_URL when no forwarded headers", async () => {
      mockGet.mockReturnValue(null);
      process.env.NEXT_PUBLIC_SITE_URL = "https://hirelens-1-g304.onrender.com";
      mockExchangeCode.mockResolvedValueOnce({ error: null });

      const req = createRequest("http://localhost:10000/auth/callback?code=abc123");
      const res = await GET(req);

      const location = res.headers.get("location");
      expect(location).toContain("https://hirelens-1-g304.onrender.com");
    });

    it("falls back to request origin when no env var or headers", async () => {
      mockGet.mockReturnValue(null);
      delete process.env.NEXT_PUBLIC_SITE_URL;
      mockExchangeCode.mockResolvedValueOnce({ error: null });

      const req = createRequest("http://localhost:3000/auth/callback?code=abc123");
      const res = await GET(req);

      const location = res.headers.get("location");
      expect(location).toContain("http://localhost:3000");
    });
  });

  describe("Code Exchange", () => {
    beforeEach(() => {
      mockGet.mockImplementation((key: string) => {
        if (key === "x-forwarded-host") return "myapp.onrender.com";
        if (key === "x-forwarded-proto") return "https";
        return null;
      });
    });

    it("redirects to /analyze on successful code exchange", async () => {
      mockExchangeCode.mockResolvedValueOnce({ error: null });

      const req = createRequest("http://localhost:10000/auth/callback?code=valid-code");
      const res = await GET(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("https://myapp.onrender.com/analyze");
    });

    it("redirects to custom next param on success", async () => {
      mockExchangeCode.mockResolvedValueOnce({ error: null });

      const req = createRequest("http://localhost:10000/auth/callback?code=valid-code&next=/jobs");
      const res = await GET(req);

      const location = res.headers.get("location");
      expect(location).toBe("https://myapp.onrender.com/jobs");
    });

    it("redirects to /analyze?error=auth on failed code exchange", async () => {
      mockExchangeCode.mockResolvedValueOnce({ error: new Error("Invalid code") });

      const req = createRequest("http://localhost:10000/auth/callback?code=invalid-code");
      const res = await GET(req);

      const location = res.headers.get("location");
      expect(location).toBe("https://myapp.onrender.com/analyze?error=auth");
    });

    it("redirects to /analyze?error=auth when no code provided", async () => {
      const req = createRequest("http://localhost:10000/auth/callback");
      const res = await GET(req);

      const location = res.headers.get("location");
      expect(location).toBe("https://myapp.onrender.com/analyze?error=auth");
    });

    it("calls exchangeCodeForSession with the provided code", async () => {
      mockExchangeCode.mockResolvedValueOnce({ error: null });

      const req = createRequest("http://localhost:10000/auth/callback?code=my-auth-code");
      await GET(req);

      expect(mockExchangeCode).toHaveBeenCalledWith("my-auth-code");
    });

    it("does not call exchangeCodeForSession when no code", async () => {
      const req = createRequest("http://localhost:10000/auth/callback");
      await GET(req);

      expect(mockExchangeCode).not.toHaveBeenCalled();
    });
  });
});

import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Max 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (file.name.toLowerCase().endsWith(".pdf")) {
      const result = await extractText(new Uint8Array(buffer));
      text = Array.isArray(result.text) ? result.text.join("\n") : String(result.text);
    } else if (file.name.toLowerCase().endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (file.name.toLowerCase().endsWith(".txt")) {
      text = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, or TXT." },
        { status: 400 }
      );
    }

    // Clean up extracted text
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (text.length < 20) {
      return NextResponse.json(
        { error: "Could not extract text from file. Try pasting instead." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Parse resume error:", error);
    return NextResponse.json(
      { error: "Failed to parse file. Try a different format or paste your resume." },
      { status: 500 }
    );
  }
}

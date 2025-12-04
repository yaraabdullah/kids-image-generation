import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } }) : null;

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function normalizeEntry(row) {
  if (!row || typeof row !== "object") return null;
  return {
    id: row.id ?? row.uuid ?? null,
    kidName: row.kid_name ?? row.kidName ?? "—",
    story: row.story ?? "",
    prompt: row.prompt ?? "",
    imageUrl: row.image_url ?? row.imageUrl ?? "",
    generatedAt: row.created_at ?? row.generatedAt ?? new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabase) {
    return res.status(500).json({ error: "Supabase environment variables are not configured." });
  }

  try {
    // Fetch all artwork for PDF generation
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    
    const { data, error } = await supabase
      .from("kid_artwork")
      .select("id, kid_name, story, prompt, image_url, created_at")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Supabase fetch error:", error);
      if (error.code === '57014' || error.message?.includes('timeout')) {
        return res.status(504).json({ 
          error: "Request timeout. The database query took too long." 
        });
      }
      return res.status(500).json({ error: "Failed to load artwork records." });
    }

    const entries = (data ?? []).map(normalizeEntry).filter(Boolean);
    return res.status(200).json({ 
      success: true, 
      pages: entries,
      coverImage: "/assets/images/newCover.jpg"
    });
  } catch (error) {
    console.error("Unexpected fetch error:", error);
    return res.status(500).json({ error: "Unexpected error while loading artwork records." });
  }
}


import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } }) : null;

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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

  if (!supabase) {
    return res.status(500).json({ error: "Supabase environment variables are not configured." });
  }

  if (req.method === "GET") {
    try {
      // Parse query parameters for pagination
      // Reduced limit to 100 to prevent timeouts with large base64 image URLs
      // Base64 images can be 100KB+ each, so fetching too many causes timeouts
      const limit = Math.min(parseInt(req.query.limit) || 100, 200); // Max 200, default 100
      const offset = parseInt(req.query.offset) || 0;
      
      // Build query with limit to prevent timeout
      // Order by created_at ascending (oldest first) for book display
      let query = supabase
        .from("kid_artwork")
        .select("id, kid_name, story, prompt, image_url, created_at")
        .order("created_at", { ascending: true })
        .range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        console.error("Supabase fetch error:", error);
        // Check if it's a timeout error
        if (error.code === '57014' || error.message?.includes('timeout')) {
          return res.status(504).json({ 
            error: "Request timeout. The database query took too long. Try reducing the limit or contact support." 
          });
        }
        return res.status(500).json({ error: "Failed to load kid artwork records." });
      }

      const entries = (data ?? []).map(normalizeEntry).filter(Boolean);
      return res.status(200).json(entries);
    } catch (error) {
      console.error("Unexpected fetch error:", error);
      return res.status(500).json({ error: "Unexpected error while loading kid artwork records." });
    }
  }

  if (req.method === "POST") {
    try {
      const { kidName, story, prompt, imageUrl } = req.body || {};

      if (!kidName || !story || !prompt || !imageUrl) {
        return res.status(400).json({ error: "Missing kidName, story, prompt, or imageUrl" });
      }

      const { data, error } = await supabase
        .from("kid_artwork")
        .insert({
          kid_name: kidName,
          story,
          prompt,
          image_url: imageUrl,
        })
        .select("id, kid_name, story, prompt, image_url, created_at")
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return res.status(500).json({ error: "Failed to save kid artwork record." });
      }

      return res.status(201).json(normalizeEntry(data));
    } catch (error) {
      console.error("Unexpected insert error:", error);
      return res.status(500).json({ error: "Unexpected error while saving kid artwork record." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}


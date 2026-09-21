/**
 * TEMPORARY demo data for verifying the public catalogue pages. Inserts a few
 * entries tagged "DEMO — " so they can be removed cleanly.
 *
 *   node --env-file=.env.local scripts/demo-entries.mjs seed
 *   node --env-file=.env.local scripts/demo-entries.mjs clean
 */
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const action = process.argv[2] ?? "seed";

async function idFor(table, name) {
  const { data } = await db.from(table).select("id").eq("name", name).single();
  return data?.id;
}

if (action === "clean") {
  const { error } = await db
    .from("catalogue_entries")
    .delete()
    .like("collection_name", "DEMO — %");
  if (error) throw error;
  console.log("Removed demo entries.");
  process.exit(0);
}

const [curtains, upholstery] = await Promise.all([
  idFor("sections", "Curtains"),
  idFor("sections", "Upholstery"),
]);
const [floral, geometric, plain] = await Promise.all([
  idFor("design_types", "Floral"),
  idFor("design_types", "Geometric"),
  idFor("design_types", "Plain"),
]);

const rows = [
  { collection_name: "DEMO — Rosewood Bloom", section_id: curtains, design_type_id: floral, seed: 11 },
  { collection_name: "DEMO — Meridian Lines", section_id: curtains, design_type_id: geometric, seed: 22 },
  { collection_name: "DEMO — Ivory Calm", section_id: upholstery, design_type_id: plain, seed: 33 },
].map((r) => ({
  collection_name: r.collection_name,
  section_id: r.section_id,
  design_type_id: r.design_type_id,
  thumbnail_url: `https://picsum.photos/seed/${r.seed}/400/300`,
  pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  is_active: true,
}));

const { error } = await db.from("catalogue_entries").insert(rows);
if (error) throw error;
console.log(`Inserted ${rows.length} demo entries.`);

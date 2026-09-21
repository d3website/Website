/**
 * Seed the taxonomy tables (sections / features / design_types) with the
 * standard D3 options. Idempotent: existing names are skipped.
 *
 * Run from the project root:
 *   node --env-file=.env.local scripts/seed-taxonomy.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env vars. Use --env-file=.env.local");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const sections = [
  { name: "Curtains", sort_order: 1 },
  { name: "Upholstery", sort_order: 2 },
  { name: "Outdoor Fabric", sort_order: 3 },
];
const features = [
  "Pet Friendly",
  "Fire Retardant",
  "Leather Finish",
  "Easy to Clean",
].map((name) => ({ name }));
const designTypes = [
  "Plain",
  "Textured",
  "Floral",
  "Abstract",
  "Damask",
  "Geometric",
  "Leaves",
  "Paisley",
  "Stripes & Checks",
].map((name) => ({ name }));

async function seed(table, rows) {
  const { error } = await db
    .from(table)
    .upsert(rows, { onConflict: "name", ignoreDuplicates: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  const { count } = await db
    .from(table)
    .select("*", { count: "exact", head: true });
  console.log(`${table}: ${count} rows`);
}

await seed("sections", sections);
await seed("features", features);
await seed("design_types", designTypes);
console.log("Seed complete.");

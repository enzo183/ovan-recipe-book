import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const csvPath = path.join(root, "data", "Classeur1.csv");
const outPath = path.join(root, "data", "recipes.json");

const CATEGORY_MAP = {
  "menu classique": "Menu classique",
  "burgers du moment": "Burgers du moment",
};

function normalizeCategory(raw) {
  const key = raw.trim().toLowerCase();
  return CATEGORY_MAP[key] ?? raw.trim();
}

function parseCsvRows(content) {
  const lines = content.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  const header = lines[0].split(";");
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === ";" && !inQuotes) {
        values.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    values.push(current);

    const row = {};
    header.forEach((col, index) => {
      row[col.trim()] = (values[index] ?? "").trim();
    });
    rows.push(row);
  }

  return rows;
}

function parseIngredient(part) {
  const trimmed = part.trim();
  if (!trimmed) return null;

  const segments = trimmed.split(":");
  const name = segments[0]?.trim() ?? "";
  const qtyRaw = segments[1]?.trim() ?? "";
  const unitRaw = (segments[2]?.trim() ?? "").toLowerCase();

  if (!name) return null;

  if (!qtyRaw || !unitRaw) {
    return {
      name,
      quantity: null,
      unit: null,
      scalable: false,
    };
  }

  const quantity = Number.parseFloat(qtyRaw.replace(",", "."));
  if (Number.isNaN(quantity)) {
    return {
      name,
      quantity: null,
      unit: null,
      scalable: false,
    };
  }

  const unit = unitRaw === "pièce" || unitRaw === "piece" ? "pièce" : unitRaw;

  return {
    name,
    quantity,
    unit,
    scalable: true,
  };
}

function parseIngredients(raw) {
  return raw
    .split(";")
    .map(parseIngredient)
    .filter(Boolean);
}

function parseSteps(raw) {
  return raw
    .split("|")
    .map((step) => step.trim())
    .filter(Boolean);
}

function rowToRecipe(row) {
  return {
    id: String(row.id),
    title: row.title,
    category: normalizeCategory(row.category),
    baseServings: Number.parseInt(row.baseServings, 10) || 1,
    imageUrl: row.imageUrl,
    prepTime: row.prepTime,
    difficulty: row.difficulty,
    ingredients: parseIngredients(row.ingredients),
    steps: parseSteps(row.steps),
  };
}

const csv = fs.readFileSync(csvPath, "utf8");
const recipes = parseCsvRows(csv).map(rowToRecipe);

fs.writeFileSync(outPath, `${JSON.stringify(recipes, null, 2)}\n`, "utf8");
console.log(`Importé ${recipes.length} recette(s) → ${outPath}`);

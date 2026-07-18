import express, { Request, Response } from "express";
import { EventEmitter } from "events";
import * as Models from "./models.js";

const app = express();
app.use(express.json());

// In-memory stores (simple for demo / solo semester build)
let nextUserId = 4;
let nextItemId = 2;
let nextClaimId = 1;

const users: Models.User[] = [
  { id: 1, name: "alfonso", role: "student", contact: "alice@uni.edu" },
  { id: 2, name: "jhay vy", role: "security", contact: "sec@uni.edu" },
  { id: 3, name: "ian", role: "admin", contact: "admin@uni.edu" },
];

const items: Models.Item[] = [
  {
    id: 1,
    title: "Black backpack",
    type: "lost",
    description: "Black backpack with a water bottle and notebook",
    location: "Library - 2nd floor",
    reporterId: 1,
    status: Models.ItemStatus.Reported,
    createdAt: new Date().toISOString(),
  },
];

const claims: Models.Claim[] = [];

const events = new EventEmitter();

function broadcastCounts() {
  const payload = JSON.stringify({ totalItems: items.length, openClaims: claims.filter(c => c.status === Models.ClaimStatus.Pending).length });
  events.emit("counts", payload);
}

function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

function getById<T extends { id: number }>(
  items: T[],
  id: number
): T | undefined {
  return items.find((item) => item.id === id);
}

// Simple helpers
function findUser(id: number) {
  return getById(users, id);
}

const firstUser = getFirst(users);

// Routes
app.get("/api/users", (req: Request, res: Response) => res.json(users));

app.get("/api/items", (req: Request, res: Response) => res.json(items));

app.get("/api/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

app.post("/api/items", (req: Request, res: Response) => {
  const { reporterId, title, type, description, location } = req.body;
  const reporter = findUser(Number(reporterId));
  if (!reporter) return res.status(400).json({ error: "Invalid reporterId" });
  const item: Models.Item = {
    id: nextItemId++,
    reporterId: reporter.id,
    title: String(title || "Untitled"),
    type: type === "found" ? "found" : "lost",
    description: String(description || ""),
    location: String(location || ""),
    status: Models.ItemStatus.Reported,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  broadcastCounts();
  res.status(201).json(item);
});

app.post("/api/items/:id/claim", (req: Request, res: Response) => {
  const itemId = Number(req.params.id);
  const { claimantId, reason } = req.body;
  const item = items.find(i => i.id === itemId);
  const claimant = findUser(Number(claimantId));
  if (!item) return res.status(404).json({ error: "Item not found" });
  if (!claimant) return res.status(400).json({ error: "Invalid claimantId" });
  const claim: Models.Claim = {
    id: nextClaimId++,
    itemId: item.id,
    claimantId: claimant.id,
    reason: String(reason || ""),
    status: Models.ClaimStatus.Pending,
    createdAt: new Date().toISOString(),
  };
  claims.push(claim);
  // update item status to Claimed
  item.status = Models.ItemStatus.Claimed;
  broadcastCounts();
  res.status(201).json(claim);
});

// Admin verifies a claim
app.post("/api/claims/:id/verify", (req: Request, res: Response) => {
  const claimId = Number(req.params.id);
  const { adminId, approve } = req.body;
  const admin = findUser(Number(adminId));
  if (!admin || admin.role !== "admin") return res.status(403).json({ error: "Only admin can verify" });
  const claim = claims.find(c => c.id === claimId);
  if (!claim) return res.status(404).json({ error: "Claim not found" });
  claim.status = approve ? Models.ClaimStatus.Approved : Models.ClaimStatus.Rejected;
  // if approved, mark item Verified
  const item = items.find(i => i.id === claim.itemId);
  if (item && approve) item.status = Models.ItemStatus.Verified;
  broadcastCounts();
  res.json(claim);
});

// Admin marks item as returned
app.post("/api/items/:id/return", (req: Request, res: Response) => {
  const itemId = Number(req.params.id);
  const { adminId } = req.body;
  const admin = findUser(Number(adminId));
  if (!admin || admin.role !== "admin") return res.status(403).json({ error: "Only admin can mark returned" });
  const item = items.find(i => i.id === itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });
  item.status = Models.ItemStatus.Returned;
  broadcastCounts();
  res.json(item);
});

// SSE endpoint for live counts (Module 4 feature)
app.get("/api/counts/stream", (req: Request, res: Response) => {
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  const send = (payload: string) => res.write(`data: ${payload}\n\n`);
  // send initial counts
  send(JSON.stringify({ totalItems: items.length, openClaims: claims.filter(c => c.status === Models.ClaimStatus.Pending).length }));
  const onCounts = (payload: string) => send(payload);
  events.on("counts", onCounts);
  req.on("close", () => events.off("counts", onCounts));
});

// Generative-text placeholder: suggest a clear description based on title/location
app.post("/api/items/:id/suggest-description", (req: Request, res: Response) => {
  const itemId = Number(req.params.id);
  const item = items.find(i => i.id === itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });
  // Simple template-based 'generation' for demo purposes
  const suggestion = `Found in ${item.location}: ${item.title}. Notable features: ${item.description || "no extra details"}. If this is yours, contact reporter ID ${item.reporterId}.`;
  res.json({ suggestion });
});

// health
app.get("/api/health", (req: Request, res: Response) => res.json({ ok: true }));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => console.log(`Lost & Found API listening on http://localhost:${port}`));

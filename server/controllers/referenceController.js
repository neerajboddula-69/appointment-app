import { loadState } from "../services/stateService.js";

export async function health(_, res) {
  return res.json({ ok: true, database: "MongoDB" });
}

export async function getServices(_, res) {
  try {
    const state = await loadState();
    return res.json(state.services);
  } catch {
    return res.status(500).json({ message: "Unable to load services." });
  }
}

export async function getProviders(_, res) {
  try {
    const state = await loadState();
    return res.json(state.providers);
  } catch {
    return res.status(500).json({ message: "Unable to load specialists." });
  }
}

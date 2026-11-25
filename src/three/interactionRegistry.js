const interactions = new Map();

export function registerInteraction(entry) {
  interactions.set(entry.id, entry);
}

export function unregisterInteraction(id) {
  interactions.delete(id);
}

export function getInteractionEntries() {
  return Array.from(interactions.values());
}

export function getInteractionObjects() {
  return Array.from(interactions.values())
    .map((entry) => entry.object)
    .filter(Boolean);
}

export function findInteractionForObject(object) {
  for (const entry of interactions.values()) {
    if (entry.object === object) return entry;
  }
  return null;
}

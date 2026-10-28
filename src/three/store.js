import { useSyncExternalStore } from 'react'

// Tiny shared store so HTML (hero caption, stage fallback) can follow the WebGL scene.
let state = { ready: false, points: 0 }
const listeners = new Set()

function set(patch) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

export const stackStore = {
  get: () => state,
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  ready: () => set({ ready: true }),
  setPoints: (points) => set({ points }),
}

export function useStack(selector) {
  return useSyncExternalStore(stackStore.subscribe, () => selector(stackStore.get()))
}

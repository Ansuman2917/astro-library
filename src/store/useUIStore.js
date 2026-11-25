import { create } from 'zustand';
import { audioEngine } from '../audio/AudioEngine';
import { SPAWN, SPAWN_YAW } from '../data/world';

const STORAGE_KEY = 'arshia-portfolio:settings';

const readSettings = () => {
  const defaults = {
    sensitivity: 0.0022,
    volume: 0.55,
    muted: false,
    minimapOpen: true,
    bobEnabled: true,
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      sensitivity:
        typeof parsed.sensitivity === 'number' ? parsed.sensitivity : defaults.sensitivity,
      volume: typeof parsed.volume === 'number' ? parsed.volume : defaults.volume,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : defaults.muted,
      minimapOpen:
        typeof parsed.minimapOpen === 'boolean' ? parsed.minimapOpen : defaults.minimapOpen,
      bobEnabled: typeof parsed.bobEnabled === 'boolean' ? parsed.bobEnabled : defaults.bobEnabled,
    };
  } catch {
    return defaults;
  }
};

const persistSettings = (state) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sensitivity: state.sensitivity,
        volume: state.volume,
        muted: state.muted,
        minimapOpen: state.minimapOpen,
        bobEnabled: state.bobEnabled,
      })
    );
  } catch {
    /* storage may be unavailable */
  }
};

const initialSettings = readSettings();

export const playerState = {
  position: [...SPAWN],
  yaw: SPAWN_YAW,
  pitch: 0,
  speed: 0,
  grounded: true,
  level: 0,
  moving: false,
};

export const useUIStore = create((set, get) => ({
  entered: false,
  sceneReady: false,
  hasBegun: false,
  locked: false,
  hovered: null,
  activePanel: null,
  settingsOpen: false,
  showDebug: false,
  level: 0,
  transition: 'welcome',
  ...initialSettings,

  enterLibrary: () => {
    audioEngine.start();
    set({ entered: true, transition: 'loading' });
  },
  returnToWelcome: () => {
    document.exitPointerLock?.();
    set({
      entered: false,
      sceneReady: false,
      hasBegun: false,
      locked: false,
      activePanel: null,
      settingsOpen: false,
      hovered: null,
      transition: 'welcome',
    });
  },
  setSceneReady: (value) => set({ sceneReady: value }),
  setHasBegun: (value) => set({ hasBegun: value }),
  setLocked: (value) => set({ locked: value }),
  setHovered: (hovered) => {
    const current = get().hovered;
    if (current?.id === hovered?.id) return;
    set({ hovered });
  },
  openPanel: (panel) => {
    audioEngine.panelOpen();
    document.exitPointerLock?.();
    set({ activePanel: panel, settingsOpen: false });
  },
  closePanel: () => set({ activePanel: null }),
  setSettingsOpen: (value) => {
    if (value) document.exitPointerLock?.();
    set({ settingsOpen: value });
  },
  setLevel: (level) => {
    if (get().level !== level) set({ level });
  },
  toggleDebug: () => set({ showDebug: !get().showDebug }),
  toggleMinimap: () => {
    set({ minimapOpen: !get().minimapOpen });
    persistSettings(get());
  },

  setSensitivity: (value) => {
    set({ sensitivity: value });
    persistSettings(get());
  },
  setVolume: (value) => {
    audioEngine.setVolume(value);
    set({ volume: value });
    persistSettings(get());
  },
  setMuted: (value) => {
    audioEngine.setMuted(value);
    set({ muted: value });
    persistSettings(get());
  },
  toggleMuted: () => {
    const muted = !get().muted;
    audioEngine.setMuted(muted);
    set({ muted });
    persistSettings(get());
  },
  setBobEnabled: (value) => {
    set({ bobEnabled: value });
    persistSettings(get());
  },
}));

audioEngine.setVolume(initialSettings.volume);
audioEngine.setMuted(initialSettings.muted);

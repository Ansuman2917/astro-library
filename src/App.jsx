import { useUIStore } from './store/useUIStore';
import WelcomeScreen from './components/WelcomeScreen';
import GameCanvas from './components/GameCanvas';
import LoadingOverlay from './components/LoadingOverlay';
import StartOverlay from './components/StartOverlay';
import PauseOverlay from './components/PauseOverlay';
import SettingsPanel from './components/SettingsPanel';
import InformationPanel from './components/InformationPanel';
import HUD from './components/HUD';

export default function App() {
  const entered = useUIStore((state) => state.entered);
  const sceneReady = useUIStore((state) => state.sceneReady);
  const hasBegun = useUIStore((state) => state.hasBegun);
  const locked = useUIStore((state) => state.locked);
  const activePanel = useUIStore((state) => state.activePanel);
  const settingsOpen = useUIStore((state) => state.settingsOpen);

  return (
    <div className={`app${entered ? ' app--entered' : ''}`}>
      {entered && <GameCanvas />}
      {!entered && <WelcomeScreen />}

      {entered && <LoadingOverlay />}

      {entered && sceneReady && !hasBegun && <StartOverlay />}

      {entered && hasBegun && <HUD />}

      {entered && hasBegun && !locked && !activePanel && !settingsOpen && <PauseOverlay />}

      {entered && settingsOpen && <SettingsPanel />}

      {entered && activePanel && <InformationPanel />}
    </div>
  );
}

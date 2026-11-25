import { createRoot } from 'react-dom/client';
import '@fontsource/orbitron/latin-600.css';
import '@fontsource/orbitron/latin-800.css';
import '@fontsource/rajdhani/latin-400.css';
import '@fontsource/rajdhani/latin-500.css';
import '@fontsource/rajdhani/latin-600.css';
import '@fontsource/inter/latin-400.css';
import './styles/global.css';
import './styles/interface.css';
import App from './App';

createRoot(document.getElementById('root')).render(<App />);

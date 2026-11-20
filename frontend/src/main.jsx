import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Aquí React "dibuja" la aplicación dentro del <div id="root"> del index.html
createRoot(document.getElementById('root')).render(<App />);

import './api';
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import {AuthProvider} from "./FetchUser"
import App from './App.jsx'
import './index.css';


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)



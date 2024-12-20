import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId='1085949614701-vmg86gc56gp3r84fro3m0v2f7sd2h126.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

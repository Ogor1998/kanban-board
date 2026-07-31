import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from './context/AuthContext.jsx'

const theme = createTheme({
  typography: {
    htmlFontSize: 10,
  },
});
axios.defaults.withCredentials = true  // ← add this
axios.defaults.baseURL = 'http://localhost:3000'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <NotificationProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </NotificationProvider>

  </StrictMode>,
)

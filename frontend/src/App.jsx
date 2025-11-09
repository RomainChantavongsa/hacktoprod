import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import SidebarManager from './components/sidebar/SidebarManager.jsx'
import DevDebugPanel from '@components/DevDebugPanel.jsx'
import { routes } from './routes.ts'
import './App.scss'

function App() {
  return (
    <div className="app">
      <Navbar />
      <SidebarManager />
      <main className="app-content">
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>}>
          <Routes>
            {routes.map((route, index) => (
              route.Component && (
                <Route 
                  key={index} 
                  path={route.path} 
                  element={<route.Component />} 
                />
              )
            ))}
          </Routes>
        </Suspense>
      </main>
      <Footer />
      
      {/* Panel de debug style Tracy - seulement en DEV */}
      <DevDebugPanel />
    </div>
  )
}

export default App

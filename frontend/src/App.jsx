import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import { routes } from './routes.ts'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
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
    </div>
  )
}

export default App

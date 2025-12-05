import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Confirmation from './components/Confirmation'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
import {Route,Routes} from 'react-router-dom'
import Wallet from './components/wallet'
import {Toaster} from 'sonner'
import { SpeedInsights } from "@vercel/speed-insights/react"
import './App.css'

const App = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Wallet />} />
        </Routes>
        <Toaster
          position='top-right'
          richColors
          closeButton
          expand={false}
          duration={3000}
        />
        <SpeedInsights/>
    </div>
  )
}

export default App

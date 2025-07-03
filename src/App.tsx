import {Route,Routes} from 'react-router-dom'
import Wallet from './components/wallet'
import './App.css'

const App = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Wallet />} />
        </Routes>
    </div>
  )
}

export default App

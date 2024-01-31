import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {SocketProvider} from './Component/SocketContext'
import { Dashboard } from './Component/Dashboard'
import HistoryPic from './Component/HistoryPic'
import LedCtrlPage from './Component/LedCtrlPage'
import BoxPage from './Component/BoxPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <BrowserRouter>
            <SocketProvider>
                <Routes>
                    <Route path='/' element={<Dashboard />}/>
                    <Route path='/box/:boxId' element={<BoxPage />} />
                    <Route path="historypic" element={<HistoryPic />} />
                    <Route path="ledctrl" element={<LedCtrlPage />}/>
                </Routes>
            </SocketProvider>
        </BrowserRouter>
    </>
  )
}

export default App

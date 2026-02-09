import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing/Landing'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Bct from './components/bct'

import Uregister from './pages/landing/Uregister'
import Dlogin from './pages/landing/Dlogin'
import Ulogin from './pages/landing/Ulogin'
import Dregister from './pages/landing/Dregister'

import Uhome from './pages/user/Uhome'
import Uhelp from './pages/user/Uhelp'
import Usetting from './pages/user/Usetting'
import Ucreate from './pages/user/Ucreate'


import Dhome from './pages/driver/Dhome'
import Dhelp from './pages/driver/Dhelp'
import Dsetting from './pages/driver/Dsetting'



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Landing />} index />
        <Route path='/ulogin' element={<Ulogin />} />
        <Route path='/uregister' element={<Uregister />} />
        <Route path='/dlogin' element={<Dlogin />} />
        <Route path='/dregister' element={<Dregister />} />

        <Route path='/uhome' element={<Uhome />} />
        <Route path='/uhelp' element={<Uhelp />} />
        <Route path='/usetting' element={<Usetting />} />
        <Route path='/ucreate' element={<Ucreate />} />

        <Route path='/dhome' element={<Dhome />} />
        <Route path='/dhelp' element={<Dhelp />} />
        <Route path='/dsetting' element={<Dsetting />} />
      </Routes>
      <Bct />
      <Footer />
    </Router>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/Logo.svg'
import './navbar.css'

function Navbar() {
  const [userType, setUserType] = useState(null); // 'user', 'driver', or null
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    const driver = localStorage.getItem('driver');

    if (user) {
      const userData = JSON.parse(user);
      setUserType('user');
      setUserName(userData.username || 'User');
    } else if (driver) {
      const driverData = JSON.parse(driver);
      setUserType('driver');
      setUserName(driverData.username || 'Driver');
    } else {
      setUserType(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('driver');
    setUserType(null);
    setUserName('');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fil">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"><img src={Logo} alt="" /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              {/* Variant 1: No one logged in */}
              {userType === null && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/ulogin">User Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dlogin">Driver Login</Link>
                  </li>
                </>
              )}

              {/* Variant 2: User logged in */}
              {userType === 'user' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/uhome">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/usetting">Setting</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/uhelp">Contact/Help</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {userName}
                    </span>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li><span className="dropdown-item cursor-pointer" onClick={handleLogout}>Logout</span></li>
                    </ul>
                  </li>
                </>
              )}

              {/* Variant 3: Driver logged in */}
              {userType === 'driver' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dhome">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dsetting">Setting</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dhelp">Contact/Help</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle" id="driverDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {userName}
                    </span>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="driverDropdown">
                      <li><span className="dropdown-item cursor-pointer" onClick={handleLogout}>Logout</span></li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
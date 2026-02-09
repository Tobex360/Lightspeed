import React from 'react'
import { Link } from 'react-router-dom'
import './footer.css'

function Footer() {
  return (
    <>
       <footer className="mt-auto">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-3">
                <h5>About Us</h5>
                <p>LightSpeed is a peer-to-peer delivery platform connecting users who need to send packages with verified drivers. Users can create orders, track shipments in real-time, and communicate with drivers. It is a Fast, reliable, and convenient package delivery made simple.</p>
              </div>
              <div className="col-md-4 mb-3">
                <h5>Quick Links</h5>
                <ul className="list-unstyled">
                  <li><Link to="/" className="text-decoration-none text-white link">Home</Link></li>
                  <li><Link to="/ulogin" className="text-decoration-none text-white link">User Login</Link></li>
                  <li><Link to="dlogin" className="text-decoration-none text-white link">Driver Login</Link></li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <h5>Follow Us</h5>
                <ul className="list-inline social-icons">
                  <li className="list-inline-item"><Link to="#" className="text-white"><i className="fab fa-linkedin link"></i></Link></li>
                  <li className="list-inline-item"><Link to="#" className="text-white"><i className="fab fa-facebook link"></i></Link></li>
                  <li className="list-inline-item"><Link to="#" className="text-white"><i className="fab fa-instagram link"></i></Link></li>
                  <li className="list-inline-item"><Link to="https://github.com/Tobex360" className="text-white"><i className="fab fa-github link"></i></Link></li>
                </ul>
              </div>
            </div>
            <hr className="mb-4"></hr>
            <div className="row">
              <div className="col-md-12 text-center">
                <p>Copyrights © 2026 - <Link to='https://github.com/Tobex360' className='link'>Echefu Tobechukwu</Link>, All Rights Reserved.</p>
              </div> 
            </div>
          </div>
       </footer>
    
    </>
  )
}

export default Footer
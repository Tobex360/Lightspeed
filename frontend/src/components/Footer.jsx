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
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ante mollis quam tristique convallis.</p>
              </div>
              <div className="col-md-4 mb-3">
                <h5>Quick Links</h5>
                <ul className="list-unstyled">
                  <li><Link to="#" className="text-decoration-none text-white">Home</Link></li>
                  <li><Link to="#" className="text-decoration-none text-white">Services</Link></li>
                  <li><Link to="#" className="text-decoration-none text-white">Contact</Link></li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <h5>Follow Us</h5>
                <ul className="list-inline social-icons">
                  <li className="list-inline-item"><Link to="#" className="text-white"><i className="fab fa-x"></i></Link></li>
                  <li className="list-inline-item"><Link to="#" className="text-white"><i className="fab fa-facebook"></i></Link></li>
                  <li className="list-inline-item"><Link to="#" className="text-white"><i className="fab fa-instagram"></i></Link></li>
                </ul>
              </div>
            </div>
            <hr className="mb-4"></hr>
            <div className="row">
              <div className="col-md-12 text-center">
                <p>&copy; 2023 Your Company. All rights reserved.</p>
              </div>
            </div>
          </div>
       </footer>
    
    </>
  )
}

export default Footer
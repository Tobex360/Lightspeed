import React from 'react'
import './landing.css'
import { Link } from 'react-router-dom'
import driver from '../../assets/driver.avif'
import user from '../../assets/user.avif'

function Landing() {
  return (
    <>
      {/* hero section */}
      <section className='hero-section'id='home'>
        <div className='container'>
          <h1 className='hero-title'>
            LIGHT<i className='fas fa-bolt lightning-icon'></i>SPEED
          </h1>
          <p className='hero-subtitle'>We Think Of You</p>
          </div>  
       </section>
       {/* end hero section */}
       {/* reg cards */}
       <section className='cards-section'>
        <div className='container'>
          <div className='row justify-content-center g-4'>
            <div className='col-md-5'>
              <div className='registration-card'>
                <img src={user} alt="User" className='card-image' />
                <h3 className='card-title'>Become a User</h3><br />
                <Link to ='/uregister' class="register-btn" onclick="alert('Redirecting to User Registration...')">Register</Link>
              </div>
            </div>
            <div className='col-md-5'>
              <div className='registration-card'>
                <img src={driver} alt="driver" className='card-image' />
                <h3 className='card-title'>Become a Driver</h3><br />
                <Link to ='/dregister' class="register-btn" onclick="alert('Redirecting to driver Registration...')">Register</Link>
              </div>
            </div>
          </div>
        </div>
       </section>
       {/* end reg crd */}
       {/* features sct */}
       <section className='features-section'>
        <div className='container'>
          <h2 className='text-center mb-5 fw-bold'>Why Choose Lightspeed</h2>
          <div className='row'>
            <div className='col-md-4'>
              <div className='feature-box'>
                <i className='fas fa-shipping-fast feature-icon'></i>
                <h4 className='fw-bold'>Fast Delivery</h4>
                <p className='text-muted'>Lightning-fast package delivery at your doorstep</p>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='feature-box'>
                <i className='fas fa-shield-alt feature-icon'></i>
                <h4 className='fw-bold'>Secure & Safe</h4>
                <p className='text-muted'>Your packages are insured and tracked in real-time</p>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='feature-box'>
                <i className='fas fa-dollar-sign feature-icon'></i>
                <h4 className='fw-bold'>Affordable Rates</h4>
                <p className='text-muted'>Competitive pricing with no hidden fees</p>
              </div>
            </div>
          </div>
        </div>
       </section>
       {/* end features sct */}
    </>
  )
}

export default Landing
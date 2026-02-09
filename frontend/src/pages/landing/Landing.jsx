import React from 'react'
import './landing.css'
import { Link } from 'react-router-dom'
import driver from '../../assets/driver.avif'
import user from '../../assets/user.avif'

function Landing() {
  return (
    <>
      {/* hero section */}
      <div className='landing-wrapper'>
      <section className='hero-section'id='home'>
        <div className='container text-center'>
          <div className='badge-pill'>Coming to 20+ Cities</div>
          <h1 className='hero-title'>
            LIGHT<i className='fas fa-bolt lightning-icon'></i>SPEED
          </h1>
          <p className='hero-subtitle'>Premium Deliveries, at the speed of thought.</p>
          </div>  
       </section>
       {/* end hero section */}
       {/* Registration Cards */}
      <section className='cards-section'>
        <div className='container'>
          <div className='row justify-content-center g-5'>
            <div className='col-md-5'>
              <div className='registration-card'>
                <div className="card-image-wrapper">
                  <img src={user} alt="User" className='card-image' />
                </div>
                <h3 className='card-title'>Send a Package</h3>
                <p className='card-text text-muted'>Fast, secure, and trackable personal deliveries.</p>
                <Link to='/uregister' className="register-btn">
                  Get Started
                </Link>
              </div>
            </div>
            <div className='col-md-5'>
              <div className='registration-card'>
                <div className="card-image-wrapper">
                  <img src={driver} alt="driver" className='card-image' />
                </div>
                <h3 className='card-title'>Start Earning</h3>
                <p className='card-text text-muted'>Flexible hours with the highest rates in the industry.</p>
                <Link to='/dregister' className="register-btn secondary-btn">
                  Join the Fleet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


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
       </div>
       {/* end features sct */}
    </>
  )
}

export default Landing
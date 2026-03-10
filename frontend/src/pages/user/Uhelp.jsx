import React from 'react'
import faq from '../../assets/faq.png'
import { Link } from 'react-router-dom'


function Uhelp() {
  return (
    <>
<section className="bg-light py-3 py-md-5">
  <div className="container">
    <div className="row gy-5 gy-lg-0 align-items-lg-center">
      <div className="col-12 col-lg-6">
        <img className="img-fluid rounded" loading="lazy" src={faq} alt="How can we help you?" />
      </div>
      <div className="col-12 col-lg-6">
        <div className="row justify-content-xl-end">
          <div className="col-12 col-xl-11">
            <h2 className="h1 mb-3">How can we help you?</h2>
            <p className="lead fs-4 text-secondary mb-5">We hope you have found an answer to your question. If you need any help, please search your query on our Support Center or contact us via email.</p>
            <div className="accordion accordion-flush" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    How do I create an order?
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <p>To sucessfully create an order Follow these steps</p>
                    <ul>
                      <li>Go to our website and sign in to your account.</li>
                      <li>Click on "Create new shipment" on the top left on the webpage</li>
                      <li>Enter Your package details</li>
                      <li>Enter the receiver's username(must be a valid username)</li>
                      <li>Select a driver from the list of available drivers</li>
                      <li>Click on the "create order button"</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    How do I edit my profile?
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <p>To Edit your profile, please follow these steps:</p>
                    <ul>
                      <li>Go to our website and sign in to your account.</li>
                      <li>Click on The Settings Tab on the navigation bar</li>
                      <li>Edit any field as you see fit</li>
                      <li>Click on save changes</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Tracking Order?
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    <p>You can track your orders using the order status:</p>
                    <ul>
                      <li>"Pending" means the Recevier is yet to accept the order.</li>
                      <li>"driver-pending" means the driver is yet </li>to accept the order.
                      <li>"accepted" means the driver has agreed to take the order</li>
                      <li>"in-transit" means the driver has collected the order from the Sender and is now on his way to the reciver</li>
                      <li>"complete" means the driver has deliverd the order to the recevier successfully</li>
                      <li>"cancelled" means either the recevier or the driver has rejected the order</li>
                      <li>You can also click on he tracking number to view the live progress of the order</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingFour">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    Customer Care
                  </button>
                </h2>
                <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                    You can contact us at 08139509185 or send us an email at Tobex360@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    
    </>
  )
}

export default Uhelp
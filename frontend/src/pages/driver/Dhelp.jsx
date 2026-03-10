import React from 'react'
import faq from '../../assets/faq.png'
import { Link } from 'react-router-dom'


function Dhelp() {
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
                     How Does this work?
                   </button>
                 </h2>
                 <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                   <div className="accordion-body">
                     <p>These are the steps you are expexted to take to work with us</p>
                     <ul>
                       <li>Whenever you are available to work go into "settings" page and toggle Available field to "Available"</li>
                       <li>If you get assigned job it will show up in your pending table</li>
                       <li>Click on the "view" button in the action column to see the details of the job</li>
                       <li>You are expexted to call both the sender and the recevier to confirm the details of the job</li>
                       <li>If there is an issue and you cannot complete the job you can click on the "decline" button to cancel the job</li>
                       <li>If you will be able to complete the job click on the "accept" buton to start the job</li>
                     </ul>
                   </div>
                 </div>
               </div>
              
               <div className="accordion-item">
                 <h2 className="accordion-header" id="headingTwo">
                   <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                     Tracking Orders?
                   </button>
                 </h2>
                 <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                   <div className="accordion-body">
                     <p>When you are on a job you are expexted to update the status during each step:</p>
                     <ul>
                       <li>When you accept a job the status is set to "accepted".</li>
                       <li>When you successfully pick up the order and the sender has paid you are expected to set the status to "In-Transit"</li>
                       <li>when you successfully deliver the package to the recevier you are expected to set the status to "Completed"</li>
                       <li>Click on save changes</li>
                     </ul>
                   </div>
                 </div>
               </div>
               <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    How do I edit my profile?
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
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

export default Dhelp
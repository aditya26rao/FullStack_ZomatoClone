import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
export default function Footer() {
  return (
    <div id='footer' className='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                 <img src={assets.logo} alt="" />
                 <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit modi beatae, ipsam perspiciatis numquam sapiente?</p>
                 <div className="footer-social-icons">
                    <img src={assets.facebook_icon}  alt="fb" />
                    <img src={assets.twitter_icon}   alt="twitter" />
                    <img src={assets.linkedin_icon}   alt="linkedin" />               
                </div>
            </div>
            <div className="footer-content-center">
                   <h2>COMPANY</h2>
                   <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                   </ul>
            </div>
            <div className="footer-content-right">
                  <h2>Get in Touch</h2>
                  <ul>
                    <li>+91 9XXXXX90XX</li>
                    <li>contact@zomato.com</li>
                  </ul>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">
            Copyright 2024 &copy; Tomato.com - All Right Reserved.
        </p>
    </div>
  )
}

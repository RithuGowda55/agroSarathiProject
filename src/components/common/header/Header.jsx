import React, { useState } from "react"
import { Link } from "react-router-dom"
import Head from "./Head"
import "./header.css"
// import Blogpost from "../../blogpost/Blog"

const Header = () => {
  const [click, setClick] = useState(false)

  return (
    <>
      <Head />
      <header>
        <nav className='flexSB'>
          <ul className={click ? "mobile-nav" : "flexSB "} onClick={() => setClick(false)}>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/courses'>Resources</Link>
            </li>
            {/* <li>
              <Link to='/about'>About</Link>
            </li> */}
            {/* <li>
              <Link to='/team'>Team</Link>
            </li> */}
            <li>
              <Link to='/pricing'>Pricing</Link>
            </li>
            <li>
              <Link to='/journal'>Blog</Link>
            </li>
            <li>
              <Link to='/govscheme'>GovScheme</Link>
            </li>
            <li>
              <Link to='/costpredict'>CostPredict</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
            <li>
              <Link to='/pdd'>Plant Disease Detector</Link>
            </li>
            <li>
              <Link to='/explore'>Explore</Link>
            </li>
            <li>
              <Link to='/crop'>Crop Suggest</Link>
            </li>
            {/* <li>
              <Link to='/blogpost'>BlogPost</Link>
            </li> */}
          </ul>
          <div className='start'>
            <div className='button'>Sustainable Farming</div>
          </div>
          <button className='toggle' onClick={() => setClick(!click)}>
            {click ? <i className='fa fa-times'> </i> : <i className='fa fa-bars'></i>}
          </button>
        </nav>
      </header>
    </>
  )
}

export default Header

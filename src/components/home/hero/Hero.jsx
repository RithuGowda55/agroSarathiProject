import React from "react"
import Heading from "../../common/heading/Heading"
import "./Hero.css"

const Hero = () => {
  return (
    <>
      <section className='hero'>
        <div className='container'>
          <div className='row'>
            <Heading subtitle='WELCOME TO AGRO SARATHI' title='Your Trusted Agricultural Companion' />
            <p>
              Agro Sarathi provides innovative solutions to farmers, empowering them with the knowledge, tools, and support they need to succeed in modern agriculture.
            </p>
            <div className='button'>
              {/* <button className='primary-btn'>
                GET STARTED NOW <i className='fa fa-long-arrow-alt-right'></i>
              </button>
              <button>
                VIEW SERVICES <i className='fa fa-long-arrow-alt-right'></i>
              </button> */}
            </div>
          </div>
        </div>
      </section>
      <div className='margin'></div>
    </>
  )
}

export default Hero

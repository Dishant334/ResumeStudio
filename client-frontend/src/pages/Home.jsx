import React, { useRef } from 'react'
import Banner from '../components/home/Banner'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import Testimonial from '../components/home/Testimonial'
import CallToAction from '../components/home/CallToAction'
import Footer from '../components/home/Footer'
const Home = () => {
  const featuresRef=useRef(null)
  const testimonialRef=useRef(null)
  const footerRef=useRef(null)

  const scrollToSection=(ref)=>{
    ref.current.scrollIntoView({behavior:'smooth'})
  }
  return (
    <div>
      <Banner/>
      <Hero
      goToFeatures={()=>scrollToSection(featuresRef)}
      goToTestimonial={()=>scrollToSection(testimonialRef)}
      goToFooter={()=>scrollToSection(footerRef)}
      />

       <div ref={featuresRef}>
        <Features />
      </div>
      
        <div ref={testimonialRef}>
        <Testimonial />
      </div>
      <CallToAction/>

       <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  )
}

export default Home

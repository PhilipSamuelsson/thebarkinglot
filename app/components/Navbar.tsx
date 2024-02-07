import React from 'react'


const Navbar = () => {
  return (
    <div className="navbar flex items-center justify-between flex-row bg-gray-400 p-5  ">
    <div className="logo-container">
      <a href="/"className="logo font-poppins font-semibold text-2xl">The Barking Lot!</a>
      </div>
      <div className="links-container flex gap-5">
        <a href="/about" className="link font-poppins font-semibold">About</a>
        <a href="/contact"className="link font-poppins font-semibold">Contact</a>
        <a href="/dogs" className="link font-poppins font-semibold">Dogs</a>

    </div>
  </div>
  )
}

export default Navbar

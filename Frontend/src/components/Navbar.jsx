import React, { useState, useContext } from 'react'
import { assets } from "../assets/assets_frontend/assets"
import { NavLink, useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const { token, setToken } = useContext(AppContext)

  const logout = () => {
    setToken(false)
    localStorage.removeItem("token")
    setShowProfileMenu(false)
    setShowMenu(false)
    navigate("/")
  }

  const navLinkClass = ({ isActive }) =>
    `py-1 ${isActive ? 'text-[#5F6FFF]' : ''}`

  return (
    <div className='relative flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={() => navigate("/")} src={assets.logo} alt="Logo" className='w-36 sm:w-44 cursor-pointer' />

      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to="/" end className={navLinkClass}>
          <li className='py-1'>HOME</li>
        </NavLink>
        <NavLink to="/doctors" className={navLinkClass}>
          <li className='py-1'>ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about" className={navLinkClass}>
          <li className='py-1'>ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className={navLinkClass}>
          <li className='py-1'>CONTACT</li>
        </NavLink>
      </ul>

      <div className='flex items-center gap-3 sm:gap-4'>
        {token ? (
          <div className='relative flex items-center gap-2 cursor-pointer'>
            <img
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className='w-8 rounded-full'
              src={assets.profile_pic}
              alt="Profile"
            />
            <img
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className='w-2.5'
              src={assets.dropdown_icon}
              alt=""
            />

            {showProfileMenu && (
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                  <p
                    onClick={() => { setShowProfileMenu(false); navigate('/my-profile') }}
                    className='hover:text-black cursor-pointer'
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => { setShowProfileMenu(false); navigate('/my-appointments') }}
                    className='hover:text-black cursor-pointer'
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={logout}
                    className='hover:text-black cursor-pointer'
                  >
                    Log Out
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-[#5F6FFF] text-white px-4 py-2 sm:px-8 sm:py-3 rounded-full font-light hidden md:block hover:bg-[#4B5BE6] active:scale-95 transition-all duration-300'
          >
            Create Account
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={assets.menu_icon}
          alt="Menu"
        />
      </div>

      {/* ---------- Mobile Menu ---------- */}
      <div
        className={`fixed md:hidden top-0 right-0 bottom-0 z-30 bg-white transition-all duration-300 overflow-hidden ${
          showMenu ? 'w-full' : 'w-0'
        }`}
      >
        <div className='flex items-center justify-between px-5 py-5 border-b border-gray-200'>
          <img src={assets.logo} alt="Logo" className='w-36' />
          <img
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            alt="Close"
            className='w-6 cursor-pointer'
          />
        </div>

        <ul className='flex flex-col items-center gap-2 mt-8 px-5 text-lg font-medium'>
          <NavLink onClick={() => setShowMenu(false)} to="/" end className={navLinkClass}>
            <li className='px-4 py-2 rounded-full inline-block'>HOME</li>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/doctors" className={navLinkClass}>
            <li className='px-4 py-2 rounded-full inline-block'>ALL DOCTORS</li>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about" className={navLinkClass}>
            <li className='px-4 py-2 rounded-full inline-block'>ABOUT</li>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact" className={navLinkClass}>
            <li className='px-4 py-2 rounded-full inline-block'>CONTACT</li>
          </NavLink>

          {token ? (
            <>
              <NavLink onClick={() => setShowMenu(false)} to="/my-profile" className={navLinkClass}>
                <li className='px-4 py-2 rounded-full inline-block'>MY PROFILE</li>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/my-appointments" className={navLinkClass}>
                <li className='px-4 py-2 rounded-full inline-block'>MY APPOINTMENTS</li>
              </NavLink>
              <button
                onClick={logout}
                className='mt-4 border border-[#5F6FFF] text-[#5F6FFF] px-8 py-3 rounded-full font-light active:scale-95 transition-all duration-300'
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => { setShowMenu(false); navigate('/login') }}
              className='mt-4 bg-[#5F6FFF] text-white px-8 py-3 rounded-full font-light active:scale-95 transition-all duration-300'
            >
              Create Account
            </button>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Navbar

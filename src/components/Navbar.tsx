"use client"

import React, { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation" // This hook is a Client Component hook [^2]

// Custom NavLink component
interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  highlight?: boolean
}

const NavLink = React.memo(({ href, children, className, onClick, highlight }: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`px-3 py-1 transition-all duration-200 relative overflow-hidden group ${
        isActive ? "font-medium" : ""
      } ${highlight ? "bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2 font-medium" : ""} ${className || ""}`}
      onClick={onClick}
      prefetch={true}
    >
      <span className="relative z-10">{children}</span>
      {!highlight && (
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-white ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          } transition-all duration-200 ease-in-out`}
        ></span>
      )}
    </Link>
  )
})

NavLink.displayName = "NavLink"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Optimize scroll handler with throttling
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Memoize toggle function to prevent unnecessary re-renders
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  // Memoize close function
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  // Optimize mobile menu click outside handler
  useEffect(() => {
    if (!isMenuOpen) return

    const closeMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("#mobile-menu") && !target.closest("#menu-button")) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("click", closeMenu)
    return () => document.removeEventListener("click", closeMenu)
  }, [isMenuOpen])

  return (
    <nav
      className={`flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || isMenuOpen ? "bg-black shadow-lg" : "bg-black"
      } text-white`}
    >
      <Link
        href="/"
        prefetch={true}
        className="flex items-center hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer z-20"
      >
        <div className="w-[70px] h-[50px] relative">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8 items-center">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/alumni">Alumni</NavLink>
        <NavLink href="/register">Alumni Register</NavLink>
        <NavLink href="/faculty">Faculty</NavLink>
        {/* <NavLink href="/gallery">Gallery</NavLink> */}
        <NavLink href="/contribution" highlight={true} className="ml-4">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contribute
          </span>
        </NavLink>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden z-20">
        <button
          id="menu-button"
          className="p-2 hover:bg-gray-800 rounded-md transition-colors duration-300"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu - Simplified animation */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-black z-10 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } transition-opacity duration-200 ease-in-out md:hidden pt-24`}
        style={{ transform: "none" }} // Remove transform for better performance
      >
        <div className="flex flex-col items-center space-y-8 mt-8">
          <NavLink href="/" className="text-xl" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink href="/alumni" className="text-xl" onClick={closeMenu}>
            Alumni
          </NavLink>
          <NavLink href="/register" className="text-xl" onClick={closeMenu}>
            Alumni Register
          </NavLink>
          <NavLink href="/faculty" className="text-xl" onClick={closeMenu}>
            Faculty
          </NavLink>
          <NavLink href="/gallery" className="text-xl" onClick={closeMenu}>
            Gallery
          </NavLink>
          
          {/* Contribution button for mobile */}
          <Link
            href="/contribution"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center"
            onClick={closeMenu}
            prefetch={true}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contribute
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default React.memo(Navbar)
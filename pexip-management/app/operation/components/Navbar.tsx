// app/shared/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import IconPexip from "@/public/icons/icon-pexip.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#032137] text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="">
            <Image
              src={IconPexip}
              alt="Pexip Management"
              width={100}
              height={100}
            />
          </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4">
          <a href="#home" className="hover:text-gray-300">
            Home
          </a>
          <a href="#features" className="hover:text-gray-300">
            Features
          </a>
          <a href="#pricing" className="hover:text-gray-300">
            Pricing
          </a>
          <a href="#about" className="hover:text-gray-300">
            Meeting List
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="block md:hidden focus:outline-none"
          aria-label="Menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <a href="#home" className="block px-4 py-2 hover:bg-gray-700">
            Home
          </a>
          <a href="#features" className="block px-4 py-2 hover:bg-gray-700">
            Features
          </a>
          <a href="#pricing" className="block px-4 py-2 hover:bg-gray-700">
            Pricing
          </a>
          <a href="#about" className="block px-4 py-2 hover:bg-gray-700">
            About
          </a>
        </div>
      )}
    </nav>
  );
}

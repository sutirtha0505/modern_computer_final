"use client";
import { useState } from "react";
import { FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { IoCall } from "react-icons/io5";

const DraggableCircularNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const onDrag = (e: MouseEvent) => {
    const nav = document.querySelector("nav");
    if (nav) {
      const navStyle = window.getComputedStyle(nav),
        navTop = parseInt(navStyle.top),
        navHeight = parseInt(navStyle.height),
        windHeight = window.innerHeight;

      nav.style.top = navTop > 0 ? `${navTop + e.movementY}px` : "1px";
      if (navTop > windHeight - navHeight) {
        nav.style.top = `${windHeight - navHeight}px`;
      }
    }
  };

  const addDragListeners = () => {
    const nav = document.querySelector("nav");
    if (window.innerWidth > 768) {
      nav?.addEventListener("mousemove", onDrag);
    }
  };

  const removeDragListeners = () => {
    const nav = document.querySelector("nav");
    nav?.removeEventListener("mousemove", onDrag);
  };

  return (
    <nav
      className={`nav ${isOpen ? "open" : ""} fixed top-5 right-2`}
      onMouseDown={addDragListeners}
      onMouseUp={removeDragListeners}
      onMouseLeave={removeDragListeners}
    >
      <div className="nav-content">
        <div className="toggle-btn" onClick={toggleNav}>
          <img
            src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/customer-service.png"
            alt="customer service"
            height={30}
            width={30}
            className="customer-care"
          />
        </div>
        <span style={{ "--i": 1 } as React.CSSProperties}>
          <div className="planets first-planet">
            <FaWhatsapp className="text-green-500 icons" />
          </div>
        </span>
        <span style={{ "--i": 2 } as React.CSSProperties}>
          <div className="planets second-planet">
            {/* <FaInstagram className="gradient-icon icons" /> */}
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/Instagram-Logo.png"
              alt=""
              width={50}
              height={50}
            />
          </div>
        </span>
        <span style={{ "--i": 3 } as React.CSSProperties}>
          <div className="planets third-planet">
            <FaYoutube className="text-red-600 icons" />
          </div>
        </span>
        <span style={{ "--i": 4 } as React.CSSProperties}>
          <div className="planets forth-planet">
            <IoCall className="text-green-600 icons" />
          </div>
        </span>
        <span style={{ "--i": 5 } as React.CSSProperties}>
          <div className="planets fifth-planet">
            <FaFacebook className="text-blue-600 icons" />
          </div>
        </span>
        <span style={{ "--i": 6 } as React.CSSProperties}>
          <div className="planets sixth-planet">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/gmail.png"
              className="gmail"
              alt=""
              width={30}
              height={30}
            />
          </div>
        </span>
      </div>
    </nav>
  );
};

export default DraggableCircularNav;

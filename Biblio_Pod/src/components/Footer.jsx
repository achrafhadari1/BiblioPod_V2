import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full h-full top-0 relative">
      <footer className="z-10 bg-white rounded-lg shadow m-4 w-90-l-6 bottom-0 fixed absolute ">
        <div className="okeymobile w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="reserved-text text-sm text-gray-500 sm:text-center ">
            © 2023{" "}
            <Link to="/" className="hover:underline">
              BiblioPod
            </Link>
            . All Rights Reserved.
          </span>
          <ul className="ul-footer flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500  sm:mt-0">
            <li>
              <Link to="#" className="hover:underline me-4 md:me-6">
                About
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:underline me-4 md:me-6">
                Licensing
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

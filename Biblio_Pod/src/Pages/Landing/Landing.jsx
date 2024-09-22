import React from "react";
import { Button } from "../../components/ui/button";

import { Link } from "react-router-dom";
import "./landing.css";
export const Landing = () => {
  return (
    <>
      <div className="relative flex flex-col w-full h-screen">
        <div className="top-part-la h-1/6 w-full">
          <nav className="bg-white ">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
              {/* Empty div for spacing */}
              <div className="flex-1"></div>

              {/* Logo in the center */}
              <div className="flex-1 text-center">
                <img src="logo-long.png" alt="Logo" className="h-10 mx-auto" />
              </div>

              {/* Login and Create Account buttons on the right */}
              <div className="flex-1 text-right">
                <div className="flex justify-end gap-4">
                  <Link to="/login">
                    <Button>login</Button>
                  </Link>

                  <Link to="/signup">
                    <Button variant={"outline"}>Create an Account</Button>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <hr />
        </div>
        <div className="text-part-la h-4/6 w-full text-center text-7xl content-center">
          Experience the Joy of Reading Anywhere, Anytime
        </div>
        <div className="authors-part-la h-64 flex overflow-clip">
          <img src="authors/1.png " className="h-full  " alt="jane austin" />
          <img
            src="authors/2.png"
            className="h-full authors-image"
            alt="milkShke"
          />
          <img src="authors/3.png" className="h-full img-3" alt="milkShke" />
          <img src="authors/4.png" className="h-full img-4" alt="milkShke" />
          <img src="authors/5.png" className="h-full img-5" alt="milkShke" />
          <img src="authors/6.png" className="h-full img-6" alt="milkShke" />
          <img src="authors/7.png" className="h-full img-7" alt="milkShke" />
          <img src="authors/8.png" className="h-full img-8" alt="milkShke" />
          <img src="authors/9.png" className="h-full img-9" alt="milkShke" />
          <img src="authors/10.png" className="h-full img-10" alt="milkShke" />
        </div>
      </div>
    </>
  );
};

import React from "react";
import Footer from "../../components/Footer";
import { AddToCollection } from "../../components/Navbar/AddToCollection";
import { NewNav } from "../../components/NewNav";
import { CollectionShelf } from "./CollectionShelf";

export const CollectionLists = () => {
  return (
    <>
      <NewNav />
      <div className="h-full w-full ">
        <div className="con-list-container w-4/5 m-auto flex-wrap   h-full  flex gap-20">
          <div className=" shelf-top">
            <div className="text-5xl	container_lists_title">
              Your Collections{" "}
            </div>
            <div className="new-col-btn ">
              <AddToCollection />
            </div>
          </div>
          <div className="flex gap-20 w-full p-4 flex-wrap">
            <CollectionShelf />
          </div>
        </div>
      </div>
    </>
  );
};

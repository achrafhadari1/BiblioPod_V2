import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import { NewNav } from "../../components/NewNav";
import { CollectionSwiper } from "./CollectionSwiper";
import { IoGridOutline } from "react-icons/io5";
import { BiCarousel } from "react-icons/bi";
import { CollectionGrid } from "./CollectionGrid";
import { EditCollection } from "./EditCollection";
export const Collection = () => {
  const [showGrid, setShowGrid] = useState(true);
  const toggleIcons = () => {
    setShowGrid((prev) => !prev);
  };
  const [collectionName, setCollectionName] = useState("");
  const [bookData, setBookData] = useState([]);

  const { id } = useParams(); // Get the collection ID from URL params

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`/collected-books/details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookData(response.data.books);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching collection details:", error);
      }
    };
    const fetchCollectionName = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`/collections/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCollectionName(response.data.collection);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching collection details:", error);
      }
    };

    fetchCollectionDetails();
    fetchCollectionName();
  }, [id]);

  return (
    <>
      <NewNav />
      <div className="w-full m-auto h-full">
        <div className="w-4/5 m-auto flex justify-between h-1/4 items-center">
          <div></div>
          <div className="text-center">
            <div className="bold text-4xl">
              Collection: {collectionName.collection_name}
            </div>

            <div>{collectionName.collection_description}</div>
            <div className="opacity-50	">{`${bookData.length} books`}</div>
          </div>
          <div className="icon-outer-container">
            <div
              className="icon-container cursor-pointer"
              onClick={toggleIcons}
            >
              {showGrid ? (
                <BiCarousel size={20} />
              ) : (
                <IoGridOutline size={20} />
              )}
            </div>
            <EditCollection
              BooksByCollection={bookData}
              collection={collectionName}
              textColor="text-black"
            />
          </div>
        </div>
        {/* Conditionally render CollectionGrid */}
        {showGrid && <CollectionGrid books={bookData} />}
        {/* Conditionally render CollectionSwiper */}
        {showGrid || <CollectionSwiper books={bookData} />}
      </div>
    </>
  );
};

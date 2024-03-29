import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import "../../components/style/collections.css";
import { MdDeleteOutline } from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";
import { EditCollection } from "./EditCollection";
import { CircularProgress } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export const CollectionShelf = () => {
  const [collections, setCollections] = useState([]);
  const [collectionNames, setCollectionNames] = useState({});
  const [booksByCollection, setBooksByCollection] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("/collections", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCollections(response.data.collections);

        const names = response.data.collections.reduce((acc, curr) => {
          acc[curr.id] = curr.collection_name;
          return acc;
        }, {});

        setCollectionNames(names);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const fetchBooksByCollectionId = async (collectionId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `/collected-books/details/${collectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.books;
    } catch (error) {
      console.error(
        `Error fetching books for collection ID ${collectionId}:`,
        error
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBooksForAllCollections = async () => {
      const booksByCollectionId = {};

      for (const collection of collections) {
        const books = await fetchBooksByCollectionId(collection.id);
        booksByCollectionId[collection.id] = books;
      }

      setBooksByCollection(booksByCollectionId);
    };

    fetchBooksForAllCollections();
  }, [collections]);

  // Function to check if a collection has no books
  const hasNoBooks = (collectionId) => {
    return (
      !booksByCollection[collectionId] ||
      booksByCollection[collectionId].length === 0
    );
  };

  // Function to delete a collection
  const deleteCollection = async (collectionId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`/collections/${collectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After successful deletion, update the collections state to remove the deleted collection
      setCollections((prevCollections) =>
        prevCollections.filter((collection) => collection.id !== collectionId)
      );
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  // Function to generate a random RGB color
  const getRandomColor = () => {
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
    return randomColor;
  };

  // Function to navigate to collection details
  const navigateToCollection = (collectionId) => {
    navigate(`/collections/${collectionId}`);
  };

  return (
    <>
      {loading ? (
        <div className="h-full w-full flex justify-center items-center">
          <CircularProgress size="lg" color="default" />
        </div>
      ) : (
        collections.map((collection) => (
          <div
            key={collection.id}
            className=" cursor-pointer flex shelf-container"
            style={{
              background: `linear-gradient(90deg, rgb(1, 1, 1) 35%, ${getRandomColor()} 100%)`,
            }}
            onClick={() => navigateToCollection(collection.id)}
          >
            <div className="shelf_icons">
              <MdDeleteOutline
                className="font-20"
                onClick={(event) => {
                  event.stopPropagation(); // Stop event propagation
                  deleteCollection(collection.id);
                }}
              />
              <div onClick={(event) => event.stopPropagation()}>
                <EditCollection
                  textColor="text-white"
                  onClick={(event) => {
                    event.stopPropagation(); // Stop event propagation
                  }}
                  BooksByCollection={booksByCollection[collection.id] || []}
                  collection={collection}
                />
              </div>
            </div>

            <div className="title-and-count">
              <div className="Pex37">
                {booksByCollection[collection.id]?.length} books
              </div>
              <div>{collectionNames[collection.id]}</div>
            </div>
            <div className="weird-img-container">
              {hasNoBooks(collection.id) ? (
                <img
                  className=""
                  src="shef_empty_doodle.svg"
                  alt="Empty Shelf"
                />
              ) : (
                booksByCollection[collection.id]
                  ?.slice(0, 3)
                  .map((book, index) => (
                    <img
                      key={book.id}
                      className={`rounded-lg shadow-md img${index + 1}`}
                      src={
                        book.thumbnail && book.thumbnail.startsWith("public")
                          ? `http://127.0.0.1:8000/${book.thumbnail.replace(
                              "public",
                              "storage"
                            )}`
                          : book.thumbnail
                      }
                      alt="Book Poster"
                    />
                  ))
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
};

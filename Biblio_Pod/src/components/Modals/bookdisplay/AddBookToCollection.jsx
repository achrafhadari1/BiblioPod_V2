import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";

export const AddBookToCollection = ({ closeModal, bookName, identifier }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [collectedBooks, setCollectedBooks] = useState([]);

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
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    const fetchCollectedBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        if (!identifier) {
          console.error("Identifier is not defined");
          return;
        }

        const response = await axios.get(`/collected-books/${identifier}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCollectedBooks(response.data.collections);
        console.log(collectedBooks);
      } catch (error) {
        console.error("Error fetching collected books:", error);
      }
    };

    fetchCollections();
    fetchCollectedBooks();
  }, [identifier]);

  const formatUpdatedAt = (updatedAt) => {
    const date = new Date(updatedAt);
    return date.toLocaleString();
  };

  const toggleCollection = (id) => {
    const isSelected = selectedCollections.includes(id);

    if (isSelected) {
      setSelectedCollections((prev) =>
        prev.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedCollections((prev) => [...prev, id]);
    }
  };

  const storeMethod = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/collected-books",
        {
          identifier: identifier,
          selectedCollections: selectedCollections,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closeModal();
    } catch (error) {
      console.error("Error storing books to collections:", error);
    }
  };
  const disabledStyle = {
    opacity: 0.5, // Adjust opacity as needed
    pointerEvents: "none",
  };

  const isBookInCollection = (collectionId) => {
    return collectedBooks.some(
      (collectedBook) => collectedBook.id === collectionId
    );
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={closeModal}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="height_37rem w-6/12 flex flex-col gap-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all"
          role="dialog"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-around h-full w-full ">
            <div className="flex w-11/12 gap-4 flex-col ">
              <div className="m-8 font-bold text-xl">Add {bookName} to:</div>
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className={`cursor-pointer flex flex-col w-full rounded-lg gap-4 p-4 border-slate-800 border-solid ${
                    selectedCollections.includes(collection.id)
                      ? "border-4" // Add a thicker border for selected collections
                      : " border"
                  } ${isBookInCollection(collection.id) ? "disabled" : ""}`}
                  style={isBookInCollection(collection.id) ? disabledStyle : {}}
                  onClick={() => {
                    if (!isBookInCollection(collection.id)) {
                      toggleCollection(collection.id);
                    }
                  }}
                >
                  <div className="text-3xl">
                    {collection.collection_name}{" "}
                    <span className="text-xs">
                      {" "}
                      {isBookInCollection(collection.id) ? "Already Added" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div>Contains {collection.books_count} Books</div>
                    <div>Updated {formatUpdatedAt(collection.updated_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={closeModal}
              type="button"
              className="black-hex w-2/5 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
            <button
              onClick={storeMethod}
              type="button"
              className="black-hex w-2/5 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

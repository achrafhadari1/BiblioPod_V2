import React, { useState } from "react";
import axios from "../../api/axios";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { BiAddToQueue } from "react-icons/bi";

export const AddToCollection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [collectionData, setCollectionData] = useState({
    collection_name: "",
    collection_description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollectionData({
      ...collectionData,
      [name]: value,
    });
  };

  const handleCreateCollection = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/collections", collectionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      closeModal();
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full cursor-pointer">
      {/* Modal toggle */}
      <li className="item" onClick={openModal}>
        <div className="link flex items-center">
          <BiAddToQueue className="nav-logo" />
          <span>New Collection</span>
        </div>
      </li>
      {isOpen && (
        <div
          className="fixed z-50 inset-0 overflow-y-auto cursor-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-labelledby="modal-headline"
            >
              {/* Replace the following divs with your content */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Make a Collection
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 flex flex-col gap-4 text-left">
                      <div className="m-auto grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="collection_name"
                          value={collectionData.collection_name}
                          onChange={handleChange}
                          placeholder="Enter collection Name"
                        />
                      </div>
                      <div className="m-auto grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                          id="description"
                          name="collection_description"
                          rows="4"
                          value={collectionData.collection_description}
                          onChange={handleChange}
                          className="border-black bg-white block p-2.5 w-full text-sm text-gray-900 rounded-lg border"
                          placeholder="Write your thoughts here..."
                        ></textarea>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
              {/* End of content divs */}

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={closeModal}
                  type="button"
                  className="black-hex w-2/5 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
                <button
                  onClick={handleCreateCollection}
                  type="button"
                  className="black-hex w-2/5 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Make
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

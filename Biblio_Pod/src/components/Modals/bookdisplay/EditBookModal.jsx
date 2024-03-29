import React, { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import axios from "../../../api/axios";
import { MdUploadFile } from "react-icons/md";
import { CircularProgress } from "@nextui-org/react";

export const EditBookModal = ({
  isOpen,
  closeModal,
  identifier,
  userId,
  updateBookData,
}) => {
  const [bookData, setBookData] = useState({});
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Define formData as local state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    language: "",
    description: "",
    thumbnail: "", // Initialize thumbnail as empty
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        console.log(identifier);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in local storage");
        }
        const response = await axios.get(`/books/${identifier.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const bookInfo = response.data.book;
        setBookData(bookInfo);
        setFormData(bookInfo); // Set formData with the fetched book data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };
    fetchBook();
  }, [identifier, userId]); // Include identifier and userId in the dependency array

  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (id === "file-input" && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          thumbnail: reader.result, // Update thumbnail with the uploaded image data
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      // Check if any required fields are empty
      const requiredFields = ["title", "author"];
      for (const field of requiredFields) {
        if (!formData[field]) {
          setUpdateErrorMessage(`${field} is required`);
          return;
        }
      }

      // Remove the thumbnail from formData if it's empty or unchanged
      const updatedFormData = { ...formData };
      if (
        !updatedFormData.thumbnail ||
        updatedFormData.thumbnail === bookData.thumbnail
      ) {
        delete updatedFormData.thumbnail;
      }

      // Send update request
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in local storage");
      }
      const response = await axios.put(
        `/books/${identifier}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Book updated successfully:", response.data);
      updateBookData(response.data.book, identifier);

      closeModal();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  if (loading) {
    // Render a loading indicator while fetching user
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

          <div className="h-screen w-full flex justify-center items-center">
            <CircularProgress size="lg" color="default" />
          </div>
        </div>
      </div>
    );
  }

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
          className="height_37rem w-3/5 flex flex-col gap-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all"
          role="dialog"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-around h-full">
            <div className="flex w-6/12 gap-4 flex-col">
              <div className="m-8 font-bold text-xl">Edit your Book</div>
              <div className="m-auto grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="title">Book Title</Label>
                <Input
                  id="title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="m-auto grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="author">Book Author</Label>
                <Input
                  id="author"
                  placeholder="Enter book author"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>
              <div className="m-auto grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  placeholder="Enter book genre"
                  value={formData.genre}
                  onChange={handleChange}
                />
              </div>
              <div className="m-auto grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="language">Book Language</Label>
                <Input
                  id="language"
                  placeholder="Enter book language"
                  value={formData.language}
                  onChange={handleChange}
                />
              </div>
              <div className="m-auto grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows="4"
                  className="border-black bg-white block p-2.5 w-full text-sm text-gray-900 rounded-lg border"
                  placeholder="Write your thoughts here..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="flex-col justify-center h-full flex items-center w-2/5">
              <div className="h-1/5"></div>
              <div className="upload-cover-container h-4/6 w-3/4">
                {formData.thumbnail &&
                  (formData.thumbnail.startsWith("public") ? (
                    <img
                      className="rounded-2xl h-full w-full"
                      src={`http://127.0.0.1:8000/${formData.thumbnail.replace(
                        "public",
                        "storage"
                      )}`}
                      alt="Book Poster"
                    />
                  ) : (
                    <img
                      className="rounded-2xl h-full w-full"
                      src={formData.thumbnail}
                      alt="Book Poster"
                    />
                  ))}
                <div className="input-icon transition ease-in-out delay-150 w-full h-full flex justify-center items-center rounded-xl black-rgba">
                  <label htmlFor="file-input">
                    <MdUploadFile className="cursor-pointer w-8 h-8 text-white" />
                  </label>
                  <input id="file-input" type="file" onChange={handleChange} />
                </div>
              </div>
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
              onClick={handleUpdate}
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

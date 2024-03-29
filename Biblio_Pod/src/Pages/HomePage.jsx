import React, { useState, useEffect } from "react";
import axios from "axios";
import ePub from "epubjs";
import { BookDisplay } from "../components/BookDisplay";
import { ContinueReading } from "../components/ContinueReading";
import { Input } from "../components/ui/input";
import "../index.css";
import { MdNavigateNext } from "react-icons/md";
import { AuthProvider, useAuthContext } from "../context/AuthContext";
import { CircularProgress } from "@nextui-org/react";

import { BsListColumnsReverse } from "react-icons/bs";
import { NewNav } from "../components/NewNav";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { FilterByCategory } from "../components/FilterByCategory";
export const HomePage = () => {
  const [fileDetails, setFileDetails] = useState([]);
  const [bookGoogle, setbookGoogle] = useState([]);
  const [genres, setGenres] = useState([]);
  const [sortOption, setSortOption] = useState("updated");

  const [loading, setLoading] = useState(true);

  const selectedBook = JSON.parse(localStorage.getItem("selectedBook"));

  const { user } = useAuthContext(); // Access user data from the authentication context

  useEffect(() => {
    if (user) {
      // Fetch books associated with the logged-in user
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFileDetails(response.data.books);
      setGenres(response.data.books.map((book) => book.genre));
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const storeBook = async (bookDetails, file) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in local storage");
      }

      await Promise.all(Object.values(bookDetails));

      const formData = new FormData();
      for (const [key, value] of Object.entries(bookDetails)) {
        formData.append(key, value);
      }

      formData.append(`file`, file);

      console.log(bookDetails);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/books",
        formData, // Pass user_id directly without quotes
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      console.log("Book stored successfully:", response.data);
      // Handle success
    } catch (error) {
      console.error("Error storing book:", error);
      // Handle error
    }
  };
  const handleDeleteBook = (deletedIdentifier) => {
    // Filter out the deleted book from fileDetails
    const updatedFileDetails = fileDetails.filter(
      (book) => book.isbn !== deletedIdentifier
    );
    setFileDetails(updatedFileDetails);
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      try {
        const updatedFileDetails = [];
        const updatedBookGoogleDetails = []; // New array to store bookGoogle details for each file

        for (const file of files) {
          const bookInfo = await parseEpub(file);
          const additionalDetails = await fetchBookDetails(
            bookInfo.title,
            bookInfo.author,
            bookInfo.language,
            user.id
          );
          const combinedDetails = { ...bookInfo, ...additionalDetails };
          updatedFileDetails.push(combinedDetails);

          // Store the bookGoogle details for each file
          updatedBookGoogleDetails.push({ ...additionalDetails });
        }

        setFileDetails((prevFileDetails) => [
          ...prevFileDetails,
          ...updatedFileDetails,
        ]);
        updatedFileDetails.forEach((bookDetails, index) => {
          const singleFile = files[index]; // Get the corresponding file
          storeBook(bookDetails, singleFile); // Pass only one file
        });
        // Update the state with the stored bookGoogle details
        setbookGoogle(updatedBookGoogleDetails);
      } catch (error) {
        console.error("Error processing ePub files:", error);
      }
    }
  };

  const parseEpub = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const book = ePub(reader.result);
          await book.ready;

          const meta = book.package.metadata;

          const bookInfo = {
            title: meta.title || "Unknown Title",
            author: meta.creator || "Unknown Author",
            publisher: meta.publisher || "Unknown Publisher",
            language: meta.language || "en",
          };

          resolve(bookInfo);
          console.log(bookInfo);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // In the fetchBookDetails function, update the id generation logic
  const fetchBookDetails = async (title, author, language, userId) => {
    const urlApi = `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}+inauthor:${author}&printType=books&langRestrict=en`;

    console.log(urlApi);
    try {
      const response = await axios.get(urlApi);
      const bookDetails = response.data.items[0]?.volumeInfo;
      setbookGoogle(bookDetails);
      return {
        thumbnail: bookDetails?.imageLinks?.thumbnail || "",
        description: bookDetails?.description || "No description available",
        isbn:
          `${bookDetails?.industryIdentifiers[0].identifier}` ||
          "No id available", // Concatenate user ID with book ID
        genre: bookDetails?.categories[0] || "Unknown",
      };
    } catch (error) {
      console.error("Error fetching book details from Google API:", error);
      return {};
    } finally {
      setLoading(false);
    }
  };

  console.log(fileDetails);

  const updateBookData = (updatedBook, identifier) => {
    setFileDetails((prevFileDetails) =>
      prevFileDetails.map((book) =>
        book.isbn === identifier ? updatedBook : book
      )
    );
  };

  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    if (selectedGenres.includes(value)) {
      setSelectedGenres(selectedGenres.filter((genre) => genre !== value));
    } else {
      setSelectedGenres([...selectedGenres, value]);
    }
  };

  const sortedFilteredBooks = fileDetails
    .filter((book) => {
      if (selectedGenres.length === 0) return true;
      return selectedGenres.includes(book.genre);
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "last_uploaded":
          return new Date(b.created_at) - new Date(a.created_at);
        case "alphabetic":
          return a.title.localeCompare(b.title);
        case "older":
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });
  const sortOptions = [
    { label: "Updated", value: "updated" },
    { label: "Last Uploaded", value: "last_uploaded" },
    { label: "Alphabetic", value: "alphabetic" },
    { label: "Older", value: "older" },
  ];

  if (loading) {
    // Render a loading indicator while fetching user
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <CircularProgress size="lg" color="default" />
      </div>
    );
  }

  return (
    <>
      <NewNav />
      <div
        className={`library-container ${selectedBook === null ? "m-auto" : ""}`}
      >
        {fileDetails.length > 0 ? (
          <div className="library-not-empty-to-show-the-fucking-add-book-input default-width">
            <div className="lib-title">My Library</div>
            <div className="input-centered ">
              <Input
                id="picture"
                className="cursor-pointer"
                onChange={handleFileChange}
                placeholder="add more books"
                multiple
                accept=".epub"
                type="file"
              />
            </div>
          </div>
        ) : (
          <div className="lib-title default-width">My Library</div>
        )}
        <div className="main-page-coll-pt line-heightx4 w-full default-width">
          <hr />
          <div className="main-page-coll-pt-inner flex justify-between items-center ">
            <div className="flex items-center gap-2">
              <div className="text-white bg-black  rounded-full flex justify-center items-center w-8 h-8">
                <BsListColumnsReverse />
              </div>
              <div>Collections</div>
            </div>
            <div>
              <Link to="/Collections">
                <MdNavigateNext className="cursor-pointer" />
              </Link>
            </div>
          </div>
          <hr />
        </div>

        <FilterByCategory
          bookGenres={genres}
          handleCheckboxChange={handleCheckboxChange}
          sortOptions={sortOptions}
          sortOptionHome={sortOption} // Change prop name to sortOptionHome
          handleSortChange={(option) => setSortOption(option)}
        />
        <div className="lib-inner-container default-width ">
          <div className="lib-books-container ">
            {sortedFilteredBooks.length > 0 ? (
              sortedFilteredBooks.map((book, index) => (
                <div key={index}>
                  <BookDisplay
                    onDeleteBook={handleDeleteBook}
                    title={book.title}
                    author={book.author}
                    img={book.thumbnail}
                    identifier={book.isbn.toString()}
                    description={book.description}
                    rating={book.rating}
                    updateBookData={updateBookData}
                  />
                </div>
              ))
            ) : (
              <div className="empty-Lib-container ">
                <div className="bold-sub-head">Your Library is Empty!</div>
                <div>
                  add as many books as you want by dropping the epub files or
                  select them from your local storage
                </div>
                <div className="input-centered ">
                  <Input
                    id="picture"
                    className="cursor-pointer"
                    multiple
                    onChange={handleFileChange}
                    accept=".epub"
                    type="file"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 pb-20 "></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

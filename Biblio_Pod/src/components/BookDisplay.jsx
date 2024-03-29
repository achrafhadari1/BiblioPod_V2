import React, { useState, useEffect, useReducer } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import axios from "../api/axios";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  cn,
} from "@nextui-org/react";
import { AddNoteIcon } from "./Modals/bookdisplay/AddNoteIcon";
import { CopyDocumentIcon } from "./Modals/bookdisplay/CopyDocumentIcon";
import { EditDocumentIcon } from "./Modals/bookdisplay/EditDocumentIcon";
import { DeleteDocumentIcon } from "./Modals/bookdisplay/DeleteDocumentIcon";
import { motion } from "framer-motion";
import "./style/bookdisplay.css";
import "../index.css";
import { EditBookModal } from "./Modals/bookdisplay/EditBookModal";
import { useNavigate } from "react-router-dom";
import { RatingComponent } from "./RatingComponent";
import { AddBookToCollection } from "./Modals/bookdisplay/AddBookToCollection";
import { useAuthContext } from "../context/AuthContext";

export const BookDisplay = ({
  title,
  userId,
  author,
  img,
  identifier,
  onDeleteBook,
  bookDetails,
  rating: initialRating,
  updateBookData,
}) => {
  const navigate = useNavigate();
  const goToRead = () => {
    navigate(`/read?book=${identifier.toString()}`);
  };
  // State to manage EditBookModal visibility

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // State to manage AddBookToCollection visibility

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [rating, setRating] = useState(initialRating); // Local state for rating
  const [readingProgress, setReadingProgress] = useState(null);
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const { user } = useAuthContext();
  useEffect(() => {
    const fetchReadingProgress = async () => {
      console.log(identifier);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in local storage");
          return 0;
        }

        const response = await axios.get(`/user-book-progress/${identifier}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { current_percentage } = response.data.progress;

        // Set the reading progress state
        setReadingProgress(current_percentage || 0);

        return current_percentage || 0;
      } catch (error) {
        return 0;
      }
    };

    // Call the function
    fetchReadingProgress();
  }, [identifier]);

  const deleteBook = async (identifier) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in local storage");
      }
      const response = await axios.delete(`/books/${identifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Book deleted successfully:", response.data);

      // Emit event to inform parent component about book deletion
      onDeleteBook(identifier);

      // Handle success
    } catch (error) {
      console.error("Error deleting book:", error);
      // Handle error
    }
  };
  const deleteProgress = async (isbn) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("token not found in local storage");
      }
      const response = await axios.delete(`/user-book-progress/${isbn}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Progress Deleted", response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ x: 20, opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="bookContainer"
      >
        {img && img.startsWith("public") ? (
          <img
            className="BookPoster"
            src={`http://127.0.0.1:8000/${img.replace("public", "storage")}`}
            alt="Book Poster"
          />
        ) : (
          <img className="BookPoster" src={img} alt="Book Poster" />
        )}

        {readingProgress > 0 && (
          <p className="bookProgress">{readingProgress}%</p>
        )}

        <p className="bookTitle" onClick={() => goToRead()}>
          {title}
        </p>
        <p className="bookAuthor">{author}</p>

        <div className="hover-container">
          <div onClick={() => goToRead()} className="hover-background"></div>
          <div className="inside-bookCover">
            <IoEyeOutline
              onClick={() => goToRead()}
              className="icons-insideCover"
            />
            <MdDeleteOutline
              onClick={() => deleteBook(identifier)}
              className="icons-insideCover"
            />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="icons-insideCover trigger-button capitalize"
                >
                  <HiDotsHorizontal />
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                variant="faded"
                aria-label="Dropdown menu with description"
              >
                <DropdownSection title="Actions" showDivider>
                  <DropdownItem
                    key="add"
                    description="Add book to list"
                    startContent={<AddNoteIcon className={iconClasses} />}
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    Add to List
                  </DropdownItem>
                  <DropdownItem
                    key="Rate"
                    description="Rate this Book"
                    startContent={<CopyDocumentIcon className={iconClasses} />}
                  >
                    <RatingComponent
                      bookId={identifier}
                      currentRating={rating}
                      onRatingChange={setRating}
                      userId={user.id} // Pass callback to update rating
                    />
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    description="Edit the metadata"
                    startContent={<EditDocumentIcon className={iconClasses} />}
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Book
                  </DropdownItem>
                </DropdownSection>

                {readingProgress > 0 && (
                  <DropdownSection title="Danger zone">
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      description="Permanently clear your reading progress"
                      onClick={() => deleteProgress(identifier.toString())}
                      startContent={
                        <DeleteDocumentIcon
                          className={cn(iconClasses, "text-danger")}
                        />
                      }
                    >
                      Clear Progress
                    </DropdownItem>
                  </DropdownSection>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </motion.div>
      {isEditModalOpen && (
        <EditBookModal
          isOpen={isEditModalOpen}
          identifier={identifier.toString()}
          userId={userId}
          closeModal={() => setIsEditModalOpen(false)}
          updateBookData={updateBookData}
        />
      )}
      {isAddModalOpen && (
        <AddBookToCollection
          bookName={title}
          identifier={identifier.toString()}
          closeModal={() => setIsAddModalOpen(false)}
        />
      )}
    </>
  );
};

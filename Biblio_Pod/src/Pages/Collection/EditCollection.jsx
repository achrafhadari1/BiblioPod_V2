import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "../../components/ui/drawer";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { CiCircleMinus } from "react-icons/ci";
import { FiEdit2 } from "react-icons/fi";

export const EditCollection = ({
  BooksByCollection,
  collection,
  textColor,
}) => {
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [books, setBooks] = useState([]);
  const [deletedBookIds, setDeletedBookIds] = useState([]);
  const [originalBooks, setOriginalBooks] = useState([]);

  useEffect(() => {
    if (collection) {
      setCollectionName(collection.collection_name);
      setCollectionDescription(collection.collection_description);
    }

    if (Array.isArray(BooksByCollection)) {
      setBooks(BooksByCollection);
      setOriginalBooks(BooksByCollection);
    }
  }, [collection, BooksByCollection]);

  const removeBook = (bookId) => {
    setBooks(books.filter((book) => book.isbn !== bookId));

    setDeletedBookIds((prevDeletedBookIds) => [...prevDeletedBookIds, bookId]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      for (const bookId of deletedBookIds) {
        const response = await axios.delete(
          `/collected-books/${collection.id}/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
      }

      // Reset deletedBookIds after successful deletion
      setDeletedBookIds([]);
      setOriginalBooks(books); // Update originalBooks to reflect current state
    } catch (error) {
      console.error("Error deleting books:", error);
    }

    // Handle form submission here
    console.log("Submitted:", collectionName, collectionDescription);
  };

  const handleCancel = () => {
    // Reset books to original list when cancel is clicked
    setBooks(originalBooks);
    setDeletedBookIds([]);
  };

  return (
    <Drawer onClose={handleCancel}>
      <DrawerTrigger className="h-full">
        <FiEdit2 className={textColor} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit "{collectionName}" List</DrawerTitle>
        </DrawerHeader>
        <div className="form_edit_grid mt-2 justify-evenly flex w-full">
          <p className="form_edit_child mb-8 w-3/6 text-sm text-gray-500 flex flex-col gap-4 text-left">
            <div className="m-auto grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="collection_name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Enter collection Name"
              />
            </div>
            <div className="m-auto grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="collection_description"
                value={collectionDescription}
                onChange={(e) => setCollectionDescription(e.target.value)}
                rows="4"
                className="border-black bg-white block p-2.5 w-full text-sm text-gray-900 rounded-lg border"
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
          </p>
          <div className="remove_books_edit w-5/12 flex flex-col justify-center">
            {books.map((book) => (
              <div className="edit-books-lineup flex gap-4" key={book.isbn}>
                <div className="w-11/12">{book.title}</div>
                <div>
                  <CiCircleMinus
                    className="text-orange-700 text-2xl cursor-pointer"
                    onClick={() => removeBook(book.isbn)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <DrawerFooter className="drawer_buttons">
          <DrawerClose>
            <Button className="w-1/8 m-auto" onClick={handleSubmit}>
              Modify
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

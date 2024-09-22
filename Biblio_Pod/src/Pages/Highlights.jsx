import React, { useState, useEffect } from "react";
import { NewNav } from "../components/NewNav";
import "../components/style/highlights.css";
import Card from "../components/Modals/card";
import axios from "../api/axios";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";

export const Highlights = () => {
  const [books, setBooks] = useState([]);
  const [selectedAnnotations, setSelectedAnnotations] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const navigate = useNavigate();

  function hexToRgba(hex, alpha = 1) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, "");

    // Parse r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Return the rgba string
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const deleteAnnotation = async (index) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in local storage");
      }

      const annotationId = selectedAnnotations[index].id; // Assuming each annotation has a unique ID

      const response = await axios.delete(`/annotations/${annotationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Remove the deleted annotation from the state
        const updatedAnnotations = selectedAnnotations.filter(
          (_, i) => i !== index
        );
        setSelectedAnnotations(updatedAnnotations);
      }
    } catch (error) {
      console.error("Error deleting annotation:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in local storage");
        }
        const response = await axios.get("/annotationswithBooks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredBooks = response.data.books.filter(
          (book) => book.annotations_count > 0
        );
        setBooks(filteredBooks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (annotations) => {
    setSelectedAnnotations(annotations);
    console.log(selectedAnnotations);
  };

  const goToRead = () => {
    if (selectedBook !== "") {
      navigate(`/read?book=${selectedBook}`);
    }
  };

  return (
    <>
      <NewNav />
      <div className="flex h-screen w-90 m-auto gap-12	">
        <ScrollArea className=" w-2/12 rounded-md border m-4	">
          <div className="  flex-col ml-4 highlights flex  pl-2 w-full pr-10">
            <div className="  flex flex-col gap-4 flex-wrap">
              {books &&
                books.map((book) => (
                  <Card
                    key={book.isbn}
                    book={book}
                    onClick={() => {
                      handleCardClick(
                        book.annotations.map((annotation) => ({
                          text: annotation.text,
                          color: annotation.color,
                          id: annotation.id,
                        }))
                      );
                      setSelectedBook(book.isbn);
                    }}
                  />
                ))}
            </div>
            <div className="border-right-highlight"></div>
          </div>
        </ScrollArea>

        <div className="w-4/5 py-4	">
          <div className="flex h-full justify-start flex-col gap-8	">
            {selectedAnnotations.length === 0 ? (
              <p></p>
            ) : (
              <>
                <Button
                  className="w-2/12	self"
                  onClick={() => goToRead()} // Assuming you want to pass the isbn of the first book
                >
                  Go to book
                </Button>
                <ScrollArea className=" p-10 rounded-md border">
                  {selectedAnnotations.map((annotation, index) => (
                    <div className="highlight-box" key={index}>
                      <div
                        className="h-75 rounded p-1"
                        style={{
                          backgroundColor: hexToRgba(annotation.color, 0.3),
                        }}
                      >
                        <p className="h-full overflow-y-auto">
                          {annotation.text}
                        </p>
                      </div>
                      <div
                        onClick={() => deleteAnnotation(index)}
                        className="gap-2.5 w-full text-right flex justify-end"
                      >
                        <div>Burn</div>
                        <MdOutlineDeleteOutline className="self-center h-full" />
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Highlights;

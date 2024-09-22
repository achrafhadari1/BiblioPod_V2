import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ePub from "epubjs";
import axios from "../api/axios";
import "../index.css";
import { CiBookmark } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineFullscreen } from "react-icons/ai";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { FiMoon } from "react-icons/fi";
import { CircularProgress } from "@nextui-org/react";

import TextSelectionCoordinates from "../components/Modals/TextSelectionCoordinates";
import { EpubReaderSettings } from "../components/EpubReaderComponents/EpubReaderSettings";

function EpubReader() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bookValue = searchParams.get("book");
  console.log(bookValue);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentCFI, setCurrentCFI] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [book, setBook] = useState(null);
  const [rendition, setRendition] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showTitleBar, setShowTitleBar] = useState(true);
  const [isDarkClicked, setisDarkClicked] = useState(null);
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in local storage");
        }
        const response = await axios.get(`/books/${bookValue}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const bookInfo = response.data.book;
        setBookData(bookInfo);
        console.log(bookInfo);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };
    fetchBook();
  }, [bookValue]);

  useEffect(() => {
    const loadBook = async () => {
      if (!bookData || !bookData.file_directory) {
        console.error("Invalid book or missing file directory");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in local storage");
          return;
        }

        const response = await axios.get(
          `books/${bookData.user_id}/files/${bookData.file_directory}`,
          {
            responseType: "arraybuffer",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const arrayBuffer = response.data;
        const newBook = ePub(arrayBuffer);

        await newBook.ready;
        setBook(newBook);
        if (newBook.locations.total === 0) {
          await newBook.locations.generate(1024);
        }

        renderBook(newBook);
      } catch (error) {
        if (
          error.message &&
          error.message.includes("File not found in the epub")
        ) {
          console.error(
            "Error loading book: Missing resource file (e.g., stylesheet.css)",
            error
          );
          // Optionally, you can display a user-friendly message or perform any additional error handling here
        } else {
          console.error("Error loading book:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBook();

    // Cleanup function
  }, [bookData]);

  useEffect(() => {
    let timer;
    const handleMouseMove = () => {
      setShowTitleBar(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowTitleBar(false), 10000); // Hide title bar after 5 seconds of inactivity
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  const saveReadingProgress = async () => {
    if (!rendition || !bookData) {
      return;
    }

    const newCFI = rendition.location.start.cfi;
    const newPercentage = Math.round(
      rendition.book.locations.percentageFromCfi(newCFI) * 100
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in local storage");
        return;
      }

      const response = await axios.post(
        "/user-book-progress",
        {
          user_id: bookData.user_id,
          isbn: bookData.isbn,
          current_percentage: newPercentage,
          current_cfi: newCFI,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Reading progress saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving reading progress:", error);
    }
  };
  useEffect(() => {
    const fetchAnnotations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in local storage");
        }
        const response = await axios.get("/annotations", {
          params: {
            book_isbn: bookValue,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const annotations = response.data;

        // Loop through fetched annotations and mark them in the rendition
        annotations.forEach((annotation) => {
          rendition.annotations.highlight(
            annotation.cfi_range,
            {},
            (e) => {
              console.log(e);
            },
            undefined,
            { fill: annotation.color }
          );
        });
      } catch (error) {
        console.error("Error fetching annotations:", error);
      }
    };

    if (rendition && bookValue) {
      fetchAnnotations();
    }
  }, [rendition, bookValue]);

  const renderBook = (loadedBook) => {
    if (!loadedBook) {
      return;
    }

    const newRendition = loadedBook.renderTo("viewer", {
      width: `${window.innerWidth}px`,
      height: "90vh",
      ignoreClass: "annotator-hl",
      manager: "default",
    });

    newRendition.display();
    console.log(newRendition);

    setRendition(newRendition);

    // Register themes
    // Register dark theme
    newRendition.themes.register("dark", {
      ".calibre": {
        background: "black ",
        color: "white ",
        "font-family": "lora",
      },
    });

    // Register default theme
    newRendition.themes.register("default", {
      ".calibre": {
        background: "white ",
        color: "black ",
        "font-family": "lora",
      },
    });

    // Set font size for both themes
    newRendition.themes.fontSize("28px");

    // Select theme based on isDarkTheme

    // Event listener for resizing the window
    const resizeListener = () => {
      newRendition.resize(`${window.innerWidth}px`, "90vh");
      // Update page info after rendering
      updatePageInfo();
    };

    // Event listener for switching themes

    // Add event listeners
    window.addEventListener("resize", resizeListener);

    // Cleanup: remove event listeners on component unmount

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  };
  const selectTheme = () => {
    if (rendition && rendition.themes) {
      if (isDarkTheme) {
        if (isDarkClicked > 0) {
          rendition.themes.override("transition", "0.5s ease-in-out");
        }
        rendition.themes.override("background", "black");
        rendition.themes.override("color", "white");
      } else {
        if (isDarkClicked > 0) {
          rendition.themes.override("transition", "0.5s ease-in-out");
        }
        rendition.themes.override("background", "white");
        rendition.themes.override("color", "black");
      }
    }
  };
  // Listen for changes in isDarkTheme and call selectTheme
  useEffect(() => {
    selectTheme();
  }, [isDarkTheme]);

  useEffect(() => {
    const fetchReadingProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in local storage");
          return;
        }

        const response = await axios.get(
          `/user-book-progress/${bookData.isbn}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { current_cfi } = response.data.progress;
        console.log(current_cfi);
        setCurrentCFI(current_cfi);
        if (rendition && current_cfi) {
          rendition.display(current_cfi);
          updatePageInfo();
        }
      } catch (error) {
        console.error("Error fetching reading progress:", error);
      }
    };

    if (bookData && rendition) {
      fetchReadingProgress();
    }
  }, [bookData, rendition]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextBtn();
      } else if (event.key === "ArrowLeft") {
        backBtn();
      }
    };

    if (rendition) {
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [rendition]);

  useEffect(() => {
    return () => {
      saveReadingProgress();
    };
  }, []);
  const updatePageInfo = () => {
    if (rendition && book) {
      const currentCfi = rendition.currentLocation().start.cfi;
      const currentPercentage =
        rendition.book.locations.percentageFromCfi(currentCfi);
      const currentPage = Math.ceil(
        currentPercentage * (rendition.book.locations.total / 2)
      );
      const totalPages = Math.round(rendition.book.locations.total / 2);

      setCurrentPage(currentPage);
      setTotalPages(totalPages);
    }
  };

  const nextBtn = () => {
    if (rendition) {
      rendition.next();

      const newCFI = rendition.location.start.cfi;
      const newPercentage =
        rendition.book.locations.percentageFromCfi(newCFI) * 100;
      updatePageInfo();
      setCurrentCFI((prevCFI) => {
        localStorage.setItem("currentCFI", newCFI);
        localStorage.setItem("currentPercentageFromCFI", newPercentage);
        return { newCFI, newPercentage };
      });
      if (book) {
        saveReadingProgress();
      }
    }
  };

  const backBtn = () => {
    if (rendition) {
      rendition.prev();
      const newCFI = rendition.location.start.cfi;
      const newPercentage =
        rendition.book.locations.percentageFromCfi(newCFI) * 100;
      updatePageInfo();
      setCurrentCFI((prevCFI) => {
        localStorage.setItem("currentCFI", newCFI);
        localStorage.setItem("currentPercentageFromCFI", newPercentage);
        return { newCFI, newPercentage };
      });
    }
  };
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    setisDarkClicked(1);
    if (rendition) {
      rendition.themes.override(isDarkTheme ? "default" : "dark");
    }
  };

  useEffect(() => {
    localStorage.setItem("selectedBook", JSON.stringify(bookData));
  }, [bookData]);
  const toggleFullscreen = () => {
    const root = document.getElementById("root");
    if (root) {
      if (isFullscreen) {
        document.exitFullscreen();
      } else {
        root.requestFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <CircularProgress size="lg" color="default" />
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="addBook-error-handle">
        <p>Sorry, we don't have this book.</p>
        <div>
          <input type="file" accept=".epub" />
          <button>Add to Collection</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isDarkTheme
          ? "dark h-lvh main-book-reader-container"
          : "main-book-reader-container default h-lvh "
      }
    >
      <div className={showTitleBar ? "titlebar" : "titlebar opacity-low"}>
        <TextSelectionCoordinates
          bookValue={bookValue}
          book={book}
          updatePageInfo={updatePageInfo}
          rendition={rendition}
          forceUpdate={forceUpdate}
          saveReadingProgress={saveReadingProgress}
          setForceUpdate={setForceUpdate}
        />

        <div id="metainfo">
          <span id="book-title">{bookData.author}</span>
          <span id="title-separator">&nbsp;&nbsp;–&nbsp;&nbsp;</span>
          <span id="chapter-title">{bookData.title}</span>
        </div>
        <div id="title-controls">
          <a
            onClick={toggleTheme}
            id="darkmode"
            className=" cursor icon-resize-full"
          >
            <FiMoon />
          </a>
          <a id="bookmark" className="icon-bookmark-empty">
            <CiBookmark />
          </a>
          <EpubReaderSettings rendition={rendition} />
          <a
            id="fullscreen"
            onClick={toggleFullscreen}
            className="icon-resize-full cursor"
          >
            <AiOutlineFullscreen />
          </a>
        </div>
      </div>

      <div className={isDarkTheme ? "dark" : "default"}>
        <div
          id="divider"
          className={
            !book ? "hidden" : `show ${isDarkTheme ? "lightDivider" : ""}`
          }
        />
        <div
          id="viewer"
          className={`epub-viewer ${isFullscreen ? "h-lvh " : ""}`}
        />

        <button
          className={
            !book
              ? "hidden"
              : `prev reset-btn ${isDarkTheme ? "light-button" : ""}`
          }
          onClick={backBtn}
        >
          <GrPrevious />
        </button>
        <button
          className={
            !book
              ? "hidden"
              : `next reset-btn ${isDarkTheme ? "light-button" : ""}`
          }
          onClick={nextBtn}
        >
          <GrNext />
        </button>
      </div>
      <div
        className={
          showTitleBar
            ? "absolute bottom-0 left-3 "
            : "absolute bottom-0 left-3 opacity-low"
        }
      >
        {currentPage} of {totalPages}{" "}
      </div>
    </div>
  );
}

export default EpubReader;

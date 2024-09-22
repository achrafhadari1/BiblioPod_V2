import React, { useEffect, useState, useRef } from "react";
import { ReaderMenu } from "./ReaderMenu";
import { EpubReaderDrawer } from "../EpubReaderComponents/EpubReaderDrawer";
import axios from "../../api/axios";

const TextSelectionCoordinates = ({
  rendition,
  setForceUpdate,
  annotations,
  updatePageInfo,
  saveReadingProgress,
  book,
  bookValue,
}) => {
  const [state, setState] = useState({
    selectedTextCoords: { x: 0, y: 0 },
    selectedText: "",
    selectedColor: null,
    lastCfiRange: null,
    isColorBoxOpen: false,
  });

  const colorBoxRef = useRef(null);

  useEffect(() => {
    const handleTextSelection = (cfiRange) => {
      const range = rendition.getRange(cfiRange);

      if (range) {
        const rect = range.getBoundingClientRect();
        setState({
          ...state,
          selectedTextCoords: { x: rect.x, y: rect.y },
          selectedText: range.toString(),
          lastCfiRange: cfiRange,
          isColorBoxOpen: true, // Show the color box when text is selected
        });
      } else {
        setState({
          ...state,
          lastCfiRange: null,
          selectedTextCoords: { x: 0, y: 0 },
          isColorBoxOpen: false, // Hide the color box when no text is selected
        });
      }
    };

    if (rendition) {
      rendition.on("selected", handleTextSelection);
    }

    return () => {
      if (rendition) {
        rendition.off("selected", handleTextSelection);
        setState({
          selectedTextCoords: { x: 0, y: 0 },
          selectedText: "",
          selectedColor: null,
          lastCfiRange: null,
          isColorBoxOpen: false,
        });
      }
    };
  }, [rendition]);

  const handleColorSelection = async (color) => {
    setForceUpdate({});

    if (state.lastCfiRange && rendition.annotations._annotations) {
      const keyToDelete = state.lastCfiRange + "highlight";

      rendition.annotations.highlight(
        state.lastCfiRange,
        {},
        (e) => {
          console.log(e);
        },
        undefined,
        { fill: color }
      );

      setState({
        ...state,
        selectedTextCoords: { x: 0, y: 0 },
        selectedText: "",
        selectedColor: color,
        isColorBoxOpen: false, // Close the color box after selecting a color
      });
      rendition.display(state.lastCfiRange);

      // Send color selection to backend
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in local storage");
        }
        const response = await axios.post(
          "/annotations",
          {
            book_isbn: bookValue,
            text: state.selectedText,
            color: color,
            cfi_range: state.lastCfiRange,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const annotation = response.data;
        console.log("Annotation stored:", annotation);
      } catch (error) {
        console.error("Error storing annotation:", error);
      }
    }
  };
  const handleClickOutside = () => {
    setState({
      ...state,
      isColorBoxOpen: false,
    });
  };
  const stopPropag = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <ReaderMenu
        book={book}
        bookValue={bookValue}
        saveReadingProgress={saveReadingProgress}
        rendition={rendition}
        selectedColor={state.selectedColor}
        className="icon-bookmark-empty"
      />

      {state.isColorBoxOpen && (
        <div onClick={handleClickOutside} className="absolute w-5/6 vh90 z-20">
          <div
            onClick={stopPropag}
            ref={colorBoxRef}
            style={{
              position: "absolute",
              left: `44%`,
              top: `${state.selectedTextCoords.y}px`,
            }}
          >
            <div className="h-10 items-center px-1 max-w-sm border border-gray-200 rounded-full bg-black gap-2.5 flex">
              <div
                className="w-5 h-5 rounded-full bg-lime-500 cursor-pointer"
                onClick={() => handleColorSelection("#00FF00")} // Lime Green
              ></div>
              <div
                className="w-5 h-5 rounded-full bg-green-700 cursor-pointer"
                onClick={() => handleColorSelection("#008000")} // Green
              ></div>
              <div
                className="w-5 h-5 rounded-full bg-sky-800 cursor-pointer"
                onClick={() => handleColorSelection("#87CEEB")} // Sky Blue
              ></div>
              <div
                className="w-5 h-5 rounded-full bg-violet-900 cursor-pointer"
                onClick={() => handleColorSelection("#8A2BE2")} // Violet
              ></div>
              {/* <div className="h-full">
                <EpubReaderDrawer setSelectedColor={handleColorSelection} />
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TextSelectionCoordinates;

import React, { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaListUl } from "react-icons/fa";
import { BiHighlight } from "react-icons/bi";
import axios from "../../api/axios";

import "../style/Modals.css";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiHomeAlt2 } from "react-icons/bi";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { flatten } from "./getChapters";

export const ReaderMenu = ({
  book,
  bookValue,
  rendition,
  setForceUpdate,
  selectedColor,
}) => {
  const [MenuisOpen, setMenuOpen] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [currentCFI, setCurrentCFI] = useState({});
  const [annotations, setAnnotations] = useState([]);
  const [state, setState] = useState({
    selectedTextCoords: { x: 0, y: 0 },
    selectedText: "",
    selectedColor: null,
    lastCfiRange: null,
    isColorBoxOpen: false,
  });

  useEffect(() => {
    //   const fetchAnnotations = async () => {
    //     if (rendition && rendition.annotations._annotations) {
    //       const allAnnotations = Object.values(
    //         rendition.annotations._annotations
    //       );

    //       if (allAnnotations.length > 0) {
    //         const fetchedAnnotations = await Promise.all(
    //           allAnnotations.map(async (annotation) => {
    //             try {
    //               const cfiRange = annotation.range.cfiRange;
    //               const range = await rendition.book.getRange(cfiRange);
    //               const selectedText = range ? range.toString() : "";
    //               return {
    //                 cfiRange,
    //                 selectedText,
    //               };
    //             } catch (error) {
    //               console.error("Error fetching range:", error);
    //               return null;
    //             }
    //           })
    //         );

    //         setAnnotations(
    //           fetchedAnnotations.filter((annotation) => annotation !== null)
    //         );
    //       }
    //     }
    //   };

    //   fetchAnnotations();
    // }, [rendition]);
    const fetchAnnotations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in local storage");
          return;
        }
        const response = await axios.get(
          `/annotations?book_isbn=${bookValue}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAnnotations(response.data);
      } catch (error) {
        console.error("Error fetching annotations:", error);
      }
    };

    fetchAnnotations();
  }, []);

  const handleMenuOpening = () => {
    setMenuOpen(!MenuisOpen);
  };

  const gotoChapter = async (href) => {
    const id = href.split("#")[1];
    const item = book.spine.get(href);
    await item.load(book.load.bind(book));
    const el = id ? item.document.getElementById(id) : item.document.body;
    const chapterCFI = item.cfiFromElement(el);

    const newPercentage =
      rendition.book.locations.percentageFromCfi(chapterCFI) * 100;

    setCurrentCFI((prevCFI) => {
      localStorage.setItem("currentCFI", chapterCFI);
      localStorage.setItem("currentPercentageFromCFI", newPercentage);
      return { newCFI: chapterCFI, newPercentage };
    });

    rendition.display(chapterCFI);
  };

  useEffect(() => {
    if (book) {
      const chapters = flatten(book.navigation.toc);
      setChapters(chapters);
    }
  }, [book]);

  const handleGotoPage = async (cfiRange) => {
    if (rendition) {
      try {
        await rendition.display(cfiRange);

        const pageNumber = rendition.book.locations.locationFromCfi(cfiRange);
        const newPercentage =
          rendition.book.locations.percentageFromCfi(cfiRange) * 100;

        setCurrentCFI({
          newCFI: cfiRange,
          newPercentage,
        });
      } catch (error) {
        console.error("Error navigating to page with CFI:", cfiRange, error);
      }
    }
  };

  const handleDeleteAnnotation = async (cfiRange) => {
    try {
      await axios.delete(`/annotations/${cfiRange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAnnotations((prevAnnotations) =>
        prevAnnotations.filter(
          (annotation) => annotation.cfi_range !== cfiRange
        )
      );
    } catch (error) {
      console.error("Error deleting annotation:", error);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex gap-5">
        <Link to="/">
          <BiHomeAlt2 className="icon-bookmark-empty" />
        </Link>
      </div>
      <IoMdMenu className="cursor-pointer" onClick={handleMenuOpening} />
      <div
        className={`menu-con flex-col flex w-72 bg-zinc-300 h-screen fixed top-0 left-0 ${
          !MenuisOpen ? "hidden" : "not-hidden"
        }`}
      >
        <div className="flex  w-full gap-8 p-1 justify-between">
          <div></div>
          <IoIosCloseCircleOutline
            className="cursor-pointer X-icon"
            onClick={handleMenuOpening}
          />
        </div>
        <Tabs
          defaultValue="content"
          className="w-full flex flex-col-reverse h-90per "
        >
          <TabsList className="w-auto self-center h-auto">
            <TabsTrigger value="content">
              <div className="flex flex-col items-center text-xs	">
                <div>
                  <FaListUl />
                </div>
                Contents
              </div>
            </TabsTrigger>
            <TabsTrigger value="annotations">
              <div className="flex flex-col items-center text-xs	">
                <div>
                  <BiHighlight />
                </div>
                Annotations
              </div>
            </TabsTrigger>
            <TabsTrigger value="bookmarks">
              <div className="flex flex-col items-center text-xs">
                <div>
                  <FaRegBookmark />
                </div>
                Bookmarks
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent className="h-5/6  " value="content">
            <div id="style-4" className="scrollbar text-left p-l0-1 pl-4">
              <div className="force-overflow flex flex-col gap-5">
                {chapters.map((chapter, i) => (
                  <div
                    className="h-11	flex pl-2 items-center chapter-title hover:bg-violet-600 active:bg-violet-700"
                    key={i}
                    onClick={() => {
                      gotoChapter(chapter.href);
                    }}
                  >
                    {chapter.label}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent className="h-5/6 mb-4" value="annotations">
            <div id="style-4" className="scrollbar text-left p-l0-1 pl-4">
              <div className="force-overflow flex flex-col gap-5">
                {annotations.map((annotation, index) => {
                  const { cfi_range, text } = annotation;
                  console.log("Rendering:", annotation);
                  return (
                    <div className="quote" key={index}>
                      <div id="style-5" className="scrollbar-2">
                        <div className="">
                          <div className="p-1 italic"> "{text}"</div>
                        </div>
                      </div>
                      <div className="flex justify-between px-3">
                        <p
                          className="underline cursor-pointer"
                          onClick={() => {
                            handleGotoPage(cfi_range);
                          }}
                        >
                          Go to Page
                        </p>
                        <div className="flex items-center gap-1">
                          <FaRegTrashCan />
                          <button
                            onClick={() => {
                              handleDeleteAnnotation();
                            }}
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent className="h-5/6" value="bookmarks">
            Change your bookmarks here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

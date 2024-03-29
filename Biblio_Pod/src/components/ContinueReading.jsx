import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";

import "./style/mainpage.css";
import "../index.css";
import { Progress } from "semantic-ui-react";
export const ContinueReading = () => {
  const [colors, setColors] = useState(null);
  const Local = localStorage.getItem("selectedBook");
  const storedBook = JSON.parse(Local);
  const [value, setValue] = useState(0);

  // Use localStorage to get the stored CFI and percentage
  const storedPercentage = localStorage.getItem("currentPercentageFromCFI");

  // Use the stored percentage as the initial value for the Progress component
  useEffect(() => {
    if (storedPercentage !== null) {
      setValue(parseFloat(storedPercentage));
    }
  }, [storedPercentage]);

  if (storedBook == null) {
    return <div></div>;
  }

  return (
    <>
      <div
        style={{
          background:
            colors && colors.length > 0
              ? `linear-gradient(143deg, ${colors[0]} 0%, ${colors[2]} 50%, ${colors[4]} 100%)`
              : "#000",
        }}
        className="reading-container"
      >
        <div className="book-info">
          <div className="curr-pt-1">
            <img
              className="now-reading"
              src={storedBook.imageLinks?.thumbnail}
              alt={storedBook.title}
            />
          </div>
          <div className="curr-pt-2">
            <div className="curr-title">{storedBook.title}</div>
            <div className="curr-desc">
              {storedBook.description
                ? storedBook.description.slice(0, 150) + "..."
                : ""}
            </div>
            <div className="curr-author">- {storedBook.authors}</div>
            <div className="curr-button cursor">
              <Link
                to={
                  "/read?book=isbn:" +
                  storedBook.industryIdentifiers[1].identifier
                }
              >
                Continue Reading
              </Link>
              <div className="goIcon">
                <MdArrowOutward />
              </div>
            </div>
            <div className="curr-pt-3">
              <Progress
                value={Math.round(value)}
                total="100"
                progress="percent"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

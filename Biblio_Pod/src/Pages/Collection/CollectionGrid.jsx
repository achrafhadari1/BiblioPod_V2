import React from "react";
import { BookDisplay } from "../../components/BookDisplay";

export const CollectionGrid = ({ books }) => {
  return (
    <div className="lib-inner-container default-width ">
      <div className="lib-books-container ">
        {books.map((book) => (
          <div key={book.id}>
            <BookDisplay
              title={book.title}
              author={book.author}
              img={book.thumbnail} // Update with your actual image URL field
              description={book.description}
              identifier={book.isbn}
              rating={book.rating}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

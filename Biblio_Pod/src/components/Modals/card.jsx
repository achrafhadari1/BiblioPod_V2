import React from "react";

export default function Card({ book, onClick }) {
  if (!book) {
    return null;
  }

  const { isbn, title, annotations_count, thumbnail } = book;

  return (
    <div className="card w-full mt-4 cursor-pointer" onClick={onClick}>
      <div className="card_body p-2 bg-white rounded-xl transform transition-all hover:duration-300 shadow-lg hover:shadow-2xl">
        {thumbnail && thumbnail.startsWith("public") ? (
          <img
            className="h-40 object-cover rounded-xl card_img w-full"
            src={`http://127.0.0.1:8000/${thumbnail.replace(
              "public",
              "storage"
            )}`}
            alt="Book Poster"
          />
        ) : (
          <img
            className="h-40 object-cover rounded-xl card_img w-full"
            src={thumbnail}
            alt="Book Poster"
          />
        )}

        <div className="p-2"></div>
        <h2 className="font-bold text-lg mb-2 card_title">{title}</h2>
        <p className="text-sm text-gray-600 card_description">
          {annotations_count} Annotations
        </p>
      </div>
    </div>
  );
}

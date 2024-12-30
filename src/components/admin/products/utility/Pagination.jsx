import React from "react";

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage,currentPage }) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }
  return (
    <div >
      {pages.map((page, index) => {
        return (
            page==currentPage?
            <button
            key={index}
            onClick={() => setCurrentPage(page)}
            className="m-1 mt-10 p-2  bg-amber-600 rounded-md hover:bg-amber-500"
          >
            {page}
          </button>:
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            className="m-1 mt-10 p-2  bg-gray-600 rounded-md hover:bg-gray-500"
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;

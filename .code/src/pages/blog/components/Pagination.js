import React from "react";

const Pagination = ({currentPage, totalPages, onPageChange}) => {
  return (
    <div className="mt-4">
      <div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-primary"
          style={{
            background: "#053B50",
            color: "#fff",
            outline: "3px solid black",
            outlineOffset: "2px",
            margin: "7px",
          }}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            disabled={currentPage === i + 1}
            className={`btn btn-primary ${
              currentPage === i + 1 ? "active" : ""
            }`}
            style={{
              background: "#053B50",
              color: "#fff",
              outline: "3px solid black",
              outlineOffset: "2px",
              margin: "10px",
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-primary"
          style={{
            background: "#053B50",
            color: "#fff",
            outline: "3px solid black",
            outlineOffset: "2px",
            margin: "10px",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

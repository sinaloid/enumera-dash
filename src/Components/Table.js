import React from "react";

const Table = ({ children }) => {
  return (
    <div className="table-responsive-sm mt-4 border bg-white p-3 rounded-3">
      <table className="table align-middle">{children}</table>
    </div>
  );
};

export default Table;

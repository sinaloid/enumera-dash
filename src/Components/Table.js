import React from "react";

const Table = ({ children }) => {
  return (
    <div className="table-responsive-sm mt-4">
      <table className="table align-middle">{children}</table>
    </div>
  );
};

export default Table;

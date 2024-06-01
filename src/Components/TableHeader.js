import React from "react";

const TableHeader = ({children}) => {
  return (
    <thead>
      <tr className="align-middle">
        {children}
      </tr>
    </thead>
  );
}

export default TableHeader;

import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, children }) => (
  <table className="min-w-full bg-white border">
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index} className="py-2 px-4 border">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

export default Table;
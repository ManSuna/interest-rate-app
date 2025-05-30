import React from 'react';

function Grid({ columns, data, onAdd, onDelete, tooltips = {} }) {
  return (
    <div>
      {onAdd && (
        <button className="btn btn-success mb-3" onClick={onAdd}>
          Add Row
        </button>
      )}
      <table className="table table-bordered">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            {onDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(col => (
                  <td key={col.key} title={tooltips[col.key] || ''}>
                    {row[col.key]}
                  </td>
                ))}
                {onDelete && (
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(rowIndex)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Grid;

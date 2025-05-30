
import React, { useState } from 'react';

function Grid({ columns, data, onDelete, onAdd, tooltips }) {
  const [newRow, setNewRow] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (key, value) => {
    setNewRow(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleAddRow = () => {
    const newErrors = {};

    if (!newRow.interestRate || !/^\d+(\.\d{1,2})?$/.test(newRow.interestRate)) {
      newErrors.interestRate = 'Must be decimal (e.g. 5.25)';
    }

    if (!newRow.effectiveDate || !/^\d{4}\/\d{2}\/\d{2}$/.test(newRow.effectiveDate)) {
      newErrors.effectiveDate = 'Date must be in CCYY/MM/DD format';
    }

    const isDuplicate = data.some(
      (row) => row.effectiveDate === newRow.effectiveDate
    );

    if (isDuplicate) {
      newErrors.effectiveDate = 'This effective date is already present';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (typeof onAdd === 'function') {
      onAdd(newRow); // ✅ Trigger parent handler
    }

    setNewRow({});
  };

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.label}</th>
          ))}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
            <td>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(idx)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
        <tr>
          {columns.map(col => (
            <td key={col.key}>
              <input
                className="form-control"
                value={newRow[col.key] || ''}
                onChange={(e) => handleInputChange(col.key, e.target.value)}
                placeholder={col.label}
                title={tooltips[col.key]}
              />
              {errors[col.key] && (
                <div className="text-danger">{errors[col.key]}</div>
              )}
            </td>
          ))}
          <td>
            <button className="btn btn-success btn-sm" onClick={handleAddRow}>
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default Grid;

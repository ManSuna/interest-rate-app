import React, { useState } from 'react';

function InterestRateMaintenance() {
  const [data, setData] = useState([
    { interestRate: '5.00', effectiveDate: '2025/04/02' },
    { interestRate: '5.25', effectiveDate: '2024/11/30' },
    { interestRate: '5.50', effectiveDate: '2023/03/04' },
    { interestRate: '5.75', effectiveDate: '2015/02/05' },
    { interestRate: '6.00', effectiveDate: '2011/09/06' },
    { interestRate: '6.25', effectiveDate: '2009/03/11' },
    { interestRate: '6.50', effectiveDate: '2005/08/09' },
    { interestRate: '6.75', effectiveDate: '2002/03/15' },
  ]);

  const validateRate = (rate) => /^\d+(\.\d{1,2})?$/.test(rate);
  const validateDate = (date) => /^\d{4}\/\d{2}\/\d{2}$/.test(date);

  const handleAdd = () => {
    const interestRate = prompt("Enter the Interest Rate (e.g. 5.25):");
    const effectiveDate = prompt("Enter the Effective Date (YYYY/MM/DD):");

    if (!interestRate || !validateRate(interestRate)) {
      alert("Invalid Interest Rate. Must be decimal with up to 2 places.");
      return;
    }

    if (!effectiveDate || !validateDate(effectiveDate)) {
      alert("Invalid Date Format. Must be YYYY/MM/DD.");
      return;
    }

    const confirmAdd = window.confirm(
      `Are you sure you want to add below Interest Rate and Effective Date?\nInterest Rate: ${interestRate}\nEffective Date: ${effectiveDate}`
    );

    if (confirmAdd) {
      setData([...data, { interestRate, effectiveDate }]);
    }
  };

  const handleDelete = (index) => {
    const item = data[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete below Interest Rate and Effective Date?\nInterest Rate: ${item.interestRate}\nEffective Date: ${item.effectiveDate}`
    );

    if (confirmDelete) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <button className="btn btn-success mb-3" onClick={handleAdd}>Add Row</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Interest Rate</th>
            <th>Effective Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td title="Enter the percentage rate in decimal format">{entry.interestRate}</td>
              <td title="Enter or select the Business Date">{entry.effectiveDate}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InterestRateMaintenance;

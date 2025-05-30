import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import Grid from './Grid';





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

  const [modal, setModal] = useState({
    show: false,
    message: '',
    title: '',
    onConfirm: () => {},
  });

  const [newRow, setNewRow] = useState(null);

  const openConfirmModal = ({ title, message, onConfirm }) => {
    setModal({ show: true, title, message, onConfirm });
  };

  const handleAdd = () => {
    const interestRate = prompt("Enter the Interest Rate (e.g. 5.25):");
    const effectiveDate = prompt("Enter the Effective Date (YYYY/MM/DD):");

    const validRate = /^\d+(\.\d{1,2})?$/.test(interestRate);
    const validDate = /^\d{4}\/\d{2}\/\d{2}$/.test(effectiveDate);

    if (!validRate || !validDate) {
      alert("Validation failed. Make sure Interest Rate is decimal and Date is in YYYY/MM/DD format.");
      return;
    }

    const newEntry = { interestRate, effectiveDate };
    setNewRow(newEntry);

    openConfirmModal({
      title: 'Confirm Add',
      message: `Are you sure you want to add the following?\nInterest Rate: ${interestRate}\nEffective Date: ${effectiveDate}`,
      onConfirm: () => {
        setData(prev => [...prev, newEntry]);
        setModal({ ...modal, show: false });
      }
    });
  };

  const handleDelete = (index) => {
    const item = data[index];
    openConfirmModal({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete the following?\nInterest Rate: ${item.interestRate}\nEffective Date: ${item.effectiveDate}`,
      onConfirm: () => {
        setData(prev => prev.filter((_, i) => i !== index));
        setModal({ ...modal, show: false });
      }
    });
  };

  const columns = [
    { key: 'interestRate', label: 'Interest Rate' },
    { key: 'effectiveDate', label: 'Effective Date' }
  ];

  const tooltips = {
    interestRate: 'Enter the percentage rate in decimal format',
    effectiveDate: 'Enter or select the Business Date'
  };

  return (
    <div>
      <Grid
  columns={[
    { key: 'interestRate', label: 'Interest Rate' },
    { key: 'effectiveDate', label: 'Effective Date' },
  ]}
  data={data}
  onDelete={handleDelete}
  tooltips={{
    interestRate: 'Enter the percentage rate in decimal format',
    effectiveDate: 'Enter or select the Business Date',
  }}
/>

      <ConfirmModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
}

export default InterestRateMaintenance;

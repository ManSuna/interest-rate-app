import React, { useState } from 'react';
import Grid from './Grid';
import ConfirmModal from './ConfirmModal';

function InterestRateMaintenance() {
  const [data, setData] = useState([
    { interestRate: '5.00', effectiveDate: '2025/04/02' },
    { interestRate: '5.25', effectiveDate: '2024/11/30' },
    // more default rows...
  ]);

  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const openConfirmModal = ({ title, message, onConfirm }) => {
    setModal({
      show: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setModal({ ...modal, show: false });
      }
    });
  };

const handleAdd = (newRow) => {
  openConfirmModal({
    title: 'Confirm Add',
    message: `Are you sure you want to add:\nInterest Rate: ${newRow.interestRate}\nEffective Date: ${newRow.effectiveDate}`,
    onConfirm: () => {
      setData(prev => [...prev, newRow]);
    }
  });
};

  const handleDelete = (index) => {
    const row = data[index];
    openConfirmModal({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete:\nInterest Rate: ${row.interestRate}\nEffective Date: ${row.effectiveDate}`,
      onConfirm: () => {
        setData(prev => prev.filter((_, i) => i !== index));
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
    <div style={{ position: 'relative' }}>
      <Grid columns={columns} data={data} onAdd={handleAdd} onDelete={handleDelete} tooltips={tooltips} />
      <ConfirmModal {...modal} onCancel={() => setModal({ ...modal, show: false })} />
    </div>
  );
}

export default InterestRateMaintenance;

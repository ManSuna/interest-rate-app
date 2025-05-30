// src/components/ConfirmModal.js
import React from 'react';
import './ConfirmModal.css';

function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h5>{title}</h5>
        <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

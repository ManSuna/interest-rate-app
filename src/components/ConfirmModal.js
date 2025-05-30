// src/components/ConfirmModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      backdrop="static"  // prevent click outside to dismiss
      keyboard={false}   // disable ESC key closing
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;

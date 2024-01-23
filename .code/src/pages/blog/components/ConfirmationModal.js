import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  isLoading,
  title,
  message,
  confirmText,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Deleting..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;

// React:
import axios from "axios";
import { useState } from "react";
// React Bootstrap:
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

const AreaAddModal = ({ setIsVisibleModalAddArea }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const area = { name };
    axios
      .post('http://backend.mneia.gr/api/areas/', area)
      .then(() => {
        setIsVisibleModalAddArea(false);
      })
  };

  return (
    <Modal show={true} onHide={() => setIsVisibleModalAddArea(false)}>
      <Modal.Header>
        <Modal.Title>Add Area</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Name
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                required
                placeholder="Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">Add</Button>
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AreaAddModal;
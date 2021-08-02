// Axios:
import axios from "axios";
// React:
import { useEffect } from "react";
import { useState } from "react";
// React Bootstrap:
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
// React Router:
import { useHistory } from "react-router-dom";

const WorkAddModal = ({ setIsVisibleModalAddWork, addToast }) => {
  const [name, setName] = useState('');
  const [types, setTypes] = useState([]);
  const [type, setType] = useState();
  const history = useHistory();

  useEffect(
    () => {
      axios
        .get('http://backend.mneia.gr/api/work-types/')
        .then((response) => {
          setTypes(response.data);
        })
    },
    []
  )

  const handleSubmit = (e) => {
    e.preventDefault();
    const work = { name, type };
    axios
      .post('http://backend.mneia.gr/api/works/', work)
      .then((response) => {
        setIsVisibleModalAddWork(false);
        addToast(`Added work ${name}`);
        history.push(`/works/${ response.data.id }`)
      })
  };

  return (
    <Modal show={true} onHide={() => setIsVisibleModalAddWork(false)}>
      <Modal.Header>
        <Modal.Title>Add Work</Modal.Title>
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

          <fieldset>
            <Form.Group as={Row} className="mb-3">
              <Form.Label as="legend" column sm={2}>
                Type
              </Form.Label>
              <Col sm={10}>
                {types.map((type) => {
                  return (
                    <Form.Check
                      key={type.id}
                      type="radio"
                      label={type.name}
                      name="formHorizontalRadios"
                      id={type.id}
                      onChange={(e) => setType(e.target.id)}
                    />
                  )
                })}
              </Col>
            </Form.Group>
          </fieldset>

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

export default WorkAddModal;
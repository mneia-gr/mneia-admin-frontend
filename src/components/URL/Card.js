// React
import { useState, useEffect } from 'react';
// React Bootstrap
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
// etc
import axios from 'axios';

/**
 * Renders:
 *  1. a Card with URLs related to an instance of a Model, e.g. a Work, Person, or Area,
 *  2. a Modal with a form to add a URL to an instance
 * @param {string} model
 * @param {object} instance
 * @returns 
 */
const URLCard = ({ model, instance, setAlert, addToast }) => {
  const [urls, setUrls] = useState([]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [url, setUrl] = useState('');

  const getUrls = (model, instance) => {
    axios
      .get(`http://backend.mneia.gr/api/${model.toLowerCase()}-urls/?${model.toLowerCase()}=${instance.id}`)
      .then((response) => {
        setUrls(response.data);
      })
  }

  useEffect(
    () => {
      if (instance.id) {
        getUrls(model, instance);
      }
    },
    [model, instance]
  )

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { url };
    data[`${model.toLowerCase()}`] = instance.id;
    axios
      .post(`http://backend.mneia.gr/api/${model.toLowerCase()}-urls/`, data)
      .then((response) => {
        setIsVisibleModal(false);
        addToast(`Added URL ${url} to ${model} ${instance.name}`)
        getUrls(model, instance);
      })
      .catch((err) => {
        setIsVisibleModal(false);
        setAlert(err.message);
      })
  }

  return (
    <>
      <Card className="mb-2">
        <Card.Header as="div">
          <h5 className="mb-0 float-start">URLs</h5>
          <Button
            className="float-end"
            variant="primary"
            size="sm"
            style={{ padding: '0 0.4rem' }}
            onClick={() => setIsVisibleModal(true)}
          >+</Button>
        </Card.Header>
        {(urls.length > 0) &&
          <Card.Body>
            <ul className="mb-0 ps-0" style={{ listStyle: 'none' }}>
              {urls.map((url) => {
                return (
                  <li key={url.id}>
                    <a href={url.url}>{url.type}</a>
                  </li>
                )
              })}
            </ul>
          </Card.Body>
        }
      </Card>

      <Modal show={isVisibleModal} onHide={() => setIsVisibleModal(false)}>
        <Modal.Header>
          <Modal.Title>Add URL to {model}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Person
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  required
                  id="instance"
                  defaultValue={instance.name}
                  disabled
                ></Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                URL
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  required
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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
    </>
  );
}


export default URLCard;
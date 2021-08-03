// React:
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
// React Bootstrap:
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
// React Router
import { useHistory } from "react-router";
// etc
import { getModelNamePlural } from "../../utils";

/**
 * Renders a modal with a form to add an instance of a model, with Name and [optional] Type fields.
 * @param {string} model - the name of the model in which the instance will be added
 * @param {function} setIsVisibleModalAddInstance - controls the visibility of the modal
 * @param {function} addToast - used to show a notification after a successful operation
 * @param {boolean} hasTypes - if provided, the form will include radio buttons for model types
 * @param {boolean} redirect - if provided, the browser will redirect to a page specific to the newly added instance
 * @returns a Modal
 */
const InstanceAddModal = ({ model, setIsVisibleModalAddInstance, addToast, hasTypes, redirect }) => {
  const [name, setName] = useState('');
  const [types, setTypes] = useState([]);
  const [type, setType] = useState();
  const history = useHistory();

  useEffect(
    () => {
      if (hasTypes) {
        axios
          .get(`http://backend.mneia.gr/api/${model.toLowerCase()}-types/`)
          .then((response) => {
            setTypes(response.data)
          })
      }
    },
    [hasTypes, model]
  )

  const handleSubmit = (e) => {
    e.preventDefault();
    const instance = { name };
    if (hasTypes) {
      instance['type'] = type;
    }
    const modelNamePlural = getModelNamePlural(model);
    axios
      .post(`http://backend.mneia.gr/api/${modelNamePlural}/`, instance)
      .then((response) => {
        setIsVisibleModalAddInstance(false);
        addToast(`Added ${model} ${name}`);
        if (redirect) {
          history.push(`/${modelNamePlural}/${response.data.id}`)
        }
      })
  };

  return (
    <Modal show={true} onHide={() => setIsVisibleModalAddInstance(false)}>
      <Modal.Header>
        <Modal.Title>Add {model}</Modal.Title>
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

          {types.length &&
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
          }

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

export default InstanceAddModal;
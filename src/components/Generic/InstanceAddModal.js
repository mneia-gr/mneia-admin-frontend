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
 * @param {function} setAlert - use to show an application-wide alert in case of error
 * @returns a Modal
 */
const InstanceAddModal = ({ model, setIsVisibleModalAddInstance, addToast, hasTypes, redirect, setAlert }) => {
  const [name, setName] = useState('');
  const [types, setTypes] = useState([]);
  const [type, setType] = useState();
  const [similarInstances, setSimilarInstances] = useState([]);
  const history = useHistory();
  const [mbid, setMbid] = useState('');
  const [isDisabledName, setIsDisabledName] = useState(false);
  const [isDisabledMbid, setIsDisabledMbid] = useState(false);

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
    const data = {};

    if (mbid.length > 0) {
      data.mbid = mbid;
    } else {
      data.name = name;
    }

    if (hasTypes) {
      data.type = type;
    }

    const modelNamePlural = getModelNamePlural(model);
    axios
      .post(`http://backend.mneia.gr/api/${modelNamePlural}/`, data)
      .then((response) => {
        setIsVisibleModalAddInstance(false);
        addToast(`Added ${model} "${response.data.name}"`);
        if (redirect) {
          history.push(`/${modelNamePlural}/${response.data.id}`)
        }
      })
      .catch((err) => {
        setIsVisibleModalAddInstance(false);
        setAlert(`POST failed with error: ${err.message}`);
      })
  };

  const handleNameChange = (name) => {
    setName(name);
    setIsDisabledMbid(name.length > 0);
    console.log(`name: "${name}" length: ${name.length}`)
    if (name.length > 0) {
      const modelNamePlural = getModelNamePlural(model);
      axios
        .get(`http://backend.mneia.gr/api/${modelNamePlural}/?name=${name}&limit=5`)
        .then((response) => {
          setSimilarInstances(response.data);
        })
    } else {
      setSimilarInstances([]);
    }
  }

  const handleMbidChange = (mbid) => {
    setMbid(mbid);
    setIsDisabledName(mbid.length > 0);
  }

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
                required={mbid.length === 0}
                placeholder="Name"
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={isDisabledName}
              ></Form.Control>
            </Col>
          </Form.Group>

          {(similarInstances.length > 0) &&
            <Row>
              <Col sm={2}>
                Similar
              </Col>
              <Col sm={10}>
                <ul>
                  {similarInstances.map((similarInstance) => {
                    return (
                      <li key={similarInstance.id}>{similarInstance.name}</li>
                    )
                  })}
                </ul>
              </Col>
            </Row>
          }

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              <abbr title="MusicBrainz ID">MBID</abbr>
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                required={name.length === 0}
                placeholder="Import from MusicBrainz..."
                id="mbid"
                value={mbid}
                onChange={(e) => handleMbidChange(e.target.value)}
                disabled={isDisabledMbid}
              ></Form.Control>
            </Col>
          </Form.Group>

          {(types.length > 0) &&
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
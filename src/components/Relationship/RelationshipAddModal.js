import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from "react-bootstrap/Row";
import { Typeahead } from 'react-bootstrap-typeahead';
import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Renders a modal with a form that adds a relationship between two models. Either `fromInstance` or `toInstance` must
 * be provided. The order doesn't matter, because the API accepts calls to create relationships with the models in
 * either order. For example, to create a relationship between an Area and a Work, the API accepts calls to either of
 * these URLs:
 *
 *    /api/area-work-relationships/
 *    /api/work-area-relationships/
 *
 * @param {object} fromInstance
 * @param {string} fromModel - the name of the first model in the relationship
 * @param {object} toInstance
 * @param {string} toModel - the name of the second model in the relationship
 * @param {function} setIsVisibleRelationshipAddModal - sets the visibility of the modal
 * @param {function} refresher - if provided, it will be executed after the relationship has been created
 * @param {function} setAlertMessage - if provided, it can be use to display an alert in case of errors
 * @returns
 */
const RelationshipAddModal = ({
  fromInstance,
  fromModel,
  toInstance,
  toModel,
  setIsVisibleRelationshipAddModal,
  refresher,
  setAlertMessage,
  addToast,
}) => {
  const [startInstance, setStartInstance] = useState();
  const [startModel, setStartModel] = useState();
  const [endInstance, setEndInstance] = useState([]);
  const [endModel, setEndModel] = useState();
  const [endInstances, setEndInstances] = useState();
  const [types, setTypes] = useState([]);
  const [type, setType] = useState();
  const [note, setNote] = useState();
  const [typeAheadDisabled, setTypeAheadDisabled] = useState(false);
  const [addEndInstanceCollapseOpen, setAddEndInstanceCollapseOpen] = useState(false);
  const [newEndInstanceName, setNewEndInstanceName] = useState('');

  const getModelNamePlural = (modelName) => {
    if (modelName.toLowerCase() === "person") {
      return "people";
    } else {
      return `${modelName.toLowerCase()}s`;
    }
  }

  useEffect(
    () => {
      const getEndInstances = (endModel) => {
        const modelNamePlural = getModelNamePlural(endModel);
        axios
          .get(`http://backend.mneia.gr/api/${modelNamePlural}/`)
          .then((response) => {
            setEndInstances(response.data);
          })
      }
      if (fromInstance) {
        setStartInstance(fromInstance);
        setStartModel(fromModel);
        setEndModel(toModel);
        getEndInstances(toModel);
      } else if (toInstance) {
        setStartInstance(toInstance);
        setStartModel(toModel);
        setEndModel(fromModel);
        getEndInstances(fromModel);
      };
    },
    [fromInstance, toInstance, fromModel, toModel]
  )

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/${fromModel.toLowerCase()}-${toModel.toLowerCase()}-relationship-types/`)
        .then((response) => {
          setTypes(response.data);
        })
    },
    [fromModel, toModel]
  )

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { type, note };
    data[startModel.toLowerCase()] = startInstance.id;
    data[endModel.toLowerCase()] = endInstance[0].id;
    const url = `http://backend.mneia.gr/api/${startModel.toLowerCase()}-${endModel.toLowerCase()}-relationships/`

    axios
      .post(url, data)
      .then(() => {
        setIsVisibleRelationshipAddModal(false);
        if (refresher) {
          refresher(startInstance);
        }
        addToast(`Added relationship between ${startModel} "${startInstance.name}" and ${endModel} "${endInstance[0].name}"`)
      })
      .catch((err) => {
        setIsVisibleRelationshipAddModal(false);
        setAlertMessage(`POST to ${url} with data ${JSON.stringify(data)} failed: ${err.message}`);
      })
  }

  const handleAddNewEndInstance = (e) => {
    e.preventDefault();
    const data = { name: newEndInstanceName };
    const modelNamePlural = getModelNamePlural(endModel);
    const url = `http://backend.mneia.gr/api/${modelNamePlural}/`
    axios
      .post(url, data)
      .then((response) => {
        setAddEndInstanceCollapseOpen(false);
        setTypeAheadDisabled(false);
        setEndInstance([response.data]);
        addToast(`Added ${endModel} ${newEndInstanceName}`)
      })
      .catch((err) => {
        setIsVisibleRelationshipAddModal(false);
        setAlertMessage(`POST to ${url} with data ${JSON.stringify(data)} failed: ${err.message}`);
      })
  }

  return (
    <Modal show={true} onHide={() => setIsVisibleRelationshipAddModal(false)}>
      <Modal.Header>
        <Modal.Title>Add {fromModel}-{toModel} Relationship</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="start">
            <Form.Label column sm={2}>
              {startModel}
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                disabled
                defaultValue={startInstance && startInstance.name} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="end">
            <Form.Label column sm={2}>
              {endModel}
            </Form.Label>
            <Col sm={8} className="pe-0">
              {endInstances &&
                <Typeahead
                  id="typeahead-end-model"
                  labelKey="name"
                  options={endInstances}
                  placeholder={endModel}
                  selected={endInstance}
                  onChange={(selected) => {
                    setEndInstance(selected);
                  }}
                  highlightOnlyResult
                  disabled={typeAheadDisabled}
                />
              }
            </Col>
            <Col sm={2}>
              <Button
                className="float-end"
                variant="primary"
                onClick={() => {
                  setTypeAheadDisabled(!typeAheadDisabled);
                  setAddEndInstanceCollapseOpen(!addEndInstanceCollapseOpen);
                }}
                aria-controls="add-end-model-collapse-open"
                aria-expanded={addEndInstanceCollapseOpen}
              >New</Button>
            </Col>
          </Form.Group>

          <Collapse in={addEndInstanceCollapseOpen}>
            <Row>
              <Col sm={{ span: 8, offset: 2 }} className="pe-0">
                <Form.Control
                  className="mb-3"
                  type="text"
                  placeholder={`New ${endModel} Name`}
                  value={newEndInstanceName}
                  onChange={(e) => setNewEndInstanceName(e.target.value)}
                />
              </Col>
              <Col sm={2}>
                <Button
                  className="float-end"
                  variant="primary"
                  style={{ width: '100%' }}
                  onClick={handleAddNewEndInstance}
                >Add</Button>
              </Col>
            </Row>
          </Collapse>

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

          <Form.Group as={Row} className="mb-3" controlId="formHorizontalNote">
            <Form.Label column sm={2}>
              Note
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" placeholder="Note" onChange={(e) => setNote(e.target.value)} />
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

export default RelationshipAddModal;
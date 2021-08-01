import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from "react-bootstrap/Row";
import { Typeahead } from 'react-bootstrap-typeahead';

const PersonWorkRelationshipAddModal = ({
  work,
  setIsVisibleModalAddPersonWorkRelationship,
  getPersonWorkRelationships
}) => {
  // `people` and `types` are used to populate the fields in the form:
  const [people, setPeople] = useState([]);
  const [types, setTypes] = useState([]);
  // `person`, `type` and `note` are the values selected in the form:
  const [person, setPerson] = useState([]);
  const [type, setType] = useState();
  const [note, setNote] = useState();
  // controls when adding a person, while adding a relationship:
  const [addPersonCollapseOpen, setAddPersonCollapseOpen] = useState(false);
  const [personTypeAheadDisabled, setPersonTypeAheadDisabled] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  useEffect(
    () => {
      axios
        .get('http://backend.mneia.gr/api/people/')
        .then((response) => {
          setPeople(response.data)
        })
    },
    []
  )

  useEffect(
    () => {
      axios
        .get('http://backend.mneia.gr/api/person-work-relationship-types/')
        .then((response) => {
          setTypes(response.data)
        })
    },
    []
  )

  const handleSubmit = (e) => {
    e.preventDefault();
    const personWorkRelationship = {
      work: work.id,
      person: person[0].id,
      type,
      note,
    }
    axios
      .post('http://backend.mneia.gr/api/person-work-relationships/', personWorkRelationship)
      .then(() => {
        setIsVisibleModalAddPersonWorkRelationship(false);
        getPersonWorkRelationships(work);
      })
  }

  const handleAddNewPerson = (e) => {
    e.preventDefault();
    const person = { name: newPersonName };
    axios
      .post('http://backend.mneia.gr/api/people/', person)
      .then((response) => {
        setAddPersonCollapseOpen(false);
        setPersonTypeAheadDisabled(false);
        setPerson([response.data]);
      })
  }

  return (
    <Modal show={true} onHide={() => setIsVisibleModalAddPersonWorkRelationship(false)}>
      <Modal.Header>
        <Modal.Title>Add Person-Work Relationship</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalWork">
            <Form.Label column sm={2}>
              Work
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" placeholder="Work" disabled value={work.name} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formHorizontalPerson">
            <Form.Label column sm={2}>
              Person
            </Form.Label>
            <Col sm={8} className="pe-0">
              <Typeahead
                id="typeahead-person"
                labelKey="name"
                options={people}
                placeholder="Person"
                selected={person}
                onChange={(selected) => {
                  setPerson(selected);
                }}
                highlightOnlyResult
                disabled={personTypeAheadDisabled}
              />
            </Col>
            <Col sm={2}>
              <Button
                className="float-end"
                variant="primary"
                onClick={() => {
                  setPersonTypeAheadDisabled(!personTypeAheadDisabled);
                  setAddPersonCollapseOpen(!addPersonCollapseOpen);
                }}
                aria-controls="add-person-collapse-open"
                aria-expanded={addPersonCollapseOpen}
              >New</Button>
            </Col>
          </Form.Group>

          <Collapse in={addPersonCollapseOpen}>
            <Row>
              <Col sm={{ span: 8, offset: 2 }} className="pe-0">
                <Form.Control
                  className="mb-3"
                  type="text"
                  placeholder="New Person Name"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                />
              </Col>
              <Col sm={2}>
                <Button
                  className="float-end"
                  variant="primary"
                  style={{ width: '100%' }}
                  onClick={handleAddNewPerson}
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

export default PersonWorkRelationshipAddModal;
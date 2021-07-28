import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from "react-bootstrap/Row";


const PersonWorkRelationshipAddModal = ({
  work,
  setIsVisibleModalAddPersonWorkRelationship,
  getPersonWorkRelationships
}) => {
  // `people` and `types` are used to populate the fields in the form:
  const [people, setPeople] = useState([]);
  const [types, setTypes] = useState([]);
  // `person`, `type` and `note` are the values selected in the form:
  const [person, setPerson] = useState();
  const [type, setType] = useState();
  const [note, setNote] = useState();

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
      person,
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

          {/* TODO Replace this with https://www.npmjs.com/package/react-bootstrap-typeahead */}
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalPerson">
            <Form.Label column sm={2}>
              Person
            </Form.Label>
            <Col sm={10}>
              <Form.Select aria-label="Select Person" onChange={(e) => setPerson(e.target.value)}>
                {people.map((person) => {
                  return (
                    <option key={person.id} value={person.id}>{person.name}</option>
                  )
                })}
              </Form.Select>
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
import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from "react-bootstrap/Row";
import { Typeahead } from 'react-bootstrap-typeahead';

const AreaWorkRelationshipAddModal = ({
  work,
  setIsVisibleAreaWorkRelationshipAddModal,
  getAreaWorkRelationships
}) => {
  // `areas` and `types` are used to populate the fields in the form:
  const [areas, setAreas] = useState([]);
  const [types, setTypes] = useState([]);
  // `area`, `type` and `note` are the values selected in the form:
  const [area, setArea] = useState([]);
  const [type, setType] = useState();
  const [note, setNote] = useState();

  useEffect(
    () => {
      axios
        .get('http://backend.mneia.gr/api/areas/')
        .then((response) => {
          setAreas(response.data)
        })
    },
    []
  )

  useEffect(
    () => {
      axios
        .get('http://backend.mneia.gr/api/area-work-relationship-types/')
        .then((response) => {
          setTypes(response.data)
        })
    },
    []
  )

  const handleSubmit = (e) => {
    e.preventDefault();
    const areaWorkRelationship = {
      work: work.id,
      area: area[0].id,
      type,
      note,
    }
    axios
      .post('http://backend.mneia.gr/api/area-work-relationships/', areaWorkRelationship)
      .then(() => {
        setIsVisibleAreaWorkRelationshipAddModal(false);
        getAreaWorkRelationships(work);
      })
  }

  return (
    <Modal show={true} onHide={() => setIsVisibleAreaWorkRelationshipAddModal(false)}>
      <Modal.Header>
        <Modal.Title>Add Area-Work Relationship</Modal.Title>
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

          <Form.Group as={Row} className="mb-3" controlId="formHorizontalArea">
            <Form.Label column sm={2}>
              Area
            </Form.Label>
            <Col sm={10}>
              <Typeahead
                id="typeahead-area"
                labelKey="name"
                options={areas}
                placeholder="Area"
                selected={area}
                onChange={(selected) => {
                  setArea(selected);
                }}
                highlightOnlyResult
              />
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

export default AreaWorkRelationshipAddModal;
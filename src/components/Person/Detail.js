// React
import { useState, useEffect } from "react";
// React Bootstrap
import Col from "react-bootstrap/Col";
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table';
import Row from "react-bootstrap/Row";
// React Router
import { useParams } from "react-router-dom";
// etc
import axios from "axios";
import PersonWorkRelationshipItem from "../PersonWorkRelationship/Item";
import URLCard from "../URL/Card";

const PersonDetail = ({ setAlert, addToast }) => {
  const { id } = useParams();
  const [person, setPerson] = useState({});
  const [personIsLoading, setPersonIsLoading] = useState(false);
  const [personWorkRelationships, setPersonWorkRelationships] = useState([]);

  const getPersonWorkRelationships = (person) => {
    axios
      .get(`http://backend.mneia.gr/api/person-work-relationships/?person=${person.id}`)
      .then((response) => {
        setPersonWorkRelationships(response.data);
      })
  }

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/people/${id}/`)
        .then((response) => {
          setPersonIsLoading(false);
          setPerson(response.data);
          getPersonWorkRelationships(response.data);
          document.title = response.data.name;
        })
    },
    [id]
  )

  return (
    <>
      {personIsLoading &&
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      }
      {person &&
        <article>
          <h1>{person.name}</h1>
          <Row>
            <Col md={8}>
              {(personWorkRelationships.length > 0) &&
                <>
                  <h2>Relationships</h2>
                  <h3>Works</h3>
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th><th>Type</th><th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personWorkRelationships.map((personWorkRelationship) => {
                        return (
                          <PersonWorkRelationshipItem
                            key={personWorkRelationship.id}
                            personWorkRelationship={personWorkRelationship}
                            scope="work"
                            as="tr"
                          />
                        )
                      })}
                    </tbody>
                  </Table>

                </>
              }
            </Col>
            <Col md={4} className="work-sidebar">
              {person &&
                <URLCard model="Person" instance={person} setAlert={setAlert} addToast={addToast} />
              }
            </Col>
          </Row>
        </article>
      }
    </>
  );
}

export default PersonDetail;
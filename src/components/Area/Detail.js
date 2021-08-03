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
import AreaWorkRelationshipItem from "../AreaWorkRelationship/Item";
import URLCard from "../URL/Card";

const AreaDetail = ({ setAlert, addToast }) => {
  const { id } = useParams();
  const [area, setArea] = useState({});
  const [areaIsLoading, setAreaIsLoading] = useState(false);
  const [areaWorkRelationships, setAreaWorkRelationships] = useState([]);

  const getAreaWorkRelationships = (area) => {
    axios
      .get(`http://backend.mneia.gr/api/area-work-relationships/?area=${area.id}`)
      .then((response) => {
        setAreaWorkRelationships(response.data);
      })
  }

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/areas/${id}/`)
        .then((response) => {
          setAreaIsLoading(false);
          setArea(response.data);
          getAreaWorkRelationships(response.data);
          document.title = response.data.name;
        })
    },
    [id]
  )

  return (
    <>
      {areaIsLoading &&
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      }
      {area &&
        <article>
          <h1>{area.name}</h1>
          <Row>
            <Col md={8}>
              {(areaWorkRelationships.length > 0) &&
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
                      {areaWorkRelationships.map((areaWorkRelationship) => {
                        return (
                          <AreaWorkRelationshipItem
                            key={areaWorkRelationship.id}
                            areaWorkRelationship={areaWorkRelationship}
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
              {area &&
                <URLCard model="Area" instance={area} setAlert={setAlert} addToast={addToast} />
              }
            </Col>
          </Row>
        </article>
      }
    </>
  );
}

export default AreaDetail;
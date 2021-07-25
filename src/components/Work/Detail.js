// React
import { useState, useEffect } from "react";
// React Router
import { useParams } from "react-router-dom";
// React Bootstrap
import Card from 'react-bootstrap/Card';
import Col from "react-bootstrap/Col";
import Dropdown from 'react-bootstrap/Dropdown';
import Row from "react-bootstrap/Row";
// React Markdown
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
// etc
import axios from "axios";
import PersonWorkRelationshipListItem from "../PersonWorkRelationship/ListItem";
import AreaWorkRelationshipListItem from "../AreaWorkRelationship/ListItem";

const WorkDetail = () => {
  const { id } = useParams();
  const [work, setWork] = useState({});
  const [type, setType] = useState();
  const [workIsLoading, setWorkIsLoading] = useState(true);
  const [typeIsLoading, setTypeIsLoading] = useState(true);
  const [workTypes, setWorkTypes] = useState([]);
  const [personWorkRelationships, setPersonWorkRelationships] = useState();
  const [areaWorkRelationships, setAreaWorkRelationships] = useState();

  const getPersonWorkRelationships = (work) => {
    axios
      .get(`http://backend.mneia.gr/api/person-work-relationships/?work=${work.id}`)
      .then((response) => {
        setPersonWorkRelationships(response.data);
      })
  }

  const getAreaWorkRelationships = (work) => {
    axios
      .get(`http://backend.mneia.gr/api/area-work-relationships/?work=${work.id}`)
      .then((response) => {
        setAreaWorkRelationships(response.data);
      })
  }

  const getWorkType = (work) => {
    if (work.type === null) {
      setTypeIsLoading(false);
      setType({ name: "None" });
    } else {
      axios
        .get(`http://backend.mneia.gr/api/work-types/${work.type}/`)
        .then((response) => {
          setTypeIsLoading(false);
          setType(response.data);
        })
    }
  }

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/works/${id}/`)
        .then((response) => {
          setWorkIsLoading(false);
          setWork(response.data);
          getWorkType(response.data);
          getPersonWorkRelationships(response.data);
          getAreaWorkRelationships(response.data);
          document.title = response.data.name;
        })
    },
    [id]
  );

  useEffect(
    () => {
      axios
        .get('http://backend.mneia.gr/api/work-types/')
        .then((response) => {
          setWorkTypes(response.data);
        })
    },
    []
  )

  const handleChangeWorkType = (e, newWorkType) => {
    e.preventDefault();
    if (newWorkType.id === work.type) {
    } else {
      let newWork = {
        id: work.id,
        name: work.name,
        type: newWorkType.id,
      }
      axios
        .put(`http://backend.mneia.gr/api/works/${work.id}/`, newWork)
        .then((response) => {
          setWork(response.data);
          getWorkType(response.data);
        })
    }
  }

  return (
    <div>
      {workIsLoading && <div>Loading...</div>}
      {work && (
        <>
          <article className="work">
            <h1>{work.name}</h1>
            <Row>
              <Col md={8} className="content">
                <ReactMarkdown rehypePlugins={[rehypeRaw]} children={work.content} />
              </Col>
              <Col md={4} className="work-sidebar">
                <Card className="mb-2">
                  <Card.Header as="h5">Πληροφορίες</Card.Header>
                  <Card.Body>
                    <b>Τύπος:</b> {typeIsLoading && <span>Loading...</span>} {type && type.name}
                    {' '}
                    {workTypes &&
                      <>
                        <Dropdown as="span">
                          <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" size="sm" style={{ border: "0px" }}>
                            <i className="bi bi-pencil-square"></i>
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {workTypes.map((workType) => {
                              return (
                                <Dropdown.Item key={workType.id} href="#" onClick={(e) => handleChangeWorkType(e, workType)}>{workType.name}</Dropdown.Item>
                              )
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    }
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header as="h5">Συνδέσεις</Card.Header>
                  <Card.Body>
                    {personWorkRelationships &&
                      <>
                        <h6>Πρόσωπα</h6>
                        <ul>
                          {personWorkRelationships.map((personWorkRelationship) => {
                            return (
                              <PersonWorkRelationshipListItem personWorkRelationship={personWorkRelationship} />
                            )
                          })}
                        </ul>
                      </>
                    }

                    {areaWorkRelationships &&
                      <>
                        <h6>Τόποι</h6>
                        <ul>
                          {areaWorkRelationships.map((areaWorkRelationship) => {
                            return (
                              <AreaWorkRelationshipListItem areaWorkRelationship={areaWorkRelationship} />
                            )
                          })}
                        </ul>
                      </>
                    }
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </article>
        </>
      )}
    </div>
  );
}

export default WorkDetail;
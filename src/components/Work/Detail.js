import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from 'react-bootstrap/Dropdown'

const WorkDetail = () => {
  const { id } = useParams();
  const [work, setWork] = useState({});
  const [type, setType] = useState();
  const [workIsLoading, setWorkIsLoading] = useState(true);
  const [typeIsLoading, setTypeIsLoading] = useState(true);
  const [workTypes, setWorkTypes] = useState([]);

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
              <Col md={10} className="content">
                <ReactMarkdown rehypePlugins={[rehypeRaw]} children={work.content} />
              </Col>
              <Col md={2} className="work-sidebar">
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
              </Col>
            </Row>
          </article>
        </>
      )}
    </div>
  );
}

export default WorkDetail;
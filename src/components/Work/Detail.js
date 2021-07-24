import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useEffect } from "react";
import axios from "axios";

const WorkDetail = () => {
  const { id } = useParams();
  const [work, setWork] = useState({});
  const [type, setType] = useState();
  const [workIsLoading, setWorkIsLoading] = useState(true);
  const [typeIsLoading, setTypeIsLoading] = useState(true);

  const getWorkType = (work) => {
    axios
      .get(`http://backend.mneia.gr/api/work-types/${work.type}/`)
      .then((response) => {
        setTypeIsLoading(false);
        setType(response.data);
      })
  }

  useEffect(
    () => {
      axios
        .get(`http://backend.mneia.gr/api/works/${id}/`)
        .then((response) => {
          setWorkIsLoading(false);
          setWork(response.data);
          getWorkType(response.data);
        })
    },
    [id]
  );

  return (
    <div>
      {workIsLoading && <div>Loading...</div>}
      {work && (
        <>
          <article>
            <h1>{work.name}</h1>
            <Row>
              <Col md={10}>
                <ReactMarkdown rehypePlugins={[rehypeRaw]} children={work.content} />
              </Col>
              <Col md={2} className="work-sidebar">
                <b>Τύπος:</b> {typeIsLoading && <span>Loading...</span>} {type && type.name }
              </Col>
            </Row>
          </article>
          <Helmet>
            <title>{work.name}</title>
          </Helmet>
        </>
      )}
    </div>
  );
}

export default WorkDetail;
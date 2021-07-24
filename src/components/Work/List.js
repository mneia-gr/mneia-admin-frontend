import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import useFetch from "../../useFetch";
import Button from 'react-bootstrap/Button';
import { LinkContainer } from "react-router-bootstrap";

const WorkList = () => {
  const { data: works, isPending, error } = useFetch('http://backend.mneia.gr/api/works/');

  return (
    <>
      <Helmet><title>Works</title></Helmet>
      <h2>Works</h2>

      <LinkContainer to="/works/+">
        <Button>Add Work</Button>
      </LinkContainer>

      {isPending && <div>Works are loading...</div>}
      {error && <div>{error}</div>}
      {works && (
        <ul>
          {works.map((work) => {
            return (
              <li key={work.id}>
                <Link to={`/works/${work.id}`}>{work.name}</Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  );
}

export default WorkList;
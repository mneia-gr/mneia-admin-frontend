import { Link } from "react-router-dom";
import useFetch from "../../useFetch";
import Spinner from 'react-bootstrap/Spinner'

const WorkList = () => {
  const { data: works, isPending, error } = useFetch('http://backend.mneia.gr/api/works/');

  document.title = "Works";

  return (
    <>
      <h2>Works</h2>

      {isPending &&
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      }
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
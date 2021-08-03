import { Link } from "react-router-dom";
import useFetch from "../../useFetch"
import Spinner from "react-bootstrap/Spinner";

const AreaList = () => {
  const { data: areas, isPending, error } = useFetch('http://backend.mneia.gr/api/areas/');

  document.title = "Areas";

  return (
    <>
      <h2>Areas</h2>
      {isPending &&
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      }
      {error && <div>{error}</div>}
      {areas && (
        <ul>
          {areas.map((area) => {
            return (
              <li key={area.id}>
                <Link to={`/areas/${area.id}`}>{area.name}</Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export default AreaList;
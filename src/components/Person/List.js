import { Link } from "react-router-dom";
import useFetch from "../../useFetch"
import Spinner from 'react-bootstrap/Spinner'

const PeopleList = () => {
  const { data: people, isPending, error } = useFetch('http://backend.mneia.gr/api/people/');

  document.title = "People";

  return (
    <>
      <h2>People</h2>
      {isPending &&
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      }
      {error && <div>{error}</div>}
      {people && (
        <ul>
          {people.map((person) => {
            return (
              <li key={person.id}>
                <Link to={`/people/${person.id}`}>{person.name}</Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

export default PeopleList;
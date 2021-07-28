import { Link } from "react-router-dom";
import useFetch from "../../useFetch";

const WorkList = () => {
  const { data: works, isPending, error } = useFetch('http://backend.mneia.gr/api/works/');

  document.title = "Works";

  return (
    <>
      <h2>Works</h2>

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
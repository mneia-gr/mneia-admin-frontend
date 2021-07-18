import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import useFetch from "../../useFetch";

const WorkList = () => {
  const { data: works, isPending, error } = useFetch('http://localhost:8000/api/works/');

  return (
    <>
      <Helmet><title>Works</title></Helmet>
      <h2>Works</h2>
      <Link className="btn btn-primary" to="/works/+">Create Work</Link>
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
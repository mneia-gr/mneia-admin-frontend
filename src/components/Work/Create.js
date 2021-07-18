import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { Helmet } from "react-helmet";

const WorkCreate = () => {
  const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

  const handleSubmit = (e) => {
    setIsPending(true);
    e.preventDefault();
    const work = { name };

    axios.post('http://backend.mneia.gr/api/works/', work)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        setIsPending(false)
        history.push('/works/' + response.data.id)
      })
  }

  return (
    <>
      <Helmet><title>Create Work</title></Helmet>
      <h1>Create Work</h1>
      <form onSubmit={handleSubmit}>
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            type="text"
            required
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {
          isPending
            ? <button className="btn btn-secondary" disabled>Adding...</button>
            : <button className="btn btn-primary">Add</button>
        }
      </form>
    </>
  );
}

export default WorkCreate;
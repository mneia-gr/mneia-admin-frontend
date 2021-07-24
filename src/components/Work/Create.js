import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { Helmet } from "react-helmet";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from "react-bootstrap/Col";

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


      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
          <Form.Label column md={1}>Name:</Form.Label>
          <Col md={11}>
            <Form.Control
              type="text"
              required
              placeholder="Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit">
          Add
        </Button>
      </Form>
    </>
  );
}

export default WorkCreate;
// React:
import { useState } from 'react';
// React Bootstrap:
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// React Router:
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// React Router Bootstrap:
import { LinkContainer } from 'react-router-bootstrap';
// Mneia Admin Frontend:
import WorkList from './components/Work/List';
import WorkDetail from './components/Work/Detail';
import PeopleList from './components/Person/List';
import PersonAddModal from './components/Person/AddModal';
import WorkAddModal from './components/Work/AddModal';
import AreaAddModal from './components/Area/AddModal';

function App() {
  document.title = 'Μνεία';

  const [isVisibleModalAddPerson, setIsVisibleModalAddPerson] = useState(false);
  const [isVisibleModalAddWork, setIsVisibleModalAddWork] = useState(false);
  const [isVisibleModalAddArea, setIsVisibleModalAddArea] = useState(false);

  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                alt="Mneia"
                src="/favicon-32x32.png"
                width="24"
                height="24"
                className="d-inline-block"
              />{' '}
              Μνεία
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/works">
                <Nav.Link>Works</Nav.Link>
              </LinkContainer>
              <Button
                variant="outline-primary"
                size="sm"
                style={{ border: "0px" }}
                onClick={() => setIsVisibleModalAddWork(true)}
              >
                <i className="bi bi-plus-square"></i>
              </Button>
              <LinkContainer className="ms-4" to="/people">
                <Nav.Link>People</Nav.Link>
              </LinkContainer>
              <Button
                variant="outline-primary"
                size="sm"
                style={{ border: "0px" }}
                onClick={() => setIsVisibleModalAddPerson(true)}
              >
                <i className="bi bi-plus-square"></i>
              </Button>

              <LinkContainer className="ms-4" to="/areas">
                <Nav.Link>Areas</Nav.Link>
              </LinkContainer>
              <Button
                variant="outline-primary"
                size="sm"
                style={{ border: "0px" }}
                onClick={() => setIsVisibleModalAddArea(true)}
              >
                <i className="bi bi-plus-square"></i>
              </Button>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Switch>
          <Route exact path="/works">
            <WorkList />
          </Route>
          <Route path="/works/:id">
            <WorkDetail />
          </Route>
          <Route exact path="/people">
            <PeopleList />
          </Route>
        </Switch>
      </Container>

      {isVisibleModalAddPerson && <PersonAddModal setIsVisibleModalAddPerson={setIsVisibleModalAddPerson} />}
      {isVisibleModalAddWork && <WorkAddModal setIsVisibleModalAddWork={setIsVisibleModalAddWork} />}
      {isVisibleModalAddArea && <AreaAddModal setIsVisibleModalAddArea={setIsVisibleModalAddArea} />}
    </Router>
  )
}

export default App;

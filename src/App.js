import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WorkList from './components/Work/List';
import WorkDetail from './components/Work/Detail';
import WorkCreate from './components/Work/Create';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import './index.css'

function App() {
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Switch>
          <Route exact path="/works">
            <WorkList />
          </Route>
          <Route exact path="/works/+">
            <WorkCreate />
          </Route>
          <Route path="/works/:id">
            <WorkDetail />
          </Route>
        </Switch>
      </Container>

      <Helmet><title>Μνεία</title></Helmet>

    </Router>
  )
}

export default App;

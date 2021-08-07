// React:
import { useState } from 'react';
// React Bootstrap:
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
// React Router:
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// React Router Bootstrap:
import { LinkContainer } from 'react-router-bootstrap';
// Mneia Admin Frontend:
import WorkList from './components/Work/List';
import WorkDetail from './components/Work/Detail';
import PeopleList from './components/Person/List';
import PersonDetail from './components/Person/Detail';
import AreaList from './components/Area/List';
import AreaDetail from './components/Area/Detail';
import InstanceAddModal from './components/Generic/InstanceAddModal';

function App() {
  document.title = 'Μνεία';

  // Alert:
  const [alert, setAlert] = useState('');
  // Toasts:
  const [toasts, setToasts] = useState([]);
  // Modals:
  const [isVisibleModalAddPerson, setIsVisibleModalAddPerson] = useState(false);
  const [isVisibleModalAddWork, setIsVisibleModalAddWork] = useState(false);
  const [isVisibleModalAddArea, setIsVisibleModalAddArea] = useState(false);

  const popToast = (index) => {
    const newToasts = [...toasts];
    newToasts.splice(index, 1);
    setToasts(newToasts);
  }

  const addToast = (toast) => {
    const newToasts = [...toasts];
    newToasts.push(toast);
    setToasts(newToasts);
  };

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

      {alert &&
        <Container>
          <Alert variant="danger" onClose={() => setAlert('')} dismissible>
            <Alert.Heading>Error</Alert.Heading>
            {alert}
          </Alert>
        </Container>
      }

      <Container>
        <Switch>
          <Route exact path="/works">
            <WorkList />
          </Route>
          <Route path="/works/:id">
            <WorkDetail addToast={addToast} setAlert={setAlert} />
          </Route>
          <Route exact path="/people">
            <PeopleList />
          </Route>
          <Route path="/people/:id">
            <PersonDetail setAlert={setAlert} addToast={addToast} />
          </Route>
          <Route exact path="/areas">
            <AreaList />
          </Route>
          <Route path="/areas/:id">
            <AreaDetail setAlert={setAlert} addToast={addToast} />
          </Route>
        </Switch>
      </Container>

      <ToastContainer className="p-3" position="bottom-end">
        {toasts.map((toast, index) => {
          return (
            <Toast key={index} bg='success' onClose={() => popToast(index)} autohide delay={30000} >
              <Toast.Header>
                <span className="me-auto">{toast}</span>
              </Toast.Header>
            </Toast>
          )
        })}
      </ToastContainer>

      {isVisibleModalAddPerson &&
        <InstanceAddModal
          model="Person"
          setIsVisibleModalAddInstance={setIsVisibleModalAddPerson}
          addToast={addToast}
          setAlert={setAlert}
        />
      }
      {isVisibleModalAddWork &&
        <InstanceAddModal
          model="Work"
          setIsVisibleModalAddInstance={setIsVisibleModalAddWork}
          addToast={addToast}
          hasTypes
          redirect
          setAlert={setAlert}
        />
      }
      {isVisibleModalAddArea &&
        <InstanceAddModal
          model="Area"
          setIsVisibleModalAddInstance={setIsVisibleModalAddArea}
          addToast={addToast}
          setAlert={setAlert}
        />
      }
    </Router>
  )
}

export default App;

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import WorkList from './components/Work/List';
import WorkDetail from './components/Work/Detail';
import WorkCreate from './components/Work/Create';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand p-0" to="/">
            <img src="/favicon-32x32.png" alt="" width="24" height="24" className="d-inline-block align-text-top" />
            <span className="px-2">Μνεία</span>
          </Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/works">Works</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
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
      </div>

      <Helmet><title>Μνεία</title></Helmet>

    </Router>
  )
}

export default App;

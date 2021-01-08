import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">
              Home
            </Link>
          </li>
        </ul>
      </nav>
        <Switch>
          <Route path="/" exact>
            Home Page
          </Route>
          <Route path="/">
            Not Found
            <br />
            <Link to="/">
              Go Home
            </Link>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App

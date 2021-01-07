import React, { useEffect, useState } from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom"
import SignUp from './SignUp';
import SignIn from './SignIn';
import UserInfo from './UserInfo';
import SignOut from './SignOut';
import { UserContext } from './Contexts/User.Context';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  })
  useEffect(() => {
    ;(async () => {
      const resp = await fetch('/api/user-info')
      const user = await resp.json()
      setUser(user)
    })()
  })
  return (
    <div className="App">
      <UserContext.Provider value={{
        ...user, setUser
      }}>
      <Router>
      <nav>
        <ul>
          {isSignedIn ? "" : <>
            <li>
              <Link to="/sign-up">
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/sign-in">
                Sign In
              </Link>
            </li>
          </>}
          <li>
            <Link to="/user-info">
              User Info
            </Link>
          </li>
          <li>
            <Link to="/sign-out">
              Sign Out
            </Link>
          </li>
        </ul>
      </nav>
        <Switch>
          <Route path="/sign-up">
            <SignUp />
          </Route>
          <Route path="/sign-in">
            <SignIn />
          </Route>
          <Route path="/sign-out">
            <SignOut />
          </Route>
          <Route path="/user-info">
            <UserInfo />
          </Route>
          <Route path="/" exact>
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
      </UserContext.Provider>
    </div>
  )
}

export default App

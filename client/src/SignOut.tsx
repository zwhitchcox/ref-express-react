import * as React from 'react'
import { UserContext } from './Contexts/User.Context'
import "./SignOut.scss"

const SignOut = () => {
  const [status, setStatus] = React.useState("Signing out...")
  const user = React.useContext(UserContext)
  const signout = async () => {
    const resp = await fetch('/api/sign-out')
    const text = await resp.text()
    console.log(text)
  }
  React.useEffect(() => {
    signout()
  }, [])
  console.log(user)
  return (
    <div className="sign-out">
      {status}
    </div>
  )
}

export default SignOut
import { SimpleForm, Text } from '@zecos/input-basic'
import { validatePassword, validateUsername } from '@zecos/validate'
import * as React from 'react'

const SignIn = () => {
      const { Cmpt, handleErrors }  = SimpleForm({
        name: 'signIn',
        items: [
            Text({
                validate: validateUsername,
                name: "username",
                init: process.env.NODE_ENV === "development" ? "zwhitchcox" : ""
            }),
            Text({
                validate: validatePassword,
                name: "password",
                init: process.env.NODE_ENV === "development" ? "password1234" : ""
            }),
        ],
        action: async ({values}) => {
          await fetch("/api/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values())
            })
            .then(handleErrors) // handle errors automatically displays the error for you
            .then(resp => resp.text())
            .then(() => window.location.href = "/") // redirect to home page, however you do that
            .catch(()=>{ /* already handled for you */})
          // console.log(await resp.text())

        },
        loadingText: "Signing In..."
    })

  return (
    <div className="sign-form">
      {Cmpt}
    </div>
  )
}

export default SignIn
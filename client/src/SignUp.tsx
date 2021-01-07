import * as React from 'react'
import { SimpleForm, Text } from '@zecos/input-basic'
import { validateUsername, validatePassword, validateEmail, validateName } from "@zecos/validate"

const SignUp = () => {
      const { Cmpt, handleErrors }  = SimpleForm({
        name: 'signUp',
        items: [
            Text({
              validate: validateName,
              name: "firstName",
              init: process.env.NODE_ENV === "development" ? "Zane" : ""
            }),
            Text({
              validate: validateName,
              name: "lastName",
              init: process.env.NODE_ENV === "development" ? "Hitchcox" : ""
            }),
            Text({
                validate: validateEmail,
                name: "email",
                init: process.env.NODE_ENV === "development" ? "zwhitchcox@gmail.com" : ""
            }),
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
        action: ({values}) => {
          fetch("/api/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values())
            })
            .then(handleErrors) // handle errors automatically displays the error for you
            .then(() => window.location.href = "/") // redirect to home page, however you do that
            .catch(()=>{ /* already handled for you */})
        },
        loadingText: "Signing Up..."
    })

  return (
    <div className="sign-form">
      {Cmpt}
    </div>
  )
}

export default SignUp
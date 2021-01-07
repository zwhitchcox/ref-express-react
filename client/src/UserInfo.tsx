import * as React from 'react'
import { SimpleForm, Text } from '@zecos/input-basic'
import { validateUsername, validatePassword, validateEmail, validateName } from "@zecos/validate"

const UserInfo = () => {
  const { Cmpt, handleErrors, setValues } = SimpleForm({
    name: 'accountInfo',
    items: [
      Text({
        validate: validateName,
        name: "firstName",
        init: "",
        props: {
          spellCheck: false,
        },
      }),
      Text({
        validate: validateName,
        name: "lastName",
        init: "",
        props: {
          spellCheck: false,
        },
      }),
      Text({
        validate: validateEmail,
        name: "email",
        init: "",
      }),
      Text({
        validate: validateUsername,
        name: "username",
        init: "",
        props: {
          spellCheck: false,
        },
      }),
      Text({
        validate: (pass) => {
          if (pass.length === 0) {
            return []
          }
          return validatePassword(pass)
        },
        name: "password",
        init: ""
      }),
    ],
    action: ({ values }) => {
      fetch("/api/update-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values())
      })
        .then(handleErrors) // handle errors automatically displays the error for you
        .then(() => {
          console.log('Updated successfully.')
        }) // redirect to home page, however you do that
        .catch(() => { /* already handled for you */ })
    },
    loadingText: "Updating Account Info...",
    submitButtonText: 'Update Account Info',
    props: {
      className: "sign-form",
    }
  })

  React.useEffect(() => {
    ;(async () => {
      const resp = await fetch('/api/user-info')
      const json = await resp.json()
      setValues(json)
    })()
  }, [])

  return (
    <div>
      {Cmpt}
    </div>
  )
}

export default UserInfo

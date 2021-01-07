import { createContext } from "react";

export  const UserContext = createContext<any>({
  isSignedIn: false,
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  setUser: () => {},
})
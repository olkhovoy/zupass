import { createContext, useState } from "react";
const defaults: PodValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  owner: "",
  creditScore: 30,
  accountBalance: 100000
};

export interface PodValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  owner: string;
  creditScore: number;
  accountBalance: number;
}
export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: null,
  podValues: defaults,
  setPodValues: null
});

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [podValues, setPodValues] = useState<PodValues>(defaults);
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, podValues, setPodValues }}
    >
      {children}
    </AuthContext.Provider>
  );
};

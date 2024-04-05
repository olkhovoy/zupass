import { createContext, useState } from "react";
const defaults: PodValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  owner: ""
};

export interface PodValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  owner: string;
}
export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: function (value: React.SetStateAction<Boolean>): void {},
  podValues: defaults,
  setPodValues: function (value: React.SetStateAction<PodValues>): void {}
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

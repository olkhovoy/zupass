import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { PCDForm } from "../components/PCDForm";
import { Auth } from "./Auth";

function Home(): JSX.Element {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <div className="App">
      <div className="ellipse grid-center" />
      <div className="form-container grid-center">
        {isLoggedIn && <PCDForm />}
        {!isLoggedIn && <Auth />}
      </div>
    </div>
  );
}

export default Home;

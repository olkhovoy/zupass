import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { Auth } from "./Auth";
import { Launchpad } from "./Launchpad";

function Home(): JSX.Element {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <>
      {isLoggedIn && <Launchpad />}
      {!isLoggedIn && <Auth />}
    </>
  );
}

export default Home;

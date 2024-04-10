import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export const Launchpad = () => {
  const { podValues } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="auth-result">
      <p>
        Authenticated as <b>{podValues.email}</b>
      </p>
      <p>
        Your public key is <b>{podValues.owner}</b>
      </p>
      <p>What would you like to do?</p>
      <button
        className="form-field"
        onClick={() => {
          navigate("/pod");
        }}
      >
        Get a provable object for my PII
      </button>
      <button className="form-field">Free NFT</button>
    </div>
  );
};

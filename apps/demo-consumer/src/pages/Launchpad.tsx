import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { semaphoreIdToBigInt } from "@pcd/eddsa-frog-pcd";

export const Launchpad = (): React.ReactNode => {
  const { podValues } = useContext(AuthContext);

  function prettyPrintEmail(email: string): string {
    return `${email.substring(0, 16)}...`;
  }

  function prettyPrintAddress(decimalStr: string): string {
    const str = semaphoreIdToBigInt(decimalStr).toString(16);
    return `0x${str.substring(0, 4)}...${str.substring(
      str.length - 4,
      str.length
    )}`;
  }

  const navigate = useNavigate();
  return (
    <div className="auth-result">
      <p>
        Authenticated as <b>{prettyPrintEmail(podValues.email)}</b>
      </p>
      <p>
        Your public key is <b>{prettyPrintAddress(podValues.owner)}</b>
      </p>
      <p>What would you like to do?</p>
      <button
        className="form-field"
        onClick={(): void => {
          navigate("/pod");
        }}
      >
        Get a provable object for my PII
      </button>
      <button
        className="form-field"
        onClick={(): void => {
          navigate("/phone");
        }}
      >
        Prove phone number
      </button>
    </div>
  );
};

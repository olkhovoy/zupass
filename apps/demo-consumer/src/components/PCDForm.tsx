import { constructZupassPcdAddRequestUrl } from "@pcd/passport-interface";
import { POD, podEntriesFromSimplifiedJSON } from "@pcd/pod";
import { PODPCD, PODPCDPackage } from "@pcd/pod-pcd";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { sendZupassRequest } from "../util";
import { AuthContext } from "./AuthContext";

export const PCDForm = (): React.ReactNode => {
  const [submitted, setSubmitted] = useState(false);
  const [_valid, setValid] = useState(false);
  const { isLoggedIn, podValues, setPodValues } = useContext(AuthContext);

  const navigate = useNavigate();
  const EXAMPLE_EDDSA_PRIVATE_KEY =
    "0001020304050607080900010203040506070809000102030405060708090001";

  if (!isLoggedIn) {
    navigate("/");
  }
  const handleInputChange = (event: ChangeEvent): void => {
    event.preventDefault();

    const { name, value } = event.target;
    setPodValues((values) => ({
      ...values,
      [name]: value
    }));
  };

  async function addPODPCD(
    podContent: string,
    podFolder: string | undefined
  ): Promise<void> {
    const newPOD = new PODPCD(
      uuid(),
      POD.sign(
        podEntriesFromSimplifiedJSON(podContent),
        EXAMPLE_EDDSA_PRIVATE_KEY
      )
    );

    const serializedPODPCD = await PODPCDPackage.serialize(newPOD);

    const url = constructZupassPcdAddRequestUrl(
      process.env.WALLET_URL,
      window.location.origin + "#/popup",
      serializedPODPCD,
      podFolder
    );

    sendZupassRequest(url);
  }

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (podValues.firstName && podValues.lastName && podValues.email) {
      setValid(true);
    }
    setSubmitted(true);

    addPODPCD(JSON.stringify(podValues), "Test PODs")
      .then(() => {
        console.log("pcd added");

        navigate("/");
      })
      .catch((err) => {
        console.error("failed to add pcd", err);
      });
  };

  return (
    <div>
      <div className="auth-result">
        <p>Please fill the form below to obtain a</p>
        <p>Provable Data Object</p>
      </div>
      <form className="register-form" onSubmit={handleSubmit}>
        {
          <input
            className="form-field"
            type="text"
            placeholder="First name"
            name="firstName"
            value={podValues.firstName}
            onChange={handleInputChange}
          />
        }
        {submitted && !podValues.firstName && (
          <span id="first-name-error">Please enter a first name</span>
        )}
        <input
          className="form-field"
          type="text"
          placeholder="Last name"
          name="lastName"
          value={podValues.lastName}
          onChange={handleInputChange}
        />
        {submitted && !podValues.lastName && (
          <span id="last-name-error">Please enter a last name</span>
        )}
        <input
          className="form-field"
          type="text"
          placeholder="Phone"
          name="phone"
          value={podValues.phone}
          onChange={handleInputChange}
        />
        <button className="form-field" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

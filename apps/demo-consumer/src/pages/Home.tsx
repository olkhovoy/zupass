import { constructZupassPcdAddRequestUrl } from "@pcd/passport-interface";
import { POD, podEntriesFromSimplifiedJSON } from "@pcd/pod";
import { PODPCD, PODPCDPackage } from "@pcd/pod-pcd";
import { FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";
import { sendZupassRequest } from "../util";
function Page(): JSX.Element {
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    owner:
      "18711405342588116796533073928767088921854096266145046362753928030796553161041"
  });

  const EXAMPLE_EDDSA_PRIVATE_KEY =
    "0001020304050607080900010203040506070809000102030405060708090001";

  const handleInputChange = (event: any) => {
    event.preventDefault();

    console.log(event);
    const { name, value } = event.target;
    setValues((values) => ({
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

    console.log("process.env.WALLET_URL", process.env.WALLET_URL);
    const url = constructZupassPcdAddRequestUrl(
      process.env.WALLET_URL,
      window.location.origin + "#/popup",
      serializedPODPCD,
      podFolder
    );

    sendZupassRequest(url);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (values.firstName && values.lastName && values.email) {
      setValid(true);
    }
    setSubmitted(true);

    addPODPCD(JSON.stringify(values), "Test PODs")
      .then((res) => {
        console.log("res");
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="App">
      <div className="ellipse grid-center" />
      <div className="form-container grid-center">
        <form className="register-form" onSubmit={handleSubmit}>
          {
            <input
              className="form-field"
              type="text"
              placeholder="First name"
              name="firstName"
              value={values.firstName}
              onChange={handleInputChange}
            />
          }
          {submitted && !values.firstName && (
            <span id="first-name-error">Please enter a first name</span>
          )}
          <input
            className="form-field"
            type="text"
            placeholder="Last name"
            name="lastName"
            value={values.lastName}
            onChange={handleInputChange}
          />
          {submitted && !values.lastName && (
            <span id="last-name-error">Please enter a last name</span>
          )}
          <input
            className="form-field"
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
          />
          <input
            className="form-field"
            type="text"
            placeholder="Phone"
            name="phone"
            value={values.phone}
            onChange={handleInputChange}
          />
          <button className="form-field" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;

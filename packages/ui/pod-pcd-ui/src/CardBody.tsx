import { constructZupassPcdAddRequestUrl } from "@pcd/passport-interface";
import {
  FieldLabel,
  HiddenText,
  Separator,
  Spacer,
  styled
} from "@pcd/passport-ui";
import { PCDUI } from "@pcd/pcd-types";
import { PODPCD, PODPCDPackage } from "@pcd/pod-pcd";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  //align-items: center;
`;
const ContainerWide = styled.div`
  display: flex;
  width: 120%;
  flex-direction: column;
  align-self: center;
`;

const Label = styled.div`
  font-weight: bold;
  margin-top: 5px;
`;

const Text = styled.p`
  margin-top: -5px;
`;

const Container = styled.div`
  padding: 16px;
  overflow: hidden;
  width: 100%;
`;

export const PODPCDUI: PCDUI<PODPCD> = {
  renderCardBody: PODPCDCardBody
};

function SelectFieldCheckBox({
  name,
  onSelected,
  selectedFields
}: {
  name: string;
  onSelected: (updated: object) => void;
  selectedFields: object;
}): JSX.Element {
  const [checked, setChecked] = useState(0);

  return (
    <input
      type="checkbox"
      value={checked}
      onChange={(event: any): void => {
        event.preventDefault();
        onSelected({ ...selectedFields, [name]: checked === 1 });
        setChecked(checked === 1 ? 0 : 1);
      }}
    />
  );
}

/**
 * This component renders the body of a 'Card' that Zupass uses to display PCDs to the user.
 */
function PODPCDCardBody({
  pcd,
  prove,
  makeProveArgs
}: {
  pcd: PODPCD;
  prove?: boolean;
  makeProveArgs?: (args: object) => void;
}): JSX.Element {
  const [sigStatus, setSigStatus] = useState("unvalidated");

  const [selectedFields, setSelectedFields] = useState({});

  const [addUrl, setAddUrl] = useState("");
  PODPCDPackage.serialize(pcd);
  useEffect(() => {
    (async (): Promise<void> => {
      setAddUrl(
        constructZupassPcdAddRequestUrl(
          "http://localhost:3000",
          "http://localhost:3101",
          {
            type: "Add",
            pcd: JSON.stringify(await PODPCDPackage.serialize(pcd))
          },
          "My docs"
        )
      );
    })();
  }, [pcd]);

  const onSelected = (updated: object): void => {
    setSelectedFields(updated);
    console.log("onSelected", updated);
    if (makeProveArgs) {
      makeProveArgs(updated);
    }
  };
  if (prove) {
    return (
      <ContainerWide>
        <Separator />
        <FieldLabel>Select fields to prove</FieldLabel>
        <Container2>
          <table>
            <tbody>
              {Object.keys(pcd.claim.entries).map((key) => (
                <tr>
                  {prove && (
                    <td>
                      <SelectFieldCheckBox
                        name={key}
                        onSelected={onSelected}
                        selectedFields={selectedFields}
                      />
                    </td>
                  )}
                  <td>{key}</td>
                  <td>{pcd.claim.entries[key].value.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container2>
      </ContainerWide>
    );
  }

  return (
    <Container>
      <Separator />
      <FieldLabel>Document content</FieldLabel>

      <Container2>
        {Object.keys(pcd.claim.entries).map((key) => (
          <div key={key}>
            {prove && (
              <SelectFieldCheckBox
                name={key}
                onSelected={setSelectedFields}
                selectedFields={selectedFields}
              />
            )}
            <Label>{key}</Label>
            <Text>{pcd.claim.entries[key].value.toString()}</Text>
          </div>
        ))}
      </Container2>

      {/*<QRCode value={JSON.stringify(pcd)}/>*/}
      {
        <div>
          <h1>Add via QR-code</h1>
          <QRCode value={addUrl} />
        </div>
      }

      {/*<pre>{podEntriesToSimplifiedJSON(pcd.claim.entries, 2)}</pre>*/}

      <Spacer h={8} />
      <FieldLabel>EdDSA Public Key</FieldLabel>
      <HiddenText text={pcd.claim.signerPublicKey} />
      <FieldLabel>EdDSA Signature</FieldLabel>
      <HiddenText text={pcd.proof.signature} />
      <label>
        <button
          onClick={async (): Promise<void> =>
            setSigStatus(
              (await PODPCDPackage.verify(pcd)) ? "valid ✅" : "invalid ❌"
            )
          }
        >
          Check
        </button>
        Signature is {sigStatus}
      </label>
    </Container>
  );
}

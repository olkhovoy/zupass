import {
  FieldLabel,
  HiddenText,
  Separator,
  Spacer,
  styled
} from "@pcd/passport-ui";
import { PCDUI } from "@pcd/pcd-types";
import { podEntriesToSimplifiedJSON } from "@pcd/pod";
import { PODPCD, PODPCDPackage } from "@pcd/pod-pcd";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  //align-items: center;
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

/**
 * This component renders the body of a 'Card' that Zupass uses to display PCDs to the user.
 */
function PODPCDCardBody({ pcd }: { pcd: PODPCD }): JSX.Element {
  const [sigStatus, setSigStatus] = useState("unvalidated");

  useEffect(() => {
    console.warn("HERE IS THE PCD:")
    console.log(pcd)
  }, []);

  return (
    <Container>
      <p>This PCD represents a signed POD (Provable Object Data)</p>
      <Separator />
      <FieldLabel>POD Entries</FieldLabel>

      <Container2>
        {Object.keys(pcd.claim.entries).map((key) => (
          <div key={key}>
            <Label>{key}</Label>
            <Text>{pcd.claim.entries[key].value.toString()}</Text>
          </div>
        ))}
      </Container2>

      <QRCode value={JSON.stringify(pcd)}/>

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



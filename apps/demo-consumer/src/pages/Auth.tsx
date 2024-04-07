import { semaphoreIdToBigInt } from "@pcd/eddsa-frog-pcd";
import { EmailPCDPackage } from "@pcd/email-pcd";
import {
  constructZupassPcdGetRequestUrl,
  getWithoutProvingUrl,
  openSemaphoreSignaturePopup,
  openZupassPopup,
  useSemaphoreSignatureProof,
  useZupassPopupMessages
} from "@pcd/passport-interface";
import { useCallback, useContext, useEffect } from "react";
import styled from "styled-components";
import { AuthContext } from "../components/AuthContext";

const AuthControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Auth = (): React.ReactNode => {
  const { podValues, setIsLoggedIn, setPodValues } = useContext(AuthContext);
  const [pcdStr] = useZupassPopupMessages();

  const { signatureProof: _signatureProof } = useSemaphoreSignatureProof(
    pcdStr,
    () => {
      console.log("proof verified");
      setIsLoggedIn(true);
    }
  );

  function prettyPrint(decimalStr: string): string {
    const str = semaphoreIdToBigInt(decimalStr).toString(16);
    return `0x${str.substring(0, 4)}...${str.substring(0, 4)}`;
  }
  useEffect(() => {
    (async (): Promise<void> => {
      if (pcdStr) {
        const payload = JSON.parse(pcdStr);
        console.log(payload);
        const pcd = await EmailPCDPackage.deserialize(payload.pcd);
        console.log("received pcd for email", pcd.claim);

        setPodValues({
          ...podValues,
          owner: prettyPrint(pcd.claim.semaphoreId),
          email: pcd.claim.emailAddress
        });
        setIsLoggedIn(true);
      }
    })();
  }, [pcdStr, podValues, setIsLoggedIn, setPodValues]);

  // This is basically what ZuAuth does, need to get unique nonce from server
  const requestSignature = useCallback(
    () =>
      openSemaphoreSignaturePopup(
        process.env.WALLET_URL,
        window.location.origin + "#/popup",
        "messageToSign", //nonce
        false
      ),
    []
  );

  //This is not email AUTH! This initiates the process of generating a new email PCD
  //   const requestEmail = () => {
  //     getEmailPCD(
  //       process.env.WALLET_URL,
  //       window.location.origin + "#/popup",
  //       "whatever"
  //     );
  //   };
  return (
    <AuthControl>
      <p className="auth-result">Please authenticate your DID wallet</p>
      <button className="form-field" onClick={getEmailPCDWithoutProving}>
        Prove email
      </button>
      <button className="form-field" onClick={requestSignature}>
        Prove signature
      </button>
    </AuthControl>
  );
};

function sendZupassRequest(proofUrl: string): void {
  const popupUrl = `#/popup?proofUrl=${encodeURIComponent(proofUrl)}`;
  window.open(popupUrl, "_blank", "width=450,height=600,top=100,popup");
}

function getEmailPCDWithoutProving(): void {
  const url = getWithoutProvingUrl(
    process.env.WALLET_URL,
    window.location.origin + "#/popup",
    EmailPCDPackage.name
  );
  sendZupassRequest(url);
}

export function getEmailPCD(
  zupassClientUrl: string,
  popupUrl: string,
  originalSiteName: string
): void {
  const proofUrl = constructZupassPcdGetRequestUrl<typeof EmailPCDPackage>(
    zupassClientUrl,
    popupUrl,
    EmailPCDPackage.name,
    {
      emailAddress: undefined,
      id: undefined,
      privateKey: undefined,
      semaphoreId: undefined
    },
    {
      title: "Zuzalu Auth",
      description: originalSiteName,
      signIn: true
    }
  );

  openZupassPopup(popupUrl, proofUrl);
}

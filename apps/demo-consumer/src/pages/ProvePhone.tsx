import {
  constructZupassPcdGetRequestUrl,
  openZupassPopup,
  useZupassPopupMessages
} from "@pcd/passport-interface";
import { useEffect } from "react";
import styled from "styled-components";
import { PODPCDPackage } from "@pcd/pod-pcd";

const AuthControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProvePhone = (): React.ReactNode => {
  // const { podValues, setIsLoggedIn, setPodValues } = useContext(AuthContext);
  const [pcdStr] = useZupassPopupMessages();

  useEffect(() => {
    console.log("got POD PCD: ", pcdStr);
  }, [pcdStr]);

  return (
    <AuthControl>
      <p className="auth-result">Please authenticate your DID wallet</p>
      <button className="form-field" onClick={getPodPCD}>
        Prove phone
      </button>
    </AuthControl>
  );
};

export function getPodPCD(): void {
  const popupUrl = window.location.origin + "#/popup";
  const proofUrl = constructZupassPcdGetRequestUrl<typeof PODPCDPackage>(
    process.env.WALLET_URL,
    popupUrl,
    PODPCDPackage.name,
    {
      entries: undefined,
      privateKey: undefined,
      id: undefined
    },
    {
      title: "Zuzalu Auth",
      description: "originalSiteName",
      signIn: true
    }
  );

  openZupassPopup(popupUrl, proofUrl);
}

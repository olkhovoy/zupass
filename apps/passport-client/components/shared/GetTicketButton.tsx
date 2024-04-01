import { SerializedPCD } from "@pcd/pcd-types";
import { useCallback, useState } from "react";
import {
  useCredentialManager,
  usePCDCollection,
  useSelf,
  useSubscriptions
} from "../../src/appHooks";
import { Button } from "../core";

export function GetTicketButton(): JSX.Element {
  const user = useSelf();
  const pcds = usePCDCollection();
  const subscriptions = useSubscriptions();

  const [url, setUrl] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  // const [emailPcd, setEmailPCD] = useState<string | null>(null);

  const [signaturePCD, setSignaturePCD] = useState<SerializedPCD>(null);

  const credentialManager = useCredentialManager();
  // const showToast = useCallback(() => {
  //   toast("Account data exported", { position: "bottom-center" });
  // }, []);

  const getTicket = useCallback(async () => {
    const pcd = await credentialManager.requestCredential({
      signatureType: "sempahore-signature-pcd",
      pcdType: "email-pcd"
    });
    setSignaturePCD(pcd);

    const ticketResponse = await fetch("http://localhost:3100/feeds", {
      method:"POST",
      headers: [["Content-type", "application/json"]],
      body: JSON.stringify({"feedId": "1" , pcd}
      )
    });
    console.log(ticketResponse.status);
  }, []);
  return url && <Button onClick={getTicket}>Get ticket</Button>;
}

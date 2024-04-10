import { EmailPCD, EmailPCDArgs, EmailPCDPackage } from "@pcd/email-pcd";
import { ArgumentTypeName } from "@pcd/pcd-types";
import React, { useEffect, useState } from "react";
import { useIdentity, usePCDs } from "../../../src/appHooks";
import { safeRedirect } from "../../../src/passportRequest";
import { Button } from "../../core";
import { PCDGetRequest } from "@pcd/passport-interface";

export const EmailPCDProveScreen = ({
  req
}: {
  req: PCDGetRequest<typeof EmailPCDPackage>;
}): JSX.Element => {
  const pcds = usePCDs();
  const identity = useIdentity();

  const [pcd, setPCD] = useState<EmailPCD>(null);
  const emailPcd = pcds.find((pcd) => pcd.type === EmailPCDPackage.name);

  console.log("pcds", pcds);
  if (emailPcd) {
    console.log("found pcd");
  } else {
    console.log("no suitable pcd found");
  }

  useEffect(() => {
    const emailPcd = pcds.find((pcd) => pcd.type === EmailPCDPackage.name);
    setPCD(emailPcd as EmailPCD);
  }, [pcds]);

  const onProveClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();

    const args = {
      emailAddress: {
        argumentType: ArgumentTypeName.String,
        value: pcd.claim.emailAddress
      },
      id: {
        argumentType: ArgumentTypeName.String,
        value: pcd.id
      },
      privateKey: {
        argumentType: ArgumentTypeName.String,
        value: identity.getSecret().toString(16)
      },
      semaphoreId: {
        argumentType: ArgumentTypeName.String,
        value: pcd.claim.semaphoreId
      }
    } as EmailPCDArgs;
    const { prove, serialize } = EmailPCDPackage;
    const provedPCD = await prove(args);
    const serializedPCD = await serialize(provedPCD);
    safeRedirect(req.returnUrl, serializedPCD);
  };
  return (
    <div>
      {!emailPcd && <div>"no suitable pcd found"</div>}
      {emailPcd && (
        <div>
          <div> {emailPcd.id}</div>
          <Button onClick={onProveClick}>prove</Button>
        </div>
      )}
    </div>
  );
};

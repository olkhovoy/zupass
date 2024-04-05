import { EmailPCD, EmailPCDPackage } from "@pcd/email-pcd";
import { ArgumentTypeName } from "@pcd/pcd-types";
import { useEffect, useState } from "react";
import { useIdentity, usePCDs } from "../../../src/appHooks";
import { Button } from "../../core";

export const EmailPCDProveScreen = (props: any) => {
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
  }, []);

  const onProveClick = (e: any) => {
    e.preventDefault();

    EmailPCDPackage.prove({
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
        value: identity.getSecret().toString()
      },
      semaphoreId: {
        argumentType: ArgumentTypeName.String,
        value: pcd.claim.semaphoreId
      }
    });
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

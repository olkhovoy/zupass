import { ArgumentTypeName } from "@pcd/pcd-types";
import React, { useEffect, useState } from "react";
import { useIdentity, usePCDs } from "../../../src/appHooks";
import { safeRedirect } from "../../../src/passportRequest";
import { Button } from "../../core";
import { PCDGetRequest } from "@pcd/passport-interface";
import { PODPCDArgs, PODPCDPackage } from "@pcd/pod-pcd";
import { PCDCardList } from "../../shared/PCDCardList";

export const PODPCDProveScreen = ({
  req
}: {
  req: PCDGetRequest<typeof PODPCDPackage>;
}): JSX.Element => {
  const pcds = usePCDs();
  const identity = useIdentity();

  // const [pcd, setPCD] = useState<PODPCD>(null);
  const podPcds = pcds.filter((pcd) => pcd.type === PODPCDPackage.name);

  // const [args, setArgs] = useState<PODPCDArgs>(null);

  console.log("pcds", pcds);
  if (podPcds) {
    console.log("found pcd");
  } else {
    console.log("no suitable pcd found");
  }

  // useEffect(() => {
  //   const podPcd = pcds.find((pcd) => pcd.type === PODPCDPackage.name);
  //   setPCD(podPcd as PODPCD);
  // }, [pcds]);

  const onProveClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();

    // const args = {
    // emailAddress: {
    //   argumentType: ArgumentTypeName.String,
    //   value: pcd.claim.emailAddress
    // },
    // id: {
    //   argumentType: ArgumentTypeName.String,
    //   value: pcd.id
    // },
    // privateKey: {
    //   argumentType: ArgumentTypeName.String,
    //   value: identity.getSecret().toString(16)
    // },
    // semaphoreId: {
    //   argumentType: ArgumentTypeName.String,
    //   value: pcd.claim.semaphoreId
    // }
    // } as PODPCDArgs;
    // const { prove, serialize } = PODPCDPackage;
    // const provedPCD = await prove(args);
    // const serializedPCD = await serialize(provedPCD);
    // safeRedirect(req.returnUrl, serializedPCD);
  };
  const makeProveArgs = (args): void => {
    console.log("args", args);
  };
  return (
    <div>
      {!podPcds && <div>"no suitable pcd found"</div>}
      {podPcds && (
        <div>
          <PCDCardList
            pcds={podPcds}
            hideRemoveButton
            prove
            makeProveArgs={makeProveArgs}
          />
          <Button onClick={onProveClick}>prove</Button>
        </div>
      )}
    </div>
  );
};

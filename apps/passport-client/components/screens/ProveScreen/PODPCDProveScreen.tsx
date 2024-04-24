import { ArgumentTypeName } from "@pcd/pcd-types";
import React, { useEffect, useState } from "react";
import { useIdentity, usePCDs } from "../../../src/appHooks";
import { safeRedirect } from "../../../src/passportRequest";
import { Button } from "../../core";
import { PCDGetRequest } from "@pcd/passport-interface";
import {
  PODPCD,
  PODPCDArgs,
  PODPCDClaim,
  PODPCDPackage,
  PODEntries
} from "@pcd/pod-pcd";
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

  const [args, setArgs] = useState<PODPCDArgs>(null);

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
    const { prove, serialize } = PODPCDPackage;
    const provedPCD = await prove(args);
    const serializedPCD = await serialize(provedPCD);
    safeRedirect(req.returnUrl, serializedPCD);
  };
  const makeProveArgs = (args, id): void => {
    // console.log("args", args, id);
    //TODO: map selected fields to respective entries and their values

    const selectedPCD: PODPCD = pcds.find((pcd) => pcd.id === id) as PODPCD;
    const entries: PODEntries = selectedPCD.claim.entries;

    // console.debug("keys", Object.keys(entries));

    // const selectedEntries = Object.keys(entries)
    //   .filter((field) => args[field])
    //   .reduce((obj, key) => {
    //     obj[key] = entries[key];
    //     return obj;
    //   }, {});
    const phoneEntryValue = {
      phone: selectedPCD.claim.entries["phone"]
    };
    // const emailEntryValue = {
    //   email: selectedPCD.claim.entries["email"]
    // };
    console.debug("selected pcd", selectedPCD);
    console.debug(selectedPCD);
    const podPCDProvingArgs: PODPCDArgs = {
      privateKey: {
        argumentType: ArgumentTypeName.String,
        value: identity.getSecret().toString(16)
      },
      entries: {
        argumentType: ArgumentTypeName.Object,
        value: {
          ...phoneEntryValue
        }
      },
      id
    };
    console.debug("podPCDProvingArgs", podPCDProvingArgs);
    setArgs(podPCDProvingArgs);
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

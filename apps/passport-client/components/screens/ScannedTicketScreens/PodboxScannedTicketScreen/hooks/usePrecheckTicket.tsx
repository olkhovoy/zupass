import {
  PODBOX_CREDENTIAL_REQUEST,
  PodboxTicketActionPreCheckResult
} from "@pcd/passport-interface";
import { useCallback, useEffect, useState } from "react";
import urljoin from "url-join";
import { appConfig } from "../../../../../src/appConfig";
import {
  useDispatch,
  useUserIdentityPCD
} from "../../../../../src/appHooks";

/**
 * Once a ticket has been scanned by the qr code reader, Zupass makes a
 * request to the Podbox backend to determine what it can do with a ticket.
 * The possibilities are:
 *
 * - nothing
 * - check this user in
 * - give this user a badge
 * - give this user your contact card.
 */
export function usePreCheckTicket(
  ticketId: string | undefined,
  eventId: string | undefined
):
  | {
      loading: true;
      result: undefined;
    }
  | {
      loading: false;
      result: PodboxTicketActionPreCheckResult;
    } {
  const [result, setResult] = useState<
    PodboxTicketActionPreCheckResult | undefined
  >();
  const identityPCD = useUserIdentityPCD();
  const dispatch = useDispatch();

  const doPreCheckTicket = useCallback(
    async (ticketId: string | undefined, eventId: string | undefined) => {
      if (!ticketId || !eventId) {
        return;
      }

      if (!identityPCD) {
        await dispatch({ type: "participant-invalid" });
        return;
      }

      if (!identityPCD) {
        await dispatch({ type: "participant-invalid" });
        return;
      }

      const serializedEmailPCD = await EmailPCDPackage.serialize(emailPCDs[0]);
      const payload = createTicketActionCredentialPayload(
        serializedEmailPCD,
        { checkin: true },
        eventId,
        ticketId
      );

      const signedPayload = await SemaphoreSignaturePCDPackage.prove({
        identity: {
          argumentType: ArgumentTypeName.PCD,
          value: await SemaphoreIdentityPCDPackage.serialize(identityPCD)
        },
        signedMessage: {
          argumentType: ArgumentTypeName.String,
          value: JSON.stringify(payload)
        }
      });

      const preCheckTicketResult = await requestGenericIssuancePreCheck(
        urljoin(appConfig.zupassServer, "generic-issuance/api/pre-check"),
        await credentialManager.requestCredential(PODBOX_CREDENTIAL_REQUEST),
        { checkin: true },
        ticketId,
        eventId
      );
      setResult(preCheckTicketResult);
    },
    [dispatch, identityPCD, pcdCollection]
  );

  useEffect(() => {
    doPreCheckTicket(ticketId, eventId);
  }, [doPreCheckTicket, eventId, ticketId]);

  if (result) {
    return { loading: false, result };
  } else {
  if (result) {
    return { loading: false, result };
  } else {
    return { loading: true, result: undefined };
  }
}

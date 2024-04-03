import {
  KnownTicketGroup
} from "@pcd/passport-interface";
import { decodeQRPayload } from "@pcd/passport-ui";
import { PCD, SerializedPCD } from "@pcd/pcd-types";
import { ZKEdDSAEventTicketPCD, ZKEdDSAEventTicketPCDPackage, isZKEdDSAEventTicketPCD } from "@pcd/zk-eddsa-event-ticket-pcd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  usePCDCollection,
  useQuery
} from "../../../src/appHooks";
import { CenterColumn, H4, Placeholder, Spacer, TextCenter } from "../../core";
import { LinkButton } from "../../core/Button";
import { icons } from "../../icons";
import { AppContainer } from "../../shared/AppContainer";
import {
  CardContainerExpanded,
  CardHeader,
  CardOutlineExpanded
} from "../../shared/PCDCard";

enum VerifyOutcome {
  // We recognize this ticket
  KnownTicketType,
  // If verification failed for any reason
  NotVerified
}

type VerifyResult =
  | {
      outcome: VerifyOutcome.KnownTicketType;
      productId: string;
      group: KnownTicketGroup;
      publicKeyName: string;
      ticketName?: string;
      ticketId: string;
      eventName: string;
    }
  | {
      outcome: VerifyOutcome.NotVerified;
      // For unverified tickets there is an error message
      message: string;
    };



// Shows whether a ticket can be verified, and whether it is a known ticket
// about which we can show extra information. "Known tickets" are tickets such
// as Zuzalu or Zuconnect tickets.
// Unknown tickets are displayed with a warning that we cannot attest to the
// truth of the claim being made, e.g. that a ticket is a Zuzalu ticket,
// since the presented ticket does not match any known pattern of event ID,
// product ID and signing key.
export function ZkTicketVerificationScreen(): JSX.Element {
  const query = useQuery();
  const encodedQRPayload = query.get("pcd");
  const id = query.get("id");

  const { pcd, serializedPCD } = useDecodedPayload(encodedQRPayload);
  // We always perform a 'verify' request on all tickets that reach this point
  const [verifyResult, setVerifyResult] = useState<VerifyResult | undefined>();

  useEffect( ()=> {
    ( async ():Promise<void> => {
      if(pcd) {
        if(isZKEdDSAEventTicketPCD(pcd) ) {
          const ticket = pcd as ZKEdDSAEventTicketPCD;
          const isValid = await ZKEdDSAEventTicketPCDPackage.verify(ticket)
          if(isValid ) {
            setVerifyResult({
              outcome: VerifyOutcome.KnownTicketType,
              productId: ticket.claim.partialTicket.productId,
              group: KnownTicketGroup.Other,
              publicKeyName: "CHANGE_ME publicKeyName",
        // ticketName?: string,
              ticketId: ticket.claim.partialTicket.ticketId,
              eventName: "CHANGE_ME publicKeyName",
            });
         } else {
          setVerifyResult({
            outcome:VerifyOutcome.NotVerified,
            message: "Invalid proof"
          })
         }
        }
      } 
    })();
  }, [pcd])

  if (!verifyResult) {
    return <WaitingForCheckAndVerify />;
  }
  if (
    pcd &&
    isZKEdDSAEventTicketPCD(pcd)  &&
    verifyResult.outcome === VerifyOutcome.KnownTicketType
    
  ) {
    return (
      <AppContainer bg={"primary"}>
        <Spacer h={48} />

        <ZKNoticeContainer>
          <h2>Zero-knowledge ticket</h2>
          <p>
            You can't check this ticket in, as you're not event staff for the
            event.
          </p>
          <p>However, you can see the following ticket information:</p>
          <dl>
            {pcd.claim.partialTicket.ticketId && (
              <>
                <dt>Ticket ID</dt>
                <dd>{pcd.claim.partialTicket.ticketId}</dd>
              </>
            )}
            {pcd.claim.partialTicket.eventId && (
              <>
                <dt>Event ID</dt>
                <dd>{pcd.claim.partialTicket.eventId}</dd>
              </>
            )}
            {pcd.claim.partialTicket.productId && (
              <>
                <dt>Product ID</dt>
                <dd>{pcd.claim.partialTicket.productId}</dd>
              </>
            )}
            {verifyResult.publicKeyName && (
              <>
                <dt>Signed by</dt>
                <dd>{verifyResult.publicKeyName}</dd>
              </>
            )}
          </dl>
          <p>
            The following information is <strong>NOT</strong> revealed:
          </p>
          <dl>
            <dt>Ticket-holder email</dt>
            <dd>
              <strong>HIDDEN</strong>
            </dd>
            <dt>Ticket-holder name</dt>
            <dd>
              <strong>HIDDEN</strong>
            </dd>
          </dl>
        </ZKNoticeContainer>
      </AppContainer>
    );
  }

  return (
    <AppContainer bg={"gray"}>
      <Spacer h={48} />

      <TextCenter>
        <img draggable="false" width="90" height="90" src={icons.verifyValid} />
        <Spacer h={24} />
        {verifyResult.outcome === VerifyOutcome.KnownTicketType && (
          <>
            <H4 col="var(--accent-dark)">PROOF VERIFIED.</H4>
          </>
        )}
      </TextCenter>
      <Spacer h={48} />
      <Placeholder minH={160}>
        {verifyResult.outcome === VerifyOutcome.NotVerified && (
          <TextCenter>{verifyResult.message}</TextCenter>
        )}
        {verifyResult.outcome === VerifyOutcome.KnownTicketType && (
          <VerifiedAndKnownTicket
            publicKeyName={verifyResult.publicKeyName}
            ticketName={verifyResult.ticketName}
            eventName={verifyResult.eventName}
          />
        )}
      </Placeholder>
      <Spacer h={64} />
      <CenterColumn w={280}>
        <LinkButton to="/scan">Verify another</LinkButton>
        <Spacer h={8} />
        <LinkButton to="/">Back to Zupass</LinkButton>
        <Spacer h={24} />
      </CenterColumn>
    </AppContainer>
  );
}

function WaitingForCheckAndVerify(): JSX.Element {
  return (
    <AppContainer bg={"gray"}>
      <Spacer h={48} />

      <TextCenter>
        <img
          draggable="false"
          width="90"
          height="90"
          src={icons.verifyInProgress}
        />
        <Spacer h={24} />
        <H4>VERIFYING PROOF...</H4>
      </TextCenter>
    </AppContainer>
  );
}

/**
 * If the ticket is verified and is a known Zuzalu '23 or Zuconnect '23
 * ticket, display a ticket-specific message to the user.
 */
function VerifiedAndKnownTicket({
  publicKeyName,
  ticketName,
  eventName
}: {
  publicKeyName: string;
  ticketName: string | undefined;
  eventName: string;
}): JSX.Element {
  return (
    <CardContainerExpanded>
      <CardOutlineExpanded>
        <CardHeader col="var(--accent-lite)">
          <VerifyLine>Verified {eventName} Ticket</VerifyLine>
          <VerifyLine>
            {ticketName?.split("\n").map((line) => {
              return <NameLine key={line}>{line}</NameLine>;
            })}
          </VerifyLine>
          <VerifyLine>SIGNED BY: {publicKeyName}</VerifyLine>
        </CardHeader>
      </CardOutlineExpanded>
    </CardContainerExpanded>
  );
}

function useDecodedPayload(encodedQRPayload: string): {
  pcd: PCD;
  serializedPCD: SerializedPCD<PCD>;
} {
  const [pcd, setPcd] = useState<PCD>(null);
  const [serializedPCD, setSerializedPCD] = useState<SerializedPCD>(null);
  const pcds = usePCDCollection();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (encodedQRPayload) {
          // decodedPCD is a JSON.stringify'd {@link SerializedPCD}
          const decodedPayload = decodeQRPayload(encodedQRPayload);
          const serializedPCD: SerializedPCD = JSON.parse(decodedPayload);
          const pcd = await pcds.deserialize(serializedPCD);
          setPcd(pcd);
          setSerializedPCD(serializedPCD);
        }
      } catch (e) {
        console.log("Could not deserialize PCD:", e);
      }
    })();
  }, [encodedQRPayload, pcds]);

  return { pcd, serializedPCD };
}

const Container = styled.div`
  margin-top: 64px;
  color: var(--bg-dark-primary);
  width: 400px;
  padding: 0px 32px;
`;

const ZKNoticeContainer = styled.div`
  padding: 16px;
  min-width: 400px;
  margin-top: 16px;
  margin-bottom: 16px;
  border-radius: 12px;
  border: 2px solid var(--accent-dark);
  color: var(--accent-dark);

  h2 {
    font-family: monospace;
    font-weight: bold;
    text-transform: uppercase;
    margin: 16px 0px;
    text-align: center;
  }

  p {
    margin: 8px 0px;

    em {
      display: inline-block;
      border-radius: 4px;
      background-color: var(--bg-dark);
      color: var(--white);
      font-weight: bold;
      font-style: normal;
    }
  }

  dt {
    display: inline-block;
    width: 30%;
    vertical-align: top;
    margin-bottom: 8px;
  }

  dd {
    display: inline-block;
    width: 70%;
    color: var(--accent-lite);
    margin-bottom: 8px;
  }
`;

const ZKCheckinNotice = styled.div`
  margin-bottom: 16px;
  color: var(--accent-dark);
`;

const VerifyLine = styled.div`
  text-transform: capitalize;
  margin: 12px 0px;
`;

const NameLine = styled.p`
  margin: 2px 0px;
`;

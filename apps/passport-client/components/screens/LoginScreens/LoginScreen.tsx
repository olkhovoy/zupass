import { requestLogToServer } from "@pcd/passport-interface";
import { validateEmail } from "@pcd/util";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState
} from "react";
import { appConfig } from "../../../src/appConfig";
import { useDispatch, useQuery, useSelf } from "../../../src/appHooks";
import {
  pendingRequestKeys,
  setPendingAddRequest,
  setPendingAddSubscriptionRequest,
  setPendingGenericIssuanceCheckinRequest,
  setPendingGetWithoutProvingRequest,
  setPendingProofRequest,
  setPendingViewFrogCryptoRequest,
  setPendingViewSubscriptionsRequest
} from "../../../src/sessionStorage";
import { ConnectKitButton } from "connectkit";
import {
  BigInput,
  Button,
  CenterColumn,
  H1,
  H2,
  Spacer,
  TextCenter
} from "../../core";
import { AppContainer } from "../../shared/AppContainer";
import { InlineError } from "../../shared/InlineError";

export function LoginScreen(): JSX.Element {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const query = useQuery();
  const redirectedFromAction = query?.get("redirectedFromAction") === "true";

  const pendingGetWithoutProvingRequest = query?.get(
    pendingRequestKeys.getWithoutProving
  );
  const pendingAddRequest = query?.get(pendingRequestKeys.add);
  const pendingProveRequest = query?.get(pendingRequestKeys.proof);
  const pendingViewSubscriptionsRequest = query?.get(
    pendingRequestKeys.viewSubscriptions
  );
  const pendingAddSubscriptionRequest = query?.get(
    pendingRequestKeys.addSubscription
  );
  const pendingViewFrogCryptoRequest = query?.get(
    pendingRequestKeys.viewFrogCrypto
  );
  const pendingGenericIssuanceCheckinRequest = query?.get(
    pendingRequestKeys.genericIssuanceCheckin
  );
  useEffect(() => {
    let pendingRequestForLogging: string | undefined = undefined;

    if (pendingGetWithoutProvingRequest) {
      setPendingGetWithoutProvingRequest(pendingGetWithoutProvingRequest);
      pendingRequestForLogging = pendingRequestKeys.getWithoutProving;
    } else if (pendingAddRequest) {
      setPendingAddRequest(pendingAddRequest);
      pendingRequestForLogging = pendingRequestKeys.add;
    } else if (pendingProveRequest) {
      setPendingProofRequest(pendingProveRequest);
      pendingRequestForLogging = pendingRequestKeys.proof;
    } else if (pendingViewSubscriptionsRequest) {
      setPendingViewSubscriptionsRequest(pendingViewSubscriptionsRequest);
      pendingRequestForLogging = pendingRequestKeys.viewSubscriptions;
    } else if (pendingAddSubscriptionRequest) {
      setPendingAddSubscriptionRequest(pendingAddSubscriptionRequest);
      pendingRequestForLogging = pendingRequestKeys.addSubscription;
    } else if (pendingViewFrogCryptoRequest) {
      setPendingViewFrogCryptoRequest(pendingViewFrogCryptoRequest);
      pendingRequestForLogging = pendingRequestKeys.viewFrogCrypto;
    } else if (pendingGenericIssuanceCheckinRequest) {
      setPendingGenericIssuanceCheckinRequest(
        pendingGenericIssuanceCheckinRequest
      );
      pendingRequestForLogging = pendingRequestKeys.genericIssuanceCheckin;
    }

    if (pendingRequestForLogging) {
      requestLogToServer(appConfig.zupassServer, "login-with-pending", {
        pending: pendingRequestForLogging
      });
    }
  }, [
    pendingGetWithoutProvingRequest,
    pendingAddRequest,
    pendingProveRequest,
    pendingViewSubscriptionsRequest,
    pendingAddSubscriptionRequest,
    pendingViewFrogCryptoRequest,
    pendingGenericIssuanceCheckinRequest
  ]);

  const suggestedEmail = query?.get("email");

  const self = useSelf();
  const [email, setEmail] = useState(suggestedEmail ?? "");

  const onGenPass = useCallback(
    function (e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const trimmedEmail = email.trim();

      if (trimmedEmail === "" || validateEmail(trimmedEmail) === false) {
        setError("Enter a valid email address");
      } else {
        dispatch({
          type: "new-passport",
          email: trimmedEmail.toLocaleLowerCase("en-US")
        });
      }
    },
    [dispatch, email]
  );

  useEffect(() => {
    // Redirect to home if already logged in
    if (self) {
      window.location.hash = "#/";
    }
  }, [self]);

  return (
    <AppContainer bg="primary">
      <Spacer h={64} />
      {redirectedFromAction ? (
        <>
          <TextCenter>
            <H2>ZUPASS</H2>
            <Spacer h={24} />
            To complete this request, you need to either log into your existing
            Zupass account, or create a new one.
          </TextCenter>
        </>
      ) : (
        <>
          <TextCenter>
            <H1>Web3 Id</H1>
            <Spacer h={24} />
            This is an experimental personal credentials manager, powered by
            Zero-Knowledge.
          </TextCenter>
        </>
      )}

      <Spacer h={24} />

      <CenterColumn>
        <form onSubmit={onGenPass}>
          <BigInput
            autoCapitalize="off"
            autoCorrect="off"
            type="text"
            autoFocus
            placeholder="email address"
            value={email}
            onChange={useCallback(
              (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
              [setEmail]
            )}
          />
          <InlineError error={error} />
          <Spacer h={8} />
          <Button style="primary" type="submit">
            Continue
          </Button>
        </form>
        <Spacer h={48} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <TextCenter>OR login with web3</TextCenter>
          <Spacer h={16} />
          <ConnectKitButton />
        </div>
      </CenterColumn>
      <Spacer h={64} />
    </AppContainer>
  );
}

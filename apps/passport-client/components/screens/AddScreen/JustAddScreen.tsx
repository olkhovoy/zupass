import { PCDAddRequest } from "@pcd/passport-interface";
import { getErrorMessage } from "@pcd/util";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { useDispatch, useIsSyncSettled } from "../../../src/appHooks";
import { useDeserialized } from "../../../src/useDeserialized";
import { err } from "../../../src/util";
import { Button, H2, Spacer } from "../../core";
import { MaybeModal } from "../../modals/Modal";
import { AddedPCD } from "../../shared/AddedPCD";
import { AppContainer } from "../../shared/AppContainer";
import { AppHeader } from "../../shared/AppHeader";
import { PCDCard } from "../../shared/PCDCard";
import { SyncingPCDs } from "../../shared/SyncingPCDs";

/**
 * Screen that allows the user to respond to a `PCDAddRequest` and add
 * a PCD into their wallet without proving it.
 */

const Footer = styled.div`
    margin-left: 8px; // почему-то объект смещён на 8px влево
    
    max-width: 372px;
    width: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    background-color: white;
    color: black;
    bottom: 0;
    box-shadow: rgba(17,17,26,0.1) 0px -10px 10px
`;

export function JustAddScreen({
                                request
                              }: {
  request: PCDAddRequest;
}): JSX.Element {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const { error, pcd } = useDeserialized(request.pcd);
  const syncSettled = useIsSyncSettled();

  const onAddClick = useCallback(async () => {
    try {
      await dispatch({
        type: "add-pcds",
        pcds: [request.pcd],
        folder: request.folder
      });
      setAdded(true);
    } catch (e) {
      await err(dispatch, "Error Adding PCD", getErrorMessage(e));
    }
  }, [dispatch, request.folder, request.pcd]);

  let content;

  if (!syncSettled) {
    return <SyncingPCDs />;
  } else if (!added) {
    content = (
      <>
        <H2>{"ADD PCD".toUpperCase()}</H2>
        {pcd && <PCDCard pcd={pcd} expanded={true} hideRemoveButton={true} />}
        <Spacer h={64} />
        <Footer>
          {request.folder && (
            <div>
              PCD will be added to folder:
              <br /> <strong>{request.folder}</strong>
            </div>
          )}
          {error && JSON.stringify(error)}
          <Spacer h={8} />
          <Button onClick={onAddClick}>Add</Button>
        </Footer>

      </>
    );
  } else {
    content = <AddedPCD onCloseClick={(): void => window.close()} />;
  }

  return (
    <>
      <MaybeModal fullScreen isProveOrAddScreen={true} />
      <AppContainer bg="gray">
        <Container>
          {/*<AppHeader isProveOrAddScreen={true} />*/}
          {/*<Spacer h={16} />*/}
          {content}
        </Container>
      </AppContainer>
    </>
  );
}

const Container = styled.div`
    //padding: 16px;
    width: 100%;
    height: 100%;
    max-width: 100%;
`;

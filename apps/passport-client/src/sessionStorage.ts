export function clearAllPendingRequests(): void {
  clearPendingHaloRequest();
  clearPendingGetWithoutProvingRequest();
  clearPendingAddRequest();
  clearPendingProofRequest();
  clearPendingViewSubscriptionsRequest();
  clearPendingAddSubscriptionRequest();
  clearPendingGenericIssuanceCheckinRequest();
}

export function hasPendingRequest(): boolean {
  return !!(
    getPendingGetWithoutProvingRequest() ||
    getPendingAddRequest() ||
    getPendingHaloRequest() ||
    getPendingProofRequest() ||
    getPendingViewSubscriptionsPageRequest() ||
    getPendingAddSubscriptionPageRequest() ||
    getPendingViewFrogCryptoPageRequest() ||
    getPendingGenericIssuanceCheckinRequest()
  );
}

export const pendingRequestKeys = {
  getWithoutProving: "getWithoutProvingRequest",
  add: "pendingAddRequest",
  halo: "pendingHaloRequest",
  proof: "pendingProofRequest",
  viewSubscriptions: "pendingViewSubscriptions",
  addSubscription: "pendingAddSubscription",
  viewFrogCrypto: "pendingViewFrogCrypto",
  genericIssuanceCheckin: "pendingGenericIssuanceCheckin"
} as const;

export function setPendingGetWithoutProvingRequest(request: string): void {
  sessionStorage.setItem(pendingRequestKeys.getWithoutProving, request);
  sessionStorage.setItem(pendingRequestKeys.getWithoutProving, request);
}

export function clearPendingGetWithoutProvingRequest(): void {
  sessionStorage.removeItem(pendingRequestKeys.getWithoutProving);
  sessionStorage.removeItem(pendingRequestKeys.getWithoutProving);
}

export function getPendingGetWithoutProvingRequest(): string | undefined {
  const value = sessionStorage.getItem(pendingRequestKeys.getWithoutProving);
  const value = sessionStorage.getItem(pendingRequestKeys.getWithoutProving);
  return value ?? undefined;
}

export function setPendingAddRequest(request: string): void {
  sessionStorage.setItem(pendingRequestKeys.add, request);
  sessionStorage.setItem(pendingRequestKeys.add, request);
}

export function clearPendingAddRequest(): void {
  sessionStorage.removeItem(pendingRequestKeys.add);
  sessionStorage.removeItem(pendingRequestKeys.add);
}

export function getPendingAddRequest(): string | undefined {
  const value = sessionStorage.getItem(pendingRequestKeys.add);
  const value = sessionStorage.getItem(pendingRequestKeys.add);
  return value ?? undefined;
}

export function setPendingHaloRequest(request: string): void {
  sessionStorage.setItem(pendingRequestKeys.halo, request);
  sessionStorage.setItem(pendingRequestKeys.halo, request);
}

export function clearPendingHaloRequest(): void {
  sessionStorage.removeItem(pendingRequestKeys.halo);
  sessionStorage.removeItem(pendingRequestKeys.halo);
}

export function getPendingHaloRequest(): string | undefined {
  const value = sessionStorage.getItem(pendingRequestKeys.halo);
  const value = sessionStorage.getItem(pendingRequestKeys.halo);
  return value ?? undefined;
}

export function setPendingProofRequest(request: string): void {
  sessionStorage.setItem(pendingRequestKeys.proof, request);
  sessionStorage.setItem(pendingRequestKeys.proof, request);
}

export function clearPendingProofRequest(): void {
  sessionStorage.removeItem(pendingRequestKeys.proof);
  sessionStorage.removeItem(pendingRequestKeys.proof);
}

export function getPendingProofRequest(): string | undefined {
  const value = sessionStorage.getItem(pendingRequestKeys.proof);
  const value = sessionStorage.getItem(pendingRequestKeys.proof);
  return value ?? undefined;
}

export function setPendingViewSubscriptionsRequest(request: string): void {
  sessionStorage.setItem(pendingRequestKeys.viewSubscriptions, request);
  sessionStorage.setItem(pendingRequestKeys.viewSubscriptions, request);
}

export function clearPendingViewSubscriptionsRequest(): void {
  sessionStorage.removeItem(pendingRequestKeys.viewSubscriptions);
  sessionStorage.removeItem(pendingRequestKeys.viewSubscriptions);
}

export function getPendingViewSubscriptionsPageRequest(): string | undefined {
  const value = sessionStorage.getItem(pendingRequestKeys.viewSubscriptions);
  const value = sessionStorage.getItem(pendingRequestKeys.viewSubscriptions);
  return value ?? undefined;
}

export function setPendingAddSubscriptionRequest(request: string): void {
  sessionStorage.setItem(pendingRequestKeys.addSubscription, request);
  sessionStorage.setItem(pendingRequestKeys.addSubscription, request);
}

export function clearPendingAddSubscriptionRequest(): void {
  sessionStorage.removeItem(pendingRequestKeys.addSubscription);
  sessionStorage.removeItem(pendingRequestKeys.addSubscription);
}

export function getPendingAddSubscriptionPageRequest(): string | undefined {
  const value = sessionStorage.getItem(pendingRequestKeys.addSubscription);
  const value = sessionStorage.getItem(pendingRequestKeys.addSubscription);
  return value ?? undefined;
}

export function setPendingViewFrogCryptoRequest(request: string): void {
  sessionStorage.setItem(pendingRequestKeys.viewFrogCrypto, request);
  sessionStorage.setItem(pendingRequestKeys.viewFrogCrypto, request);
}

export function clearPendingViewFrogCryptoRequest(): void {
  sessionStorage.removeItem(pendingRequestKeys.viewFrogCrypto);
  sessionStorage.removeItem(pendingRequestKeys.viewFrogCrypto);
}

export function getPendingViewFrogCryptoPageRequest(): string | undefined {
  const value = sessionStorage.getItem(pendingRequestKeys.viewFrogCrypto);
  const value = sessionStorage.getItem(pendingRequestKeys.viewFrogCrypto);
  return value ?? undefined;
}

export function setPendingGenericIssuanceCheckinRequest(request: string): void {
  sessionStorage.setItem(pendingRequestKeys.genericIssuanceCheckin, request);
  sessionStorage.setItem(pendingRequestKeys.genericIssuanceCheckin, request);
}

export function clearPendingGenericIssuanceCheckinRequest(): void {
  sessionStorage.removeItem(pendingRequestKeys.genericIssuanceCheckin);
  sessionStorage.removeItem(pendingRequestKeys.genericIssuanceCheckin);
}

export function getPendingGenericIssuanceCheckinRequest(): string | undefined {
  const value = sessionStorage.getItem(
    pendingRequestKeys.genericIssuanceCheckin
  );
  const value = sessionStorage.getItem(
    pendingRequestKeys.genericIssuanceCheckin
  );
  return value ?? undefined;
}

/**
 * Gets any pending request, if any. Returns undefined if none.
 */
export function getPendingRequest():
  | { key: keyof typeof pendingRequestKeys; value: string }
  | undefined {
  for (const key in pendingRequestKeys) {
    const item = sessionStorage.getItem(key);
    if (item) {
      return {
        key: key as keyof typeof pendingRequestKeys,
        value: item
      };
    }
  }

  return undefined;
}

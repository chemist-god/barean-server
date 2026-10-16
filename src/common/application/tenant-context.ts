/** Obtained from a verified session and active organization membership; never from body. */
export interface TenantContext {
  readonly organizationId: string;
  readonly actorUserId: string;
}

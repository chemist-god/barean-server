export type ParticipationStatus = 'ACTIVE' | 'INACTIVE';
export interface ParticipationProps {
  id: string;
  organizationId: string;
  unitId: string;
  personId: string;
  status: ParticipationStatus;
}
export class Participation {
  constructor(public readonly props: Readonly<ParticipationProps>) {}
  canReceiveAssignment(): boolean {
    return this.props.status === 'ACTIVE';
  }
}

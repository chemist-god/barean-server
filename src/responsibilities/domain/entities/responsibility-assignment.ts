import { Participation } from '../../../participation/domain/entities/participation';
export type ResponsibilityKind = 'POSITION' | 'FUNCTION';
export interface ResponsibilityDefinitionRef {
  id: string;
  organizationId: string;
  unitId: string;
  kind: ResponsibilityKind;
}
export class ResponsibilityAssignment {
  static assertAssignable(
    participation: Participation,
    definition: ResponsibilityDefinitionRef,
  ): void {
    if (participation.props.organizationId !== definition.organizationId)
      throw new Error('CROSS_TENANT_ASSIGNMENT');
    if (participation.props.unitId !== definition.unitId)
      throw new Error('CROSS_UNIT_ASSIGNMENT');
    if (!participation.canReceiveAssignment())
      throw new Error('INACTIVE_PARTICIPATION');
  }
}

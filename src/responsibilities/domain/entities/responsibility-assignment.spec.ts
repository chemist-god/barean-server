import { describe, expect, it } from 'vitest';
import { Participation } from '../../../participation/domain/entities/participation';
import { ResponsibilityAssignment } from './responsibility-assignment';
const participation = new Participation({
  id: 'p',
  organizationId: 'org-a',
  unitId: 'media',
  personId: 'person',
  status: 'ACTIVE',
});
describe('assignment invariants', () => {
  it('accepts matching active participation', () =>
    expect(() =>
      ResponsibilityAssignment.assertAssignable(participation, {
        id: 'd',
        organizationId: 'org-a',
        unitId: 'media',
        kind: 'FUNCTION',
      }),
    ).not.toThrow());
  it('rejects cross tenant', () =>
    expect(() =>
      ResponsibilityAssignment.assertAssignable(participation, {
        id: 'd',
        organizationId: 'org-b',
        unitId: 'media',
        kind: 'POSITION',
      }),
    ).toThrow('CROSS_TENANT_ASSIGNMENT'));
  it('rejects cross unit', () =>
    expect(() =>
      ResponsibilityAssignment.assertAssignable(participation, {
        id: 'd',
        organizationId: 'org-a',
        unitId: 'music',
        kind: 'FUNCTION',
      }),
    ).toThrow('CROSS_UNIT_ASSIGNMENT'));
});

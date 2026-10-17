import { Person } from '../../domain/entities/person';
export interface PersonRepositoryPort {
  save(person: Person): Promise<void>;
  findById(organizationId: string, personId: string): Promise<Person | null>;
}
export const PERSON_REPOSITORY = Symbol('PERSON_REPOSITORY');

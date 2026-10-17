export interface PersonProps {
  id: string;
  organizationId: string;
  fullName: string;
  phone?: string | null;
}
export class Person {
  private constructor(public readonly props: Readonly<PersonProps>) {}
  static register(input: PersonProps): Person {
    const fullName = input.fullName.trim();
    if (!fullName || fullName.length > 200)
      throw new Error('PERSON_NAME_INVALID');
    if (!input.organizationId || !input.id)
      throw new Error('PERSON_IDENTITY_INVALID');
    return new Person({ ...input, fullName });
  }
}

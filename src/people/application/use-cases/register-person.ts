import { randomUUID } from 'node:crypto';
import { TenantContext } from '../../../common/application/tenant-context';
import { Person } from '../../domain/entities/person';
import { PersonRepositoryPort } from '../ports/person-repository.port';
export class RegisterPerson {
  constructor(private readonly people: PersonRepositoryPort) {}
  async execute(
    ctx: TenantContext,
    command: { fullName: string; phone?: string },
  ): Promise<{ personId: string }> {
    const person = Person.register({
      id: randomUUID(),
      organizationId: ctx.organizationId,
      fullName: command.fullName,
      phone: command.phone,
    });
    await this.people.save(person);
    return { personId: person.props.id };
  }
}

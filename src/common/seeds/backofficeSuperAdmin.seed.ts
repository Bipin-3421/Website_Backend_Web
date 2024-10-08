import { ConfigService } from '@nestjs/config';
import { Member } from 'common/entities/member.entity';
import { TransactionalConnection } from 'module/connection/connection.service';
import { AppConfig } from 'config/configuration';
import { MemberRole } from 'common/enum/memberRole.enum';

export async function seedSuperAdmin(
  connection: TransactionalConnection,
  configService: ConfigService<AppConfig, true>,
): Promise<void> {
  const memberRepository = connection.getRepository(Member);

  const { email, phoneNumber } = configService.get('member', {
    infer: true,
  });

  const superAdmin = await memberRepository.findOne({
    where: {
      role: MemberRole.SUPERADMIN,
      email: email,
      phoneNumber: phoneNumber,
    },
  });

  if (!superAdmin) {
    const member = memberRepository.create({
      name: 'Super Admin',
      email: email,
      phoneNumber: phoneNumber,
      designation: 'SUPERADMIN',
      role: MemberRole.SUPERADMIN,
    });

    await memberRepository.save(member);
  }
}

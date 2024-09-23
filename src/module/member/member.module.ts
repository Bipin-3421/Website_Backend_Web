import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { AssetModule } from 'asset/asset.module';

@Module({
  imports: [AssetModule],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}

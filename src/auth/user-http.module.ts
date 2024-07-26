import { Module } from '@nestjs/common';
import { UserModule } from '../module/auth/user.module';
import { UserController } from '../module/auth/user.controller';
import { UserService } from '../module/auth/user.service';

@Module({
  imports: [UserModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UsersHttpModule {}

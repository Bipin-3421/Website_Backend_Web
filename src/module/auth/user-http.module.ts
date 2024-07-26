import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UsersHttpModule {}

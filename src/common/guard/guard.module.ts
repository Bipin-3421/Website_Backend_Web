import { Module } from '@nestjs/common';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtServiceImpl } from './jwt.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JwtServiceImpl],
  exports: [JwtServiceImpl],
  controllers: [],
})
export class AuthGuardModule {}

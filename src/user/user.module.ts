import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Career } from '../career/entities/career.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Career])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

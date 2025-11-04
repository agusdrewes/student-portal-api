import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmAsyncConfig = {
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
    username: config.get<string>('DB_USER'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),

    autoLoadEntities: true,
    synchronize: config.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
    logging: config.get<string>('TYPEORM_LOGGING') === 'true',
  }),
};

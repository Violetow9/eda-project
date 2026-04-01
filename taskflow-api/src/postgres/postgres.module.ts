import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => ({
                type: 'postgres',
                host: cfg.getOrThrow<string>('POSTGRES_HOST'),
                port: cfg.getOrThrow<number>('POSTGRES_PORT'),
                username: cfg.getOrThrow<string>('POSTGRES_USER'),
                password: cfg.getOrThrow<string>('POSTGRES_PASSWORD'),
                database: cfg.getOrThrow<string>('POSTGRES_DB'),
                synchronize: cfg.getOrThrow<boolean>('POSTGRES_SYNCHRONIZE'),
                autoLoadEntities: true,
                logging: cfg.getOrThrow<boolean>('POSTGRES_LOGGING'),
                charset: 'utf8mb4',
            }),
        }),
    ],
})
export class PostgresModule {
}
import { Module, NestModule, OnModuleInit, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScaleModule } from "@/scale/scale.module";
import { MikroOrmModule, MikroOrmMiddleware } from "@mikro-orm/nestjs";
import config from "@/mikro-orm.config";
import { MikroORM } from "@mikro-orm/core";
import { BullModule } from "@nestjs/bull";
import { ConfigService } from "@nestjs/config";

const EnvFilePath: string = `${process.cwd()}/.env`;

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,  // Set to global
            envFilePath: [EnvFilePath]
        }),
        BullModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get<string>("REDIS_HOST"),
                    port: parseInt(configService.get<string>("REDIS_PORT")),
                    password: configService.get<string>("REDIS_PASSWORD"),
                }
            }),
            inject: [ConfigService]
        }),
        BullModule.registerQueue({
            name: "scale-queue",
        }),
        MikroOrmModule.forRoot(config),
        ScaleModule
    ],
})

export class AppModule implements NestModule, OnModuleInit {

    constructor(private readonly orm: MikroORM) {}
  
    async onModuleInit(): Promise<void> {
        await this.orm.getMigrator().up();
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(MikroOrmMiddleware)
            .forRoutes("*");
    }
}

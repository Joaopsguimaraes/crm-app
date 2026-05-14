import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["apps/api/.env", ".env"],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRES_HOST", "localhost"),
        port: Number(configService.get<string>("POSTGRES_PORT", "5432")),
        username: configService.get<string>("POSTGRES_USER", "crm"),
        password: configService.get<string>("POSTGRES_PASSWORD", "crm"),
        database: configService.get<string>("POSTGRES_DB", "crm"),
        autoLoadEntities: true,
        synchronize: false,
        ssl:
          configService.get<string>("DATABASE_SSL", "false") === "true"
            ? { rejectUnauthorized: false }
            : false
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

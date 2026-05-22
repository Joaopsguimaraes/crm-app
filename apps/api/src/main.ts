import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureSwagger } from "./swagger";
import { configureValidation } from "./validation";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3001);

  configureValidation(app);
  configureSwagger(app);

  await app.listen(port);
}

void bootstrap();

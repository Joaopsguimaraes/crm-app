import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function configureSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("CRM API")
    .setDescription("CRM backend API documentation")
    .setVersion("0.1.0")
    .addTag("customers")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
}

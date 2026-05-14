import { Controller, Get } from "@nestjs/common";
import type { CrmHealthResponse } from "@crm/shared";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): CrmHealthResponse {
    return this.appService.getHealth();
  }
}

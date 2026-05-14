import { Injectable } from "@nestjs/common";
import type { CrmHealthResponse } from "@crm/shared";

@Injectable()
export class AppService {
  getHealth(): CrmHealthResponse {
    return {
      app: "crm-app",
      status: "ok",
      timestamp: new Date().toISOString()
    };
  }
}

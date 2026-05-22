import type { CrmHealthResponse } from "@crm/shared";
import { fn } from "jest-mock";
import { AppController } from "./app.controller";

describe("AppController", () => {
  it("returns health from the app service", () => {
    const health: CrmHealthResponse = {
      app: "crm-app",
      status: "ok",
      timestamp: new Date("2026-05-15T00:00:00.000Z").toISOString()
    };
    const getHealth = fn<() => CrmHealthResponse>().mockReturnValue(health);
    const controller = new AppController({ getHealth });

    expect(controller.getHealth()).toEqual(health);
    expect(getHealth).toHaveBeenCalledTimes(1);
  });
});

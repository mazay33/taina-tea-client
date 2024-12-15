class AbortControllerManager {
  private controllers: AbortController[] = [];

  public createController(): AbortController {
    const controller = new AbortController();
    this.controllers.push(controller);
    return controller;
  }

  public abortAll(): void {
    this.controllers.forEach(controller => controller.abort());
    this.controllers = [];
  }
}

export const abortControllerManager = new AbortControllerManager();

"use strict";

class WizardJSKeyboardManager extends DefaultKeyboardManager {
  constructor() {
    super();
    this.directionMap = [4]; //right, top, left, down
    this.directionMap.fill(0);
  }
  /**
   * 
   * @param {Event} e 
   * @param {InputV2Controller} controller 
   */
  onKeyDown(e, controller) {
    switch (e.code) {
      case 'KeyA':
        this.directionMap[2] = 3;
        this.updateWASD(controller);
      break;
      case 'KeyD':
        this.directionMap[0] = 3;
        this.updateWASD(controller);
      break;
      case 'KeyW':
        this.directionMap[1] = 3;
        this.updateWASD(controller);
      break;
      case 'KeyS':
        this.directionMap[3] = 3;
        this.updateWASD(controller);
      break;
      case 'KeyX':
        controller.buttonRB = 3;
      break;
      case 'KeyZ':
      controller.buttonLB = 3;
      break;
      case 'Escape':
        controller.buttonStart = 3;
        controller.analogStart = 1;
      break;
      case 'Space':
        controller.buttonRT = 3;
      break;
      case 'ShiftLeft':
        controller.buttonLS = 3;
      break;
    }
    super.onKeyDown(e, controller);
  }
  /**
   * 
   * @param {Event} e 
   * @param {InputV2Controller} controller 
   */
  onKeyUp(e, controller) {
    switch (e.code) {
      case 'KeyA':
        this.directionMap[2] = 1;
        this.updateWASD(controller);
      break;
      case 'KeyD':
        this.directionMap[0] = 1;
        this.updateWASD(controller);
      break;
      case 'KeyW':
        this.directionMap[1] = 1;
        this.updateWASD(controller);
      break;
      case 'KeyS':
        this.directionMap[3] = 1;
        this.updateWASD(controller);
      break;
      case 'KeyX':
        controller.buttonRB = 1;
      break;
      case 'KeyZ':
      controller.buttonLB = 1;
      break;
      case 'Escape':
        controller.buttonStart = 1;
        controller.analogStart = 0;
      break;
      case 'Space':
        controller.buttonRT = 1;
      break;
      case 'ShiftLeft':
        controller.buttonLS = 1;
      break;
    }
    super.onKeyUp(e, controller);
  }

  /** Makes it so that keyboard controls aren't complete junk
   * @param {InputV2Controller} controller
   */
  updateWASD(controller) {
    controller.axisLeft.set(0,0);
    if (this.directionMap[0]>1) {
      controller.axisLeft.x += 1;
    }
    if (this.directionMap[1]>1) {
      controller.axisLeft.y -= 1;
    }
    if (this.directionMap[2]>1) {
      controller.axisLeft.x -= 1;
    }
    if (this.directionMap[3]>1) {
      controller.axisLeft.y += 1;
    }
  }
  reset() {
    super.reset();
    for (let i=0;i<this.directionMap.length;++i) {
      this.directionMap[i]&=2;
    }
  }
}
class WizardJSMouseManager extends DefaultMouseManager {
  constructor() {
    super();
  }
  /**
   * @param {Event} e 
   * @param {InputV2Controller} controller 
   */
  onMouseMove(e, controller) {
    super.onMouseMove(e, controller);

    let v = new Vector2(
      this.camera.PtWX(this.mousePos.x * this.camera.canvasScaleX),
      this.camera.PtWY(this.mousePos.y * this.camera.canvasScaleY)
    );
    controller.axisRight.setVector(v.subtract(this.camera));
  }
  /**
   * @param {Event} e 
   * @param {InputV2Controller} controller 
   */
  onMouseDown(e, controller) {
    switch(e.button) {
      case 0: //left
        controller.buttonRB = 3;
        controller.buttonRT = 3;
      break;
      case 2: //right
      controller.buttonLB = 3;
      break;
    }
    super.onMouseDown(e, controller);
  }
  /**
   * @param {Event} e 
   * @param {InputV2Controller} controller 
   */
  onMouseUp(e, controller) {
    switch(e.button) {
      case 0: //left
        controller.buttonRB = 1;
        controller.buttonRT = 1;
      break;
      case 2: //right
      controller.buttonLB = 1;
      break;
    }
    super.onMouseUp(e, controller);
  }
}
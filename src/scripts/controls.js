"use strict";

class WizardJSKeyboardManager extends InputV2KeyboardManager {
  constructor() {
    super();
    this.keyMap = [223];//[223]; //keys pressed or held. 3 = pressed, 2 = held, 1 = released, 0 = none
    this.keyMap.fill(0);

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
    }
    if (e.keyCode) {
      this.keyMap[e.keyCode] = 3;
    }
    e.preventDefault(); //prevents spacebar from scrolling the screen and other weird things.
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
    }
    if (e.keyCode) {
      this.keyMap[e.keyCode] = 1;
    }
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

  key(keyCode) {
    return this.keyMap[keyCode];
  }
  reset() {
    for (let i=0;i<this.keyMap.length;++i) {
      this.keyMap[i]&=2;
    }
    for (let i=0;i<this.directionMap.length;++i) {
      this.directionMap[i]&=2;
    }
  }
}
class WizardJSMouseManager extends InputV2MouseManager {
  constructor() {
    super();

    this.camera = new Camera2d;

    this.mousePos = new Vector2();
    this.mouseDrag = new Vector2();
    this.mouseButtons = [5];
    this.mouseButtons.fill(0);
    this.mouseWheel = [3];
    this.mouseWheel.fill(0);
  }
  /**
   * @param {Event} e 
   * @param {InputV2Controller} controller 
   */
  onMouseMove(e, controller) {
    this.mouseDrag.x += this.mousePos.x - e.offsetX;
    this.mouseDrag.y += this.mousePos.y - e.offsetY;
    this.mousePos.x = e.offsetX;
    this.mousePos.y = e.offsetY;

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
    this.mouseButtons[e.button] = 3;
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
    this.mouseButtons[e.button] = 1;
  }
  /**
   * @param {Event} e 
   * @param {InputV2Controller} controller 
   */
  onMouseWheel(e, controller) {}

  getMousePos() {
    return this.mousePos;
  }
  getMouseDrag() {
    return this.mouseDrag;
  }
  getMouseButtons() {
    return this.mouseButtons;
  }
  getMouseWheel() {
    return this.mouseWheel;
  }
  reset() {
    for (let i=0;i<this.mouseButtons.length;++i) {
      this.mouseButtons[i]&=2;
    }
  };
}
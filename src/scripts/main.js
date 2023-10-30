"use strict"; //Wizard game setup file.

class WizardGameInstance extends GameInstance {
  constructor(canvas) {
    super();
    /**@type {HTMLCanvasElement} */
    this.canvas = canvas;
    /**@type {CanvasRenderingContext2D} */
    this.context2d = this.canvas.getContext("2d");
    /**@type {WizardGameLevel} */
    this.level = null;
    /**@type {Input} */
    this.input = new Input(canvas);

    this.paused = false;

    this.fps = 0;
    this.framesSinceLastSecond = 0;
    this.nextSecond;
    this.frameStart = 0;
  }
  startup() {
    //canvas.width = canvas.offsetWidth;
    //canvas.height = canvas.offsetHeight;
    this.canvas.width = 600;
    this.canvas.height = 400;
  
    this.level = new EndlessLevel(this);
    this.level.camera.setWidth(this.canvas.width);
    this.level.camera.setHeight(this.canvas.height);
  
    this.nextSecond = Date.now()+1000;
  };

  act() {
    if (this.level!=null) {
      if (this.input.key(27)===Input.PRESSED) {
        this.paused = !this.paused;
      }

      if (!this.paused) {
        this.level.act(); 
      }
      this.input.reset();
    } 
    this.framesSinceLastSecond++;
  }
  draw() {
    this.level.draw();
    this.drawFrameRate();
    if (this.paused) {
      this.drawPauseScreen();
    }
    if (Date.now()>=this.nextSecond) {
      this.fps = this.framesSinceLastSecond;
      this.framesSinceLastSecond = 0;
      this.nextSecond+=1000;
    }
  }
}

WizardGameInstance.prototype.drawPauseScreen = function () {
  this.context2d.fillStyle = "#00000040"
  this.context2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
  this.context2d.fillStyle = "#000000";
  this.context2d.textAlign = "center";
  this.context2d.font = "24px sans-serif"
  this.context2d.fillText("Paused",this.canvas.width/2,this.canvas.height/2+12);
};

WizardGameInstance.prototype.drawFrameRate = function () {
  this.context2d.fillStyle = "#000000";
  this.context2d.textAlign = "right";
  this.context2d.font = "8px sans-serif";
  this.context2d.fillText("Frame Rate: " + this.fps, this.canvas.width-2, this.canvas.height-2);
};

function onLoad(e) {
  let canvases = document.getElementsByClassName("game-canvas");
  for (let i=0;i<canvases.length;++i) {
    new WizardGameInstance(canvases.item(i)).start();
  }
  if (canvases.length>0) {
    canvases.item(0).focus();
  }
  window.removeEventListener("load", onLoad);
}

window.addEventListener("load", onLoad); 
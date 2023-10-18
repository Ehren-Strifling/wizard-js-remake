"use strict";

//Base class with basic collision. Not optimized enough for everything I want. Use the GridCollisionLevel subclass.
class WizardGameLevel {
  constructor(instance) {
    /**@type {WizardGameInstance} */
    this.instance = instance;

    /**@type {Camera2d} */
    this.camera = new Camera2d();

    /**@type {Wizard[]} */
    this.wizards = [];
    /**@type {Magic[]} */
    this.magic = [];
    
    
    /** level area. Magic outside this area is destroyed. Wizards outside this area are bounced back in.
     * @type {number}
    */
    this.radius = 1600;

    // /** @type {Player} */
    // this.player = new Player(this, 0, 0);
    /** @type {Wizard} */
    this.cameraTarget = null;
    // this.addWizard(this.player);
    //this.player.spell = MagicBreath; //testing
  }

  /**
   * Minimizes the damage done if I ever have to change the instance structure
   * @returns {Input}
   */
  getInput() {
    return this.instance.input;
  }
  /**
   * Minimizes the damage done if I ever have to change the instance structure
   * @returns {CanvasRenderingContext2D}
   */
  getContext() {
    return this.instance.context2d;
  }
  /**
   * Minimizes the damage done if I ever have to change the instance structure
   * @returns {HTMLCanvasElement}
   */
  getCanvas() {
    return this.instance.canvas;
  }

  /**
   * Adds a wizard to this level
   * @param {Wizard} wizard 
   */
  addWizard(wizard) {
    this.wizards.push(wizard);
    wizard.addToLevel(this);
  }
  addMagic(magic) {
    this.magic.push(magic);
    magic.addToLevel(this);
  }
  destroyWizard(i) {
    this.wizards[i].destroy(this);
    this.wizards.splice(i,1);
  }
  destroyMagic(i) {
    this.magic[i].destroy(this);
    this.magic.splice(i,1); //[0].GridCell; //????? Was this an error
  }
  /**
   * Main loop called every frame
   */
  act() {
    for (let i=0;i<this.wizards.length;++i) {
      this.actWizards(i);
    }
    for (let i=0;i<this.magic.length;++i) {
      this.actMagic(i);
    }
    this.collision();
    this.after();
  }
  actWizards(i) {
    this.wizards[i].act(this);
  }
  actMagic(i) {
    this.magic[i].act(this);
  }
  /**
   * Checks entity collisions
   */
  collision() {
    for (let i=0;i<this.wizards.length;++i) {
      this.wizards[i].collision(this);
    }
    //Most magic has no collision, some do however.
    for (let i=0;i<this.magic.length;++i) {
      this.magic[i].collision(this);
    }
  }
  /**
   * Called after entity collisions. Cleans up entities that need to be removed.
   */
  after() { //after the act loop. We delete objects in here so we go over objects in reverse order
    for (let i=this.wizards.length-1;i>=0;--i) {
      let returnval = this.wizards[i].after(this);
      switch (returnval) {
        case AFTER_CODE.PLAYER_DEFEAT:
        case AFTER_CODE.DESTROY:
          this.destroyWizard(i);
          break;
        default:
      }
    }
        
    for (let i=this.magic.length-1;i>=0;--i) {
      let returnval = this.magic[i].after(this);
      switch (returnval) {
        case AFTER_CODE.DESTROY:
          this.destroyMagic(i);
          break;
        default:
      }
    }
          
    if (this.player && !this.player.inWorld) {
      this.player = null;
    }
    if (this.cameraTarget && !this.cameraTarget.inWorld) {
      if (this.wizards.length>0) {
        this.cameraTarget = this.wizards[0];
      } else {
        this.cameraTarget = null;
      }
    }
  }

  /**
   * 
   * @param {Vector2} vector 
   * @param {number} radius 
   * @returns {Wizard[]}
   */
  getWizardsInRadius(vector,radius) {
    let wizards = [];
    for (let i=0;i<this.wizards.length;++i) {
      if (vector.sqDistance(this.wizards[i])<((this.wizards[i]+radius) * (this.wizards[i]+radius))) {
        wizards.push(this.wizards[i]);
      }
    }
    return wizards;
  }
  /**
   * 
   * @param {Vector2} vector 
   * @param {number} radius 
   * @returns {Magic[]}
   */
  getMagicInRadius(vector,radius) {
    let magic = [];
    for (let i=0;i<this.magic.length;++i) {
      if (vector.sqDistance(this.magic[i])<((this.magic[i].radius) * (this.magic[i].radius))) {
        magic.push(this.magic[i]);
      }
    }
    return magic;
  }

  //shortcut methods
  /** 
   * @param {Vector2} vector position to center the search around
   * @param {number} colour colour of wizard we want to avoid (friendly wizards)
   * @param {number} radius maximum distance to search, 0 means that every wizard will be searched.
   * @returns {Wizard} Can return null
   */
  getNearestEnemyWizard(vector, colour, radius = 0) {
    let wizards;
    if (radius) {
      wizards = this.getWizardsInRadius(vector, radius);
    } else {
      wizards = this.wizards;
    }
    return Wizard.nearestEnemyWizard(wizards, vector, colour);
  }
  /** 
   * @param {Vector2} vector position to center the search around
   * @param {number} colour colour of wizard we want to search for (friendly wizards)
   * @param {number} radius maximum distance to search, 0 means that every wizard will be searched.
   * @param {Wizard} self avoid this wizard when searching.
   * @returns {Wizard} Can return null
   */
  getNearestFriendlyWizard(vector, colour, radius = 0, self = null) {
    //if (!self) {self = vector;} //not needed yet
    let wizards;
    if (radius) {
      wizards = this.getWizardsInRadius(vector, radius);
    } else {
      wizards = this.wizards;
    }
    
    return Wizard.nearestFriendlyWizard(wizards, vector, colour, self);
  }
  /** 
   * @param {Vector2} vector position to center the search around
   * @param {number} radius maximum distance to search, 0 means that every wizard will be searched.
   * @param {Wizard} self avoid this wizard when searching.
   * @returns {Wizard} Can return null
   */
  getNearestWizard(vector, radius = 0, self = null) {
    let wizards;
    if (radius) {
      wizards = this.getWizardsInRadius(vector, radius);
    } else {
      wizards = this.wizards;
    }
    return Wizard.nearestWizard(wizards,vector,self);
  }

  /**
   * Renders the level
   */
  draw() {
    if (this.cameraTarget!=null) {
      this.camera.setVector(this.cameraTarget);
    }
    this.camera.clear(this.getContext());

    this.drawBackground();

    //draw magic before wizards
    this.drawMagic();
    this.drawWizards();
  }

  drawBackground() {
    let ctx = this.getContext();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    this.camera.circle(ctx, 0, 0, this.radius);
    ctx.stroke();
  }

  drawWizards() {
    let minX = this.camera.PtWX(0);
    let maxX = this.camera.PtWX(this.getCanvas().width);
    let minY = this.camera.PtWY(0);
    let maxY = this.camera.PtWY(this.getCanvas().height);
    for (let i=0;i<this.wizards.length;++i) {
      if (
        this.wizards[i].x+this.wizards[i].drawRadius > minX &&
        this.wizards[i].x-this.wizards[i].drawRadius < maxX &&
        this.wizards[i].y+this.wizards[i].drawRadius > minY &&
        this.wizards[i].y-this.wizards[i].drawRadius < maxY
      ) {
        this.wizards[i].draw(this);
      }
    }
    for (let i=0;i<this.wizards.length;++i) {
      if (
        this.wizards[i].x+this.wizards[i].drawRadius > minX &&
        this.wizards[i].x-this.wizards[i].drawRadius < maxX &&
        this.wizards[i].y+this.wizards[i].drawRadius > minY &&
        this.wizards[i].y-this.wizards[i].drawRadius < maxY
      ) {
        this.wizards[i].drawHealthbar(this);
      }
    }
  }
  drawMagic() {
    let minX = this.camera.PtWX(0);
    let maxX = this.camera.PtWX(this.getCanvas().width);
    let minY = this.camera.PtWY(0);
    let maxY = this.camera.PtWY(this.getCanvas().height);
    for (let i=0;i<this.magic.length;++i) {
      if (
        this.magic[i].x+this.magic[i].radius > minX &&
        this.magic[i].x-this.magic[i].radius < maxX &&
        this.magic[i].y+this.magic[i].radius > minY &&
        this.magic[i].y-this.magic[i].radius < maxY
      ) {
        this.magic[i].draw(this);
      }
    }
  }
}
"use strict";

//A major problem with the original wizard game as well as the unity remake was how collision was not very optimized.
//There were things that I couldn't do because of how laggy entity detection would be.
//Here, I'm going to use a grid-cell based collision approach which should lighten collision detection
//at the cost of a ton of RAM.

//After some testing, it saves an absolute ton of performance. The game can easily support over 20,000 entities now.
//I might need to create a grid collision class for my main library.

class GridCollisionLevel extends WizardGameLevel {
  
  constructor(instance) {
    super(instance);
    //Grid cell size = width / cell count. MAKE SURE THE CELLS ARE NOT TOO TINY.
    /**@type {Grid} */
    this.grid = new Grid(32,32,1600,1600);
  }

  /**
   * We actually create a new property in entities when we call this on. Which I'm ok with since it doesn't change how they function.
   * @param {Entity} entity
   */
  updateGridPos(entityName, entity) { //I would really love to have entities have no reference to the grid...
    let c = this.grid.getCell(entity.x,entity.y);
    if (entity.gridCell!=c) {
      if (entity.gridCell!=undefined) {
        this.grid.remove(entityName, entity, entity.gridCell);
      }
        this.grid.add(entityName, entity, c);
        entity.gridCell = c;
    }
  }

  addWizard(wizard) {
    this.updateGridPos("wizard", wizard);
    super.addWizard(wizard);
  }
  addMagic(magic) {
    this.updateGridPos("magic", magic);
    super.addMagic(magic);
  }
  destroyWizard(i) {
    if (this.wizards[i].gridCell!=undefined) {
      this.grid.remove("wizard", this.wizards[i], this.wizards[i].gridCell);
    }
    super.destroyWizard(i);
  }
  destroyMagic(i) {
    if (this.magic[i].gridCell!=undefined) {
      this.grid.remove("magic", this.magic[i], this.magic[i].gridCell);
    }
    super.destroyMagic(i);
  }
  
  actWizards(i) {
    super.actWizards(i);
    this.updateGridPos("wizard", this.wizards[i]);
  }
  actMagic(i) {
    super.actMagic(i);
    this.updateGridPos("magic", this.magic[i]);
  }

  /**
   * 
   * @param {Vector2} vector 
   * @param {number} radius 
   * @returns {Wizard[]}
   */
  getWizardsInRadius(vector,radius) {
    return this.grid.getEntitiesInRadius("wizard", vector, radius);
  }
  /**
   * 
   * @param {Vector2} vector 
   * @param {number} radius 
   * @returns {Magic[]}
   */
  getMagicInRadius(vector,radius) {
    return this.grid.getEntitiesInRadius("magic", vector, radius);
  }

  drawWizards() {
    this.grid.drawEntitiesIn(
      "wizard",
      this,
      this.camera.PtWX(0),
      this.camera.PtWY(0),
      this.camera.PtWX(this.getCanvas().width),
      this.camera.PtWY(this.getCanvas().height)
    );
    this.grid.drawEntitiesIn(
      "wizard",
      this,
      this.camera.PtWX(0),
      this.camera.PtWY(0),
      this.camera.PtWX(this.getCanvas().width),
      this.camera.PtWY(this.getCanvas().height),
      "drawHealthbar"
    );
  }
  drawMagic() {
    this.grid.drawEntitiesIn(
      "magic",
      this,
      this.camera.PtWX(0),
      this.camera.PtWY(0),
      this.camera.PtWX(this.getCanvas().width),
      this.camera.PtWY(this.getCanvas().height)
    );
  }
}


class Grid {
  /**
   * @param {number} columns
   * @param {number} rows
   * @param {number} width
   * @param {number} height
   */
  constructor(columns,rows,width,height) { //1d array instead of 2d array might be faster here... Or might not be
    /**@type {number} */
    this.startX = -width/2;
    /**@type {number} */
    this.startY = -height/2;
    /**@type {number} */
    this.columns = columns;
    /**@type {number} */
    this.rows = rows;
    /**@type {number} */
    this.cellWidth = width/columns;
    /**@type {number} */
    this.cellHeight = height/columns;

    /**@type {GridCell} */
    this.cells = [];
    for (let i=0;i<columns*rows;++i) {
      this.cells.push(new GridCell());
    }
  }
  /**
   * returns a cell id from an x and y value
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  getCell(x,y) {
    x = Math.floor((x-this.startX)/this.cellWidth);
    y = Math.floor((y-this.startY)/this.cellHeight);
    x = Math.min(Math.max(0,x),this.columns-1);
    y = Math.min(Math.max(0,y),this.rows-1);

    return x + y*this.columns;
  }

  add(entityName, wizard, cellId) {
    this.cells[cellId].add(entityName, wizard);
  }
  remove(entityName, wizard, cellId) {
    this.cells[cellId].remove(entityName, wizard);
  }

  /**
   * @param {string} entityName
   * @param {Vector2} vector 
   * @param {number} radius 
   * @returns {Vector2[]}
   */
  getEntitiesInRadius(entityName, vector,radius) {
    let range = Math.ceil(radius / Math.max(this.cellWidth, this.cellHeight));
    let colliding = [];
    let minX = Math.floor((vector.x-this.startX)/this.cellWidth-range);
    let maxX = minX+range*2;
    let minY = Math.floor((vector.y-this.startY)/this.cellHeight-range);
    let maxY = minY+range*2;
    minX = Math.min(Math.max(0,minX),this.columns-1);
    maxX = Math.min(Math.max(0,maxX),this.columns-1);
    minY = Math.min(Math.max(0,minY),this.rows-1);
    maxY = Math.min(Math.max(0,maxY),this.rows-1);

    for (let i=minY;i<=maxY;++i) {
      for (let j=minX;j<=maxX;++j) {
        for (let k=0;k<this.cells[j+i*this.columns][entityName].length;++k) {
          let entity = this.cells[j+i*this.columns][entityName][k];
          if (vector.sqDistance(entity)<(radius+entity.radius)*(radius+entity.radius)/4) {
            colliding.push(entity);
          }
        }
      }
    }
    return colliding;
  }

  drawEntitiesIn(entityName, level, x,y,x2,y2, f = "draw") {
    let minX = Math.floor((x-this.startX)/this.cellWidth-1);
    let maxX = Math.ceil((x2-this.startX)/this.cellWidth+1);
    let minY = Math.floor((y-this.startY)/this.cellHeight-1);
    let maxY = Math.ceil((y2-this.startY)/this.cellHeight+1);
    minX = Math.min(Math.max(0,minX),this.columns-1);
    maxX = Math.min(Math.max(0,maxX),this.columns-1);
    minY = Math.min(Math.max(0,minY),this.rows-1);
    maxY = Math.min(Math.max(0,maxY),this.rows-1);
    // console.log(minX+" "+maxX+"   "+minY+" "+maxY);
    for (let i=minY;i<=maxY;++i) {
      for (let j=minX;j<=maxX;++j) {
        for (let k=0;k<this.cells[j+i*this.columns][entityName].length;++k) {
          // [f] is the functionName here
          this.cells[j+i*this.columns][entityName][k][f](level);
        }
      }
    }
  }
}

class GridCell {
  constructor() {
    /**@type {Wizard[]} */
    this.wizard = [];
    /**@type {Magic[]} */
    this.magic = [];
  }

  add(entityName, entity) {
    this[entityName].push(entity);
  }
  remove(entityName, entity) {
    for (let i=0;i<this[entityName].length;++i) {
      if (this[entityName][i]===entity) {
        this[entityName].splice(i,1);
        return;
      }
    }
    console.error("Remove failed"); //Something is going wrong if this happens.
  }
}
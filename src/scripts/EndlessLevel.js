"use strict";
//Ehren Strifling

class EndlessLevel extends WizardGameLevel {
  static SPAWN_COOLDOWN = 120;
  static RADIUS = 1600;

  static SCORE_TIME = 1;
  static SCORE_ENEMY = 360;

  static HEAL_PER_KO = 100;
  static MANA_PER_KO = 100;
  static MAX_HEALTH_PER_KO = 10;
  static MAX_MANA_PER_KO = 10;


  constructor(instance) {
    super (instance);
    /** level area. Magic outside this area is destroyed. Wizards outside this area are bounced back in.
     * @type {number}
    */
    this.radius = this.constructor.RADIUS;
    //Grid cell size = width / cell count. MAKE SURE THE CELLS ARE NOT TOO TINY.
    this.grid = new Grid(32,32,this.constructor.RADIUS, this.constructor.RADIUS);

    //new properties
    /**@type {number} game time */
    this.time = -60;

    /**@type {WIzard} How many wizards the player has defeated */
    this.wizardsDefeated = 0;

    /** @type {Player} The game's player */
    this.player = new Player(this, 0, 0);
    /** @type {Wizard} */
    this.cameraTarget = this.player;
    this.addWizard(this.player);

    this.gameover = false;
  }

  reset() {
    this.time = -60;
    this.wizardsDefeated = 0;

    for (let i=this.wizards.length-1;i>=0;--i) {
      this.destroyWizard(i);
    }
    for (let i=this.magic.length-1;i>=0;--i) {
      this.destroyMagic(i);
    }

    this.player = new Player(this, 0, 0);
    /** @type {Wizard} */
    this.cameraTarget = this.player;
    this.addWizard(this.player);

    this.gameover = false;
  }

  /**
   * Main loop called every frame
   */
  act() {
    if (this.gameover) {
      this.reset();
    }

    if (this.time%this.constructor.SPAWN_COOLDOWN === 0) {
      this.spawnWizards();
    }
    super.act();

    this.time++;
  }

  destroyWizard(i) {
    let w = this.wizards[i].defeatedBy;
    if (w!==null) {
      if (w===this.player) {
        this.wizardsDefeated++;
      }
      w.maxHealth += this.constructor.MAX_HEALTH_PER_KO;
      w.maxMana += this.constructor.MAX_MANA_PER_KO;

      w.heal(this.constructor.HEAL_PER_KO);
      w.manaHeal(this.constructor.MANA_PER_KO);

    }

    if (this.wizards[i]===this.player) {
      this.gameover = true;
    }

    super.destroyWizard(i);
  }


  spawnWizards() {
    this.addWizard(new Enemy(this, Math.random()*this.radius-this.radius/2, Math.random()*this.radius-this.radius/2));
  }
}
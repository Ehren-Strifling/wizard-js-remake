"use strict";

//Debugging script
//gives statistics on all magic damage per second and healing per second so that
//I can compare and see which magic is overpowered and which magic is garbage.
{
  /**@type {typeof Magic[]} */
  let allMagic = [
    Magic,
    MagicPiercingOrb,
    MagicBigOrb,
    MagicBreath,
    MagicHoming,
    MagicFollow,
    MagicHealing,
    //MagicHealPlus,
    MagicLifeSteal
  ];
  /**@type {typeof MagicHealing[]} */
  let healingMagic = [
    MagicHealing,
    //MagicHealPlus,
    MagicHealSpirit
  ]
  allMagic.forEach((m)=>{
    console.log(m);
    let maxDps = m.damage / m.cooldown;
    let trueDps = m.damage / Math.max(m.cooldown, m.cost);
    console.log("Max DPF: "+maxDps);
    console.log("Average DPF: "+trueDps);
    let manaDrain = (m.cost - m.cooldown) / m.cooldown;
    console.log("Mana drain per frame: "+manaDrain);
    if (m.pierce>0) {
      maxDps*=m.pierce+1;
      trueDps*=m.pierce+1;
      console.log("Piercing max DPF: "+maxDps);
      console.log("Piercing average DPF: "+trueDps);
    }
    console.log("");
  });

  healingMagic.forEach((m)=>{
    console.log(m);
    let maxHps = m.healthHeal / m.cooldown;
    let trueHps = m.healthHeal / Math.max(m.cooldown, m.cost);
    let maxMps = m.manaHeal / m.cooldown;
    let trueMps = m.manaHeal / Math.max(m.cooldown, m.cost);
    console.log("Max HPF: "+maxHps);
    console.log("Average HPF: "+trueHps);
    console.log("Max MPF: "+maxMps);
    console.log("Average MPF: "+trueMps);
    let manaDrain = (m.cost - m.cooldown) / m.cooldown;
    console.log("Mana drain per frame: "+manaDrain);
    if (m.pierce>0) {
      maxHps*=m.pierce+1;
      trueHps*=m.pierce+1;
      maxMps*=m.pierce+1;
      trueMps*=m.pierce+1;
      console.log("Piercing max HPF: "+maxHps);
      console.log("Piercing average HPF: "+trueHps);
      console.log("Piercing max MPF: "+maxMps);
      console.log("Piercing average MPF: "+trueMps);
    }
    console.log("");
  });
}

/**
 * 
 * @param {number} id Give the wizard the spell with this id instead of giving a random spell.
 * @returns {Magic}
 */
Player.getSpell = function (id) { //TEMP for debugging
  if (!id && id!=0) {
    id = parseInt(prompt("Please input spell id.", Math.floor(Math.random()*8)));
  }
  //id = id || prompt("Please input spell id."); //does not work because 0 is falsy
  return Wizard.getSpell(id);
}



Player.prototype.control2 = Player.prototype.control;
Player.prototype.control = function (level) {
  this.control2(level);
  for (let i=0;i<8;++i) {
    if (level.getInput().key(96+i)) {
      this.spell = this.constructor.getSpell(i);
    }
  }

  // if (level.getInput().mouseWheelY != 0) {
  //   level.camera.setScale(level.camera.getScale() - level.getInput().mouseWheelY / 1200);
  //   if (level.camera.getScale()<0) {
  //     level.camera.setScale(0.05);
  //   }
  // }
}
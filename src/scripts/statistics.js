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
    MagicHealPlus
  ];
  /**@type {typeof MagicHealing[]} */
  let healingMagic = [
    MagicHealing,
    MagicHealPlus
  ]
  allMagic.forEach((m)=>{
    console.log(m);
    let maxDps = m.damage / m.cooldown;
    let trueDps = m.damage / Math.max(m.cooldown, m.cost);
    console.log("Max DPS: "+maxDps);
    console.log("Average DPS: "+trueDps);
    let manaDrain = (m.cost - m.cooldown) / m.cooldown;
    console.log("Mana drain per frame: "+manaDrain);
    if (m.pierce>0) {
      maxDps*=m.pierce+1;
      trueDps*=m.pierce+1;
      console.log("Piercing max DPS: "+maxDps);
      console.log("Piercing average DPS: "+trueDps);
    }
    console.log("");
  });

  healingMagic.forEach((m)=>{
    console.log(m);
    let maxHps = m.healthHeal / m.cooldown;
    let trueHps = m.healthHeal / Math.max(m.cooldown, m.cost);
    let maxMps = m.manaHeal / m.cooldown;
    let trueMps = m.manaHeal / Math.max(m.cooldown, m.cost);
    console.log("Max HPS: "+maxHps);
    console.log("Average HPS: "+trueHps);
    console.log("Max MPS: "+maxMps);
    console.log("Average MPS: "+trueMps);
    let manaDrain = (m.cost - m.cooldown) / m.cooldown;
    console.log("Mana drain per frame: "+manaDrain);
    if (m.pierce>0) {
      maxHps*=m.pierce+1;
      trueHps*=m.pierce+1;
      maxMps*=m.pierce+1;
      trueMps*=m.pierce+1;
      console.log("Piercing max HPS: "+maxHps);
      console.log("Piercing average HPS: "+trueHps);
      console.log("Piercing max MPS: "+maxMps);
      console.log("Piercing average MPS: "+trueMps);
    }
    console.log("");
  });
}

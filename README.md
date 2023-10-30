# Version 1.2-alpha

## Gameplay Changes
increased target radius for player's auto-aim
Fixed how the framerate works, now it works flawlessly on (hopefully) all browser.
Now only reads keyboard inputs while the game canvas is focused.

Changed how barrier bouncing code to make it more consistent
Moved the framerate counter slightly away from the edge of the canvas

## Code Changes
Removed all references to the level grid from entities, now it's all managed by the level itself.
Created a new baseclass for level that doesn't use grid collision so I can compare performances. - The collision grid does in fact save A TON of performance.

Updated xander-js-3
Reworked code to use game-instance from xander-js-3

# wizard-js-remake
Remake of my Greenfoot wizard game.
Link to the original Java version: https://www.greenfoot.org/scenarios/27474

You can play the most recent release of the game without downloading anything by [visiting this website](https://ehren-strifling.github.io/index.html).

The main file is index.html.
Running this requires you to download the "xander-js-3" submodule.   
https://github.com/Ehren-Strifling/xander-js-3

If you do not want to download it then you can try **wizard-js-portable.html** in the portable folder. It should work as long as you are online.

The game is still early in development.

## Main Controls
Use **WASD** or the **arrow keys** to move. Hold **spacebar** or **leftmouse** to cast magic.  
Your character is the wizard in the center of the screen. Use the mouse to aim.

You can also pause and unpause the game by pressing the **esc** key.

### More controls
Press **leftmouse** or the **X** key to set your auto-aim target to a wizard nearby your mouse.  
Press **rightmouse** or **Z** to unset your target.  
_If your auto aim target is defeated then you will automatically target another nearby enemy wizard._

Holding **shift** will override the auto-aim and resume aiming towards your mouse. Spells that track wizards will still prioritise your set target.


### Debug controls
Enter a number to the prompt to select which spell you want.  
You can also use the numberpad numbers to change your spell while the game is still running.

#### Spell ids
0. Basic magic. Rapid fire spell with a low mana cost
1. Piercing magic. Slower firing smell that can pierce through 1 wizard to hit a second one
2. Large orb magic. Shoots big projectiles that deal a lot of damage and cause knockback but fires slowely.
3. Magic Breath. Short range magic that can deflect projectiles and has a high dps but high mana cost.
4. Homing magic. Shoots magic that will home in on nearby targets. At the cost of dealing slightly less damage.
5. Follow magic (name still not decided). Shoots magic that flies towards enemies. Has a high mana cost.
6. Healing magic. Restores the health and mana of any allies it hits. But costs slightly more to cast.
7. Homing healing magic. Will home in on enemies or allies. Slightly restores the health of allies. Has a pitiful damage output.

## Mechanics
### Mana
Using spells costs mana to cast. Mana regenerates overtime.
If a wizard has full mana and has not been hit for a while, they will start regenerating health using mana.
### Colour
Wizards with the same robe colour are **allies**. Wizards with different robe colour are **enemies**.
Spells will not hit allies (unless they are healing spells).
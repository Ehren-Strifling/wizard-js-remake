# Version 1.3-alpha

## New features
Added Vampire Spell. Steals life from hit enemies.

## Gameplay Changes
Changed DPS to DPF in the debug script

## Removed
Removed Heal Plus spell

## Code Changes
Reworked controls to allow for controller support in the future


# Version 1.2-alpha

## Gameplay Changes
increased target radius for player's auto-aim
Fixed how the framerate works, now it works flawlessly on (hopefully) all browser.
Now only reads keyboard inputs while the game canvas is focused.

Changed the barrier bouncing code to make it more consistent
Moved the framerate counter slightly away from the edge of the canvas

## Code Changes
Removed all references to the level grid from entities, now it's all managed by the level itself.
Created a new baseclass for level that doesn't use grid collision so I can compare performances. - The collision grid does in fact save A TON of performance.

Updated xander-js-3
Reworked code to use game-instance from xander-js-3

# Version 1.1-alpha

## New features
Added a background so you can tell where you're moving.
Added endless mode

## Balance

 * nerfed manabreath because it was too good a deflecting enemy magic
   * increased magic cost 10->14
   * increased damage 6->10
 * increased followmagic damage 4 -> 6
 * decreased followmagic damage cost 20 -> 16
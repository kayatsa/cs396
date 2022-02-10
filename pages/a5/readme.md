## A5: Plantkeeper

Chatbot with Tracery

This bot serves as a mediator between you and the plant you are taking care of. You perform certain actions, the bot will inform you how the plant responds.

### Features

**CARE:** Care for the plant. Increases `health` by 2. Decreases `playfulness` by 1.

**PLAY:** Play with the plant. Decreases `health` by 1.

-   If `health` ≤ 2, no change to `playfulness`.
-   If 3 ≤ `health` ≤ 6, increases `playfulness` by 2.
-   If `health` ≥ 7, increases `playfulness` by 3.

**WAIT:** Do nothing. Decreases `health` by 1. Decreases `playfulness` by 1.

### Bloom

If `health` ≥ 9 and `playfulness` ≥ 9, the plant will bloom into a flower.
If then either `health` or `playfulness` ≤ 8, the flower will revert to an unbloomed plant.

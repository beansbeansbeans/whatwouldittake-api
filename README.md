We could generate a random mapping of square indices at the initialization stage. Then the assignments would be deterministic per session. 

Beyond that though, the problem is that we need to persist the squares by user key, not by index, because indices will change while users will not. 

SO I THINK the first step is getting the squares to visually persist. NEXT step is getting them to only move when the square coordinates change. 

----

so why would it kind of work with square indexes? it's sort of because the pool has to be consistent maybe? if the pool changes, then everything is re-rendered it seems. so my pool of keys has to be carefully managed. 
- even as coordinates resize, the pool must be predictable. 
- 

======

Maybe - SETTING ASIDE WINDOW DIMENSIONS CHANGE HANDLING FOR NOW. 

Assuming that there is always a square in the exact center IS a simplifying assumption. 

When the grid becomes too small/large given the # of chatters, we can nudge the assumed square size until window area / square size is an appropriate #. 

Then given that assumption, we can calculate the array of coordinates that the squares should be arranged in. 

Rects are either occupied or unoccupied. But each grid space is rendered as a rect.

=== STEP TWO ===

Given an array of chatters, we create associations between chatter objects and rect + index pairs. These associations are randomly created (CHECK THIS - DON'T THINK IT WILL WORK), so the chatters will be scattered across the UI. But the association persists through the lifetime of the chatter. 

Every time there's an update to the chatters, we create a fresh batch of associations.

As chatters leave, their indices are released into a pool of unused indices. New chatters get index assignments randomly from this pool. 

The chatter -> index associations are reflected in the DOM by classes and data-id (pointing to user id) attributes. 

=== THE RENDER LOOP ===

CHATTERS UPDATE - GRID MUST INCREASE BY 100
(1) Create the array of grid coordinates
(2) Create the array of chatters with assigned indices
(3) Remove any DOM rects that no longer have associated grid coordinates
(4) Transform any DOM rects with associated grid coordinates to their new positions
(5) Create DOM rects for any grid coordinates that yet don't correspond to DOM rects. 
(6) Create chatter -> index associations for all chatters that don't yet have one - then add attributes to the corresponding DOM rects to reflect these associations (data-id, data-index, data-occupied, etc.).
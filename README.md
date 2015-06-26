Maybe - SETTING ASIDE WINDOW DIMENSIONS CHANGE HANDLING FOR NOW. 

Assuming that there is always a square in the exact center IS a simplifying assumption. 

When the grid becomes too small/large given the # of chatters, we can nudge the assumed square size until window area / square size is an appropriate #. 

Then given that assumption, we can calculate the array of coordinates that the squares should be arranged in. 

Rects are either occupied or unoccupied. But each grid space is rendered as a rect.

=== STEP ONE ===

MAPPING BETWEEN DATA (GRID COORDINATES) AND RECTS

Indices, forming concentric circles (approximately), are assigned to the grid coordinates. A rect is rendered at each index (the rect keeps track of which index it was rendered to).

When the grid coordinates change, the indices are reconstructed, forming concentric circles again. The rects on the screen are transformed according to the new coordinates that their assigned index points to. Rect nodes are recycled. 
- For any coordinates that don't have rects, new rects are created.
- For any rects that no longer have coordinates, they are removed from the DOM.

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
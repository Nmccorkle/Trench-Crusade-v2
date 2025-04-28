// Import document classes.
import { TrenchCrusadeactor } from './documents/actor.mjs';
import { TrenchCrusadeItem } from './documents/item.mjs';
// Import sheet classes.
import { TrenchCrusadeactorSheet } from './sheets/actor-sheet.mjs';
import { TrenchCrusadeItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { BOILERPLATE } from './helpers/config.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.trench_crusade = {
    TrenchCrusadeactor,
    TrenchCrusadeItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.BOILERPLATE = BOILERPLATE;

  CONFIG.actor.trackableAttributes = {
    actor: {
      bar: ["resources.wounds", "resources.power"]
    },
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: game.settings.get('trench-crusade', 'initiativeFormula') || '1d20 + @abilities.dex.mod',
    decimals: 2,
  };
  CONFIG.actor.wounds = {
    formula: '@abilities.end.mod + @abilities.str.mod + (2 * tier)',
    decimals: 0,
  };
  CONFIG.actor.

  // Define custom Document classes
  CONFIG.actor.documentClass = TrenchCrusadeactor;
  CONFIG.Item.documentClass = TrenchCrusadeItem;

  // Active Effects are never copied to the actor,
  // but will still apply to the actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  actors.unregisterSheet('core', actorSheet);
  actors.registerSheet('trench-crusade', TrenchCrusadeactorSheet, {
    makeDefault: true,
    label: 'BOILERPLATE.SheetLabels.actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('trench-crusade', TrenchCrusadeItemSheet, {
    makeDefault: true,
    label: 'BOILERPLATE.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.trench-crusade.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'trench-crusade.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}

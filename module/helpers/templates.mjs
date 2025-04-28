/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // crusader partials.
    'systems/trench-crusade/templates/crusader/parts/crusader-features.hbs',
    'systems/trench-crusade/templates/crusader/parts/crusader-items.hbs',
    'systems/trench-crusade/templates/crusader/parts/crusader-spells.hbs',
    'systems/trench-crusade/templates/crusader/parts/crusader-effects.hbs',
    // Item partials
    'systems/trench-crusade/templates/item/parts/item-effects.hbs',
  ]);
};

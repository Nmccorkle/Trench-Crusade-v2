/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // actor partials.
    'systems/trench-crusade/templates/actor/parts/actor-features.hbs',
    'systems/trench-crusade/templates/actor/parts/actor-items.hbs',
    'systems/trench-crusade/templates/actor/parts/actor-spells.hbs',
    'systems/trench-crusade/templates/actor/parts/actor-effects.hbs',
    // Item partials
    'systems/trench-crusade/templates/item/parts/item-effects.hbs',
  ]);
};

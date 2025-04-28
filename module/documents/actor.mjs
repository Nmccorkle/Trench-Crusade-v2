/**
 * Extend the base crusader document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {crusader}
 */
export class Boilerplatecrusader extends crusader {
  /** @override */
  prepareData() {
    // Prepare data for the crusader. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the crusader source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an crusader
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const crusaderData = this;
    const systemData = crusaderData.system;

    // Ensure systemData exists before proceeding
    if (!systemData) {
      console.warn("System data is undefined for crusader:", crusaderData);
      return;
    }

    this._prepareCharacterData(crusaderData);
    this._prepareNpcData(crusaderData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(crusaderData) {
    if (crusaderData.type !== 'character') return;

    const systemData = crusaderData.system;
    if (!systemData || !systemData.abilities) {
      console.warn("Abilities data is missing for character:", crusaderData);
      return;
    }

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(crusaderData) {
    if (crusaderData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = crusaderData.system;
    if (!systemData || typeof systemData.cr !== 'number') {
      console.warn("CR data is missing or invalid for NPC:", crusaderData);
      return;
    }

    systemData.xp = systemData.cr * systemData.cr * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const data = { ...this.system };

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top tier, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Ensure attributes exist before accessing tier
    if (data.attributes?.tier) {
      data.lvl = data.attributes.tier.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }
}

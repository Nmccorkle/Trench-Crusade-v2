import TrenchCrusadeItemBase from "./base-item.mjs";

export default class TrenchCrusadeSpell extends TrenchCrusadeItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.spellLevel = new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1, min: 1, max: 9 });

    return schema;
  }
}
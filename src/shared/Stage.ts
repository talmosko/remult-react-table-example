import { ValueListFieldType } from "remult";

@ValueListFieldType({
  getValues: () => [
    Stage.seed,
    Stage.seriesA,
    Stage.seriesB,
    Stage.seriesC,
    Stage.IPO,
  ],
})
export class Stage {
  constructor(public id: string) {
    this.id = id;
  }
  static seed = new Stage("Seed");
  static seriesA = new Stage("Series A");
  static seriesB = new Stage("Series B");
  static seriesC = new Stage("Series C");
  static IPO = new Stage("IPO");
}

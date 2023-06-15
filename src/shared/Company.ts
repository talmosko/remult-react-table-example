import { Entity, Field, Fields } from "remult";
import { Stage } from "./Stage";

@Entity("companies", {
  allowApiCrud: true,
})
export class Company {
  @Fields.cuid()
  id = "";
  @Fields.string()
  name = "";
  @Fields.integer()
  numberOfEmployees = 0;
  @Fields.string()
  shortDescription = "";
  @Fields.number()
  avgYearlyRevenue = 0;
  @Field(() => Stage)
  stage = Stage.seed;
  @Fields.boolean()
  hiring = false;
  @Fields.string()
  location = "";
}

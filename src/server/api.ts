import { remultExpress } from "remult/remult-express";
import { Company } from "../shared/Company";
import { Stage } from "../shared/Stage";

export const api = remultExpress({
  entities: [Company, Stage],
});

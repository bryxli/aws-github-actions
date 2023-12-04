import { SSTConfig } from "sst";
import { IAM } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "aws-github-actions",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(IAM);
  }
} satisfies SSTConfig;

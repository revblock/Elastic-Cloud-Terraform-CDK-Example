import { Construct } from "constructs";
import { App, TerraformOutput, TerraformStack, TerraformVariable } from "cdktf";
import { Deployment, EcProvider } from "./.gen/providers/ec";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const apiKey = new TerraformVariable(this, "api_key", {
      type: "string"
    })

    new EcProvider(this, "ec", {
      apikey: apiKey.stringValue,
    });

    const ecDeployment = new Deployment(this, "supersearch", {
      name: "super-search",
      region: "eu-west-1",
      version: "7.12.0",
      elasticsearch: [{}],
      kibana: [{}],
      deploymentTemplateId: "aws-enterprise-search-dedicated-v2",
    });

    new TerraformOutput(this, "es_username", {
      value: ecDeployment.elasticsearchUsername,
    });

    new TerraformOutput(this, "es_password", {
      value: ecDeployment.elasticsearchPassword,
    });
  }
}

const app = new App();
new MyStack(app, "poc");
app.synth();

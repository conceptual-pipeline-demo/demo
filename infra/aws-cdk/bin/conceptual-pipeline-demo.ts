#!/usr/bin/env node
import 'source-map-support/register';
import {App} from "aws-cdk-lib";
import {defaultEnv} from "../lib/environments";
import {VpcStack} from "../lib/vpc-stack";
import {AuroraStack} from "../lib/aurora-stack";
import {EcrStack} from "../lib/ecr-stack";
import {EksStack} from "../lib/eks-stack";

const app = new App();

const vpcStack = new VpcStack(app, 'ConceptualPipelineVpcStack', {
  env: defaultEnv,
});

new AuroraStack(app, 'ConceptualPipelineAuroraStack', {
  env: defaultEnv,
  vpc: vpcStack.vpc,
  allowIngressFromSecurityGroupIds: [],
});

new EcrStack(app, 'ConceptualPipelineEcrStack', {
  env: defaultEnv,
});

new EksStack(app, 'ConceptualPipelineEksStack', {
  env: defaultEnv,
  vpc: vpcStack.vpc,
});

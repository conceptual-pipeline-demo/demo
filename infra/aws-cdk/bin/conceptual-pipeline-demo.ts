#!/usr/bin/env node
import 'source-map-support/register';
import {App} from "aws-cdk-lib";
import {defaultEnv} from "../lib/environments";
import {VpcStack} from "../lib/vpc-stack";
import {AuroraStack} from "../lib/aurora-stack";

const app = new App();

const vpcStack = new VpcStack(app, 'VpcStack', {
  env: defaultEnv,
});

new AuroraStack(app, 'ShadowAuroraStack', {
  env: defaultEnv,
  vpc: vpcStack.vpc,
  allowIngressFromSecurityGroupIds: [],
});
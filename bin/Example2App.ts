#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PersistenceStack } from '../lib/PersistenceStack';
import { GraphQlStack } from '../lib/GraphQlStack';

const app = new cdk.App();

const persistence = new PersistenceStack(app, 'PersistenceStack', {
  stackName: "Persistence",
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

const graphQl = new GraphQlStack(app, 'GraphQlStack', {
  stackName: "GraphQl",
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  table: persistence.table,
});

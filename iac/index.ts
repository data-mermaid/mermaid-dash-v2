#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib'
import { Aspects } from 'aws-cdk-lib'
import { AwsSolutionsChecks } from 'cdk-nag'
import { StaticSiteStack } from './stacks/static-site-stack'
import { applyNagSuppressions } from './nag-suppressions'

const app = new cdk.App()
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))

const tags = {
  "Owner": "sysadmin@datamermaid.org",
}


const environment = process.env.ENV || 'dev'
const domain = process.env.DOMAIN || 'dev-explore.datamermaid.org'

const cdkEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
}

const stack = new StaticSiteStack(app, `${environment}-explore`, {
    env: cdkEnv,
    tags,
    domainName: domain,
    environment: environment
})

applyNagSuppressions(stack)

app.synth()

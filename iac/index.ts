#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib'
import { StaticSiteStack } from './stacks/static-site-stack'

const app = new cdk.App()

const tags = {
  "Owner": "sysadmin@datamermaid.org",
}


const environment = process.env.ENV || 'dev'
const domain = process.env.DOMAIN || 'dev-explore.datamermaid.org'

const cdkEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
}

new StaticSiteStack(app, `${environment}-explore`, {
    env: cdkEnv,
    tags,
    domainName: domain,
    environment: environment
})

app.synth()

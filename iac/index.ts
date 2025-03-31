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

const subdomain = app.node.tryGetContext('subdomain') || 'dev'
const domain = app.node.tryGetContext('domain') || 'dashboard3.datamermaid.org'
const hostedZoneId = app.node.tryGetContext('hostedZoneId') || 'Z04309691UBJ1O79WWKW4'

const cdkEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
}

new StaticSiteStack(app, `${subdomain}-dashboard3`, {
    env: cdkEnv,
    tags,
    domainName: domain,
    siteSubDomain: subdomain,
    hostedZoneId: hostedZoneId
})

app.synth()

#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib'
import { StaticSite } from '../static-site'

/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk [--profile mermaid] synth -c domain=app2.datamermaid.org -c subdomain=dev'
**/

interface StaticSiteStackProps extends cdk.StackProps {
  domainName: string;
  siteSubDomain: string;
  hostedZoneId: string;
}

export class StaticSiteStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: StaticSiteStackProps) {
        super(parent, name, props)

        const site = new StaticSite(this, 'StaticSite', {
            domainName: props.domainName,
            siteSubDomain: props.siteSubDomain,
            hostedZoneId: props.hostedZoneId
        })
    }
}

#!/usr/bin/env node
/* eslint-disable no-new */
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins'
import { CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export interface StaticSiteProps {
  domainName: string;
  environment: string;
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution and ACM certificate.
 */
export class StaticSite extends Construct {
  bucket: s3.Bucket

  constructor(parent: Stack, name: string, props: StaticSiteProps) {
    super(parent, name)

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'CloudfrontOAI', {
      comment: `OAI for ${name}`
    })

    new CfnOutput(this, 'Site', { value: `https://${props.domainName}` })

    // Content bucket
    const siteBucket = new s3.Bucket(this, 'Bucket', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: props.domainName,

      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      removalPolicy: props.environment === 'dev' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,

      /**
       * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
       * setting will enable full cleanup.
       */
      autoDeleteObjects: props.environment === 'dev',
    })

    // Grant access to cloudfront
    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }))
    new CfnOutput(this, 'BucketName', { value: siteBucket.bucketName })

    // TLS certificate
    // NOTE: This depends on the cert already created (manually)
    const certificate = acm.Certificate.fromCertificateArn(this, 'DefaultSSLCert',
      `arn:aws:acm:us-east-1:${parent.account}:certificate/2aba1caf-7215-4cfe-9c0e-2c9871b7ed41`
    )

    // CloudFront distribution
    const domainNames = []
    domainNames.push(props.domainName)

    // Function to rewrite root requests to index.html
    const rewriteFunction = new cloudfront.Function(this, 'RewriteToIndex', {
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          if (request.uri === "/") {
            request.uri = "/index.html";
          }
          return request;
        }
      `),
    })

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultRootObject: "index.html",
      domainNames,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      // if you do a hard refresh, then the app goes to an error page. We need it to
      // redirect to index.html
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        }
      ],
      defaultBehavior: {
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        origin: cloudfront_origins.S3BucketOrigin.withOriginAccessIdentity(siteBucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // Rewrite root path to index.html using a lightweight CloudFront Function
        functionAssociations: [{
          function: rewriteFunction,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      }
    })

    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId })

    // Deploy site contents to S3 bucket
    let s3Asset = s3deploy.Source.asset('../dist')
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3Asset],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    })

    // export
    this.bucket = siteBucket
  }
}

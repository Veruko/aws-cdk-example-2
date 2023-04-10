import * as cdk from 'aws-cdk-lib';
import * as dynamoDb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudFront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as ssm from "aws-cdk-lib/aws-ssm";

import { Construct } from 'constructs';


export class PersistenceStack extends cdk.Stack {
  public readonly table : dynamoDb.ITable;


  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // this will create a dynamodb table, where we can store our data
    this.table = new  dynamoDb.Table (this, "table", {
      tableName: "example-2",
      partitionKey: { name: "name", type: dynamoDb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, //note: bad idea on PRD
    })

    // this will create a S3 bucket for storing our sample website
    const websiteBucket = new s3.Bucket(this, "website_bucket", {
      bucketName: "example-2-website", //note: bucket name needs to be globally unique
    })

    // the distribution that will allow accessing the website from the internet
    const distribution = new cloudFront.Distribution (this, "website_distribution", {
      comment: "Example 2 Website",
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket)        
      },
      defaultRootObject: "index.html",
    })

    // exporting a parameter from the stack so the website can easily read it. 
    new ssm.StringParameter(this, "website_parameter_url", { 
      parameterName: "/example2/website/url",
      stringValue: distribution.distributionDomainName
    })
  }
}

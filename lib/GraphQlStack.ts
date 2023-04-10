import * as cdk from 'aws-cdk-lib';
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';


type GraphQlStackProps = cdk.StackProps & {
  table: ITable
}

export class GraphQlStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: GraphQlStackProps) {
    super(scope, id, props);

      //setting up graph ql endpoints
      const graphQlApi = new appsync.GraphqlApi(this, "graphql", {
        name: "Example2",
        schema: appsync.SchemaFile.fromAsset("./schema/website2.graphql"),
      });

      const myLambda = new nodejs.NodejsFunction(this, "lambda", {
        functionName: "example_2",
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: "./functions/Example2Lambda.ts",
        timeout: cdk.Duration.seconds(10),
      });

      props.table.grantWriteData(myLambda);
    
      const dataSource = graphQlApi.addLambdaDataSource("example_2_datasource", myLambda);

      dataSource.createResolver("example_2_resolver", {
        fieldName: "hello",
        typeName: "Query"
      })

      if (graphQlApi.apiKey){
        new ssm.StringParameter(this, "graphql_parameter_apikey", { 
          parameterName: "/example2/graphql/key",
          stringValue: graphQlApi.apiKey //note: not teh safest way ;)
        })
      }

      new ssm.StringParameter(this, "graphql_parameter_url", { 
        parameterName: "/example2/graphql/url",
        stringValue:graphQlApi.graphqlUrl
      })

  }
}

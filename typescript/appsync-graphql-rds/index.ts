import cdk = require('aws-cdk-lib');
import * as appsync from 'aws-cdk-lib/aws-appsync' ;
import {
    CfnGraphQLApi,
    Definition,
    CfnDataSource
  } from "aws-cdk-lib/aws-appsync";
import { Construct } from 'constructs';
import { readFileSync } from "fs";

export class AppSyncCdkStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appGraphQLApi = new CfnGraphQLApi(this, 'AppApi', {
      name: 'AppApi',
      definition: Definition.fromFile('schema.graphql'),
    });

    // TODO: Create RDS instance using CDK

    const dataSource = new CfnDataSource(this, "AppDataSource", {
        apiId: appGraphQLApi.attrApiId,
        name: "AppDataSource",
        relationalDatabaseConfig: {
            relationalDatabaseSourceType: 'relationalDatabaseSourceType',
            rdsHttpEndpointConfig: {
              awsRegion: this.region, // TODO: Get from RDS instance construct
              awsSecretStoreArn: 'awsSecretStoreArn', // TODO: Get from RDS instance construct
              dbClusterIdentifier: 'dbClusterIdentifier', // TODO: Get from RDS instance construct
              databaseName: 'app',
            },
          },
    });

    dataSource.createResolver(this, "CreateMessageResolver", {
        apiId: appGraphQLApi.attrApiId,
        typeName: "Mutation",
        fieldName: "createMessage",
        dataSourceName: dataSource.name,
        runtime: {
          name: "APPSYNC_JS",
          runtimeVersion: "1.0.0",
        },
        code: readFileSync("./resolvers/createMessage.js", "utf-8"),
    });

    // Mutation resolver
    dataSource.createResolver(this, "CreateMessageResolver", {
        apiId: appGraphQLApi.attrApiId,
        typeName: "Mutation",
        fieldName: "createMessage",
        dataSourceName: dataSource.name,
        runtime: {
          name: "APPSYNC_JS",
          runtimeVersion: "1.0.0",
        },
        code: readFileSync("./resolvers/createMessage.js", "utf-8"),
    });

    // Mutation resolver demonstrating custom query
    dataSource.createResolver(this, "GetConversationSummaryResolver", {
        apiId: appGraphQLApi.attrApiId,
        typeName: "Mutation",
        fieldName: "getConversationSummary",
        dataSourceName: dataSource.name,
        runtime: {
          name: "APPSYNC_JS",
          runtimeVersion: "1.0.0",
        },
        code: readFileSync("./resolvers/getConversationSummary.js", "utf-8"),
    });

    // Prints out URL
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: appGraphQLApi.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: appGraphQLApi.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });
  }
}

const app = new cdk.App();
new AppSyncCdkStack(app, 'AppSyncGraphQLDynamoDBExample');
app.synth();

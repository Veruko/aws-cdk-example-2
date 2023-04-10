import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Handler } from "aws-lambda";

type HelloEvent = {
    arguments : {
      name : string
  }
}

const dynamoDb =  DynamoDBDocument.from(new DynamoDB({}));

export const handler: Handler<HelloEvent, string> = async (event) => {
  console.log("event", JSON.stringify(event));
  
  const {name} = event.arguments;

  let nickname = name;

  const response = await dynamoDb.get({
    TableName: "example-2",
    Key: {
      name: name
    }
  });

  if (response && response.Item) {
    nickname = response.Item["nickname"] ?? name
  }

  return `Hello ${nickname}!`;
};

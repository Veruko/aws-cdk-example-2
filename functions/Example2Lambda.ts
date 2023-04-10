import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Handler } from "aws-lambda";

type HelloEvent = {
    name : string
}

const dynamoDb =  DynamoDBDocument.from(new DynamoDB({}));

export const handler: Handler<HelloEvent, string> = async (event) => {
  console.log("event", JSON.stringify(event));
  
  let nickname = event.name;

  const response = await dynamoDb.get({
    TableName: "example-2",
    Key: {
      name: event.name
    }
  });
  console.log("🚀 ~ file: Example1Lambda.ts:22 ~ consthandler:Handler<HelloEvent,string>= ~ response:", response)

  if (response && response.Item) {
    nickname = response.Item["nickname"] ?? event.name
  }

  return `Hello ${nickname}!`;
};

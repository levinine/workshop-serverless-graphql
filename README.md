# Serverless GraphQL Workshop by Levi9

## Workshop outline

Using [CryptoCompare API](https://min-api.cryptocompare.com/) we are going to fetch Crypto currencies data, pass data into SQS and store processed data in DynamoDB.
On the other side of system, this data will be exposed to client through GraphQL endpoint. 

API contains Crypto currency images that we are going to serve though CloudFront and Lambda@Edge. 

Client will be React application with Apollo client.

## Services used

* Lambda
* SQS/Kinesis
* DynamoDB
* API Gateway
* IAM
* CloudFront
* CloudWatch
* CloudFormation
* S3
* Lambda@Edge

Most of these will be managed through Serverless framework.

## API used 
[CryptoCompare API](https://min-api.cryptocompare.com/)

## What are we building

![system diagram](assets/system-diagram.png "System diagram")

## Run locally 

Run ElasticMQ server (Requires Java JDK)

```bash
java -jar assets/elasticmq-server-0.14.14.jar
```

Download local DynamoDB 

```bash
sls dynamodb install
```

Run local DynamoDB 

```bash
sls dynamodb start --migrate
```

Run serverless offline 

```bash
sls offline
```
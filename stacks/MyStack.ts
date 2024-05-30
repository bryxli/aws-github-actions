import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { StackContext } from 'sst/constructs';

export function IAM({ app, stack }: StackContext) {
  if (app.stage === 'prod') {

    const provider = new iam.OpenIdConnectProvider(stack, 'GitHub', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });

    new iam.Role(stack, 'ZoeBotActions', {
      assumedBy: new iam.OpenIdConnectPrincipal(provider).withConditions({
        StringLike: {
          'token.actions.githubusercontent.com:sub': 'repo:bryxli/zoe-bot:*',
        },
      }),
      description: 'Zoe bot role for deploying from GitHub CI using SST',
      roleName: 'ZoeBotActions',
      maxSessionDuration: Duration.hours(1),
      inlinePolicies: {
        SSTDeploymentPolicy: new iam.PolicyDocument({
          assignSids: true,
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'cloudformation:DeleteStack',
                'cloudformation:DescribeStackEvents',
                'cloudformation:DescribeStackResources',
                'cloudformation:DescribeStacks',
                'cloudformation:GetTemplate',
                'cloudformation:ListImports',
                'ecr:CreateRepository',
                'iam:PassRole',
                'iot:Connect',
                'iot:DescribeEndpoint',
                'iot:Publish',
                'iot:Receive',
                'iot:Subscribe',
                'lambda:GetFunction',
                'lambda:GetFunctionConfiguration',
                'lambda:UpdateFunctionConfiguration',
                's3:ListBucket',
                's3:PutObjectAcl',
                's3:GetObject',
                's3:PutObject',
                's3:DeleteObject',
                's3:ListObjectsV2',
                's3:CreateBucket',
                's3:PutBucketPolicy',
                'ssm:DeleteParameter',
                'ssm:GetParameter',
                'ssm:GetParameters',
                'ssm:GetParametersByPath',
                'ssm:PutParameter',
                'sts:AssumeRole',
              ],
              resources: [
                '*',
              ],
            }),
          ],
        }),
      },
    });

    new iam.Role(stack, 'ZoeBotApplication', {
      assumedBy: new iam.OpenIdConnectPrincipal(provider).withConditions({
        StringLike: {
          'token.actions.githubusercontent.com:sub': 'repo:bryxli/zoe-bot:*',
        },
      }),
      description: 'Zoe bot role for application permissions',
      roleName: 'ZoeBotApplication',
      maxSessionDuration: Duration.hours(1),
      inlinePolicies: {
        Boto3Policy: new iam.PolicyDocument({
          assignSids: true,
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:Scan',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:DeleteItem',
                'dynamodb:UpdateItem'
              ],
              resources: [
                '*',
              ],
            }),
          ],
        }),
      },
    });
  }
}    
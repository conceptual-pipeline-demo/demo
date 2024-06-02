import { Duration, Stack } from 'aws-cdk-lib';
import {
  AclCidr,
  AclTraffic,
  Action,
  FlowLogDestination,
  FlowLogTrafficType,
  GatewayVpcEndpointAwsService,
  InterfaceVpcEndpointAwsService,
  IpAddresses,
  NetworkAcl,
  SubnetType,
  TrafficDirection,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Bucket, StorageClass } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { conventionalBucketOptions } from './constructs/conventional-bucket-options';
import { ContextResolver } from './environments';
import { StrictStackProps } from './strict-types';
import { TagsBuilder } from './tags-builder';

export class VpcStack extends Stack {
  private readonly _vpc: Vpc;

  constructor(scope: Construct, id: string, props: StrictStackProps) {
    super(scope, id, props);
    const context = new ContextResolver(this.node, props.env);

    const flowLogsBucket = this.createFlowLogBucket(context);

    this._vpc = this.createVpc(context, flowLogsBucket);

    this.createNetworkAcls(context, this._vpc);

    TagsBuilder.of(this, props.env);
  }

  private createNetworkAcls(context: ContextResolver, vpc: Vpc) {
    this.createNacl(`${context.localPrefix}-public-nacl`, vpc, SubnetType.PUBLIC, AclCidr.anyIpv4());
    this.createNacl(`${context.localPrefix}-private-nacl`, vpc, SubnetType.PRIVATE_WITH_EGRESS, AclCidr.anyIpv4());
    this.createNacl(`${context.localPrefix}-secure-nacl`, vpc, SubnetType.PRIVATE_ISOLATED, AclCidr.ipv4(context.vpc.cidr));
  }

  private createNacl(naclId: string, vpc: Vpc, subnetType: SubnetType, cidr: AclCidr) {
    let nacl = new NetworkAcl(this, naclId, {
      vpc: vpc,

      networkAclName: naclId,
      subnetSelection: {
        onePerAz: false,
        subnetType: subnetType,
      },
    });

    nacl.addEntry(`${naclId}-ingress`, {
      ruleAction: Action.ALLOW,
      ruleNumber: 100,
      cidr: cidr,
      traffic: AclTraffic.allTraffic(),
      direction: TrafficDirection.INGRESS,
    });
    nacl.addEntry(`${naclId}-egress`, {
      ruleAction: Action.ALLOW,
      ruleNumber: 100,
      cidr: cidr,
      traffic: AclTraffic.allTraffic(),
      direction: TrafficDirection.EGRESS,
    });
    TagsBuilder.addNameTagTo(nacl, naclId);
  }

  private createVpc(context: ContextResolver, flowLogsBucket: Bucket) {
    let vpc = new Vpc(this, `${context.localPrefix}-vpc`, {
      ipAddresses: IpAddresses.cidr(context.vpc.cidr),
      vpcName: `${context.localPrefix}-vpc`,
      flowLogs: {
        "flowLogsS3": {
          destination: FlowLogDestination.toS3(flowLogsBucket),
          trafficType: FlowLogTrafficType.ALL,
        },
      },
      maxAzs: 3,
      reservedAzs: 1,
      subnetConfiguration: [
        {
          cidrMask: 20,
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 20,
          name: 'private',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 20,
          name: 'secure',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
      natGateways: 2,
      gatewayEndpoints: {
        s3: {
          service: GatewayVpcEndpointAwsService.S3,
        },
      },
    });
    vpc.addInterfaceEndpoint(`${context.localPrefix}-vpc-ie-ssm`, {
      service: InterfaceVpcEndpointAwsService.SSM,
    });
    vpc.addInterfaceEndpoint(`${context.localPrefix}-vpc-ie-ssmmessages`, {
      service: InterfaceVpcEndpointAwsService.SSM_MESSAGES,
    });
    vpc.addInterfaceEndpoint(`${context.localPrefix}-vpc-ie-secretmanager`, {
      service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    });
    return vpc;
  }

  private createFlowLogBucket(context: ContextResolver) {
    const bucketName = `${context.localPrefix}-vpc-flow-logs`;
    return new Bucket(this, bucketName, {
      ...conventionalBucketOptions,
      bucketName: bucketName,
      lifecycleRules: [
        {
          id: "transition objects to infrequent access",
          enabled: true,
          transitions: [
            {
              storageClass: StorageClass.INFREQUENT_ACCESS,
              transitionAfter: Duration.days(30),
            },
          ],
        },
        {
          id: "delete old objects",
          enabled: true,
          expiration: Duration.days(2555),
        },
      ],
    });
  }

  get vpc(): Vpc {
    return this._vpc;
  }
}

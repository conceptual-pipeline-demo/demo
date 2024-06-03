import {Duration, Stack} from 'aws-cdk-lib';
import {InstanceType, Peer, Port, SecurityGroup, SubnetType, Vpc} from 'aws-cdk-lib/aws-ec2';
import {IKey} from 'aws-cdk-lib/aws-kms';
import {
  AuroraPostgresEngineVersion,
  ClusterInstance,
  Credentials,
  DatabaseCluster,
  DatabaseClusterEngine,
  Endpoint,
  IClusterEngine,
  IParameterGroup,
  ParameterGroup,
} from 'aws-cdk-lib/aws-rds';
import {Construct} from 'constructs';
import {ContextResolver} from './environments';
import {StrictStackProps} from './strict-types';
import {TagsBuilder} from './tags-builder';
import {ConventionalCmk} from "./constructs/conventional-cmk";

interface AuroraStackProps extends StrictStackProps {
  vpc: Vpc;
  allowIngressFromSecurityGroupIds: string[];
}

export class AuroraStack extends Stack {
  private readonly PORT = 5432;
  private readonly _databaseCluster: DatabaseCluster;

  constructor(scope: Construct, id: string, props: AuroraStackProps) {
    super(scope, id, props);

    const context = new ContextResolver(this.node, props.env);
    const instanceId = `${context.localPrefix}-instance`;

    const cmk = this.createKmsKey(context, props);
    const securityGroup = this.createSecurityGroup(`${context.localPrefix}-db-sg`, props);

    this._databaseCluster = this.createDatabase(context, instanceId, props, cmk.key, securityGroup);

    TagsBuilder.of(this, props.env);
  }

  get readWriteEndpoint(): Endpoint {
    return this._databaseCluster.clusterEndpoint;
  }

  private createDatabase(context: ContextResolver,
                         instanceId: string,
                         props: AuroraStackProps,
                         cmk: IKey,
                         securityGroup: SecurityGroup) {
    const engine = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_14_6,
    });
    const parameterGroup = this.createParameterGroup(`${instanceId}-pg`, engine);

    const clusterId = `${context.localPrefix}-cluster`;
    return new DatabaseCluster(this, clusterId, {
      engine: engine,
      deletionProtection: false,
      parameterGroup: parameterGroup,
      writer: ClusterInstance.provisioned(instanceId, {
        instanceIdentifier: instanceId,
        publiclyAccessible: false,
        instanceType: new InstanceType(context.auroraDb.writerInstanceType),
        autoMinorVersionUpgrade: false,
        enablePerformanceInsights: true,
      }),
      monitoringInterval: Duration.seconds(60),
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      clusterIdentifier: clusterId,
      vpc: props.vpc,
      iamAuthentication: false,
      storageEncrypted: true,
      storageEncryptionKey: cmk,
      backup: {
        retention: Duration.days(10),
        preferredWindow: context.auroraDb.backupWindow,
      },
      port: this.PORT,
      preferredMaintenanceWindow: context.auroraDb.maintenanceWindow,
      securityGroups: [securityGroup],
      credentials: Credentials.fromGeneratedSecret(context.auroraDb.username, {
        secretName: `${context.localPrefix}-aurora-auto-generated-credentials`,
      }),
      defaultDatabaseName: context.auroraDb.defaultDatabaseName,
    });
  }

  private createSecurityGroup(securityGroupName: string, props: AuroraStackProps): SecurityGroup {
    const securityGroup = new SecurityGroup(this, securityGroupName, {
      vpc: props.vpc,
      description: "Security Group for Aurora",
      securityGroupName: securityGroupName,
      allowAllOutbound: false,
    });
    securityGroup.addEgressRule(Peer.anyIpv4(), Port.allTcp())
    props.allowIngressFromSecurityGroupIds.forEach(sgId => {
      securityGroup.addIngressRule(Peer.securityGroupId(sgId), Port.tcp(this.PORT));
    });
    return securityGroup;
  }

  private createKmsKey(context: ContextResolver, props: AuroraStackProps) {
    return new ConventionalCmk(this, `${context.localPrefix}-rds-key`, {
      env: props.env,
      keyName: "rds-key",
    });
  }

  private createParameterGroup(name: string, engine: IClusterEngine): IParameterGroup {
    let parameterGroup = new ParameterGroup(this, name, {
      engine: engine,
      description: name,
    });
    TagsBuilder.addNameTagTo(parameterGroup, name);
    return parameterGroup;
  }
}

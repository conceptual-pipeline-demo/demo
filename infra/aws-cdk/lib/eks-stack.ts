import {CfnOutput, Stack} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {ContextResolver} from './environments';
import {TagsBuilder} from './tags-builder';
import {StrictStackProps} from "./strict-types";
import {AlbControllerVersion, Cluster, KubernetesVersion} from "aws-cdk-lib/aws-eks";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  ISecurityGroup, Port,
  SubnetType,
  Vpc
} from "aws-cdk-lib/aws-ec2";
import {AccountRootPrincipal, Role} from "aws-cdk-lib/aws-iam";
import {KubectlV29Layer} from "@aws-cdk/lambda-layer-kubectl-v29";

interface MasterRoleProps {
  readonly [name: string]: string;
}

interface EksStackProps extends StrictStackProps {
  readonly vpc: Vpc;
  readonly masterRoles: MasterRoleProps;
  readonly dbSecurityGroup: ISecurityGroup;
}

export class EksStack extends Stack {
  constructor(scope: Construct, id: string, props: EksStackProps) {
    super(scope, id, props);

    const context = new ContextResolver(this.node, props.env);

    const kubeCliRole = new Role(this, `${context.localPrefix}-eks-role`, {
      assumedBy: new AccountRootPrincipal(),
      roleName: `eks-role`,
      path: `/${context.localPrefix}/`,
    });

    const cluster = this.createCluster(context, props, kubeCliRole);
    cluster.connections.allowTo(props.dbSecurityGroup, Port.tcp(5432));
    this.createCoreResources(cluster);

    TagsBuilder.of(this, props.env);

    new CfnOutput(this, 'KubeCliRole', {
      value: kubeCliRole.roleArn
    });
  }

  private createCoreResources(cluster: Cluster) {
    cluster.addHelmChart("cluster-autoscaler", {
      chart: "cluster-autoscaler",
      repository: "https://kubernetes.github.io/autoscaler",
      namespace: "kube-system",
      values: {
        autoDiscovery: {
          clusterName: cluster.clusterName,
        },
        awsRegion: this.region,
        extraArgs: {
          "skip-nodes-with-system-pods": false,
        },
      },
    });
    cluster.addManifest(
        'core-namespaces',
        {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name: 'dev'
          },
        },
        {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name: 'uat'
          },
        },
        {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name: 'prod'
          },
        },
    );
    // todo: add pixie, metrics-server, kube-state-metrics, flagger
  }

  private createCluster(context: ContextResolver, props: EksStackProps, kubeCliRole: Role) {
    const kubectlV29Layer = new KubectlV29Layer(this, `${context.localPrefix}-kubectl-layer`);
    const cluster = new Cluster(this, `${context.localPrefix}-eks`, {
      version: KubernetesVersion.V1_29,
      defaultCapacity: 3,
      defaultCapacityInstance: InstanceType.of(InstanceClass.T4G, InstanceSize.MEDIUM),
      vpc: props.vpc,
      vpcSubnets: [{subnetType: SubnetType.PRIVATE_WITH_EGRESS}],
      albController: {
        version: AlbControllerVersion.V2_6_2,
      },
      mastersRole: kubeCliRole,
      clusterName: context.localPrefix,
      kubectlLayer: kubectlV29Layer,
    });
    for (const roleName in props.masterRoles) {
      cluster.awsAuth.addMastersRole(Role.fromRoleArn(this, roleName, props.masterRoles[roleName]));
    }
    return cluster;
  }
}

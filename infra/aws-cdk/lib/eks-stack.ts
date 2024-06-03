import {Stack} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {ContextResolver} from './environments';
import {TagsBuilder} from './tags-builder';
import {StrictStackProps} from "./strict-types";
import {
  AlbControllerVersion,
  Cluster,
  EndpointAccess,
  KubernetesVersion
} from "aws-cdk-lib/aws-eks";
import {InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";
import {Role} from "aws-cdk-lib/aws-iam";
import {AccountRootPrincipal} from "aws-cdk-lib/aws-iam/lib/principals";

interface EksStackProps extends StrictStackProps {
  vpc: Vpc;
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

    new Cluster(this, `${context.localPrefix}-eks`, {
      version: KubernetesVersion.V1_29,
      defaultCapacity: 3,
      defaultCapacityInstance: InstanceType.of(InstanceClass.T4G, InstanceSize.MEDIUM),
      vpc: props.vpc,
      vpcSubnets: [{subnetType: SubnetType.PRIVATE_WITH_EGRESS}],
      endpointAccess: EndpointAccess.PRIVATE,
      albController: {
        version: AlbControllerVersion.V2_6_2,
      },
      mastersRole: kubeCliRole,
    });

    TagsBuilder.of(this, props.env);
  }
}

import { Node } from 'constructs';
import { StrictEnvironment } from './strict-types';

export const defaultEnv: StrictEnvironment = {
  account:
    (process.env.CDK_DEPLOYMENT_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT)!,
  region: (process.env.CDK_DEPLOYMENT_REGION || process.env.CDK_DEFAULT_REGION)!,
};

interface VpcContextVariables {
  readonly cidr: string;
}

interface AuroraContextVariables {
  readonly defaultDatabaseName: string;
  readonly username: string;
  readonly readerInstanceType: string;
  readonly writerInstanceType: string;
  readonly maintenanceWindow: string;
  readonly backupWindow: string;
}

interface CertificateContextVariables {
  readonly subjectAlternativeNames: string[];
  readonly domainName: string;
}

interface AlbContextVariables {
  readonly xOriginKeySecretArn: string;
  readonly certificate: CertificateContextVariables;
}

interface DnsZoneContextVariables {
  readonly id: string;
  readonly name: string;
}

interface ApiGatewayContextVariables {
  readonly domainName: string;
  readonly certificate: CertificateContextVariables;
}

export class ContextResolver {
  private readonly accountLevelConfigs: any;
  private readonly regionalLevelConfigs: any;
  // private readonly region: string;

  constructor(node: Node, env: StrictEnvironment) {
    // this.region = env.region;
    this.accountLevelConfigs = node.getContext("accounts")[env.account];
    this.regionalLevelConfigs = this.accountLevelConfigs["regions"][env.region];
  }

  get apiGateway(): ApiGatewayContextVariables {
    return {
      certificate: {
        subjectAlternativeNames: this.regionalLevelConfigs["api-gateway"]["certificate"]["subject-alternative-names"],
        domainName: this.regionalLevelConfigs["api-gateway"]["domain-name"],
      },
      domainName: this.regionalLevelConfigs["api-gateway"]["domain-name"],
    };
  }

  get environmentName(): string {
    return this.accountLevelConfigs["environment"];
  }

  get localPrefix(): string {
    return this.regionalLevelConfigs["local-prefix"];
  }

  get vpc(): VpcContextVariables {
    return {
      cidr: this.regionalLevelConfigs["vpc-cidr"],
    };
  }

  get auroraDb(): AuroraContextVariables {
    return {
      defaultDatabaseName: this.regionalLevelConfigs["conceptual-pipeline-aurora"]["default-db-name"] || "demo",
      username: this.regionalLevelConfigs["conceptual-pipeline-aurora"]["snapshot-db-username"] || "dbusername",
      readerInstanceType: this.sanitiseDbInstanceType(this.regionalLevelConfigs["conceptual-pipeline-aurora"]["reader-instance-type"]),
      writerInstanceType: this.sanitiseDbInstanceType(this.regionalLevelConfigs["conceptual-pipeline-aurora"]["writer-instance-type"]),
      backupWindow: this.sanitiseDbInstanceType(this.regionalLevelConfigs["conceptual-pipeline-aurora"]["preferred-backup-window"]),
      maintenanceWindow: this.sanitiseDbInstanceType(this.regionalLevelConfigs["conceptual-pipeline-aurora"]["preferred-maintenance-window"]),
    };
  }

  get dnsZone(): DnsZoneContextVariables {
    return {
      id: this.accountLevelConfigs["dns-zone"]["id"],
      name: this.accountLevelConfigs["dns-zone"]["name"],
    };
  }

  get alb(): AlbContextVariables {
    return {
      xOriginKeySecretArn: this.regionalLevelConfigs["alb"]["x-origin-key-secret-arn"],
      certificate: {
        subjectAlternativeNames: this.regionalLevelConfigs["alb"]["certificate"]["subject-alternative-names"],
        domainName: this.regionalLevelConfigs["alb"]["certificate"]["domain-name"],
      },
    };
  }

  private sanitiseDbInstanceType(instanceType: string) {
    return instanceType.replace(/^db\./g, "");
  }
}

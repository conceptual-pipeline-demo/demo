import { Repository, RepositoryEncryption, TagMutability } from 'aws-cdk-lib/aws-ecr';
import { LifecycleRule } from 'aws-cdk-lib/aws-ecr/lib/lifecycle';
import { Construct } from 'constructs';
import { ContextResolver } from '../environments';
import { StrictStackProps } from '../strict-types';

interface EcrRepoProps extends StrictStackProps {
  readonly repoName: string;
  readonly lifecycleRulesOverride?: LifecycleRule[];
}

export class ConventionalEcrRepository extends Construct {
  private readonly _repo: Repository;

  constructor(scope: Construct, id: string, props: EcrRepoProps) {
    super(scope, id);

    const context = new ContextResolver(this.node, props.env);
    const repoName = `${context.localPrefix}-${props.repoName}`;

    this._repo = new Repository(this, `${repoName}-ecr-repo`, {
      repositoryName: repoName,
      encryption: RepositoryEncryption.AES_256,
      imageTagMutability: TagMutability.MUTABLE,
      imageScanOnPush: true,
      lifecycleRules: props.lifecycleRulesOverride || [{
        maxImageCount: 5,
      }],
    });
  }

  get repo(): Repository {
    return this._repo;
  }
}

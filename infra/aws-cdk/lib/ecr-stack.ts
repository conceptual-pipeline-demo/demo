import {Stack} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {ConventionalEcrRepository} from './constructs/conventional-ecr-repository';
import {ContextResolver} from './environments';
import {TagsBuilder} from './tags-builder';
import {StrictStackProps} from "./strict-types";
import {Repository} from "aws-cdk-lib/aws-ecr";

export class EcrStack extends Stack {
  private readonly _repo: ConventionalEcrRepository;

  constructor(scope: Construct, id: string, props: StrictStackProps) {
    super(scope, id, props);

    const context = new ContextResolver(this.node, props.env);

    this._repo = new ConventionalEcrRepository(this, `${context.localPrefix}-ecr`, {
      env: props.env,
      repoName: "conceptual-pipeline-demo-repo",
    });

    TagsBuilder.of(this, props.env);
  }

  get repo(): Repository {
    return this._repo.repo;
  }
}

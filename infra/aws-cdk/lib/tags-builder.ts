import { Stack, Tags } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { ContextResolver } from './environments';
import { StrictEnvironment } from './strict-types';

export class TagsBuilder {
  private readonly tags: Tags;

  private constructor(tags: Tags) {
    this.tags = tags;
  }

  static of(stack: Stack, env: StrictEnvironment): TagsBuilder {
    let tags = Tags.of(stack);
    let context = new ContextResolver(stack.node, env);
    tags.add("env", context.environmentName)
    return new TagsBuilder(tags);
  }

  addService(service: Services) {
    this.tags.add("service", service);
  }

  static addNameTagTo(scope: IConstruct, name: string): Tags {
    let tags = Tags.of(scope);
    tags.add("Name", name);
    return tags;
  }
}

export enum Services {
  DEMO = "demo",
}

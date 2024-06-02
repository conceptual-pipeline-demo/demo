import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IKey, Key } from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';
import { ContextResolver } from '../environments';
import { StrictEnvironment } from '../strict-types';

interface ConventionalKeyProps {
  readonly env: StrictEnvironment;
  readonly keyName: string;
  readonly keyPolicies?: PolicyStatement[];
}

export class ConventionalCmk extends Construct {
  private readonly _key: IKey;

  constructor(scope: Construct, id: string, props: ConventionalKeyProps) {
    super(scope, id);
    const context = new ContextResolver(this.node, props.env);
    const keyName = `${context.localPrefix}-${props.keyName}`;
    this._key = new Key(this, keyName, {
      alias: keyName,
      enableKeyRotation: true,
    });
    if (props.keyPolicies) {
      props.keyPolicies.forEach(policy => this._key.addToResourcePolicy(policy));
    }
  }

  get key(): IKey {
    return this._key;
  }
}

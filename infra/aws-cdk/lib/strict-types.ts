import { Environment, StackProps } from 'aws-cdk-lib';

export interface StrictStackProps extends StackProps {
  readonly env: StrictEnvironment;
}

export interface StrictEnvironment extends Environment {
  readonly account: string;
  readonly region: string;
}

export class RegionalEnvironment implements StrictEnvironment {
  private readonly _account: string;
  private readonly _region: string;

  constructor(account: string, region: string) {
    this._account = account;
    this._region = region;
  }

  get region(): string {
    return this._region;
  }

  get account(): string {
    return this._account;
  }
}

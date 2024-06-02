#!/bin/bash
set -euo pipefail

EXPECTED_AWS_ACCOUNT_ID="160071257600"

SSO_ACCOUNT=$(aws sts get-caller-identity --query "Account" || true)
if [ ${#SSO_ACCOUNT} -eq 14 ]; then
    echo "AWS SSO session still valid. Skipping AWS login..."
else
    echo "AWS SSO session expired. Logging in..."
    aws sso login
fi

ACTUAL_AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
if [ "$EXPECTED_AWS_ACCOUNT_ID" != "$ACTUAL_AWS_ACCOUNT_ID" ]; then
    echo "You are logged into AWS account $ACTUAL_AWS_ACCOUNT_ID. This script is intended to be run from the AWS account $EXPECTED_AWS_ACCOUNT_ID. Exiting."
    exit 1
fi

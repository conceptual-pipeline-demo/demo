#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

STACK_NAME="ConceptualPipelineDemoAccountBootstrap"

"${SCRIPT_DIR}"/../scripts/aws-login.sh

echo "Deploying the bootstrap stack..."
aws cloudformation deploy \
    --region ap-southeast-2 \
    --template-file "${SCRIPT_DIR}/pipeline.yaml" \
    --stack-name "${STACK_NAME}" \
    --capabilities CAPABILITY_NAMED_IAM

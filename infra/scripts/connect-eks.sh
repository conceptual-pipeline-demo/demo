#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

"${SCRIPT_DIR}"/aws-login.sh

aws eks update-kubeconfig \
    --name conceptual-pipeline \
    --region ap-southeast-2 \
    --alias demo-eks \
    --user-alias demo-eks
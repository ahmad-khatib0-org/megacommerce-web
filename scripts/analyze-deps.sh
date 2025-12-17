#!/bin/bash

# Analyze unused dependencies for monorepo workspace
# Since this is a monorepo with single root package.json, analyze at root level
# Results will show all workspace dependencies

set -e

# Check if depcheck is installed globally, if not install it
if ! command -v depcheck &> /dev/null; then
    echo "Installing depcheck..."
    npm install -g depcheck
fi

echo "Analyzing dependencies for monorepo workspace..."
echo "============================================"
echo ""
echo "Note: This is a monorepo with single root package.json"
echo "Results include dependencies for ALL apps and packages"
echo ""

# Run depcheck on the entire repo
depcheck . \
    --ignores="@megacommerce/*,@mantine/*,@radix-ui/*,@tabler/*,@uppy/*,@nestjs/*,@nx/*,@babel/*,@swc/*,@types/*,@testing-library/*,@vitest/*,@eslint/*,next" \
    --ignore-dirs=".nx,.next,.git,dist,node_modules,tmp" \
    || true

echo ""
echo "============================================"
echo "ℹ️  How to use depcheck results (for monorepo):"
echo ""
echo "STEP 1: Review the 'unused dependencies' list"
echo "        Some might be false positives due to:"
echo "        - Dynamic imports (require/import from variables)"
echo "        - Config-loaded modules"
echo "        - Peer dependencies used indirectly"
echo ""
echo "STEP 2: Check if a package is used in specific apps:"
echo "        grep -r 'package-name' apps/ packages/"
echo ""
echo "STEP 3: If truly unused, remove it:"
echo "        pnpm remove unused-package-name"
echo ""
echo "STEP 4: Rebuild Docker image to verify:"
echo "        docker build -f apps/customer-app/Dockerfile.dev -t megacommerce-customer-app ."
echo ""
echo "⚠️  Be especially careful with:"
echo "  - Packages used in config files (next.config.js, etc)"
echo "  - Packages loaded via process.env or NODE_OPTIONS"
echo "  - Packages used only in specific apps"
echo "  - Babel/TypeScript plugins and presets"

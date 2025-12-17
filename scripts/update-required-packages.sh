#!/bin/bash

# Update required-package.json for all apps after adding/removing packages
# Run this after: pnpm add <package> or pnpm remove <package>

set -e

echo "Updating required-package.json for all apps..."
echo ""

node scripts/analyze-imports.js apps/customer-app
echo ""
node scripts/analyze-imports.js apps/home-app
echo ""
node scripts/analyze-imports.js apps/supplier-app
echo ""
node scripts/analyze-imports.js apps/shared-api

echo ""
echo "✅ All required-package.json files updated!"
echo ""
echo "Next steps:"
echo "  1. Review the changes in git"
echo "  2. Commit the updated files"
echo "  3. Rebuild Docker images"

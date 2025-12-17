#!/bin/bash

# Verify all required-package.json files exist and are valid JSON

set -e

echo "🔍 Verifying Docker setup..."
echo ""

ERRORS=0

# Check required-package.json files
echo "✓ Checking required-package.json files..."
echo ""

FILES=(
  "packages/shared/required-package.json"
  "apps/customer-app/required-package.json"
  "apps/home-app/required-package.json"
  "apps/supplier-app/required-package.json"
  "apps/shared-api/required-package.json"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Verify it's valid JSON
    if jq empty "$file" 2>/dev/null; then
      DEPS=$(jq '.dependencies | length' "$file")
      echo "  ✓ $file ($DEPS dependencies)"
    else
      echo "  ✗ $file (Invalid JSON)"
      ERRORS=$((ERRORS + 1))
    fi
  else
    echo "  ✗ $file (NOT FOUND)"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo "✓ Checking Dockerfile.dev files..."
echo ""

DOCKERFILES=(
  "apps/customer-app/Dockerfile.dev"
  "apps/home-app/Dockerfile.dev"
  "apps/supplier-app/Dockerfile.dev"
  "apps/shared-api/Dockerfile.dev"
)

for dockerfile in "${DOCKERFILES[@]}"; do
  if [ -f "$dockerfile" ]; then
    # Check if it has required stages
    if grep -q "FROM.*AS build-shared" "$dockerfile" && \
       grep -q "FROM.*AS app" "$dockerfile" && \
       grep -q "required-package.json" "$dockerfile" && \
       grep -q ".env.development" "$dockerfile" && \
       grep -q ".env.production" "$dockerfile"; then
      echo "  ✓ $dockerfile (has all required stages)"
    else
      echo "  ✗ $dockerfile (missing required content)"
      ERRORS=$((ERRORS + 1))
    fi
  else
    echo "  ✗ $dockerfile (NOT FOUND)"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo "✓ Checking scripts..."
echo ""

SCRIPTS=(
  "scripts/analyze-imports.js"
  "scripts/update-required-packages.sh"
)

for script in "${SCRIPTS[@]}"; do
  if [ -f "$script" ]; then
    echo "  ✓ $script"
  else
    echo "  ✗ $script (NOT FOUND)"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo "✓ Checking environment files in apps..."
echo ""

ENV_REQUIRED=(
  "apps/customer-app/.env.development"
  "apps/customer-app/.env.production"
  "apps/home-app/.env.development"
  "apps/home-app/.env.production"
  "apps/supplier-app/.env.development"
  "apps/supplier-app/.env.production"
  "apps/shared-api/.env.development"
  "apps/shared-api/.env.production"
)

MISSING_ENV=0
for file in "${ENV_REQUIRED[@]}"; do
  if [ ! -f "$file" ]; then
    echo "  ⚠ $file (missing - app may need it)"
    MISSING_ENV=$((MISSING_ENV + 1))
  fi
done

if [ $MISSING_ENV -eq 0 ]; then
  echo "  ✓ All .env files present"
else
  echo "  ⚠ Missing $MISSING_ENV .env files (not critical if env vars are set at runtime)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo "✅ Docker setup is COMPLETE and VALID!"
  echo ""
  echo "Next steps:"
  echo "  1. Commit: git add -A && git commit -m 'Complete Docker setup'"
  echo "  2. Test build: docker build -f apps/customer-app/Dockerfile.dev -t test ."
  echo "  3. Push: git tag v1.0.0 && git push origin v1.0.0"
  exit 0
else
  echo "❌ Found $ERRORS ERROR(S)!"
  echo ""
  echo "Please fix the issues above and run again."
  exit 1
fi

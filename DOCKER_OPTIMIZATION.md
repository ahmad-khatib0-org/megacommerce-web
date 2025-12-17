# Docker Image Optimization

## Problem

Docker images were ~1GB each due to:

- Including all `node_modules` with devDependencies in final image
- Copying all app sources even when only one was needed
- No dependency pruning or optimization

## Solution

### 1. Optimized Dockerfiles (4-Stage Build with `--prod` Only)

**Critical Understanding:**

- **Stages 1-3** are build-cache only (stored locally, NOT pushed to registry)
- **Stage 4 (dev)** is the final image (what gets pushed and downloaded)
- Docker automatically excludes intermediate layers from registry push

**Key Strategy:**

```dockerfile
Stage 1 (deps):      Install full dependencies for building       (~1.5GB cached, NOT pushed)
Stage 2 (build-shared): Build shared library                      (cached, NOT pushed)
Stage 3 (prod-deps):  Install ONLY production deps with --prod   (~300-400MB cached, NOT pushed)
Stage 4 (dev):        Final image using only prod node_modules   (~300-400MB PUSHED & DOWNLOADED)
```

**The Critical Line:**

```dockerfile
RUN pnpm install --frozen-lockfile --prod --prefer-offline
```

The `--prod` flag ensures:

- devDependencies (testing, linting, building tools) are NOT installed
- Only runtime dependencies are included
- No bloated dev tools in the final image

**Expected size: 1GB → 300-400MB per image** (60-70% reduction)

### 2. .dockerignore File

Excludes unnecessary files from Docker build context:

- `.git`, `.nx`, `.next`, `dist`, `.vscode`
- Compiled artifacts, caches, test specs
- Temporary files

Reduces build context size significantly.

### 3. Split GitHub Actions Workflows

Four individual workflows instead of one monolithic build:

- `build-home-app.yml` - Triggers on `dev-home-app-*` tags
- `build-customer-app.yml` - Triggers on `dev-customer-app-*` tags
- `build-supplier-app.yml` - Triggers on `dev-supplier-app-*` tags
- `build-shared-api.yml` - Triggers on `dev-shared-api-*` tags

**Benefits:**

- Builds run in parallel (not sequential)
- Faster total build time
- Each workflow builds only what's needed

## Docker Build Verification

Verify the final image size:

```bash
# Build an image
docker build -f apps/customer-app/Dockerfile.dev -t megacommerce-customer-app .

# Check image size
docker images megacommerce-customer-app
# Output should show ~300-400MB, not 1GB+

# Inspect layers
docker history megacommerce-customer-app
# Only final 'dev' stage layer contributes to download size
```

## Usage

### Building Images Locally

```bash
# Build customer-app image
docker build -f apps/customer-app/Dockerfile.dev -t megacommerce-customer-app .

# Build with buildkit for better caching
DOCKER_BUILDKIT=1 docker build -f apps/home-app/Dockerfile.dev -t megacommerce-home-app .
```

### Pushing to Docker Hub

**Individual app builds (recommended):**

```bash
# Build and push only customer-app
git tag dev-customer-app-v1.0.0
git push origin dev-customer-app-v1.0.0

# Build and push only home-app
git tag dev-home-app-v1.0.0
git push origin dev-home-app-v1.0.0
```

**Full release (builds all apps in parallel):**

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Dockerfile.dev Structure Explained

Each app's Dockerfile follows this pattern:

| Stage | Name | Purpose | Size | Pushed? |
|-------|------|---------|------|---------|
| 1 | `base` | Alpine Node + pnpm | ~200MB | N/A |
| 2 | `deps` | Full workspace install | +1.5GB cache | ❌ |
| 3 | `build-shared` | Build shared library | small | ❌ |
| 4 | `prod-deps` | Prod-only install | +300-400MB cache | ❌ |
| 5 | `dev` | Final image (copies from deps only) | ~300-400MB | ✅ |

**Why Stage 4 matters:**

- Uses `pnpm install --frozen-lockfile --prod`
- Installs ONLY production dependencies
- No dev tools, test runners, linters, build plugins

**What gets downloaded:**

```
Node image: ~200MB
Prod dependencies: ~300-400MB (from Stage 4)
Source code: ~10MB
Total: ~500-600MB (not 1GB+)
```

## Analyzing & Removing Unused Dependencies

### Run Analysis

```bash
./scripts/analyze-deps.sh
```

This script:

- Analyzes the entire monorepo workspace
- Identifies potentially unused packages
- Generates a report (with some false positives expected)

### Safely Remove Unused Packages

```bash
# Check if package is actually used
grep -r "package-name" apps/ packages/

# If truly unused, remove it
pnpm remove unused-package-name

# Rebuild Docker image to verify
docker build -f apps/customer-app/Dockerfile.dev -t megacommerce-customer-app .
```

### Monorepo Considerations

Since this is an Nx monorepo with single root `package.json`:

- Unused packages might be used by specific apps
- Always verify with `grep` before removing
- Pay special attention to:
  - `@nestjs/*` packages (used by shared-api)
  - `@mantine/*`, `@radix-ui/*` (used by Next.js apps)
  - Build tools and presets (tailwindcss, postcss, next, etc.)

## Size Comparison

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Per App Image | ~1GB | ~300-400MB | 60-70% |
| Total (4 apps) | 4GB | 1.2-1.6GB | 60-70% |
| Build time per app | ~12 min | ~8-10 min | 20-30% |
| Download time (4GB → 1.5GB) | Very slow | Fast | 70% reduction |

## Monorepo Structure

This solution properly handles:

- Single root `package.json` (not per-app)
- `packages/shared` - Built library, included in all apps
- `packages/ui` - Shared UI components
- App-specific `config/` and `translations/` directories
- All dependencies at workspace root

## Why This Approach Works

### The Key: `--prod` Flag

Without `--prod`:

```bash
pnpm install --frozen-lockfile  # Installs: @nestjs, @babel, jest, eslint, vite, nx...
```

With `--prod`:

```bash
pnpm install --frozen-lockfile --prod  # Installs: only runtime packages
```

This single flag removes ~1GB of:

- Test frameworks (jest, vitest)
- Build tools (webpack, vite, swc)
- Linters (eslint)
- Type checkers (typescript)
- Development utilities (nx, etc.)

### Layer Optimization

Docker only pushes layers that contribute to the final image:

- Intermediate build stages are cached locally
- Only the final stage content is in the push
- Earlier stages don't add to download size

## Troubleshooting

### Image still large (>500MB)?

1. Verify you're using `--prod` flag:

```dockerfile
RUN pnpm install --frozen-lockfile --prod --prefer-offline
```

1. Check what got installed:

```bash
docker run --rm megacommerce-customer-app ls node_modules | wc -l
```

Should be ~100-150 packages, not 400+

### Build fails in Docker?

1. Check if missing dependencies are in package.json:

```bash
grep "missing-package" package.json
```

1. Verify the build works locally:

```bash
pnpm install
pnpm nx run customer-app:dev
```

1. Check Dockerfile doesn't exclude needed packages

## Notes

- Legacy `build.yml` kept for backwards compatibility
- Use individual workflow files for parallel builds
- Both old (`dev-*`) and new (`dev-app-*`) tag patterns supported
- Run `./scripts/analyze-deps.sh` periodically to identify unused packages
- Consider production Dockerfile variant for even more optimization
  (prod builds should be smaller still)

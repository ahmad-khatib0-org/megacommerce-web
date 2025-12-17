# Docker Layers & Image Size - Visual Explanation

## The Critical Insight

### What Gets Pushed to Registry?
```
┌─────────────────────────────────────────┐
│  Your Docker Image on Docker Hub        │
├─────────────────────────────────────────┤
│                                         │
│  Stage 4 Final (dev):  ~300-400MB ◄─── PUSHED & DOWNLOADED
│  ├── node_modules (prod only)           │
│  ├── App source code                    │
│  ├── Config + translations              │
│  └── Shared library dist/               │
│                                         │
└─────────────────────────────────────────┘

         NOT PUSHED (Build-Cache Only)
              ↓↓↓↓↓↓↓↓↓↓
┌──────────────────────────────────────────┐
│ Your Local Docker Build Cache            │
├──────────────────────────────────────────┤
│                                          │
│ Stage 1 (base):      ~200MB cache only   │
│ ├── Alpine Node                          │
│ ├── pnpm                                 │
│ └── build tools (python, make, g++)      │
│                                          │
│ Stage 2 (deps):      +1.5GB cache only   │
│ ├── Full node_modules (ALL deps!)        │
│ └── Source code + packages               │
│                                          │
│ Stage 3 (build-shared): small cache      │
│ └── Built shared library                 │
│                                          │
│ Stage 4 (prod-deps): +300-400MB cache    │
│ ├── Prod-only node_modules               │
│ └── Source + packages (not used)         │
│                                          │
└──────────────────────────────────────────┘
```

## Key Difference: `--prod` Flag

### Without --prod (OLD - 1GB image):
```
pnpm install --frozen-lockfile
    ↓
node_modules/
├── @babel/             ← UNNECESSARY
├── @swc/               ← UNNECESSARY
├── @nestjs/            ← UNNECESSARY
├── jest/               ← UNNECESSARY (test runner)
├── vitest/             ← UNNECESSARY (test runner)
├── eslint/             ← UNNECESSARY (linter)
├── typescript/         ← UNNECESSARY (type checker)
├── nx/                 ← UNNECESSARY (build tool)
├── webpack/            ← UNNECESSARY (bundler)
├── vite/               ← UNNECESSARY (dev server)
├── ... 400+ total packages
└── Total: ~1.5GB
```

### With --prod (NEW - 300-400MB image):
```
pnpm install --frozen-lockfile --prod
    ↓
node_modules/
├── react/              ← NEEDED (runtime)
├── next/               ← NEEDED (runtime)
├── @mantine/core/      ← NEEDED (UI library)
├── axios/              ← NEEDED (http client)
├── zustand/            ← NEEDED (state)
├── ... ~100-150 total packages
└── Total: ~300-400MB
```

## Layer Sizes Breakdown

```
┌────────────────────────────────────────────┐
│ Final Image Size                           │
├────────────────────────────────────────────┤
│                                            │
│ 1. Node base image      ~200MB             │
│    ├── Alpine Linux                        │
│    ├── Node.js + npm                       │
│    └── Built-in tools                      │
│                                            │
│ 2. Production node_modules ~300-400MB      │
│    ├── React, Next.js                      │
│    ├── UI libraries (@mantine, etc)        │
│    ├── HTTP clients                        │
│    ├── Utilities                           │
│    └── NO dev/test/build tools             │
│                                            │
│ 3. App source code      ~10MB              │
│    ├── customer-app/                       │
│    ├── packages/shared/dist                │
│    ├── config/                             │
│    └── translations/                       │
│                                            │
├────────────────────────────────────────────┤
│ TOTAL PUSHED & DOWNLOADED: ~500-600MB      │
│                                            │
│ (Down from 1GB = 40-50% reduction!)        │
└────────────────────────────────────────────┘
```

## GitHub Actions Workflow Layer Caching

```
Build #1:
┌─────────────────────────────┐
│ GitHub Actions Build Cache  │
├─────────────────────────────┤
│ Stage deps: 1.5GB           │  ← Cached, reused next time
│ Stage build-shared: small   │  ← Cached, reused next time
│ Stage prod-deps: 400MB      │  ← Cached, reused next time
└─────────────────────────────┘
           ↓ Push
    Docker Hub Image
    (~500MB)


Build #2 (after small code change):
┌─────────────────────────────┐
│ GitHub Actions Build Cache  │
├─────────────────────────────┤
│ Stage deps: ✓ REUSED        │  ← Fast! No redownload
│ Stage build-shared: ✓ REUSED│  ← Fast! No recompile
│ Stage prod-deps: ✓ REUSED   │  ← Fast! No reinstall
│ Copy source code: NEW       │  ← Only new part built
└─────────────────────────────┘
           ↓ Push
    Docker Hub Image
    (~500MB - same size)
```

## How pnpm Handles Production Dependencies

```
Monorepo Workspace:
┌──────────────────────────────────┐
│ package.json (root)              │
├──────────────────────────────────┤
│ dependencies:                    │
│   react, next, @mantine, axios   │ ← Keep these
│                                  │
│ devDependencies:                 │
│   @types/*, jest, eslint, nx     │ ← Remove these with --prod
│                                  │
│ packages:                        │
│   ├── shared/ (built lib)        │ ← Include with deps
│   └── ui/                        │ ← Include with deps
│                                  │
│ apps:                            │
│   ├── customer-app/              │ ← Include source
│   ├── home-app/                  │ ← Include source
│   ├── supplier-app/              │ ← Include source
│   └── shared-api/                │ ← Include source
└──────────────────────────────────┘

pnpm install --prod:
    ↓
Only copies:
  ✓ dependencies (all)
  ✓ Shared library dist
  ✗ devDependencies (excluded)
  ✗ Test files
  ✗ Build tools
```

## Real-World Comparison

```
BEFORE Optimization:
docker pull megacommerce-customer-app:latest
  Pulling from docker.io/user/megacommerce-customer-app
  ~1GB ← Slow on weak internet!

AFTER Optimization:
docker pull megacommerce-customer-app:latest
  Pulling from docker.io/user/megacommerce-customer-app
  ~400MB ← Much faster!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Internet Speed: 5 Mbps (weak)

Before:  1GB ÷ 5 Mbps = ~27 minutes wait
After:   400MB ÷ 5 Mbps = ~11 minutes wait

Internet Speed: 100 Mbps (good)

Before:  1GB ÷ 100 Mbps = ~1.3 minutes wait
After:   400MB ÷ 100 Mbps = ~0.5 minutes wait
```

## Summary

| Aspect | Before | After | How It Works |
|--------|--------|-------|--------------|
| Final Image | 1GB | 300-400MB | `pnpm install --prod` |
| Build Cache | All stages | Same | Docker magic (no effect on push) |
| Registry Push | 1GB per app | 300-400MB per app | Smaller layer = faster push |
| Download Time | Slow (4GB for 4 apps) | Fast (1.2-1.6GB for 4 apps) | 60-70% reduction |
| Build Time | 10-15 min | 8-10 min | Less to install |
| Internet (weak) | Not viable | Viable | You can now deploy! |

---

## Verification Command

```bash
# After building:
docker images megacommerce-customer-app

# Should output something like:
REPOSITORY                     TAG      IMAGE ID      CREATED         SIZE
megacommerce-customer-app      latest   abc123def     2 minutes ago    375MB ← This is what matters!
```

If size is >600MB, something went wrong. Check:
1. Are you using `--prod` flag?
2. Is the final layer copying from prod-deps, not deps?
3. Did you run `docker build` with full context?

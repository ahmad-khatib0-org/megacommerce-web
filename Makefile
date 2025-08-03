.PHONY: clean_all

clean_generated:
	rm -rf dist .nx/cache packages/shared/dist apps/home-app/.next
	pnpx nx clear-cache

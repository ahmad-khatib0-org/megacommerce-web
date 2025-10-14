.PHONY: clean_all

clean_generated:
	rm -rf dist .nx apps/home-app/.next apps/supplier-app/.next
	nx reset

build_shared: 
	nx run shared:build --skip-nx-cache

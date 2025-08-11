.PHONY: clean_all

clean_generated:
	rm -rf dist .nx packages/shared/dist apps/home-app/.next apps/supplier-app/.next
	nx reset

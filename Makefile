start:
	npm run build
	npm run start:local

migration_generate:
	npm run migration:generate -- src/migrations/$(filter-out $@,$(MAKECMDGOALS))

migration_create:
	npm run migration:create -- src/migrations/$(filter-out $@,$(MAKECMDGOALS))

%:
	@:

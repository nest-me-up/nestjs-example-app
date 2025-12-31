SERVICE = my_service

start_local:
	npm run build
	npm run start:local

start:
	docker compose up -d

restart:
	npm i && npm run build && docker compose restart $(SERVICE)

stop:
	docker compose down

build:
	docker compose build

migration_generate:
	npm run migration:generate -- src/migrations/$(filter-out $@,$(MAKECMDGOALS))

migration_create:
	npm run migration:create -- src/migrations/$(filter-out $@,$(MAKECMDGOALS))

migrate:
	npm run migration:run

logs:
	docker compose logs -f my_service

%:
	@:

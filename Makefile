.PHONY: up api web down logs

## Start all services (postgresql + api + web)
up:
	docker compose up

## Start only the API (postgresql + api)
api:
	docker compose up postgresql api

## Start only the web app
web:
	docker compose up web

## Stop all services
down:
	docker compose down

## Follow logs for all services
logs:
	docker compose logs -f

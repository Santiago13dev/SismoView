# Makefile para SismoView

.PHONY: help build up down logs clean

help:
	@echo "Comandos disponibles:"
	@echo "  make build  - Construir imágenes Docker"
	@echo "  make up     - Iniciar servicios"
	@echo "  make down   - Detener servicios"
	@echo "  make logs   - Ver logs"
	@echo "  make clean  - Limpiar contenedores y volúmenes"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f
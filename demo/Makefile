#
# GNU Makefile
#


WORKER_DIR := src
DEFAULT_ENV := staging
ENV ?= $(DEFAULT_ENV)  # ...always overriden if set on the CLI.
PATH := ./node_modules/.bin:$(PATH)
SHELL := bash -e

default:
	@echo "Available Targets:"
	@echo
	@echo "  dev - dev"
	@echo "  deploy - deploy"
	@echo "  test - test"
	@echo "  build - build"
	@echo

build:
	pnpm run build

test:
	pnpm run test

dev:
	pnpm run dev

deploy:
	npx wrangler pages deploy dist --project-name cabidela --branch main --skip-caching

.PHONY: deploy test build


# EOF - Makefile

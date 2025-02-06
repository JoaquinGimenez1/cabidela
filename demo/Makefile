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
	wrangler deploy --env $(or $(ENV),$(DEFAULT_ENV))

.PHONY: deploy test build


# EOF - Makefile

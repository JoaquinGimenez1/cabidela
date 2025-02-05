#
# GNU Makefile
#

WORKER_DIR := src
PATH := ./node_modules/.bin:$(PATH)
SHELL := bash -e

default:
	@echo "Available Targets:"
	@echo
	@echo "  test      - test own"
	@echo "  test-ajv  - test with AJV"
	@echo "  test-all  - test own and with AJV"
	@echo "  benchmark - benchmark cabidela, compare with AJV"
	@echo "  build     - build NPM package"
	@echo

test:
	npm run test

test-ajv:
	npm run test-ajv

test-all:
	npm run test-all

benchmark:
	npm run benchmark

build:
	npm run build

.PHONY: test test-ajv test-all benchmark build


# EOF - Makefile

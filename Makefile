.PHONY: all install build start clean

all: install build start

install:
	npm install

build:
	npm run build

start:
	npm start

clean:
	rm -rf dist
	rm -rf node_modules 
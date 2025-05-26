dev:
	npm run dev

host:
	npm run dev -- --host

test:
	ts-node ./src/tests/colorShemes.ts
	ts-node ./src/tests/colorContrast.ts

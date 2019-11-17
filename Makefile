

schema: schema.skema
	cat schema.skema | skema to jsonschema --resolve > example/schema.json

.PHONY: example
example:
	npm i --no-save react react-dom antd styled-components && parcel example/index.html


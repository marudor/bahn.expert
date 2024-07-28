const fs = require('node:fs');
const path = require('node:path');

const filePath = path.resolve(__dirname, '../public/swagger.json');

const content = fs.readFileSync(filePath, 'utf8');

const replacedDollar = content.replaceAll('%24', '$');

const parsed = JSON.parse(replacedDollar);

const sortedPaths = {};

const sortedEntries = Object.entries(parsed.paths);
sortedEntries.sort((a, b) => {
	const aName = a[1].get ? a[1].get.operationId : a[1].post?.operationId;
	const bName = b[1].get ? b[1].get.operationId : b[1].post?.operationId;
	return aName?.toLowerCase() > bName?.toLowerCase() ? 1 : -1;
});

for (const [i, [key, val]] of sortedEntries.entries()) {
	sortedPaths[key] = val;
}

parsed.paths = sortedPaths;

// Workaround for https://github.com/lukeautry/tsoa/issues/833
function convertAnyOfSchemaToDisctriminatedOneOf(schemaName, propertyName) {
	parsed.components.schemas[schemaName].oneOf =
		parsed.components.schemas[schemaName].anyOf;
	parsed.components.schemas[schemaName].anyOf = undefined;

	const discriminator = {
		propertyName,
		mapping: {
			...Object.fromEntries(
				parsed.components.schemas[schemaName].oneOf
					.map((entry) => entry.$ref)
					.filter((ref) => ref.startsWith('#/components/schemas/'))
					.flatMap((ref) => {
						const schemaName = ref.slice('#/components/schemas/'.length);
						const schema = parsed.components.schemas[schemaName];
						const property = schema.properties[propertyName];
						const enumValues = property.enum;

						return enumValues.map((enumValue) => [enumValue, ref]);
					}),
			),
		},
	};

	parsed.components.schemas[schemaName].discriminator = discriminator;
}

convertAnyOfSchemaToDisctriminatedOneOf('RouteJourneySegment', 'type');
convertAnyOfSchemaToDisctriminatedOneOf('SecL', 'type');
convertAnyOfSchemaToDisctriminatedOneOf('RoutingLocationInput', 'type');

fs.writeFileSync(filePath, JSON.stringify(parsed, undefined, 2));

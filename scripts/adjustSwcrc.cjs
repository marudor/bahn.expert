if (process.env.NODE_ENV === 'production') {
  const fs = require('node:fs');
  const json5 = require('json5');
  const path = require('node:path');

  const swcConfig = json5.parse(fs.readFileSync(path.resolve('.swcrc')));
  const originalSWCConfig = json5.parse(
    fs.readFileSync(path.resolve('.swcrc')),
  );

  swcConfig.jsc.experimental.plugins.unshift([
    '@swc/plugin-react-remove-properties',
    {
      properties: ['^data-test'],
    },
  ]);

  fs.writeFileSync(
    path.resolve('.swcrc'),
    JSON.stringify(swcConfig, undefined, 2),
    'utf8',
  );

  const restoreOldConfig = (code) => {
    fs.writeFileSync(
      path.resolve('.swcrc'),
      JSON.stringify(originalSWCConfig, undefined, 2),
      'utf8',
    );
  };
  process.on('beforeExit', restoreOldConfig);
  process.on('exit', restoreOldConfig);
}

const childProcess = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs/promises');
require('./adjustSwcrc.cjs');

const srcFolder = 'src';
const distFolder = 'dist/server';
async function build() {
  const srcPath = path.resolve(srcFolder);
  const folderToBuild = (await fs.readdir(srcPath)).map(
    (f) => `${srcFolder}/${f}`,
  );
  const buildPromises = folderToBuild.map((folder) => {
    const p = childProcess.spawn(
      'swc',
      [
        '-D',
        '--strip-leading-paths',
        '-C',
        'minify=true',
        '-C',
        `env.targets.node=${process.versions.node}`,
        folder,
        '--out-dir',
        distFolder,
      ],
      {
        env: {
          ...process.env,
        },
      },
    );

    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);

    return new Promise((resolve, reject) => {
      p.on('close', (code) => {
        if (code !== 0) {
          reject(code);
        }
        resolve(0);
      });
    });
  });

  await Promise.all(buildPromises);
}

build();

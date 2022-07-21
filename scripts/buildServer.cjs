const childProcess = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs/promises');

// const folderToBuild = ['business-hub', 'oebb', 'sbb', 'server', 'types'].map(
//   (f) => `src/${f}`,
// );

const srcFolder = 'src';
async function build() {
  const srcPath = path.resolve(srcFolder);
  const folderToBuild = (await fs.readdir(srcPath)).map(
    (f) => `${srcFolder}/${f}`,
  );
  const buildPromises = folderToBuild.map((folder) => {
    const p = childProcess.spawn(
      'babel',
      [
        '-x',
        '.ts,.tsx,.js',
        '--root-mode',
        'upward',
        folder,
        '--out-dir',
        folder,
        '--ignore',
        'node_modules/**',
      ],
      {
        env: {
          ...process.env,
          SERVER: folder.endsWith('client') ? 0 : 1,
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

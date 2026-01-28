import { generate } from '@graphql-codegen/cli';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { chdir } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

chdir(projectRoot);

await generate(
  {
    overwrite: true,
    schema: '../graphql-bff/src/main/resources/graphql/**/*.graphqls',
    documents: [resolve(projectRoot, 'services/graphql/queries/**/*.graphql')],
    generates: {
      'services/graphql/': {
        preset: 'client',
        config: {
          skipTypename: true,
        },
      },
    },
  },
  true
);


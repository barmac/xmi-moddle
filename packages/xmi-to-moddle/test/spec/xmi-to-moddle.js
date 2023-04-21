import { writeFileSync } from 'node:fs';

import expect from '../expect.js';
import { readFile } from '../testUtil.js';

import { generateSchemas as generate } from '../../src/index.js';

const DEBUG = process.env.DEBUG;


describe('xmi-to-moddle', function() {

  it('should generate moddle schema for simple XMI file', async function() {

    // given
    const xmi = readFile('test/fixtures/xmi/simple.xmi');

    // when
    const { schemas, warnings } = await generateSchemas(xmi);

    // then
    expect(warnings).to.be.empty;
    expect(schemas).to.eql([
      {
        'name': 'simple',
        'prefix': 'simple',
        'uri': 'https://example.com',

        'types': [
          {
            'name': 'simple',
            'properties': [
              {
                'name': 'id',
                'isAttr': true,
                'isId': true,
                'type': 'String'
              }
            ]
          },
        ],
        'associations': [],
        'enumerations': [],
        'xml': {
          'tagAlias': 'lowerCase'
        }
      }
    ]);
  });


  it('should generate moddle schema for XMI', async function() {

    // given
    const xmi = readFile('test/fixtures/xmi/XMI-model.xmi');

    // when
    const result = await generateSchemas(xmi);

    // then
    expect(result.schemas).to.exist;
    expect(result.warnings).to.be.empty;
  });


  it('should generate moddle schema for DMN 1.4', async function() {

    // given
    const xmi = readFile('test/fixtures/xmi/DMN14.xmi');

    // when
    const result = await generateSchemas(xmi);

    // then
    expect(result.schemas).to.exist;
    expect(result.warnings).to.be.empty;
  });


  it('should generate moddle schema for DMN 1.5', async function() {

    // given
    const xmi = readFile('test/fixtures/xmi/DMN15.xmi');

    // when
    const result = await generateSchemas(xmi);

    // then
    expect(result.schemas).to.exist;
    expect(result.warnings).to.be.empty;
  });


  it('should generate moddle schema for DMNDI 1.5', async function() {

    // given
    const xmi = readFile('test/fixtures/xmi/DMNDI15.xmi');

    // when
    const result = await generateSchemas(xmi);

    // then
    expect(result.schemas).to.exist;
    expect(result.warnings).to.be.empty;
  });
});


// eslint-disable-next-line no-unused-vars
function writeJSON(path, schema) {
  writeFileSync(path, JSON.stringify(schema, null, 2));
}

let index = 0;
async function generateSchemas(xmi) {
  const result = await generate(xmi);

  if (DEBUG) {
    writeJSON(`test/results/${index++}.json`, result);
  }

  return result;
}

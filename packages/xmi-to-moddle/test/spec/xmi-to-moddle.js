import expect from '../expect.js';
import { readFile } from '../testUtil.js';

import { generateSchemas } from '../../src/index.js';


describe('xmi-to-moddle', function() {

  it('should generate moddle schema for XMI', async function() {

    // given
    const xmi = readFile('test/fixtures/xmi/simple.xmi');

    // when
    const result = await generateSchemas(xmi);

    // then
    expect(result).to.exist;
    expect(result).to.eql([
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
});

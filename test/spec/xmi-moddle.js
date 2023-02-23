import expect from '../expect.js';
import { readFile } from '../testUtil.js';

import XmiModdle from '../../lib/index.js';


describe('xmi-moddle', function() {

  let moddle;

  beforeEach(function() {
    moddle = new XmiModdle();
  });


  it.only('should parse mini-XMI', async function() {

    // given
    const xmi = readFile('resources/xmi/XMI-model-mini.xmi');

    // when
    const result = await moddle.fromXML(xmi);

    // then
    for (const warning of result.warnings) {
      console.dir(warning);
    }

    expect(result.warnings).to.be.empty;
  });


  it('should parse', async function() {

    // given
    const xmi = readFile('resources/xmi/XMI-model.xmi');

    // when
    const result = await moddle.fromXML(xmi);

    // then
    for (const warning of result.warnings) {
      console.dir(warning);
    }

    expect(result.warnings).to.be.empty;
  });
});

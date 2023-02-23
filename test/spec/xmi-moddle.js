import expect from '../expect.js';
import { readFile } from '../testUtil.js';

import XmiModdle from '../../lib/index.js';


describe('xmi-moddle', function() {

  let moddle;

  beforeEach(function() {
    moddle = new XmiModdle();
  });


  it('should parse XMI', async function() {

    // given
    const xmi = readFile('resources/xmi/XMI-model.xmi');

    // when
    const result = await moddle.fromXML(xmi);

    // then
    expect(result.warnings).to.be.empty;
  });


  it('should parse DMN 1.5 XMI', async function() {

    // given
    const xmi = readFile('resources/xmi/DMN15.xmi');

    // when
    const result = await moddle.fromXML(xmi);

    // then
    printWarnings(result);
    expect(result.warnings).to.be.empty;
  });


  it('should parse DMNDI 1.5 XMI', async function() {

    // given
    const xmi = readFile('resources/xmi/DMNDI15.xmi');

    // when
    const result = await moddle.fromXML(xmi);

    // then
    expect(result.warnings).to.be.empty;
  });
});

function printWarnings(result) {
  for (let warning of result.warnings) {
    console.log(warning);
  }
}
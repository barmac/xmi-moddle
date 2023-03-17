import { XmiModdle } from './xmi-moddle.js';

import XmiPackage from '../resources/json/xmi.json' assert { type: 'json' };
import UmlPackage from '../resources/json/uml.json' assert { type: 'json' };

const packages = {
  xmi: XmiPackage,
  uml: UmlPackage
};

export default function(additionalPackages, options) {
  const pkgs = Object.assign({}, packages, additionalPackages);

  return new XmiModdle(pkgs, options);
}

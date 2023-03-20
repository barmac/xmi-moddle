# xmi-to-moddle

[![CI](https://github.com/bpmn-io/xmi-moddle/workflows/CI/badge.svg)](https://github.com/bpmn-io/xmi-moddle/actions?query=workflow%3ACI)

Generate moddle schemas from XMI files.

## Usage

```javascript
import { generateSchemas } from 'xmi-to-moddle';

const moddleSchemas = await generateSchemas('<xmi:XMI...');

console.log(moddleSchemas)
/**
 * [
 *   {
 *     ...
 *   },
 *   {
 *     ...
 *   }
 * ]
 */
```

## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).

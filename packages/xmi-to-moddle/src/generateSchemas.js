import XmiModdle from 'xmi-moddle';

const PRIMITIVE_TYPES = {
  'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#Boolean': 'Boolean',
  'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#String': 'String',
  'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#Integer': 'Integer'
};
const UML_TYPES = {
  ...PRIMITIVE_TYPES,
  'http://www.omg.org/spec/UML/20131001/UML.xmi#Element': 'uml:Element'
};

export async function generateSchemas(xmi) {
  const parseResult = await parse(xmi);

  const { elementsById, rootElement } = parseResult;

  const context = {
    elementsById,
    warnings: []
  };

  const extensions = rootElement.get('extensions');

  const schemas = extensions.flatMap(
    extension => handleExtension(extension, context)
  ).filter(Boolean);

  return {
    schemas,
    warnings: context.warnings
  };
}

/**
 * @param {*} extension
 * @param {{ elementsById: object }} context
 */
function handleExtension(extension, context) {
  if (is(extension, 'uml:Model')) {
    return handleModel(extension, context);
  } else if (is(extension, 'uml:Package')) {
    return handlePackage(extension, context);
  }

  return null;
}

function handleModel(model, context) {
  const packagedElements = model.get('packagedElement');

  // model is the only package
  if (packagedElements.some(element => is(element, 'uml:Class'))) {
    return handlePackage(model, context);
  }

  return packagedElements.map(element => {
    if (is(element, 'uml:Package')) {
      return handlePackage(element, context);
    }

    return null;
  });
}

function handlePackage(pkg, context) {
  const schema = {
    name: pkg.name,
    prefix: pkg.name,
    uri: pkg.URI,
    types: [],
    associations: [],
    enumerations: [],
    xml: {
      tagAlias: 'lowerCase'
    }
  };

  const packagedElements = pkg.get('packagedElement');

  packagedElements.forEach(element => handlePackagedElement(element, schema, context));

  return schema;
}

function handlePackagedElement(element, schema, context) {
  if (is(element, 'uml:Class')) {
    handleClass(element, schema, context);
  }
}

function handleClass(classElement, schema, context) {
  const type = {
    name: classElement.name,
    properties: []
  };

  if (classElement.get('isAbstract')) {
    type.isAbstract = true;
  }

  const attributes = classElement.get('ownedAttribute');

  attributes.forEach(attribute => handleAttribute(attribute, type, context));

  schema.types.push(type);
}

function handleAttribute(attribute, moddleType, context) {
  const property = {
    name: attribute.name
  };

  const type = getType(attribute, context);

  if (type.href in UML_TYPES) {
    property.type = UML_TYPES[type.href];
  } else if (is(type, 'uml:PrimitiveType')) {

    // moddle does not distinguish String subtypes
    property.type = 'String';
  } else if (type.name) {
    property.type = type.name;
  } else {
    context.warnings.push(unknownType(type, attribute, moddleType));
  }

  if (isPrimitive(property.type)) {
    property.isAttr = true;
  }

  // heuristic to detect id
  if (/id/i.test(property.name)) {
    property.isId = true;
  }

  const upperValue = attribute.get('upperValue');
  if (upperValue && upperValue.get('value') === '*') {
    property.isMany = true;
  }

  for (const key in property) {
    if (property[key] === false) {
      delete property[key];
    }
  }

  moddleType.properties.push(property);
}

function getType(attribute, context) {
  let type = attribute.type || attribute.get('extensions').find(e => e.$type === 'type');

  const idref = type && type['xmi:idref'];
  if (idref) {
    type = context.elementsById[idref];
  }

  return type;
}

function isPrimitive(type) {
  return Object.values(PRIMITIVE_TYPES).includes(type);
}

function parse(xmi) {
  const moddle = new XmiModdle();

  return moddle.fromXML(xmi);
}

function is(moddleElement, type) {
  return moddleElement.$instanceOf(type);
}

function unknownType(type, attribute, moddleType) {
  return {
    'message': 'unknown type',
    'class': moddleType.name,
    'attribute': attribute.name,
    'type': type
  };
}

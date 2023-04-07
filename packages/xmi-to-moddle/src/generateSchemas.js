import XmiModdle from 'xmi-moddle';

export async function generateSchemas(xmi) {
  const parseResult = await parse(xmi);

  const { rootElement } = parseResult;

  const extensions = rootElement.get('extensions');

  // const models = extensions.filter(el => is(el, 'uml:Model'));
  const packages = extensions.filter(el => is(el, 'uml:Package'));

  const schemas = packages.flatMap(handlePackage);

  return schemas;
}

function handlePackage(pkg) {
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

  packagedElements.forEach(element => handlePackagedElement(element, schema));

  return schema;
}

function handlePackagedElement(element, schema) {
  if (is(element, 'uml:Class')) {
    handleClass(element, schema);
  }
}

function handleClass(classElement, schema) {
  const type = {
    name: classElement.name,
    properties: []
  };

  const attributes = classElement.get('ownedAttribute');

  attributes.forEach(attribute => handleAttribute(attribute, type));

  schema.types.push(type);

}

function handleAttribute(attribute, type) {
  const attributeType = getType(attribute);

  const property = {
    name: attribute.name,
    isAttr: isPrimitive(attributeType),
    isId: attribute.name === 'id',
    type: attributeType
  };

  for (const key in property) {
    if (property[key] === false) {
      delete property[key];
    }
  }

  type.properties.push(property);
}

const PRIMITIVE_TYPES = {
  'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#String': 'String',
  'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#Integer': 'Integer'
};

const UML_TYPES = {
  'http://www.omg.org/spec/UML/20131001/UML.xmi#Element': 'uml:Element'
};

function getType(attribute) {
  const type = attribute.type;

  if (type.href && type.href in PRIMITIVE_TYPES) {
    return PRIMITIVE_TYPES[type.href];
  }

  if (type.href && type.href in UML_TYPES) {
    return UML_TYPES[type.href];
  }

  if (type.idref) {
    return type.idref.name;
  }

  throw new Error(`unknown type: ${attribute.type.$type}`);
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

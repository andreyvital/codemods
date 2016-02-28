/**
 * @param   {Node} specifier
 * @returns {Boolean}
 */
function isDefaultSpecifier(specifier) {
  return specifier.type === 'ImportDefaultSpecifier';
}

/**
 * @param   {Node[]} specifiers
 * @returns {void}
 */
function sortSpecifiers(specifiers) {
  specifiers.sort((a, b) => {
    if (isDefaultSpecifier(a) || isDefaultSpecifier(b)) {
      return 0;
    }

    return a.imported.name.localeCompare(b.imported.name);
  });
}

/**
 * @param   {Function} specification
 * @returns {Function}
 */
function wrap(specification) {
  return (a, b) => {
    const sA = specification(a);
    const sB = specification(b);

    if (typeof sA === 'number' && typeof sB === 'number') {
      return (sA !== sB && sA - sB) || 0;
    }

    return sA && ! sB ? -1 : (sB && ! sA ? 1 : 0);
  };
}

export default (file, api) => {
  const j = api.jscodeshift;

  const declarations = j(file.source).find(j.ImportDeclaration);
  const imports = declarations.nodes();

  imports.forEach(node => sortSpecifiers(node.specifiers));

  const specifications = [
    wrap(node => node.importKind === 'type'),
    wrap(node => node.specifiers.length === 0),
    wrap(node => (node.source.value.match(/(?!\.jsx?)\./g) || []).length),
    wrap(node => node.specifiers.some(isDefaultSpecifier)),
    (a, b) => a.source.value.localeCompare(b.source.value)
  ];

  imports.sort((a, b) => {
    return specifications.reduce(
      (result, specification) => result ? result : specification(a, b),
      0
    );
  });

  return (
    declarations
      .replaceWith(path => imports.shift())
      .toSource()
  );
}

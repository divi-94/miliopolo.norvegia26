const externalProtocols = /^(https?:)?\/\//i;

export default function rehypeExternalLinks() {
  return (tree) => {
    visit(tree);
  };
}

function visit(node) {
  if (node?.type === 'element' && node.tagName === 'a') {
    const href = String(node.properties?.href ?? '');
    node.properties ??= {};
    if (externalProtocols.test(href)) {
      node.properties.target = '_blank';
      node.properties.rel = ['noopener', 'noreferrer'];
      node.properties.className = [...(node.properties.className ?? []), 'link--external'];
    } else if (href.startsWith('tel:')) {
      node.properties.className = [...(node.properties.className ?? []), 'link--phone'];
    } else if (href.startsWith('mailto:')) {
      node.properties.className = [...(node.properties.className ?? []), 'link--email'];
    }
  }
  for (const child of node?.children ?? []) visit(child);
}

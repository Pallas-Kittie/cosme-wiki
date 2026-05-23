// Shared nav renderer
function renderNav(activePage) {
  var pages = [
    { href: '/cosme-wiki/index.html', label: 'Browse', id: 'index' },
    { href: '/cosme-wiki/ingest/index.html', label: 'Add Source', id: 'ingest' }
  ];

  // Detect if running as file:// to adjust hrefs
  var isFile = window.location.protocol === 'file:';
  var base = isFile ? '' : '';

  var links = pages.map(function(p) {
    var href = isFile ? p.href.replace('/cosme-wiki/', '../').replace('/cosme-wiki', '../') : p.href;
    // Simple path resolution for file:// mode
    if (isFile) {
      if (p.id === 'index') href = findRoot() + 'index.html';
      if (p.id === 'ingest') href = findRoot() + 'ingest/index.html';
    }
    return '<a href="' + href + '" class="nav-link' + (activePage === p.id ? ' active' : '') + '">' + p.label + '</a>';
  }).join('');

  var ingestHref = isFile ? findRoot() + 'ingest/index.html' : '/cosme-wiki/ingest/index.html';

  document.getElementById('nav-placeholder').innerHTML =
    '<nav class="nav">' +
      '<a href="' + (isFile ? findRoot() + 'index.html' : '/cosme-wiki/') + '" class="nav-logo">' +
        '<div class="nav-logo-mark">CW</div>' +
        '<span>Cosme Wiki</span>' +
      '</a>' +
      '<div class="nav-links">' + links + '</div>' +
      '<div class="nav-right">' +
        '<a href="' + ingestHref + '" class="btn-ingest">+ Add Source</a>' +
      '</div>' +
    '</nav>';
}

function findRoot() {
  // Returns relative path to E:/cosme-wiki/ root from current page
  var path = window.location.pathname;
  var segments = path.split('/').filter(function(s) { return s.length > 0; });
  // Find cosme-wiki in path
  var idx = -1;
  for (var i = 0; i < segments.length; i++) {
    if (segments[i].toLowerCase() === 'cosme-wiki') { idx = i; break; }
  }
  if (idx === -1) return './';
  var depth = segments.length - idx - 2; // how many folders below root
  if (depth <= 0) return './';
  var up = '';
  for (var j = 0; j < depth; j++) up += '../';
  return up;
}

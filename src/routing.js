export function navigate(hash) {
  window.location.hash = hash;
}

export function getRoute(currentUser) {
  const hash = window.location.hash.replace(/^#\/?/, '');

  if (!currentUser) {
    return { name: 'auth' };
  }

  if (hash === '' || hash === 'projects') {
    return { name: 'list' };
  }

  if (hash === 'projects/new') {
    return { name: 'new' };
  }

  const match = hash.match(/^projects\/([a-z0-9]+)$/);

  if (match) {
    return {
      name: 'detail',
      id: match[1],
    };
  }

  return { name: 'list' };
}
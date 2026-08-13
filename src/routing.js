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

  // Sửa: chấp nhận UUID (hex + dấu gạch ngang), trước đây chỉ khớp [a-z0-9]
  const match = hash.match(/^projects\/([0-9a-fA-F-]{36})$/);

  if (match) {
    return {
      name: 'detail',
      id: match[1],
    };
  }

  return { name: 'list' };
}
import { STATUS_ORDER } from './constants';
import { PROJECT_STATUS_ORDER } from './constants';


export function statusIndex(status) {
  // return STATUS_ORDER.indexOf(status);
  return PROJECT_STATUS_ORDER.indexOf(status);
}

export function snippet(text, n) {
  const s = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();

  return s.length > n ? `${s.slice(0, n)}…` : s;
}

export function escapeHtml(s) {
  return String(s == null ? '' : s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c],
  );
}

export const isStale = (project) => {
  // Nếu không đang running, ko stale
  if (project.stepState !== 'RUNNING') {
    return false;
  }

  // Nếu vừa mới bắt đầu (< 12 giây), ko stale
  if (!project.stepStartedAt) {
    return false;
  }

  const elapsedMs = Date.now() - project.stepStartedAt;
  return elapsedMs > 12000;
};

export function getInitials(name = '') {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

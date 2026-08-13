// Backend base URL — dùng để build full URL cho ảnh (backend serve ảnh ở port 8080, khác port FE)
export const API_BASE_URL = 'http://localhost:8080';

// project.status (backend) -> step KEY hiện tại cần chạy tiếp
// Giữ đúng key STYLE/CHARACTERS/PORTRAITS/CHAPTERS/ILLUSTRATIONS/DONE
// để khớp với STEPS constant + Stepper/StepPanel đã có sẵn.
const STATUS_TO_NEXT_STEP = {
  CREATED: 'STYLE',
  STYLE_SET: 'CHARACTERS',
  CHARACTERS_GENERATED: 'PORTRAITS',
  PORTRAITS_GENERATED: 'CHAPTERS',
  CHAPTERS_GENERATED: 'ILLUSTRATIONS',
  DONE: 'DONE',
};

// step KEY -> tên endpoint backend (lowercase, khớp route /steps/{name}/run)
const STEP_KEY_TO_ENDPOINT = {
  STYLE: 'style',
  CHARACTERS: 'characters',
  PORTRAITS: 'portraits',
  CHAPTERS: 'chapters',
  ILLUSTRATIONS: 'illustrations',
};

export function nextStepKeyFromStatus(status) {
  return STATUS_TO_NEXT_STEP[status] || 'STYLE';
}

export function endpointForStepKey(stepKey) {
  return STEP_KEY_TO_ENDPOINT[stepKey];
}

export function toAbsoluteImageUrl(relativeUrl) {
  if (!relativeUrl) return null;
  return `${API_BASE_URL}${relativeUrl}`;
}
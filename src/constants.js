export const DB_KEY = 'book-illustration-studio';

export const DEFAULT_STYLE = '';

export const STEPS = [
  {
    key: 'STYLE',
    status: 'STYLE',
    label: 'Style',
    number: 1,
  },
  {
    key: 'CHARACTERS',
    status: 'CHARACTERS',
    label: 'Characters',
    number: 2,
  },
  {
    key: 'PORTRAITS',
    status: 'PORTRAITS',
    label: 'Portraits',
    number: 3,
  },
  {
    key: 'CHAPTERS',
    status: 'CHAPTERS',
    label: 'Chapters',
    number: 4,
  },
  {
    key: 'ILLUSTRATIONS',
    status: 'ILLUSTRATIONS',
    label: 'Illustrations',
    number: 5,
  },
];

export const STATUS_ORDER = STEPS.map((step) => step.status);

export const CAPTION_MAP = {
  STYLE: 'Choosing the art direction',
  CHARACTERS: 'Generating character descriptions',
  PORTRAITS: 'Generating character portraits',
  CHAPTERS: 'Analyzing the book chapters',
  ILLUSTRATIONS: 'Generating chapter illustrations',
};
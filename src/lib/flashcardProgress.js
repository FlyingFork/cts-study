const STORAGE_KEY = 'cts.flashcardProgress.v1';
const VALID_STATUSES = new Set(['new', 'learning', 'known']);

function canUseStorage() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function readProgress() {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

function writeProgress(progress) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Treat blocked storage the same as no saved progress.
  }
}

export function getFlashcardProgress() {
  return readProgress();
}

export function getFlashcardStatus(slug) {
  const entry = readProgress()[slug];

  if (!entry || !VALID_STATUSES.has(entry.status)) {
    return 'new';
  }

  return entry.status;
}

export function setFlashcardStatus(slug, status) {
  const nextStatus = VALID_STATUSES.has(status) ? status : 'new';
  const progress = readProgress();
  const nextProgress = {
    ...progress,
    [slug]: {
      status: nextStatus,
      updatedAt: Date.now(),
    },
  };

  writeProgress(nextProgress);
  return nextProgress;
}

export function resetFlashcardProgress() {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to reset when storage is blocked.
  }
}

export function useScrollLock(isLocked) {
  const body = document.body
  if (isLocked) {
    body.style.overflow = 'hidden'
  } else {
    body.style.overflow = ''
  }
}

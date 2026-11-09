function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null
}

export function requestFullscreen(element) {
  if (!element || fullscreenElement()) return
  const request = element.requestFullscreen?.bind(element)
    ?? element.webkitRequestFullscreen?.bind(element)
    ?? element.mozRequestFullScreen?.bind(element)
    ?? element.msRequestFullscreen?.bind(element)
  const result = request?.()
  result?.catch?.(() => {})
}

export function exitFullscreen() {
  if (!fullscreenElement()) return
  const exit = document.exitFullscreen?.bind(document)
    ?? document.webkitExitFullscreen?.bind(document)
    ?? document.mozCancelFullScreen?.bind(document)
    ?? document.msExitFullscreen?.bind(document)
  const result = exit?.()
  result?.catch?.(() => {})
}

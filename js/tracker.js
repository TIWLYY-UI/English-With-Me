const TRACKER_URL = 'https://script.google.com/macros/s/AKfycbziE5CVCOLnoYEhowwJJ1g29VxT5iyBIvjmGg6gPJHi0Hnbk8LtslSoa7oVKwJAJGNE/exec'

function trackVisit() {
  const data = {
    page: location.pathname.split('/').pop() || 'index.html',
    device: window.innerWidth < 680 ? 'mobile' : 'desktop',
  }
  fetch(TRACKER_URL, {
    method: 'POST',
    body: JSON.stringify(data)
  }).catch(() => {})
}

document.addEventListener('DOMContentLoaded', trackVisit)
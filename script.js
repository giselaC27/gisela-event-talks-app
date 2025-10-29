document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('search');
  let talks = [];

  fetch('talks.json')
    .then(response => response.json())
    .then(data => {
      talks = data;
      displayTalks(talks);
    });

  function displayTalks(talksToDisplay) {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date('2025-10-29T10:00:00');

    talksToDisplay.forEach((talk, index) => {
      const talkElement = document.createElement('div');
      talkElement.classList.add('talk');

      const startTime = new Date(currentTime);
      const endTime = new Date(currentTime.getTime() + talk.duration * 60000);

      talkElement.innerHTML = `
        <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
        <h2>${talk.title}</h2>
        <div class="speakers">By: ${talk.speakers.join(', ')}</div>
        <div class="category">${talk.category.map(c => `<span>${c}</span>`).join(' ')}</div>
        <p>${talk.description}</p>
      `;

      scheduleContainer.appendChild(talkElement);

      currentTime = new Date(endTime.getTime() + 10 * 60000);

      if (index === 2) {
        const lunchBreakElement = document.createElement('div');
        lunchBreakElement.classList.add('talk');
        const lunchStartTime = new Date(currentTime);
        const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
        lunchBreakElement.innerHTML = `
        <div class="time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
        <h2>Lunch Break</h2>
        `;
        scheduleContainer.appendChild(lunchBreakElement);
        currentTime = lunchEndTime;
      }
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  searchInput.addEventListener('input', e => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTalks = talks.filter(talk => {
      return talk.category.some(c => c.toLowerCase().includes(searchTerm));
    });
    displayTalks(filteredTalks);
  });
});

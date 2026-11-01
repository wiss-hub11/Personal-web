document.addEventListener('DOMContentLoaded', () => {
  const CORRECT_PIN = "0211";
  let currentPin = "";

  const letterPages = [
    "There's something I've been waiting to tell you for a while. Mungkin ini cuma surat sederhana, tapi every single word comes straight from my heart.\n\nSo... will you read it until the end?",
    "Happy 18th Birthday to my favorite person, Dasinn! May this new chapter bring you so much joy and success. I'm so proud of you, and I’ll always be right here supporting you!!",
    "Thank you for being someone who has brought so much warmth into my life. Entah kamu sadar atau tidak, keberadaanmu selalu berhasil membuat hari-hariku terasa lebih indah.",
    "Meeting you is one of the best things that has ever happened to me. I hope life always gives you reasons to smile. Thank you for being you."
  ];
  let currentLetterIdx = 0;

  // --- Fungsi Utama ---
  function pressKey(num) {
    if (currentPin.length < 4) {
      currentPin += num;
      updateDots();
    }

    if (currentPin.length === 4) {
      setTimeout(checkPin, 300);
    }
  }

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      if (idx < currentPin.length) {
        dot.classList.add('filled');
        dot.innerText = '♥';
      } else {
        dot.classList.remove('filled');
        dot.innerText = '';
      }
    });
  }

  function checkPin() {
    if (currentPin === CORRECT_PIN) {
      document.getElementById('modal-success').classList.add('show');
    } else {
      document.getElementById('modal-wrong').classList.add('show');
    }
  }

  function closeModal(id) {
    document.getElementById(id).classList.remove('show');
    currentPin = "";
    updateDots();
  }

  function switchScreen(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    document.getElementById(toId).classList.add('active');
  }

  function goToEnvelope() {
    closeModal('modal-success');
    switchScreen('screen-pin', 'screen-envelope');
  }

  function openEnvelope() {
    switchScreen('screen-envelope', 'screen-letter');
    showLetter();
  }

  function showLetter() {
    document.getElementById('letter-text').innerText = letterPages[currentLetterIdx];
  }

  function nextLetterPage() {
    currentLetterIdx++;
    if (currentLetterIdx < letterPages.length) {
      showLetter();
    } else {
      switchScreen('screen-letter', 'screen-menu');
    }
  }

  function showSubScreen(screenName) {
    const screens = ['menu', 'memories', 'flowers', 'playlist'];
    screens.forEach(s => {
      document.getElementById(`screen-${s}`).classList.remove('active');
    });
    document.getElementById(`screen-${screenName}`).classList.add('active');
  }

  // --- Logika Audio / Pemutar Musik ---
  const bgMusic = document.getElementById('bg-music');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const vinylDisc = document.getElementById('vinyl-disc');
  const progressFill = document.getElementById('progress-fill');
  const progressDot = document.getElementById('progress-dot');
  const progressBarContainer = document.querySelector('.progress-bar-container');

  if (playPauseBtn && bgMusic) {
    playPauseBtn.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          playPauseBtn.innerText = '⏸';
          vinylDisc.classList.add('spinning');
        }).catch(err => {
          console.log("Gagal memutar audio:", err);
        });
      } else {
        bgMusic.pause();
        playPauseBtn.innerText = '▶';
        vinylDisc.classList.remove('spinning');
      }
    });

    // Update progress bar saat lagu berjalan
    bgMusic.addEventListener('timeupdate', () => {
      if (bgMusic.duration) {
        const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressFill.style.width = percent + '%';
        progressDot.style.left = percent + '%';
      }
    });

    // Ketika lagu selesai
    bgMusic.addEventListener('ended', () => {
      playPauseBtn.innerText = '▶';
      vinylDisc.classList.remove('spinning');
      progressFill.style.width = '0%';
      progressDot.style.left = '0%';
    });

    // Klik pada progress bar untuk melompat ke durasi tertentu
    progressBarContainer.addEventListener('click', (e) => {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      if (bgMusic.duration) {
        bgMusic.currentTime = (clickX / width) * bgMusic.duration;
      }
    });
  }

  // --- Event Listeners ---
  
  // Tombol Keypad
  document.querySelectorAll('.keypad .key').forEach(key => {
    key.addEventListener('click', () => {
      const keyValue = key.getAttribute('data-key');
      pressKey(keyValue);
    });
  });

  // Modal Try Again
  document.getElementById('btn-try-again').addEventListener('click', () => {
    closeModal('modal-wrong');
  });

  // Modal Success / Open Surprise
  document.getElementById('btn-open-surprise').addEventListener('click', () => {
    goToEnvelope();
  });

  // Buka Envelope
  document.getElementById('envelope-btn').addEventListener('click', () => {
    openEnvelope();
  });

  // Next Letter Page
  document.getElementById('btn-next-letter').addEventListener('click', () => {
    nextLetterPage();
  });

  // Menu Navigation Cards
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetSubScreen = card.getAttribute('data-subscreen');
      showSubScreen(targetSubScreen);
    });
  });

  // Back Buttons
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSubScreen = btn.getAttribute('data-back');
      showSubScreen(targetSubScreen);
    });
  });
});

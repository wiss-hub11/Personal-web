document.addEventListener('DOMContentLoaded', () => {
  const CORRECT_PIN = "0709";
  let currentPin = "";

  const letterPages = [
    "There's something I've been waiting to tell you for a while. Mungkin ini cuma surat sederhana, tapi every single word comes straight from my heart.\n\nSo... will you read it until the end?",
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

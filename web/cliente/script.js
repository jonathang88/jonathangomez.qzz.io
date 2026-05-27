  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  sections.forEach(s => observer.observe(s));

  // ── PILL TOGGLE ──
  // Listen to the checkbox change event (not click on label, which double-fires)
  document.querySelectorAll('.check-pill input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const pill = checkbox.closest('.check-pill');
      if (checkbox.checked) {
        pill.classList.add('selected');
      } else {
        pill.classList.remove('selected');
      }
      updateProgress();
    });
  });

  // ── PROGRESS ──
  function updateProgress() {
    const required = document.querySelectorAll('input[required]');
    const filled = Array.from(required).filter(i => i.value.trim() !== '').length;
    const totalChecked = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const textFilled = Array.from(document.querySelectorAll('input[type="text"]:not([required]), input[type="email"]:not([required]), input[type="number"], textarea, select'))
      .filter(i => i.value.trim() !== '').length;

    const total = required.length + 12;
    const done = filled + Math.min(totalChecked, 7) + Math.min(textFilled, 5);
    const pct = Math.min(Math.round((done / total) * 100), 100);

    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressPct').textContent = pct + '%';
  }

  document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea, select').forEach(el => {
    el.addEventListener('input', updateProgress);
    el.addEventListener('change', updateProgress);
  });

  // ── SUBMIT ──
  const form = document.getElementById('briefingForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const errDiv = document.getElementById('errorMsg');
    errDiv.classList.remove('visible');

    // Validate required
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!nombre || !email) {
      errDiv.textContent = 'Por favor ingresa tu nombre y correo electrónico.';
      errDiv.classList.add('visible');
      document.getElementById('nombre').focus();
      return;
    }

    btn.textContent = 'Enviando…';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.display = 'none';
        document.getElementById('successMsg').classList.add('visible');
        document.getElementById('progressFill').style.width = '100%';
        document.getElementById('progressPct').textContent = '100%';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      errDiv.textContent = 'Hubo un problema al enviar. Por favor intenta de nuevo o contáctanos directamente.';
      errDiv.classList.add('visible');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg> Enviar briefing`;
      btn.disabled = false;
    }
  });
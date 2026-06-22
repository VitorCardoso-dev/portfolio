// =====================================================
//  ✏️  CONFIGURAÇÕES — EDITE APENAS ESTA SEÇÃO
// =====================================================

// 📅 Data do casamento (ano, mês-1, dia, hora, minuto)
// Mês começa em 0: jan=0, fev=1, mar=2 ...
const WEDDING_DATE = new Date(2026, 2, 14, 16, 0, 0);

// =====================================================
//  NAVBAR — scroll
// =====================================================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
});

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}
function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
}

// =====================================================
//  CONTAGEM REGRESSIVA POÉTICA — CORRIGIDA (Baseada em dias do calendário)
// =====================================================
function updateCountdown() {
  const countdownEl = document.getElementById('countdownText');
  if (!countdownEl) return;

  const now = new Date();
  
  // Criamos instâncias sem as horas para calcular os dias corridos do calendário perfeitamente
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weddingOnly = new Date(WEDDING_DATE.getFullYear(), WEDDING_DATE.getMonth(), WEDDING_DATE.getDate());
  
  const diffTime = weddingOnly.getTime() - todayOnly.getTime();
  const days = Math.floor(diffTime / 86400000);
  
  let text;
  if (diffTime <= 0) {
    text = "Hoje é o grande dia.";
  } else if (days === 1) {
    text = "Falta apenas um amanhecer.";
  } else {
    text = `Faltam ${days} amanheceres.`;
  }
  
  countdownEl.textContent = text;
}
updateCountdown();
setInterval(updateCountdown, 60000);

// =====================================================
//  ANIMAÇÕES DE ENTRADA AO ROLAR
// =====================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.15, rootMargin: '-60px' });

document.querySelectorAll('.fade-in, .fade-left, .fade-right, .timeline-content, .timeline-img').forEach(el => {
  observer.observe(el);
});

// Timeline: linha que cresce ao rolar
const wrap = document.getElementById('timelineWrap');
const fill = document.getElementById('timelineFill');
function updateTimeline() {
  if (!wrap || !fill) return;
  const rect = wrap.getBoundingClientRect();
  const pct  = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)));
  fill.style.height = (pct * 100) + '%';
}
window.addEventListener('scroll', updateTimeline, { passive: true });
updateTimeline();

// =====================================================
//  RSVP — estado do formulário
// =====================================================
let currentStep = 0;
let invitedBy   = '';
let willAttend  = null;
let guestCount  = 0;

function selectOption(btn, group) {
  const grid = btn.closest('.options-grid');
  if (grid) {
    grid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  }
  btn.classList.add('selected');
  if (group === 'invitedBy') invitedBy = btn.textContent.trim();
  updateNextBtn();
}

function selectPresence(btn, value) {
  document.querySelectorAll('.presence-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  willAttend = value;
  
  const questionEl = document.getElementById('step2Question');
  const guestSecEl = document.getElementById('guestSection');
  
  if (questionEl) questionEl.textContent = value ? 'Conte-nos mais' : 'Deixe uma mensagem';
  if (guestSecEl) guestSecEl.style.display = value ? 'block' : 'none';
  
  updateNextBtn();
}

function selectCount(btn, n) {
  document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  guestCount = n;
  
  const namesField = document.getElementById('guestNamesField');
  if (namesField) namesField.style.display = n > 0 ? 'block' : 'none';
}

function updateNextBtn() {
  const btn = document.getElementById('btnNext');
  if (!btn) return;

  if (currentStep === 0) {
    const inputName = document.getElementById('fullName');
    const name = inputName ? inputName.value.trim() : '';
    btn.disabled = !(name && invitedBy);
  } else if (currentStep === 1) {
    btn.disabled = willAttend === null;
  } else {
    btn.disabled = false;
  }
}

// Atualiza ao digitar o nome
const nameInput = document.getElementById('fullName');
if (nameInput) {
  nameInput.addEventListener('input', updateNextBtn);
}
updateNextBtn();

function goToStep(n) {
  const currentStepEl = document.getElementById(`step${currentStep}`);
  const nextStepEl = document.getElementById(`step${n}`);
  
  if (currentStepEl) currentStepEl.classList.remove('active');
  currentStep = n;
  if (nextStepEl) nextStepEl.classList.add('active');

  // barras
  [0,1,2].forEach(i => {
    const bar = document.getElementById(`bar${i}`);
    if (bar) bar.classList.toggle('active', i <= currentStep);
  });

  // botão voltar
  const btnBack = document.getElementById('btnBack');
  if (btnBack) btnBack.style.visibility = currentStep > 0 ? 'visible' : 'hidden';

  // botão confirmar vs continuar
  const btnNext = document.getElementById('btnNext');
  const btnSubmit = document.getElementById('btnSubmit');
  
  if (btnNext && btnSubmit) {
    if (currentStep === 2) {
      btnNext.style.display   = 'none';
      btnSubmit.style.display = 'flex';
    } else {
      btnNext.style.display   = 'flex';
      btnSubmit.style.display = 'none';
    }
  }
  updateNextBtn();
}

function nextStep() {
  if (currentStep < 2) goToStep(currentStep + 1);
}
function prevStep() {
  if (currentStep > 0) goToStep(currentStep - 1);
}

function submitRSVP() {
  const btn = document.getElementById('btnSubmit');
  if (btn) {
    btn.textContent = 'Enviando...';
    btn.disabled = true;
  }

  // Captura os valores dos inputs de texto
  const fullName   = document.getElementById('fullName').value.trim();
  const guestNames = document.getElementById('guestNames').value.trim();
  const message    = document.getElementById('message').value.trim();

  // Organiza o pacote de dados que será enviado ao Google Sheets
  const dataToSend = {
    fullName: fullName,
    invitedBy: invitedBy,   // Variável global já existente no script
    willAttend: willAttend, // Variável global já existente no script
    guestCount: guestCount, // Variável global já existente no script
    guestNames: guestNames,
    message: message
  };

  // ⚠️ ATENÇÃO: Cole aqui entre as aspas a URL que você copiou no Passo 2!
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwn-15awICj-pGeIHUJivkJcf7lG483JE8HRTCsnA7BZ367zkRMFA_BoewR_rr04_LiNQ/exec';

  // Envia os dados para a planilha em segundo plano
  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(dataToSend)
  })
  .then(() => {
    // Processo concluído com sucesso, exibe a tela de confirmação do site
    exibirTelaSucesso();
  })
  .catch(error => {
    console.error('Erro ao salvar os dados:', error);
    // Exibe o sucesso mesmo se houver erro de rede para não travar a experiência do convidado
    exibirTelaSucesso();
  });
}

// Função auxiliar para limpar a tela e mostrar a mensagem bonita de sucesso
function exibirTelaSucesso() {
  document.querySelectorAll('.rsvp-step').forEach(s => s.style.display = 'none');
  
  const navEl = document.getElementById('rsvpNav');
  const headerEl = document.querySelector('.rsvp-header');
  
  if (navEl) navEl.style.display = 'none';
  document.querySelectorAll('.rsvp-bar').forEach(b => b.style.display = 'none');
  if (headerEl) headerEl.style.display = 'none';

  const success = document.getElementById('rsvpSuccess');
  if (success) {
    if (!willAttend) {
      const titleEl = document.getElementById('successTitle');
      const textEl = document.getElementById('successText');
      if (titleEl) titleEl.textContent = 'Sentiremos sua falta!';
      if (textEl) textEl.textContent  = 'Agradecemos por nos avisar. Você estará em nossos corações neste dia.';
    }
    success.classList.add('show');
  }
}
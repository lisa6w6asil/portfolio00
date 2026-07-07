// Boot animation
(function() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bootScreen = document.getElementById('boot-screen');
  if (reduceMotion) {
    bootScreen.style.display = 'none';
    return;
  }

  const linesEl = document.getElementById('boot-lines');
  const barFill = document.getElementById('boot-bar-fill');
  const lines = [
    { text: '> booting portfolio.sys', ok: false },
    { text: '> loading modules ... OK', ok: true },
    { text: '> mounting ~/work ~/about ~/skill ~/contact', ok: false },
    { text: '> starting UI ... OK', ok: true },
    { text: '> welcome, guest_', ok: true }
  ];

  let i = 0;
  function showNext() {
    if (i >= lines.length) {
      setTimeout(() => bootScreen.classList.add('hide'), 400);
      return;
    }
    const div = document.createElement('div');
    div.className = 'boot-line' + (lines[i].ok ? ' ok' : '');
    div.textContent = lines[i].text;
    linesEl.appendChild(div);
    requestAnimationFrame(() => div.classList.add('show'));
    barFill.style.width = Math.round(((i + 1) / lines.length) * 100) + '%';
    i++;
    setTimeout(showNext, 320);
  }
  showNext();
})();

// Nav + content switching
const items = document.querySelectorAll('.nav-item');
const terminalPath = document.getElementById('terminal-path');
const terminalCmd = document.getElementById('terminal-cmd');
const entrySubs = document.querySelectorAll('.entry-sub');
const entryList = document.getElementById('entry-list');
const aboutContent = document.getElementById('about-content');

const aboutLines = [
  { text: '$ cat about.md', type: 'cmd' },
  { text: '', type: 'blank' },
  { label: 'name', value: 'ああああ' },
  { label: 'career', value: '登録販売者・生命保険販売員としての経験を経て、開発エンジニアへ転向。' },
  { label: 'motto', value: "異なる分野を見てきたからこそ、'使う人の立場'を考えたものづくりを大切にしています。" },
  { text: '', type: 'blank' },
  { text: '$ ls certifications/', type: 'cmd' },
  { text: '登録販売者.cert', type: 'plain' },
  { text: 'FP技能検定3級.cert', type: 'plain' },
  { text: 'ITパスポート.cert', type: 'plain' },
  { text: 'JavaSE17Silver.cert', type: 'plain' }
];

let aboutTyping = false;

function typeAbout() {
  if (aboutTyping) return;
  aboutTyping = true;
  aboutContent.innerHTML = '';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let li = 0;
  function nextLine() {
    if (li >= aboutLines.length) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      aboutContent.appendChild(cursor);
      aboutTyping = false;
      return;
    }
    const item = aboutLines[li];

    if (item.type === 'blank') {
      const div = document.createElement('div');
      div.className = 'type-line blank';
      aboutContent.appendChild(div);
      li++;
      setTimeout(nextLine, 80);
      return;
    }

    const lineDiv = document.createElement('div');
    lineDiv.className = 'type-line' + (item.type === 'cmd' ? ' cmd' : '');
    aboutContent.appendChild(lineDiv);

    let prefix = '';
    let body = '';
    if (item.label) {
      prefix = item.label + ': ';
      body = item.value;
    } else {
      body = item.text;
    }

    const full = prefix + body;

    if (reduceMotion) {
      lineDiv.innerHTML = item.label ? `<span class="label">${item.label}</span>: ${body}` : full;
      li++;
      nextLine();
      return;
    }

    let ci = 0;
    const speed = 28;
    const timer = setInterval(() => {
      ci++;
      lineDiv.textContent = full.slice(0, ci);
      if (ci >= full.length) {
        clearInterval(timer);
        if (item.label) {
          lineDiv.innerHTML = `<span class="label">${item.label}</span>: ${body}`;
        }
        li++;
        setTimeout(nextLine, 180);
      }
    }, speed);
  }
  nextLine();
}

items.forEach(item => {
  item.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const label = item.dataset.label;
    terminalPath.textContent = `~/${label.toLowerCase()}`;
    terminalCmd.textContent = `cat ${label.toLowerCase()}.md`;

    if (label === 'ABOUT') {
      entryList.style.display = 'none';
      aboutContent.classList.add('active');
      typeAbout();
    } else {
      aboutContent.classList.remove('active');
      entryList.style.display = 'flex';
      entrySubs.forEach((sub, i) => {
        const num = String(i + 1).padStart(2, '0');
        sub.textContent = `# ${num} — ${label} の内容は準備中です`;
      });
    }
  });
});

const dirs = [
  {k:"/", d:"Raíz del sistema", why:"El punto de partida de todo el sistema de archivos. Sin él, nada funciona.", cmd:"cd /"},
  {k:"/etc", d:"Archivos de configuración", why:"Aquí están los archivos que definen cómo funciona el sistema: redes, servicios, usuarios.", cmd:'ls -la /etc/passwd'},
  {k:"/etc/passwd", d:"Usuarios del sistema (texto)", why:"Contiene los nombres de usuario, UID y shell. Los ataques suelen intentar leerlo.", cmd:'cat /etc/passwd | grep "/bin/bash"', crit:true},
  {k:"/etc/shadow", d:"Contraseñas encriptadas", why:"Archivo más sensible. Solo root puede leerlo. Contiene los hashes de contraseñas.", cmd:"sudo cat /etc/shadow", crit:true},
  {k:"/etc/sudoers", d:"Permisos sudo", why:"Define quién puede ejecutar comandos como root. No editar directamente, usar visudo.", cmd:"sudo visudo", crit:true},
  {k:"/var/log", d:"Registros del sistema", why:"Todos los logs: autenticación, sistema, servicios, etc. Clave para seguridad y auditoría.", cmd:"ls -la /var/log/"},
  {k:"/var/log/auth.log", d:"Intentos de login", why:"El archivo más importante para seguridad. Registra accesos (exitosos/fallidos).", cmd:"tail -f /var/log/auth.log", crit:true},
  {k:"/var/log/syslog", d:"Mensajes del sistema", why:"Todo lo que ocurre: servicios, arranques, errores.", cmd:'grep "error" /var/log/syslog'},
  {k:"/var/spool/cron", d:"Tareas programadas de usuarios", why:"Archivos cron. Un atacante puede programar tareas maliciosas aquí.", cmd:"crontab -l", crit:true},
  {k:"/home", d:"Directorios de usuarios", why:"Cada usuario tiene su carpeta personal.", cmd:"ls -la /home/"},
  {k:"/root", d:"Home de root", why:"Solo accesible por root. Contiene scripts y configuraciones del administrador.", cmd:"sudo ls -la /root/"},
  {k:"/bin", d:"Comandos esenciales del sistema", why:"Comandos básicos como ls, cp, mv, cat. Necesarios incluso en modo rescate.", cmd:"ls -la /bin/"},
  {k:"/sbin", d:"Comandos de administración", why:"Para administradores: fdisk, ifconfig, shutdown.", cmd:"ls -la /sbin/"},
  {k:"/usr/bin", d:"Comandos de usuario", why:"Programas instalados por el sistema (ej: vim, python, grep).", cmd:"which grep"},
  {k:"/tmp", d:"Archivos temporales", why:"Cualquier usuario puede escribir aquí. Riesgo de seguridad: archivos temporales maliciosos.", cmd:"ls -la /tmp/", crit:true},
  {k:"/opt", d:"Software adicional", why:"Programas instalados manualmente (ej: Wazuh, Elasticsearch).", cmd:"ls -la /opt/"},
  {k:"/proc", d:"Sistema de archivos virtual", why:"Información de procesos y kernel en tiempo real. No es un directorio real en disco.", cmd:"cat /proc/cpuinfo"},
  {k:"/dev", d:"Dispositivos del sistema", why:"Discos, USB, terminales.", cmd:"ls -la /dev/sd*"},
  {k:"/boot", d:"Archivos de arranque", why:"Kernel y gestor de arranque (GRUB). Si se corrompe, el sistema no inicia.", cmd:"ls -la /boot/"},
  {k:"/mnt", d:"Puntos de montaje temporal", why:"Para montar sistemas de archivos externos (ej: USB, discos).", cmd:"mount /dev/sdb1 /mnt"},
  {k:"/media", d:"Puntos de montaje automáticos", why:"USB, CDROM montados automáticamente por el sistema.", cmd:"ls -la /media/"},
];

const cmds = [
  {k:"ls -la", d:"Lista archivos con detalles", cmd:"ls -la /var/log/   # ver permisos y fechas de logs"},
  {k:"cd", d:"Cambia de directorio", cmd:"cd /var/log/   # ir al directorio de logs"},
  {k:"pwd", d:"Muestra directorio actual", cmd:"pwd   # saber dónde estás"},
  {k:"cat", d:"Muestra contenido de archivo", cmd:"cat /etc/passwd   # ver usuarios del sistema"},
  {k:"less", d:"Navega por archivos grandes", cmd:"less /var/log/syslog   # ver log sin saturar la terminal"},
  {k:"tail -f", d:"Monitorea logs en tiempo real", cmd:"tail -f /var/log/auth.log   # ver intentos de login en vivo", crit:true},
  {k:"grep", d:"Busca patrones en archivos", cmd:'grep -i "error" /var/log/syslog   # buscar errores'},
  {k:"find", d:"Busca archivos y directorios", cmd:'find / -name "*.log" -type f   # buscar todos los logs'},
  {k:"ps aux", d:"Muestra procesos en ejecución", cmd:"ps aux | grep ssh   # ver si SSH está corriendo"},
  {k:"top", d:"Monitorea procesos en tiempo real", cmd:"top   # ver CPU y memoria en vivo"},
  {k:"htop", d:"Top mejorado (más visual)", cmd:"htop   # si no está, instalarlo"},
  {k:"systemctl", d:"Gestiona servicios (systemd)", cmd:"systemctl status sshd   # ver estado de SSH"},
  {k:"service", d:"Gestiona servicios (sysvinit)", cmd:"service apache2 restart   # reiniciar Apache"},
  {k:"netstat -tulpn", d:"Muestra puertos abiertos", cmd:"netstat -tulpn | grep 80   # ver si hay un servidor web en el puerto 80", crit:true},
  {k:"ss -tulpn", d:"Alternativa moderna a netstat", cmd:"ss -tulpn   # muestra puertos escuchando"},
  {k:"du -sh", d:"Muestra tamaño de directorios", cmd:"du -sh /var/log/   # ver cuánto pesan los logs"},
  {k:"df -h", d:"Muestra espacio en disco", cmd:"df -h   # ver si hay espacio libre"},
  {k:"free -h", d:"Muestra memoria RAM/swap", cmd:"free -h   # ver memoria disponible"},
  {k:"chmod", d:"Cambia permisos de archivos", cmd:"chmod 755 script.sh   # hacer ejecutable un script"},
  {k:"chown", d:"Cambia propietario de archivos", cmd:"chown admin:admin /var/www/*   # cambiar propietario de archivos web"},
  {k:"sudo", d:"Ejecuta comandos como root", cmd:"sudo tail -f /var/log/auth.log   # leer logs protegidos", crit:true},
  {k:"who", d:"Muestra usuarios conectados", cmd:"who   # ver quién está en el sistema"},
  {k:"last", d:"Muestra últimos logins exitosos", cmd:"last -a   # ver accesos recientes con IP", crit:true},
  {k:"lastb", d:"Muestra últimos logins fallidos", cmd:"lastb -n 10   # ver últimos 10 intentos fallidos", crit:true},
  {k:"crontab -l", d:"Muestra tareas programadas", cmd:"crontab -l   # ver tareas del usuario actual"},
  {k:"crontab -e", d:"Edita tareas programadas", cmd:"crontab -e   # programar una tarea"},
  {k:"tar", d:"Comprime/descomprime archivos", cmd:"tar -czvf backup.tar.gz /var/www/   # hacer backup de web"},
  {k:"scp", d:"Copia archivos por SSH", cmd:"scp file.txt user@server:/tmp/   # copiar archivo a otro servidor"},
  {k:"rsync", d:"Sincroniza archivos remotamente", cmd:"rsync -av /var/www/ user@server:/backup/   # sincronizar carpetas"},
  {k:"history", d:"Muestra comandos ejecutados", cmd:"history   # ver qué has hecho antes"},
];

const combos = [
  {t:"Ver últimos accesos fallidos agrupados por IP", cmd:`grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr | head -5`},
  {t:"Monitorizar errores del sistema en tiempo real", cmd:`tail -f /var/log/syslog | grep -i "error\\|critical\\|fail"`},
  {t:"Buscar archivos grandes en el sistema", cmd:`find / -type f -size +100M -exec ls -lh {} \\; 2>/dev/null`},
  {t:"Ver los 10 procesos que más CPU consumen", cmd:`ps aux --sort=-%cpu | head -10`},
  {t:"Ver los 10 procesos que más memoria consumen", cmd:`ps aux --sort=-%mem | head -10`},
  {t:"Encontrar archivos con permisos SUID/SGID (riesgo de seguridad)", cmd:`find / -type f -perm -4000 -o -perm -2000 2>/dev/null`},
  {t:"Ver conexiones externas activas", cmd:`ss -tunp | grep ESTAB | grep -v 127.0.0.1`},
];

const quizPool = [
  {q:"¿Qué directorio contiene los hashes de contraseñas y solo root puede leer?", opts:["/etc/passwd","/etc/shadow","/etc/sudoers","/var/log"], a:1},
  {q:"¿Cuál es el comando correcto para ver intentos de login fallidos recientes?", opts:["last -a","lastb -n 10","who","history"], a:1},
  {q:"¿Qué archivo registra los intentos de autenticación del sistema?", opts:["/var/log/syslog","/var/log/auth.log","/etc/passwd","/proc/cpuinfo"], a:1},
  {q:"¿Qué comando permite editar de forma segura los permisos sudo?", opts:["nano /etc/sudoers","sudo visudo","chmod /etc/sudoers","vi /etc/passwd"], a:1},
  {q:"¿Qué directorio NO es un sistema de archivos real en disco?", opts:["/dev","/proc","/boot","/opt"], a:1},
  {q:"¿Cuál es un riesgo de seguridad típico asociado a /tmp?", opts:["No tiene logs","Cualquier usuario puede escribir ahí","Es solo lectura","No existe en Linux"], a:1},
  {q:"¿Qué comando muestra puertos abiertos de forma moderna (alternativa a netstat)?", opts:["ss -tulpn","ps aux","top","df -h"], a:0},
  {q:"¿Dónde se guardan las tareas cron de los usuarios?", opts:["/var/spool/cron","/etc/cron","/home/cron","/tmp/cron"], a:0},
  {q:"¿Qué comando busca archivos con permisos SUID/SGID?", opts:["find / -perm -4000 -o -perm -2000","grep -r SUID /", "ls -la /etc/suid","chmod -SUID /"], a:0},
  {q:"¿Qué comando comprime un directorio en un .tar.gz?", opts:["scp -r","tar -czvf","rsync -av","zip -r"], a:1},
];

function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderDirs(){
  const el = document.getElementById('dirsList');
  el.innerHTML = dirs.map((x,i)=>`
    <div class="row" data-search="${(x.k+' '+x.d+' '+x.why).toLowerCase()}">
      <div class="k">${x.k}${x.crit?'<span class="crit-tag">sensible</span>':''}</div>
      <div class="desc">${x.d}</div>
      <div class="why">${x.why}</div>
      <div class="cmd-line">
        <code>${escapeHtml(x.cmd)}</code>
        <button class="copy-btn" data-cmd="${escapeHtml(x.cmd)}">copiar</button>
      </div>
    </div>`).join('');
  document.getElementById('dirsCount').textContent = dirs.length + ' items';
}

function renderCmds(){
  const el = document.getElementById('cmdsList');
  el.innerHTML = cmds.map((x)=>`
    <div class="row" data-search="${(x.k+' '+x.d+' '+x.cmd).toLowerCase()}" style="grid-template-columns:160px 1fr;">
      <div class="k">${x.k}${x.crit?'<span class="crit-tag">clave</span>':''}</div>
      <div class="desc">${x.d}</div>
      <div class="cmd-line">
        <code>${escapeHtml(x.cmd)}</code>
        <button class="copy-btn" data-cmd="${escapeHtml(x.cmd)}">copiar</button>
      </div>
    </div>`).join('');
  document.getElementById('cmdsCount').textContent = cmds.length + ' items';
}

function renderCombos(){
  const el = document.getElementById('combosList');
  el.innerHTML = combos.map((c,i)=>`
    <div class="combo" data-search="${(c.t+' '+c.cmd).toLowerCase()}">
      <div class="ch" data-i="${i}">
        <span class="num">${String(i+1).padStart(2,'0')}</span>
        <span class="title">${c.t}</span>
        <span class="arrow">▶</span>
      </div>
      <div class="body">
        <div class="body-inner">
          <pre><span>${escapeHtml(c.cmd)}</span><button class="copy-btn" data-cmd="${escapeHtml(c.cmd)}">copiar</button></pre>
        </div>
      </div>
    </div>`).join('');
  document.getElementById('combosCount').textContent = combos.length + ' items';

  el.querySelectorAll('.ch').forEach(h=>{
    h.addEventListener('click', ()=> h.parentElement.classList.toggle('open'));
  });
}

renderDirs();
renderCmds();
renderCombos();

// copy buttons (delegated)
document.body.addEventListener('click', (e)=>{
  if(e.target.classList.contains('copy-btn')){
    const text = e.target.getAttribute('data-cmd');
    navigator.clipboard.writeText(text).then(()=>{
      const orig = e.target.textContent;
      e.target.textContent = '✓ copiado';
      e.target.classList.add('done');
      setTimeout(()=>{ e.target.textContent = orig; e.target.classList.remove('done'); }, 1200);
    });
    e.stopPropagation();
  }
});

// nav scroll
document.querySelectorAll('.nav button').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById(b.dataset.target).scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// search filter
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', ()=>{
  const q = searchInput.value.trim().toLowerCase();
  let visible = 0, total = 0;
  document.querySelectorAll('#dirsList .row, #cmdsList .row, #combosList .combo').forEach(el=>{
    total++;
    const match = !q || el.dataset.search.includes(q);
    el.classList.toggle('hide', !match);
    if(match) visible++;
  });
  document.getElementById('resultCount').textContent = q ? `${visible}/${total} resultados` : '';
});

// QUIZ
let qIndex = -1, score = 0, answered = 0, order = [];
function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]); }
function loadQuiz(){
  order = shuffle([...Array(quizPool.length).keys()]);
  qIndex = -1;
  score = 0; answered = 0;
  nextQuiz();
}
function nextQuiz(){
  qIndex++;
  if(qIndex >= order.length){ order = shuffle(order); qIndex = 0; }
  const item = quizPool[order[qIndex]];
  document.getElementById('quizQ').textContent = item.q;
  const optsEl = document.getElementById('quizOpts');
  optsEl.innerHTML = '';
  const shuffledOpts = item.opts.map((o,i)=>({o,i})).sort(()=>Math.random()-0.5);
  shuffledOpts.forEach(({o,i})=>{
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.textContent = o;
    btn.addEventListener('click', ()=>{
      if(btn.dataset.locked) return;
      optsEl.querySelectorAll('.opt').forEach(b=>b.dataset.locked = '1');
      if(i === item.a){
        btn.classList.add('correct');
        score++;
      } else {
        btn.classList.add('wrong');
        optsEl.children[[...optsEl.children].findIndex((c,idx)=> shuffledOpts[idx].i===item.a)]?.classList.add('correct');
      }
      answered++;
      document.getElementById('quizScore').textContent = `${score} / ${answered}`;
    });
    optsEl.appendChild(btn);
  });
}
document.getElementById('nextBtn').addEventListener('click', nextQuiz);
loadQuiz();

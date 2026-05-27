const weeks=[

{
month:"JUNIO",
title:"Semana 1 – Redes y seguridad perimetral",

objective:"Dominar infraestructura y herramientas de seguridad",

topics:[
"Modelo OSI/TCP-IP",
"Subredes",
"VLAN",
"NAT",
"ACL",
"Puertos",
"DNS",
"DHCP",
"Proxy",
"Segmentación de red"
],

lab:[
"Instalar VirtualBox",
"Ubuntu",
"Kali",
"Windows Server",
"pfSense"
],

practice:[
"Crear red virtual",
"Configurar VLAN",
"Reglas Firewall"
],

deliverable:[
'Documento: "Diseño básico infraestructura segura"'
]

},

{

month:"JUNIO",
title:"Semana 2 – Firewalls, IDS/IPS y VPN",

topics:[
"Stateful Firewall",
"NGFW",
"WAF",
"Snort",
"Suricata",
"IPSec",
"SSL VPN",
"OpenVPN",
"Google Authenticator",
"Microsoft Authenticator",
"LDAP",
"Active Directory"
],

lab:[
"Instalar pfSense",
"Instalar Snort"
],

practice:[
"Crear reglas",
"Detectar ataques",
"Configurar VPN"
]

},

{

month:"JUNIO",
title:"Semana 3 – Gestión de vulnerabilidades",

topics:[
"CVE",
"CVSS",
"Hardening",
"Gestión de parches",
"OWASP Top 10",
"Riesgo"
],

lab:[
"Nessus",
"OpenVAS",
"Nmap"
],

practice:[
"Escaneo vulnerabilidades",
"Interpretar resultados",
"Aplicar correcciones"
]

},

{

month:"JUNIO",
title:"Semana 4 – Pentesting y análisis",

topics:[
"PTES",
"OWASP",
"Kill Chain",
"Burp Suite",
"Metasploit",
"Nikto",
"Wireshark"
],

lab:[
"Hack The Box",
"OWASP Juice Shop"
],

deliverable:[
"Informe Pentesting",
"Hallazgo",
"Riesgo",
"Evidencia",
"Recomendación"
]

},

{

month:"JULIO",
title:"Semana 5 – ISO27001",

topics:[
"SGSI",
"Riesgo",
"Contexto organizacional",
"Controles",
"Control acceso",
"Gestión activos",
"Criptografía",
"Continuidad"
],

practice:[
"Crear política seguridad",
"Inventario activos"
]

},

{

month:"JULIO",
title:"Semana 6 – NIST",

topics:[
"Identify",
"Protect",
"Detect",
"Respond",
"Recover",
"NIST 800-61",
"NIST 800-53"
],

deliverable:[
"Comparación ISO vs NIST",
"Responder diferencias en menos de 2 minutos"
]

},

{

month:"JULIO",
title:"Semana 7 – Gestión incidentes",

topics:[
"Preparación",
"Identificación",
"Contención",
"Erradicación",
"Recuperación",
"Lecciones aprendidas"
],

practice:[
"Simular ransomware",
"Simular phishing",
"Simular malware"
],

deliverable:[
"Formato incidente"
]

},

{

month:"JULIO",
title:"Semana 8 – SIEM y monitoreo",

topics:[
"Logs",
"Correlación",
"Alertas",
"IOC",
"SOC"
],

lab:[
"Wazuh",
"ELK",
"Splunk"
],

practice:[
"Configurar Wazuh + agentes"
]

},

{

month:"AGOSTO",
title:"Semana 9 – Continuidad y DRP",

topics:[
"BIA",
"RTO",
"RPO",
"Backup",
"Recuperación"
],

deliverable:[
"Plan DRP entidad pública"
]

},

{

month:"AGOSTO",
title:"Semana 10 – Auditoría",

topics:[
"Informes ejecutivos",
"Hallazgos",
"Evidencias",
"Auditoría"
],

practice:[
"Crear informe técnico"
]

},

{

month:"AGOSTO",
title:"Semana 11 – Contratación pública",

topics:[
"Supervisión TI",
"SLA",
"KPI",
"ANS",
"SECOP",
"Interventoría",
"Entregables"
]

},

{

month:"AGOSTO",
title:"Semana 12 – Simulación real",

topics:[
"Simulacro técnico",
"ISO/NIST",
"Incidentes",
"Infraestructura",
"Documentación",
"Entrevista",
"Repaso total"
]

}

];

let html="";
let lastMonth="";

weeks.forEach((w,i)=>{

if(lastMonth!==w.month){

html+=`<div class='month'>${w.month}</div>`;
lastMonth=w.month;

}

html+=`

<div class='week' id="week${i}">

<details>

<summary>${w.title}</summary>

<div class='section'>
<h4>Objetivo</h4>
<p>${w.objective || "-"}</p>
</div>

<div class='section'>
<h4>Temas</h4>
<ul>${w.topics.map(x=>`<li>${x}</li>`).join("")}</ul>
</div>

<div class='section'>
<h4>Laboratorio</h4>
<ul>${(w.lab||[]).map(x=>`<li>${x}</li>`).join("")}</ul>
</div>

<div class='section'>
<h4>Prácticas</h4>
<ul>${(w.practice||[]).map(x=>`<li>${x}</li>`).join("")}</ul>
</div>

<div class='section'>
<h4>Entregables</h4>
<ul>${(w.deliverable||[]).map(x=>`<li>${x}</li>`).join("")}</ul>
</div>

<label>

<input type="checkbox"
onchange="save(${i},this.checked)"
${localStorage.getItem(i)?"checked":""}>

Semana completada

</label>

</details>

</div>

`;

});

document.getElementById("content").innerHTML=html;

function save(i,val){

if(val)
localStorage.setItem(i,true);

else
localStorage.removeItem(i);

updateProgress();

}

function updateProgress(){

let total=weeks.length;
let completed=0;

for(let i=0;i<total;i++){

if(localStorage.getItem(i))
completed++;

}

let percent=Math.round((completed/total)*100);

document.getElementById(
"bar"
).style.width=percent+"%";

document.getElementById(
"percent"
).innerText=percent+"% completado";

}

updateProgress();


document.addEventListener("DOMContentLoaded",()=>{

// Pills
document.querySelectorAll('.check-pill').forEach(pill=>{

pill.addEventListener('click',()=>{

pill.classList.toggle('selected');

});

});


// Progress
function updateProgress(){

const required=document.querySelectorAll('input[required]');

const filled=Array.from(required)
.filter(i=>i.value.trim()!=="")
.length;

const checked=document.querySelectorAll(
'input[type="checkbox"]:checked'
).length;

const textFilled=Array.from(
document.querySelectorAll(
'input[type="text"],input[type="email"],textarea'
))
.filter(i=>i.value.trim()!=="")
.length;

const total=required.length+10;

const done=
filled+
Math.min(checked,6)+
Math.min(textFilled,4);

const pct=Math.min(
Math.round((done/total)*100),
100
);

document.getElementById(
'progressFill'
).style.width=pct+'%';

document.getElementById(
'progressPct'
).textContent=pct+'%';

}

document.querySelectorAll(
'input,textarea,select'
)
.forEach(el=>{

el.addEventListener(
'change',
updateProgress
);

el.addEventListener(
'input',
updateProgress
);

});


// Form submit

const form=document.getElementById(
'briefingForm'
);

form.addEventListener(
'submit',
async(e)=>{

e.preventDefault();

const btn=
document.getElementById(
'submitBtn'
);

const errDiv=
document.getElementById(
'errorMsg'
);

errDiv.classList.remove(
'visible'
);

const nombre=
document.getElementById(
'nombre'
)
.value.trim();

const email=
document.getElementById(
'email'
)
.value.trim();

if(!nombre||!email){

errDiv.textContent=
'Por favor ingresa nombre y correo';

errDiv.classList.add(
'visible'
);

return;

}

btn.innerHTML='Enviando...';

btn.disabled=true;

try{

const data=
new FormData(form);

const res=
await fetch(
form.action,
{
method:'POST',
body:data,
headers:{
'Accept':
'application/json'
}
}
);

if(res.ok){

form.style.display='none';

document
.getElementById(
'successMsg'
)
.classList.add(
'visible'
);

window.scrollTo({
top:0,
behavior:'smooth'
});

}else{

throw Error();

}

}catch{

errDiv.textContent=
'Error enviando formulario';

errDiv.classList.add(
'visible'
);

btn.innerHTML=
'Enviar briefing';

btn.disabled=false;

}

});

});

(()=> {
"use strict";
const $=id=>document.getElementById(id),rig=document.querySelector(".rig");
if(!rig||!$("ptt")||!$("radioLinesDev"))return;
const channels=[["virtual","VIRTUAL"],["boondock-sptt","BOONDOCK SPTT"],["police-ptt","POLICE PTT"],["hospital-ptt","HOSPITAL PTT"],["mall-ptt","MALL PTT"],["construction-ptt","CONSTRUCTION PTT"],["boondockecho-lte","BOONDOCK ECHO LTE"]];
const params=new URLSearchParams(location.search),ch=params.get("ch")||"virtual";
const skins=[["boondockecho","Boondock Echo"],["motorola","Motorola"],["hytera","Hytera"],["kenwood","Kenwood"],["baofeng","Baofeng"],["sonim","Sonim"]];
const top=document.createElement("div");top.id="simpleRadioTop";top.innerHTML='<div class="simple-channel"><i></i><b id="simpleChannelName"></b></div><div><select id="simpleSkin" aria-label="Radio skin"></select><button id="simpleClose" aria-label="Close radio">×</button></div>';
rig.querySelector(".brand").after(top);
skins.forEach(([v,n])=>$("simpleSkin").add(new Option(n,v)));$("simpleSkin").value=params.get("skin")||"boondockecho";
$("simpleSkin").onchange=()=>{try{const u=new URL(window.parent.location.href);u.searchParams.set("skin",$("simpleSkin").value);window.parent.location.href=u.href}catch(e){const u=new URL(location.href);u.searchParams.set("skin",$("simpleSkin").value);location.href=u.href}};
$("simpleChannelName").textContent=(channels.find(x=>x[0]===ch)||channels[0])[1];
$("simpleClose").onclick=()=>{try{radio&&radio.leave()}catch(e){}try{window.top.close()}catch(e){}setTimeout(()=>{try{window.top.location.replace("/boondock-echo-live/")}catch(e){history.back()}},150)};
const login=$("login"),name=$("nm"),go=$("go"),main=$("main"),ptt=$("ptt");
login.style.display="none";go.style.display="none";main.style.display="block";main.insertBefore(name,main.firstChild);name.placeholder="Call sign";name.setAttribute("aria-label","Call sign");$("hd").style.display="none";
const more=document.createElement("button");more.id="simpleMore";more.textContent="MORE ⋯";const drawer=document.createElement("div");drawer.id="simpleMoreDrawer";drawer.innerHTML='<div class="more-head"><b>RADIO OPTIONS</b><button id="moreClose">×</button></div><label>CHANNEL<select id="simpleChannel"></select></label><label class="auto-row">AUTO POWER ON <input id="simpleAutoPower" type="checkbox"></label><button id="simpleSstv">SSTV IMAGE</button><small>FM pauses automatically during PTT.</small>';
rig.append(more,drawer);
channels.forEach(([v,n])=>$("simpleChannel").add(new Option(n,v)));$("simpleChannel").value=channels.some(x=>x[0]===ch)?ch:"virtual";
$("simpleChannel").onchange=()=>{const u=new URL(location.href);u.searchParams.set("ch",$("simpleChannel").value);location.href=u.href};
const auto=$("simpleAutoPower");auto.checked=localStorage.getItem("sanketptt.autoPower")!=="off";auto.onchange=()=>localStorage.setItem("sanketptt.autoPower",auto.checked?"on":"off");
more.onclick=()=>{drawer.classList.toggle("open");$("radioLinesDev").classList.remove("open")};$("moreClose").onclick=()=>drawer.classList.remove("open");
const sstvPick=document.createElement("div");sstvPick.id="sstvPick";sstvPick.innerHTML='<b>SSTV IMAGE</b><button id="sstvBrowse">BROWSE</button><button id="sstvTake">CAMERA</button>';drawer.appendChild(sstvPick);
$("sstvBrowse").onclick=()=>{drawer.classList.remove("open");$("sstvFile").removeAttribute("capture");$("sstvFile").click()};
$("sstvTake").onclick=()=>{drawer.classList.remove("open");$("sstvFile").setAttribute("capture","environment");$("sstvFile").click()};
$("simpleSstv").onclick=()=>{sstvPick.classList.toggle("open")};
const sstv=$("sstvP"),sstvBtn=$("sstvBtn"),sstvFile=$("sstvFile");if(sstvFile)document.body.appendChild(sstvFile);
if(sstv){sstv.querySelector("h3").textContent="SSTV IMAGE";sstv.querySelector("label")?.remove();sstvBtn.textContent="BROWSE IMAGE";sstvBtn.onclick=()=>{sstvFile.removeAttribute("capture");sstvFile.click()};const cam=document.createElement("button");cam.textContent="CAMERA";cam.id="sstvCamera";sstvBtn.after(cam);cam.onclick=()=>{sstvFile.setAttribute("capture","environment");sstvFile.click()}}
const fm=$("radioLinesDev"),audio=$("radioLineAudio");fm.classList.remove("open");
const fmBtn=document.createElement("button");fmBtn.id="simpleFM";fmBtn.textContent="FM RADIO";rig.appendChild(fmBtn);
fmBtn.onclick=()=>{drawer.classList.remove("open");fm.classList.toggle("open");if(fm.classList.contains("open"))fm.scrollIntoView({behavior:"smooth",block:"start"})};
if(audio)audio.addEventListener("play",()=>{fm.classList.remove("open");drawer.classList.remove("open")});
document.querySelector(".panel:has(#us)")?.remove();$("locp")?.remove();const logPanel=$("log")?.closest(".panel");if(logPanel)logPanel.style.display="none";
const messages=document.createElement("section");messages.id="simpleMessages";messages.innerHTML='<div class="ribbon-head">LAST FIVE AUDIO MESSAGES</div><div id="recentAudioRibbons"><small>Waiting for radio traffic</small></div><div class="transcript-head"><b>MESSAGE TRANSCRIPTS</b><span id="whisperState">WHISPER · AUTO</span></div><div id="simpleTranscriptList"><small>Incoming messages appear here</small></div>';main.after(messages);
const css=[
"body{padding:5px!important;background:#8f210f!important;overflow-x:hidden!important}",
".rig{max-width:520px!important;min-height:calc(100dvh - 10px)!important;padding:10px!important;display:flex!important;flex-direction:column!important;gap:7px!important}",
".brand{margin:0 5px!important;min-height:40px!important}",
"#simpleRadioTop{display:flex;align-items:center;justify-content:space-between;padding:4px 5px}",
".simple-channel{display:flex;align-items:center;gap:8px;color:#f8dfd4;font:800 11px Arial,sans-serif;letter-spacing:1px}",
".simple-channel i{width:9px;height:9px;border-radius:50%;background:#f1d8cc;box-shadow:0 0 0 2px #ffffff44}",
"#simpleSkin{max-width:125px;min-height:30px!important;padding:4px!important;font:700 11px Arial!important;background:#6f1e12!important;color:#ffe8dd!important}",
"#simpleClose{width:30px;height:30px;border-radius:50%;background:#55170e;color:#fff;font:22px Arial}",
".lcd{padding:7px 10px!important;margin:0!important}.lcd .meter{display:none!important}#st{font-size:12px!important;min-height:16px!important}",
"#main{display:flex!important;flex-direction:column!important;align-items:center!important;gap:4px!important;margin:0!important}",
"#nm{width:100%!important;max-width:220px!important;min-height:34px!important;padding:6px!important;margin:0!important;text-align:center!important;background:#4f180f!important;color:#fff!important}",
"#ptt{width:min(66vw,250px)!important;height:min(66vw,250px)!important;max-width:250px!important;max-height:250px!important;aspect-ratio:1!important;margin:5px auto!important;border-radius:50%!important;font-size:19px!important;font-weight:900!important;touch-action:none!important}",
"#main .hint{color:#f4d4c7!important;font:10px Arial!important}",
"#simpleMessages{height:50dvh;min-height:190px;max-height:50dvh;display:flex;flex-direction:column;overflow:hidden;border:1px solid #f0cbbb88;border-radius:12px;background:#5d1a11dd;color:#fff0e8;padding:7px;gap:5px}",
".ribbon-head,.transcript-head{display:flex;justify-content:space-between;align-items:center;font:800 9px Arial;letter-spacing:1px;color:#f5d5c8}",
"#recentAudioRibbons{display:flex;gap:5px;overflow-x:auto;min-height:40px;padding-bottom:3px}",
".audio-ribbon{flex:0 0 92px;min-width:92px;border:1px solid #f2cdbb66;border-radius:8px;background:#7a2416;color:#fff1e9;padding:5px;font:10px Arial;text-align:left}",
".audio-ribbon b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.audio-ribbon small{display:block;color:#f2cbb9;margin-top:3px}",
"#simpleTranscriptList{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain}",
".transcript-item{padding:7px 5px;border-bottom:1px solid #f0d2c322;font:12px/1.4 Arial}.transcript-meta{display:flex;justify-content:space-between;color:#f3c6b2;font-size:9px;margin-bottom:3px}.transcript-text{color:#fff3ed;white-space:pre-wrap;overflow-wrap:anywhere}",
"#whisperState{font-size:8px;color:#f7d5c8}.empty-ribbon,.empty-transcript{font:11px Arial;color:#f0cdbf88;padding:8px}",
"#simpleMore,#simpleFM{position:fixed;z-index:25;bottom:10px;width:84px;height:34px;border-radius:18px;background:#641b10;border:1px solid #f0cbbb;color:#ffe7dc;font:800 10px Arial;box-shadow:0 3px 10px #0005}",
"#simpleMore{left:10px}#simpleFM{right:10px}",
"#simpleMoreDrawer{display:none;position:fixed;z-index:30;left:10px;bottom:52px;width:min(270px,calc(100vw - 20px));padding:12px;background:#58180f;border:1px solid #f0cbbb;border-radius:12px;box-shadow:0 10px 28px #0009;color:#ffeadf}",
"#simpleMoreDrawer.open{display:block}.more-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font:800 11px Arial}",
"#sstvPick{display:none;margin-top:8px;gap:6px}#sstvPick.open{display:grid;grid-template-columns:1fr 1fr}#sstvPick b{grid-column:1/-1;font:800 10px Arial;color:#f5d5c8}#sstvPick button{padding:9px;background:#e9c8b8;color:#51170e;font:800 11px Arial}",
"#simpleMoreDrawer label{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:9px 0;font:11px Arial}#simpleMoreDrawer select{max-width:145px;min-height:34px!important;font-size:11px!important}",
"#simpleMoreDrawer input{width:18px;height:18px}#simpleSstv{width:100%;padding:9px;background:#e9c8b8;color:#51170e;font:800 11px Arial}",
"#radioLinesDev{display:none!important;position:fixed!important;z-index:24!important;left:8px!important;right:8px!important;bottom:52px!important;top:auto!important;max-height:65dvh!important;overflow:auto!important;margin:0!important;background:#3e170f!important}",
"#radioLinesDev.open{display:block!important}#radioLinesDev .radio-scan{max-height:140px;overflow:auto}",
"#sstvP,#locp,.panel:has(#us),.panel:has(#log),#net{display:none!important}",
"#sstvP.simple-sstv.open{display:block!important;position:fixed!important;z-index:40!important;left:10px!important;right:10px!important;bottom:54px!important;max-height:65dvh!important;overflow:auto!important;background:#5d1a11!important;color:#fff0e8!important;padding:10px!important;border:1px solid #f0cbbb!important;border-radius:12px!important}",
"@media(max-height:650px){#ptt{width:min(48vw,190px)!important;height:min(48vw,190px)!important}#simpleMessages{height:43dvh;max-height:43dvh}}"
].join("\n");
const style=document.createElement("style");style.id="simpleRadioStyles";style.textContent=css;document.head.appendChild(style);
if(sstvFile)sstvFile.addEventListener("change",()=>{if(sstvFile.files&&sstvFile.files.length){sstv.classList.add("open");drawer.classList.remove("open")}});
$("sstvCancel")?.addEventListener("click",()=>sstv.classList.remove("open"));
ptt.addEventListener("pointerdown",e=>{if(!window.radio||!radio.name){e.preventDefault();e.stopImmediatePropagation();if(!name.value.trim()){name.focus();return}go.click()}},true);
ptt.addEventListener("click",e=>{if(!window.radio||!radio.name){e.preventDefault();if(name.value.trim())go.click()}});
const oldRender=window.render;window.render=function(){if(oldRender)oldRender();if(!window.radio||!radio.name){ptt.textContent="POWER ON";ptt.className="";$("st").textContent="READY TO JOIN"}else if(!holding&&!granted&&!(radio.floor&&radio.floor.id!==radio.id))ptt.textContent="HOLD TO TALK"};
let asr=null,asrLoading=null,queue=Promise.resolve();const done=new Set(),texts=new Map();
async function loadWhisper(){if(asr)return asr;if(asrLoading)return asrLoading;$("whisperState").textContent="WHISPER · LOADING";asrLoading=import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5").then(T=>T.pipeline("automatic-speech-recognition","onnx-community/whisper-base",{dtype:"q8"})).then(p=>{asr=p;$("whisperState").textContent="WHISPER · ON DEVICE";return p}).catch(e=>{$("whisperState").textContent="WHISPER · UNAVAILABLE";throw e});return asrLoading}
function wavFloat(wav){const v=new DataView(wav),n=v.getUint32(40,true)/2,rate=v.getUint32(24,true),src=new Float32Array(n);for(let i=0;i<n;i++)src[i]=v.getInt16(44+i*2,true)/32768;const m=Math.floor(n*16000/rate),out=new Float32Array(m);for(let i=0;i<m;i++){const x=i*rate/16000,j=Math.floor(x),f=x-j;out[i]=src[j]*(1-f)+(src[Math.min(j+1,n-1)]||0)*f}return out}
function drawMessages(entries){const recent=$("recentAudioRibbons"),list=$("simpleTranscriptList");const incoming=entries.filter(e=>!e.mine);const last=incoming.slice(0,5);recent.innerHTML=last.length?"":'<small class="empty-ribbon">Waiting for incoming audio</small>';last.forEach(e=>{const b=document.createElement("button");b.className="audio-ribbon";b.innerHTML="<b></b><small></small>";b.querySelector("b").textContent=e.name||"Radio";b.querySelector("small").textContent=new Date(e.t0).toLocaleTimeString();b.onclick=()=>new Audio(URL.createObjectURL(new Blob([e.wav],{type:"audio/wav"}))).play().catch(()=>{});recent.appendChild(b)});list.innerHTML=incoming.length?"":'<small class="empty-transcript">Incoming messages appear here</small>';incoming.forEach(e=>{const item=document.createElement("article");item.className="transcript-item";const meta=document.createElement("div");meta.className="transcript-meta";const who=document.createElement("span");who.textContent=e.name||"Radio";const tm=document.createElement("time");tm.textContent=new Date(e.t0).toLocaleTimeString();meta.append(who,tm);const body=document.createElement("div");body.className="transcript-text";body.textContent=texts.get(e.key)||"Transcribing locally with Whisper…";item.append(meta,body);list.appendChild(item);if(!done.has(e.key)){done.add(e.key);queue=queue.then(async()=>{try{const pipe=await loadWhisper(),r=await pipe(wavFloat(e.wav),{task:"transcribe",chunk_length_s:30,stride_length_s:5});texts.set(e.key,(r.text||"").trim()||"No speech detected")}catch(err){texts.set(e.key,"Whisper unavailable: "+err.message)}drawMessages(window.rec?rec.entries:[])})}})}
if(window.rec){rec.onChange=entries=>{renderLog(entries);drawMessages(entries)};drawMessages(rec.entries||[])}
let fmWasPlaying=false,busy=false;function pauseFm(){if(audio&&!audio.paused){fmWasPlaying=true;audio.pause()}}
const oldDown=window.down;if(oldDown)window.down=function(e){pauseFm();return oldDown(e)};
setInterval(()=>{if(!window.radio)return;const f=radio.floor,active=!!(f&&(f.id!==radio.id||radio.talking));if(active&&!busy)pauseFm();if(!active&&busy&&fmWasPlaying&&audio){fmWasPlaying=false;audio.play().catch(()=>{})}busy=active},180);
if(auto.checked){if(!name.value)name.value=localStorage.getItem("nm")||"SANKET AUTO";setTimeout(()=>{if(window.radio&&!radio.name&&localStorage.getItem("sanketptt.autoPower")!=="off")go.click()},8000)}
setInterval(()=>{if(window.radio&&radio.name&&!holding&&!granted&&!(radio.floor&&radio.floor.id!==radio.id))ptt.textContent="HOLD TO TALK"},500);
})();
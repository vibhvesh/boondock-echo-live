(()=> {
"use strict";
const $=id=>document.getElementById(id),rig=document.querySelector(".rig");
if(!rig||!$("ptt")||!$("radioLinesDev"))return;
const channels=[["virtual","VIRTUAL"],["boondock-sptt","BOONDOCK SPTT"],["police-ptt","POLICE PTT"],["hospital-ptt","HOSPITAL PTT"],["mall-ptt","MALL PTT"],["construction-ptt","CONSTRUCTION PTT"],["boondockecho-lte","BOONDOCK ECHO LTE"]];
const params=new URLSearchParams(location.search),ch=params.get("ch")||"virtual";
const skins=[["boondockecho","Boondock Echo"],["motorola","Motorola"],["hytera","Hytera"],["kenwood","Kenwood"],["baofeng","Baofeng"],["sonim","Sonim"]];
const top=document.createElement("div");top.id="simpleRadioTop";top.innerHTML='<div class="simple-top-left"><button id="radioPower" type="button" aria-label="Power on radio" aria-pressed="false"><span class="power-glyph">⏻</span><span id="radioPowerText">OFF</span></button><div class="simple-channel"><i></i><b id="simpleChannelName"></b></div></div><div><select id="simpleSkin" aria-label="Radio skin"></select><button id="simpleClose" aria-label="Close radio">×</button></div>';
rig.querySelector(".brand").after(top);
const ledGroup=document.querySelector(".leds"),ledPwr=ledGroup&&ledGroup.querySelector(".led.pw");
if(ledGroup){top.querySelector(".simple-channel").after(ledGroup);ledGroup.style.display="flex";ledGroup.style.gap="7px";ledGroup.style.alignItems="center"}
if(ledPwr){ledPwr.id="ledpw";ledPwr.classList.remove("on")}
["rx","tx"].forEach(kind=>{const old=ledGroup&&ledGroup.querySelector(".led."+kind);if(old&&old.tagName!=="BUTTON"){const btn=document.createElement("button");btn.type="button";btn.id=kind==="rx"?"ledrx":"ledtx";btn.className=old.className+" status-led";btn.setAttribute("aria-label",kind==="rx"?"Receive status":"Transmit status");btn.setAttribute("aria-pressed","false");btn.innerHTML=old.innerHTML;old.replaceWith(btn);window[kind==="rx"?"ledrx":"ledtx"]=btn}});
const ledRx=$("ledrx"),ledTx=$("ledtx");
skins.forEach(([v,n])=>$("simpleSkin").add(new Option(n,v)));$("simpleSkin").value=params.get("skin")||"boondockecho";
$("simpleSkin").onchange=()=>{try{const u=new URL(window.parent.location.href);u.searchParams.set("skin",$("simpleSkin").value);window.parent.location.href=u.href}catch(e){const u=new URL(location.href);u.searchParams.set("skin",$("simpleSkin").value);location.href=u.href}};
$("simpleChannelName").textContent=(channels.find(x=>x[0]===ch)||channels[0])[1];
$("simpleClose").onclick=()=>{try{radio&&radio.leave()}catch(e){}try{window.top.close()}catch(e){}setTimeout(()=>{try{window.top.location.replace("/boondock-echo-live/")}catch(e){history.back()}},150)};
const login=$("login"),name=$("nm"),go=$("go"),main=$("main"),ptt=$("ptt");
const meterPanel=document.querySelector(".lcd .meter");
if(meterPanel&&!$("simpleSquelch")){const sq=document.createElement("div");sq.id="simpleSquelch";sq.innerHTML='<label for="simpleSquelchLevel">SQUELCH <span id="simpleSquelchValue">0</span></label><input id="simpleSquelchLevel" type="range" min="0" max="40" step="1" value="0" aria-label="Squelch level">';meterPanel.appendChild(sq)}

ptt.textContent="POWER ON FIRST";ptt.setAttribute("aria-label","Power on the radio using the top-left switch before transmitting");
login.style.display="none";go.style.display="none";main.style.display="block";main.insertBefore(name,main.firstChild);name.placeholder="Call sign";name.setAttribute("aria-label","Call sign");$("hd").style.display="none";
const more=document.createElement("button");more.id="simpleMore";more.textContent="⋮";more.setAttribute("aria-label","More radio controls");top.querySelector("div:last-child").appendChild(more);const drawer=document.createElement("div");drawer.id="simpleMoreDrawer";drawer.innerHTML='<div class="more-head"><b>RADIO OPTIONS</b><button id="moreClose">×</button></div><label>CHANNEL<select id="simpleChannel"></select></label><label class="auto-row">AUTO POWER ON <input id="simpleAutoPower" type="checkbox"></label><small>FM pauses automatically during PTT.</small>';
rig.append(drawer);
const skinLabel=document.createElement("label");skinLabel.textContent="RADIO SKIN";skinLabel.appendChild($("simpleSkin"));drawer.appendChild(skinLabel);

channels.forEach(([v,n])=>$("simpleChannel").add(new Option(n,v)));$("simpleChannel").value=channels.some(x=>x[0]===ch)?ch:"virtual";
$("simpleChannel").onchange=()=>{const u=new URL(location.href);u.searchParams.set("ch",$("simpleChannel").value);location.href=u.href};
const auto=$("simpleAutoPower");auto.checked=localStorage.getItem("sanketptt.autoPower")!=="off";auto.onchange=()=>localStorage.setItem("sanketptt.autoPower",auto.checked?"on":"off");
more.onclick=()=>{drawer.classList.toggle("open");$("radioLinesDev").classList.remove("open")};$("moreClose").onclick=()=>drawer.classList.remove("open");
const sstv=$("sstvP"),sstvBtn=$("sstvBtn"),sstvFile=$("sstvFile");
const sstvRow=document.createElement("div");sstvRow.id="simpleSstvRow";sstvRow.innerHTML='<span>SSTV SEND</span><button id="sstvBrowse">BROWSE</button><button id="sstvTake">CAMERA</button>';main.after(sstvRow);
$("sstvBrowse").onclick=()=>{drawer.classList.remove("open");sstvFile.removeAttribute("capture");sstvFile.click()};
$("sstvTake").onclick=()=>{drawer.classList.remove("open");sstvFile.setAttribute("capture","environment");sstvFile.click()};


const sstvModal=document.createElement("div");sstvModal.id="simpleSstvModal";sstvModal.innerHTML='<div class="sstv-modal-head"><b>REVIEW IMAGE</b><button id="sstvModalClose" aria-label="Close">×</button></div>';sstvModal.appendChild($("sstvTx"));rig.appendChild(sstvModal);
$("sstvModalClose").onclick=()=>{$("sstvTx").style.display="none";sstvModal.classList.remove("open")};
$("sstvBrowse").onclick=()=>{sstvFile.removeAttribute("capture");sstvFile.click()};
$("sstvTake").onclick=()=>{sstvFile.setAttribute("capture","environment");sstvFile.click()};
$("sstvSend").textContent="OK · SEND";$("sstvCancel").textContent="CANCEL";
if(sstvFile)document.body.appendChild(sstvFile);
if(sstv){sstv.querySelector("h3").textContent="SSTV IMAGE";sstv.querySelector("label")?.remove();sstvBtn.textContent="BROWSE IMAGE";sstvBtn.onclick=()=>{sstvFile.removeAttribute("capture");sstvFile.click()};const cam=document.createElement("button");cam.textContent="CAMERA";cam.id="sstvCamera";sstvBtn.after(cam);cam.onclick=()=>{sstvFile.setAttribute("capture","environment");sstvFile.click()}}
const fm=$("radioLinesDev"),audio=$("radioLineAudio");fm.classList.remove("open");
const fmBtn=document.createElement("button");fmBtn.id="simpleFM";fmBtn.textContent="FM OFF";top.querySelector("div:last-child").prepend(fmBtn);
fmBtn.onclick=()=>{drawer.classList.remove("open");fm.classList.toggle("open");fmBtn.textContent=fm.classList.contains("open")?"FM ON":"FM OFF";if(fm.classList.contains("open"))fm.scrollIntoView({behavior:"smooth",block:"start"})};
if(audio)audio.addEventListener("play",()=>{fm.classList.remove("open");drawer.classList.remove("open")});
document.querySelector(".panel:has(#us)")?.remove();$("locp")?.remove();const logPanel=$("log")?.closest(".panel");if(logPanel)logPanel.style.display="none";
const messages=document.createElement("section");messages.id="simpleMessages";messages.innerHTML='<div class="ribbon-head">LAST FIVE AUDIO MESSAGES</div><div id="recentAudioRibbons"><small>Waiting for radio traffic</small></div><div class="transcript-head"><b>MESSAGE TRANSCRIPTS</b><span id="whisperState">WHISPER · AUTO</span></div><div id="simpleTranscriptList"><small>Incoming messages appear here</small></div>';main.after(messages);
const css=[
"body{padding:0!important;background:#8f210f!important;overflow:hidden!important;height:100dvh!important}",
".rig{width:100%!important;max-width:520px!important;height:100dvh!important;min-height:0!important;overflow:hidden!important;padding:6px 9px!important;display:flex!important;flex-direction:column!important;gap:4px!important;border-radius:0!important}",
".brand{margin:0 5px!important;min-height:28px!important;max-height:28px!important;overflow:hidden!important}.brand h1{font-size:15px!important}",
"#simpleRadioTop{display:flex;align-items:center;justify-content:space-between;padding:2px 4px;min-height:34px;flex:0 0 34px}",
".simple-channel{display:flex;align-items:center;gap:8px;color:#f8dfd4;font:800 11px Arial,sans-serif;letter-spacing:1px}",
".simple-channel i{width:9px;height:9px;border-radius:50%;background:#f1d8cc;box-shadow:0 0 0 2px #ffffff44}",
"#simpleSkin{max-width:125px;min-height:30px!important;padding:4px!important;font:700 11px Arial!important;background:#6f1e12!important;color:#ffe8dd!important}",
"#simpleClose{width:30px;height:30px;border-radius:50%;background:#55170e;color:#fff;font:22px Arial}",
".lcd{padding:5px 8px!important;margin:0!important;flex:0 0 auto}.lcd .meter{display:block!important;margin-top:3px!important}.lcd .freq{font-size:clamp(19px,5vw,27px)!important;margin:1px 0!important;letter-spacing:1px!important}#st{font-size:10px!important;min-height:12px!important}.lcd .row{font-size:10px!important}.meter .lab{font-size:8px!important}.bars{height:8px!important;margin-top:1px!important}",
"#main{display:flex!important;flex-direction:column!important;align-items:center!important;gap:2px!important;margin:0!important;flex:0 0 auto}",
"#nm{width:100%!important;max-width:220px!important;min-height:34px!important;padding:6px!important;margin:0!important;text-align:center!important;background:#4f180f!important;color:#fff!important}",
"#ptt{width:min(29vw,168px)!important;height:min(29vw,168px)!important;min-width:118px!important;min-height:118px!important;max-width:168px!important;max-height:168px!important;aspect-ratio:1!important;margin:2px auto!important;border-radius:50%!important;font-size:17px!important;font-weight:900!important;touch-action:none!important;flex:0 0 auto}",
"#main .hint{color:#f4d4c7!important;font:10px Arial!important}",
"#simpleSquelch{display:flex;align-items:center;gap:8px;margin-top:3px;color:#e8c6b9;font:800 8px Arial;letter-spacing:1px}#simpleSquelch label{min-width:64px;display:flex;justify-content:space-between;gap:4px}#simpleSquelch input{height:10px;padding:0;margin:0;flex:1;accent-color:#f0b99e}",
"#simpleMessages{height:47dvh;min-height:0;max-height:none;flex:1 1 auto;display:flex;flex-direction:column;overflow:hidden;border:1px solid #f0cbbb88;border-radius:12px;background:#5d1a11dd;color:#fff0e8;padding:7px;gap:5px}",
".ribbon-head,.transcript-head{display:flex;justify-content:space-between;align-items:center;font:800 9px Arial;letter-spacing:1px;color:#f5d5c8}",
"#recentAudioRibbons{display:flex;gap:5px;overflow-x:auto;min-height:40px;padding-bottom:3px}",
".audio-ribbon{flex:0 0 92px;min-width:92px;border:1px solid #f2cdbb66;border-radius:8px;background:#7a2416;color:#fff1e9;padding:5px;font:10px Arial;text-align:left}",
".audio-ribbon b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.audio-ribbon small{display:block;color:#f2cbb9;margin-top:3px}",
"#simpleTranscriptList{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain}",
".transcript-item{padding:7px 5px;border-bottom:1px solid #f0d2c322;font:12px/1.4 Arial}.transcript-meta{display:flex;justify-content:space-between;color:#f3c6b2;font-size:9px;margin-bottom:3px}.transcript-text{color:#fff3ed;white-space:pre-wrap;overflow-wrap:anywhere}",
"#whisperState{font-size:8px;color:#f7d5c8}.empty-ribbon,.empty-transcript{font:11px Arial;color:#f0cdbf88;padding:8px}",
"#simpleMore,#simpleFM{position:static;z-index:25;width:auto;min-width:42px;height:30px;padding:0 9px;border-radius:8px;background:#641b10;border:1px solid #f0cbbb;color:#ffe7dc;font:800 10px Arial;box-shadow:0 2px 5px #0005}",
"#simpleMore{font-size:18px;min-width:30px;padding:0}#simpleFM{min-width:56px}",
"#simpleMoreDrawer{display:none;position:fixed;z-index:30;left:10px;bottom:52px;width:min(270px,calc(100vw - 20px));padding:12px;background:#58180f;border:1px solid #f0cbbb;border-radius:12px;box-shadow:0 10px 28px #0009;color:#ffeadf}",
"#simpleMoreDrawer.open{display:block}.more-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font:800 11px Arial}",
"#sstvPick{display:none;margin-top:8px;gap:6px}#sstvPick.open{display:grid;grid-template-columns:1fr 1fr}#sstvPick b{grid-column:1/-1;font:800 10px Arial;color:#f5d5c8}#sstvPick button{padding:9px;background:#e9c8b8;color:#51170e;font:800 11px Arial}",
"#simpleMoreDrawer label{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:9px 0;font:11px Arial}#simpleMoreDrawer select{max-width:145px;min-height:34px!important;font-size:11px!important}",
"#simpleMoreDrawer input{width:18px;height:18px}#simpleSstv{width:100%;padding:9px;background:#e9c8b8;color:#51170e;font:800 11px Arial}",
"#radioLinesDev{display:none!important;position:fixed!important;z-index:24!important;left:8px!important;right:8px!important;bottom:52px!important;top:auto!important;max-height:65dvh!important;overflow:auto!important;margin:0!important;background:#3e170f!important}",
"#radioLinesDev.open{display:block!important}#radioLinesDev .radio-scan{max-height:140px;overflow:auto}",
"#sstvP,#locp,.panel:has(#us),.panel:has(#log),#net{display:none!important}",
"#sstvP.simple-sstv.open{display:block!important;position:fixed!important;z-index:40!important;left:10px!important;right:10px!important;bottom:54px!important;max-height:65dvh!important;overflow:auto!important;background:#5d1a11!important;color:#fff0e8!important;padding:10px!important;border:1px solid #f0cbbb!important;border-radius:12px!important}",
"#simpleSstvRow{display:flex;align-items:center;gap:6px;flex:0 0 36px;min-height:36px;padding:3px 5px;border:1px solid #f0cbbb88;border-radius:9px;background:#5d1a11;color:#ffe9df;font:800 9px Arial;letter-spacing:1px}#simpleSstvRow span{flex:1}#simpleSstvRow button{height:28px;min-width:82px;background:#e9c8b8;color:#51170e;border-radius:7px;font:800 10px Arial}#simpleSstvModal{display:none;position:fixed;z-index:60;inset:0;background:#180b09ed;align-items:center;justify-content:center;padding:16px}#simpleSstvModal.open{display:flex}#simpleSstvModal #sstvTx{display:block!important;width:min(94vw,390px);max-height:90dvh;overflow:auto;background:#5d1a11;padding:10px;border:1px solid #f0cbbb;border-radius:12px}#simpleSstvModal canvas{width:100%!important;height:auto!important}.sstv-modal-head{display:flex;justify-content:space-between;align-items:center;color:#ffe9df;font:800 12px Arial;margin-bottom:8px}.sstv-modal-head button{background:#7b291b;color:white;padding:6px 10px}#simpleMoreDrawer{top:72px;bottom:auto;max-height:75dvh;overflow:auto}#simpleMoreDrawer.open{display:block}#simpleRadioTop>div:last-child{display:flex;align-items:center;gap:5px}@media(max-height:720px){#ptt{width:min(25vw,142px)!important;height:min(25vw,142px)!important;min-width:105px!important;min-height:105px!important}#simpleMessages{height:auto;min-height:0}#nm{min-height:28px!important;font-size:14px!important}#main .hint{display:none!important}}",
].join("\n");
const style=document.createElement("style");style.id="simpleRadioStyles";style.textContent=css;document.head.appendChild(style);
const statusButtonStyle=document.createElement("style");statusButtonStyle.textContent=`#radioPower{min-width:106px!important;padding:0 10px!important}#radioPower .power-glyph{display:none!important}.rig:not(.radio-powered) .lcd .meter{display:none!important}.rig.radio-powered .lcd .meter{display:block!important}.led.status-led{appearance:none;-webkit-appearance:none;cursor:default;border:1px solid #f0cbbb55;border-radius:8px;padding:4px 6px;min-width:34px;background:linear-gradient(#38130f,#1e0b09);color:#e9cabc;font:900 9px Arial;display:flex;flex-direction:column;align-items:center;gap:3px;box-shadow:inset 0 1px 2px #ffffff18}.led.status-led i{width:10px;height:10px;border-radius:50%;background:#292929;box-shadow:inset 0 1px 3px #000}.led.status-led.rx.on{color:#c9ffe0;border-color:#45ed8a88}.led.status-led.rx.on i{background:#45ed8a;box-shadow:0 0 10px #45ed8a}.led.status-led.tx.on{color:#ffd1ce;border-color:#ff514b99}.led.status-led.tx.on i{background:#ff514b;box-shadow:0 0 10px #ff514b}.led.status-led:focus{outline:1px solid #ffe0cf}.led.pw i{background:#333!important;box-shadow:inset 0 1px 3px #000!important}.led.pw.on i{background:#ffc247!important;box-shadow:0 0 10px #ffc247!important}#simpleSquelch{display:flex}#simpleRadioTop .simple-top-left{display:flex;align-items:center;gap:8px;min-width:0;flex:1}#radioPower{min-width:64px;height:32px;border-radius:18px;border:1px solid #f8d7c5;background:linear-gradient(#502017,#2a100c);color:#f8dfd3;display:flex;align-items:center;justify-content:center;gap:4px;font:900 9px Arial;box-shadow:inset 0 1px 2px #ffffff30,0 2px 5px #0007}#radioPower .power-glyph{font-size:21px}#radioPower.is-on{background:linear-gradient(#f5c35e,#a95c1a);color:#30140c;box-shadow:0 0 10px #ffb52d88}#ptt:disabled{opacity:.58;filter:saturate(.55)}.lcd .meter{display:none}#simpleRadioTop .leds{display:flex;gap:5px!important;align-items:center}`;document.head.appendChild(statusButtonStyle);

const powerStyle=document.createElement("style");powerStyle.textContent=`#simpleRadioTop .simple-top-left{display:flex;align-items:center;gap:8px;min-width:0;flex:1}#radioPower{height:31px;min-width:62px;padding:2px 8px;border-radius:18px;border:1px solid #f7d9c9;background:linear-gradient(180deg,#542018,#2c100c);color:#f5d8cc;display:flex;align-items:center;justify-content:center;gap:4px;box-shadow:inset 0 1px 2px #ffffff30,0 2px 5px #0007;font:900 9px Arial;letter-spacing:1px}#radioPower .power-glyph{font:22px Arial;line-height:1}#radioPower.is-on{background:linear-gradient(180deg,#f4c15d,#a65b1a);color:#32140b;border-color:#ffe6a8;box-shadow:0 0 10px #ffb52d88,inset 0 1px 2px #fff9}#radioPower:disabled{opacity:.7}#ptt:disabled{opacity:.55;filter:grayscale(.45);pointer-events:none}#simpleRadioTop .simple-channel{min-width:0}#simpleRadioTop>div:last-child{flex:0 0 auto}@media(max-width:390px){#radioPower{min-width:54px;height:29px;padding:1px 6px}#radioPower .power-glyph{font-size:19px}}`;document.head.appendChild(powerStyle);

const ledStyle=document.createElement("style");ledStyle.textContent=`.leds{gap:7px!important}.led{font:800 8px Arial!important;letter-spacing:1px}.led i{width:11px!important;height:11px!important;display:block}#ledpw.on i{background:#ffc247!important;box-shadow:0 0 10px #ffc247;animation:pwrGlow 2s ease-in-out infinite}#ledrx.on i{background:#45ed8a!important;box-shadow:0 0 12px #45ed8a;animation:rxBlink .55s steps(2,end) infinite}#ledtx.on i{background:#ff514b!important;box-shadow:0 0 13px #ff514b;animation:txBlink .28s steps(2,end) infinite}@keyframes pwrGlow{50%{box-shadow:0 0 3px #ffc247;opacity:.8}}@keyframes rxBlink{50%{opacity:.25;box-shadow:none}}@keyframes txBlink{50%{opacity:.15;box-shadow:none}}#simpleRadioTop{gap:7px!important;flex-wrap:nowrap!important}#simpleRadioTop .simple-channel{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#simpleRadioTop>div:last-child{display:flex;align-items:center;gap:4px}#simpleFM{min-width:48px!important;padding:0 6px!important}#simpleMore{min-width:26px!important;font-size:18px!important}#simpleSkin{max-width:88px!important;min-width:0!important}#simpleClose{flex:0 0 28px}#simpleSstvRow{margin-top:2px}@media(max-width:390px){.simple-channel{font-size:9px!important}.led{font-size:7px!important}.led i{width:9px!important;height:9px!important}#simpleSkin{max-width:72px!important}#simpleFM{min-width:42px!important;font-size:8px!important}}`;document.head.appendChild(ledStyle);

if(sstvFile)sstvFile.addEventListener("change",()=>{if(sstvFile.files&&sstvFile.files.length){sstvModal.classList.add("open");$("sstvTx").style.display="block";drawer.classList.remove("open")}});
$("sstvCancel")?.addEventListener("click",()=>{sstvModal.classList.remove("open");$("sstvTx").style.display="none"});
const oldRender=window.render;window.render=function(){if(oldRender)oldRender();if(!window.radio||!radio.name){ptt.textContent="POWER ON FIRST";ptt.className="";$("st").textContent="POWER OFF"}else if(!holding&&!granted&&!(radio.floor&&radio.floor.id!==radio.id))ptt.textContent="HOLD TO TALK"};
const powerBtn=$("radioPower"),powerText=$("radioPowerText");
let radioPowered=false;window.radioPowered=false;
function setRadioPower(on){
 radioPowered=!!on;window.radioPowered=radioPowered;
 powerBtn.classList.toggle("is-on",radioPowered);powerBtn.setAttribute("aria-pressed",String(radioPowered));powerBtn.setAttribute("aria-label",radioPowered?"Power off radio":"Power on radio");powerText.textContent=radioPowered?"POWER OFF":"POWER ON";
 if(ledPwr)ledPwr.classList.toggle("on",radioPowered);
 rig.classList.toggle("radio-powered",radioPowered);if(meterPanel)meterPanel.style.removeProperty("display");
 ptt.disabled=!radioPowered;ptt.setAttribute("aria-disabled",String(!radioPowered));ptt.textContent=radioPowered?"HOLD TO TALK":"POWER ON FIRST";
 $("st").textContent=radioPowered?"STANDBY":"POWER OFF";
}
function stopMic(){
 try{if(proc){proc.disconnect();proc.onaudioprocess=null;proc=null}}catch(e){}
 try{if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}}catch(e){}
 try{if(ac&&ac.state!=="closed")ac.close()}catch(e){}
 granted=false;holding=false;sstvTx=false;
}
powerBtn.addEventListener("click",()=>{
 if(powerBtn.disabled)return;
 if(!radioPowered){
  if(!name.value.trim()){name.focus();$("st").textContent="ENTER CALL SIGN";return}
  powerBtn.disabled=true;powerText.textContent="STARTING";
  try{
   // Invoke the existing join routine directly. The hidden legacy Join button
   // is not relied on for a mobile click event.
   const pending=go.onclick.call(go);
   if(window.radio&&radio.name){setRadioPower(true);$("st").textContent="CONNECTED · STANDBY"}
   else{setRadioPower(false);$("st").textContent="JOIN FAILED · CHECK CALL SIGN"}
   if(pending&&typeof pending.catch==="function")pending.catch(e=>{$("st").textContent="MIC ERROR · LISTEN ONLY";});
  }catch(e){setRadioPower(false);$("st").textContent="POWER ON FAILED"}
  powerBtn.disabled=false;
 }else{
  try{if(window.radio&&radio.name)radio.leave()}catch(e){}
  stopMic();try{start()}catch(e){}
  setRadioPower(false);
 }
});
// PTT is transmit-only. When the radio is off it displays POWER ON FIRST.
ptt.addEventListener("pointerdown",e=>{if(!radioPowered||!window.radio||!radio.name){e.preventDefault();e.stopImmediatePropagation()}},true);
ptt.addEventListener("click",e=>{if(!radioPowered||!window.radio||!radio.name){e.preventDefault();e.stopImmediatePropagation()}},true);
window.addEventListener("keydown",e=>{if(e.code==="Space"&&!radioPowered){e.preventDefault();e.stopImmediatePropagation()}},true);
setRadioPower(false);
let asr=null,asrLoading=null,queue=Promise.resolve();const done=new Set(),texts=new Map();
async function loadWhisper(){if(asr)return asr;if(asrLoading)return asrLoading;$("whisperState").textContent="WHISPER · LOADING";asrLoading=import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5").then(T=>T.pipeline("automatic-speech-recognition","onnx-community/whisper-base",{dtype:"q8"})).then(p=>{asr=p;$("whisperState").textContent="WHISPER · ON DEVICE";return p}).catch(e=>{$("whisperState").textContent="WHISPER · UNAVAILABLE";throw e});return asrLoading}
const sqlInput=$("simpleSquelchLevel");if(sqlInput){sqlInput.value=localStorage.getItem("sanketptt.squelch")||"0";$("simpleSquelchValue").textContent=sqlInput.value;sqlInput.oninput=()=>{$("simpleSquelchValue").textContent=sqlInput.value;localStorage.setItem("sanketptt.squelch",sqlInput.value)}}
function wavFloat(wav){const v=new DataView(wav),n=v.getUint32(40,true)/2,rate=v.getUint32(24,true),src=new Float32Array(n);for(let i=0;i<n;i++)src[i]=v.getInt16(44+i*2,true)/32768;const m=Math.floor(n*16000/rate),out=new Float32Array(m);for(let i=0;i<m;i++){const x=i*rate/16000,j=Math.floor(x),f=x-j;out[i]=src[j]*(1-f)+(src[Math.min(j+1,n-1)]||0)*f}return out}
function drawMessages(entries){const recent=$("recentAudioRibbons"),list=$("simpleTranscriptList");const incoming=entries.filter(e=>!e.mine);const last=incoming.slice(0,5);recent.innerHTML=last.length?"":'<small class="empty-ribbon">Waiting for incoming audio</small>';last.forEach(e=>{const b=document.createElement("button");b.className="audio-ribbon";b.innerHTML="<b></b><small></small>";b.querySelector("b").textContent=e.name||"Radio";b.querySelector("small").textContent=new Date(e.t0).toLocaleTimeString();b.onclick=()=>new Audio(URL.createObjectURL(new Blob([e.wav],{type:"audio/wav"}))).play().catch(()=>{});recent.appendChild(b)});list.innerHTML=incoming.length?"":'<small class="empty-transcript">Incoming messages appear here</small>';incoming.forEach(e=>{const item=document.createElement("article");item.className="transcript-item";const meta=document.createElement("div");meta.className="transcript-meta";const who=document.createElement("span");who.textContent=e.name||"Radio";const tm=document.createElement("time");tm.textContent=new Date(e.t0).toLocaleTimeString();meta.append(who,tm);const body=document.createElement("div");body.className="transcript-text";body.textContent=texts.get(e.key)||"Transcribing locally with Whisper…";item.append(meta,body);list.appendChild(item);if(!done.has(e.key)){done.add(e.key);queue=queue.then(async()=>{try{const pipe=await loadWhisper(),r=await pipe(wavFloat(e.wav),{task:"transcribe",chunk_length_s:30,stride_length_s:5});texts.set(e.key,(r.text||"").trim()||"No speech detected")}catch(err){texts.set(e.key,"Whisper unavailable: "+err.message)}drawMessages(window.rec?rec.entries:[])})}})}
if(window.rec){rec.onChange=entries=>{renderLog(entries);drawMessages(entries)};drawMessages(rec.entries||[])}
let fmWasPlaying=false,busy=false;function pauseFm(){if(audio&&!audio.paused){fmWasPlaying=true;audio.pause()}}
const oldDown=window.down;if(oldDown)window.down=function(e){pauseFm();return oldDown(e)};
setInterval(()=>{if(!window.radio)return;const f=radio.floor,active=!!(f&&(f.id!==radio.id||radio.talking));if(active&&!busy)pauseFm();if(!active&&busy&&fmWasPlaying&&audio){fmWasPlaying=false;audio.play().catch(()=>{})}busy=active},180);

if(typeof window.render==="function")window.render();
setInterval(()=>{const powered=!!(window.radio&&radio.name);if(powerBtn&&!powerBtn.disabled&&radioPowered&&!powered)setRadioPower(false);if(powered&&radioPowered&&!holding&&!granted&&!(radio.floor&&radio.floor.id!==radio.id))ptt.textContent="HOLD TO TALK"},500);
})();
(()=> {
  const channels=[
    {id:"virtual",name:"VIRTUAL"},
    {id:"boondock-sptt",name:"BOONDOCK SPTT"},
    {id:"police-ptt",name:"POLICE PTT"},
    {id:"hospital-ptt",name:"HOSPITAL PTT"},
    {id:"mall-ptt",name:"MALL PTT"},
    {id:"construction-ptt",name:"CONSTRUCTION PTT"},
    {id:"boondockecho-lte",name:"BOONDOCK ECHO LTE"}
  ];
  const rig=document.querySelector(".rig");
  const lcd=document.querySelector(".lcd");
  if(!rig||!lcd)return;
  const params=new URLSearchParams(location.search);
  const active=(params.get("ch")||"virtual").toLowerCase();
  const savedLayout=localStorage.getItem("sanketptt.radioLayout")||"standard";
  const autoPower=localStorage.getItem("sanketptt.autoPower")!=="off";
  const panel=document.createElement("section");
  panel.id="clientControls";
  panel.className="panel";
  panel.innerHTML='<h3><span>RADIO SETUP</span><span style="color:#e4b72e">CLIENT</span></h3>'+
    '<div class="control-row"><label>PTT CHANNEL<select id="pttChannelSelect"></select></label>'+
    '<label>SCREEN LAYOUT<select id="radioLayoutSelect"><option value="handheld">HANDHELD · SIMPLE</option><option value="standard">STANDARD</option><option value="control">CONTROL · FULL</option><option value="fm">FM CONSOLE · RADIO</option></select></label></div>'+
    '<label class="auto-row"><input type="checkbox" id="autoPowerToggle"> AUTO POWER ON AT STARTUP</label>'+
    '<div class="control-actions"><button type="button" id="fmToggle">📻 FM RADIO</button><button type="button" id="manualPower">POWER / JOIN</button></div>';
  lcd.after(panel);
  const channelSelect=panel.querySelector("#pttChannelSelect");
  channels.forEach(ch=>{const o=document.createElement("option");o.value=ch.id;o.textContent=ch.name;channelSelect.appendChild(o)});
  channelSelect.value=channels.some(c=>c.id===active)?active:"virtual";
  channelSelect.addEventListener("change",()=>{const u=new URL(location.href);u.searchParams.set("ch",channelSelect.value);location.href=u.toString()});
  const layoutSelect=panel.querySelector("#radioLayoutSelect");
  function setLayout(v){rig.dataset.layout=v;layoutSelect.value=v;localStorage.setItem("sanketptt.radioLayout",v);const fm=document.getElementById("radioLinesDev");if(fm)fm.classList.toggle("open",v==="control"||v==="fm")}
  setLayout(["handheld","standard","control","fm"].includes(savedLayout)?savedLayout:"standard");
  layoutSelect.addEventListener("change",()=>setLayout(layoutSelect.value));
  const autoToggle=panel.querySelector("#autoPowerToggle");autoToggle.checked=autoPower;
  autoToggle.addEventListener("change",()=>localStorage.setItem("sanketptt.autoPower",autoToggle.checked?"on":"off"));
  panel.querySelector("#fmToggle").addEventListener("click",()=>{const fm=document.getElementById("radioLinesDev");if(!fm)return;fm.classList.toggle("open");if(fm.classList.contains("open"))fm.scrollIntoView({behavior:"smooth",block:"start"})});
  panel.querySelector("#manualPower").addEventListener("click",()=>{document.getElementById("nm").focus();document.getElementById("login").scrollIntoView({behavior:"smooth",block:"center"})});
  const nameInput=document.getElementById("nm");
  if(!nameInput.value)nameInput.value=localStorage.getItem("nm")||"";
  if(autoPower){
    if(!nameInput.value)nameInput.value="SANKET AUTO";
    // Auto-join can run unattended after browser permissions have been granted.
    // GPS remains opt-in for automated startup.
    const gps=document.getElementById("shareloc");if(gps)gps.checked=false;
    setTimeout(()=>{if(localStorage.getItem("sanketptt.autoPower")!=="off"&&document.getElementById("login").style.display!=="none")document.getElementById("go").click()},1300);
  }
})();
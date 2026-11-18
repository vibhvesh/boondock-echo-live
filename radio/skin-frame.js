(function () {
  const skin = document.body.dataset.skin;
  const themes = {
    motorola: {
      bg: "#101317", frame: "#292e35", edge: "#c83232", lcd: "#17251c", screen: "#a8d878",
      accent: "#e43b35", glow: "#e43b3544", ptt: "#a92323", ptt2: "#ed4a36", font: "Arial, sans-serif",
      radius: "18px"
    },
    hytera: {
      bg: "#101812", frame: "#202a25", edge: "#65a832", lcd: "#b4d78b", screen: "#18351d",
      accent: "#75bd36", glow: "#78c83c55", ptt: "#1d542b", ptt2: "#54a82f", font: "Arial, sans-serif",
      radius: "24px"
    },
    kenwood: {
      bg: "#101a27", frame: "#303b49", edge: "#4e83bd", lcd: "#c6d8e8", screen: "#172f49",
      accent: "#4e91d0", glow: "#4e91d044", ptt: "#164a80", ptt2: "#2879bb", font: "Arial, sans-serif",
      radius: "14px"
    },
    baofeng: {
      bg: "#19140e", frame: "#28231d", edge: "#e47b1b", lcd: "#f0bd59", screen: "#38230d",
      accent: "#f28a20", glow: "#f28a2055", ptt: "#a54a0c", ptt2: "#ef8618", font: "'Share Tech Mono', monospace",
      radius: "10px"
    },
    sonim: {
      bg: "#111318", frame: "#242831", edge: "#e4b72e", lcd: "#182b49", screen: "#d5e4ff",
      accent: "#e4b72e", glow: "#e4b72e55", ptt: "#29384f", ptt2: "#d4a91f", font: "Arial, sans-serif",
      radius: "28px"
    }
  };
  const t = themes[skin] || themes.motorola;
  const frame = document.getElementById("radio-client");
  const css = `
    html,body{margin:0!important;min-height:100%!important;background:${t.bg}!important;padding:8px!important;font-family:${t.font}!important}
    .rig{max-width:520px!important;margin:0 auto!important;background:linear-gradient(145deg,${t.frame},#101318)!important;border:3px solid ${t.edge}!important;border-radius:${t.radius}!important;box-shadow:0 18px 42px #000b,inset 0 2px 0 #ffffff22!important;padding:16px!important}
    .brand h1{background:none!important;color:${t.accent}!important;-webkit-text-fill-color:${t.accent}!important;letter-spacing:1.5px!important}
    .brand small{color:#aeb8c4!important}
    .led.pw i{background:#f5bd28!important;box-shadow:0 0 10px #f5bd28!important}
    .lcd{background:linear-gradient(180deg,${t.lcd},${t.screen})!important;color:${t.screen}!important;border:3px solid #080b0d!important;box-shadow:inset 0 0 18px #000b,0 0 15px ${t.glow}!important;text-shadow:0 0 7px ${t.accent}!important}
    .lcd .row{color:inherit!important}
    .freq{color:inherit!important}
    .bars b.l{background:${t.accent}!important;box-shadow:0 0 6px ${t.accent}!important}
    .bars b.l.y{background:#f5c542!important}.bars b.l.r{background:#ef3939!important}
    .panel{background:#090d12cc!important;border:1px solid ${t.edge}55!important;border-radius:12px!important}
    .panel h3{color:${t.accent}!important}
    input{border-color:${t.edge}99!important}
    #go{background:linear-gradient(135deg,#50c878,${t.accent})!important;box-shadow:0 4px 0 #111!important}
    #ptt{width:min(74vw,285px)!important;height:min(74vw,285px)!important;max-width:285px!important;max-height:285px!important;aspect-ratio:1/1!important;border-radius:50%!important;background:radial-gradient(circle at 35% 28%,${t.ptt2},${t.ptt} 70%)!important;border:5px solid #080b0d!important;box-shadow:0 0 0 3px ${t.edge},0 0 24px ${t.glow},inset 0 -8px 16px #0008!important}
    #ptt.on{background:radial-gradient(circle at 35% 28%,#ff7770,#b30000 70%)!important;box-shadow:0 0 0 3px #ff3b30,0 0 36px #ff3020!important}
    #ptt.busy{background:radial-gradient(circle at 35% 28%,#ffe39a,#b36a00 70%)!important}
    #log li .cs{color:${t.accent}!important}
    #map{border-color:${t.edge}88!important}
    #net{color:#aab6c3!important}
    a{color:${t.accent}!important}
    ${skin === "motorola" ? ".rig:before,.rig:after{width:13px;height:13px;background:radial-gradient(#e8e8e8,#555)!important}.rig{border-left:5px solid #7d858e!important;border-right:5px solid #7d858e!important}" : ""}
    ${skin === "hytera" ? ".lcd{border-radius:7px!important}.freq{letter-spacing:1px!important}.rig{box-shadow:0 0 0 4px #151a17,0 18px 42px #000b!important}" : ""}
    ${skin === "kenwood" ? ".lcd{border-radius:5px!important}.freq{font-family:Arial,sans-serif!important;letter-spacing:2px!important}.rig{border-radius:12px!important}" : ""}
    ${skin === "baofeng" ? ".lcd{border-radius:3px!important;text-shadow:none!important}.freq{font-family:'Share Tech Mono',monospace!important}.panel h3{letter-spacing:1px!important}" : ""}
    ${skin === "sonim" ? ".rig{border:6px solid #d6aa26!important;box-shadow:0 0 0 3px #111,0 18px 42px #000c!important}.panel{border-radius:18px!important}#ptt{border-radius:50%!important;width:min(74vw,285px)!important;height:min(74vw,285px)!important;max-width:285px!important;max-height:285px!important;aspect-ratio:1/1!important}" : ""}
  `;
  function apply() {
    try {
      const doc = frame.contentDocument;
      if (!doc || !doc.head) return;
      let style = doc.getElementById("sanket-radio-skin");
      if (!style) { style = doc.createElement("style"); style.id = "sanket-radio-skin"; doc.head.appendChild(style); }
      style.textContent = css;
      doc.documentElement.style.background = t.bg;
    } catch (e) {}
  }
  frame.addEventListener("load", apply);
  setTimeout(apply, 700);
  document.title = "SanketPTT · " + skin.charAt(0).toUpperCase() + skin.slice(1) + " Radio";
})();
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CrrtEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  // Defaults = values in the original spreadsheet's 輸入表單 (plus new fields)
  var DEFAULTS = {
    weight:60, mode:"CVVHDF", dose:25, qb:180, hours:24, hct:30,
    netuf:100, dratio:50, prepct:70, pbp:0, round10:true, bagFluid:5000, bagEff:5000,
    ac:"肝素", hepBolus:0, hepMaint:0, hepU:25000, hepMl:50, hepSyr:50, hepBolusKg:"", hepMaintKg:"", hepTarget:"",
    rcaCit:"院內RCA流程", rcaCa:"院內鈣回輸流程", notes:""
  };
  // Prismaflex System Specifications (heparin pump): continuous rate "0 or min–max" mL/h, increment 0.1; bolus volume range mL
  var SYR = {
    10:{min:0.1, max:5,  bmin:0.5, bmax:5},
    20:{min:0.5, max:5,  bmin:0.5, bmax:5},
    30:{min:0.5, max:10, bmin:1,   bmax:5},
    50:{min:2,   max:20, bmin:2,   bmax:9.9}
  };
  function syrSpec(v){ return SYR[String(n(v))] || SYR["50"]; }
  function n(v){ var x = parseFloat(v); return isFinite(x) ? x : 0; }
  function has(v){ return v !== "" && v !== null && isFinite(parseFloat(v)); }
  function fmt(v, d){ if (v === null || !isFinite(v)) return "–"; return Number(v).toLocaleString("en-US",{minimumFractionDigits:d||0, maximumFractionDigits:d||0}); }
  function rnd(x, step){ return Math.round(x/step)*step; }

  function calc(st){
    var W = n(st.weight), dose = n(st.dose), qb = n(st.qb), H = n(st.hours), nuf = n(st.netuf);
    var pbpRaw = n(st.pbp), pbp = st.round10 ? rnd(pbpRaw, 10) : pbpRaw, ratio = Math.min(Math.max(n(st.dratio),0),100), prep = Math.min(Math.max(n(st.prepct),0),100);
    var target = W * dose;
    var treat = Math.max(target - nuf - pbp, 0);
    var qd, qr;
    if (st.mode === "CVVHD"){ qd = treat; qr = 0; }
    else if (st.mode === "CVVH"){ qd = 0; qr = treat; }
    else { qd = treat * ratio / 100; qr = treat - qd; }
    var raw = {qd:qd, qr:qr, pbp:pbpRaw};
    // Prismaflex increments: dialysate & replacement 50 mL/h, PBP 10 mL/h
    if (st.round10){ qd = rnd(qd, 50); qr = rnd(qr, 50); }
    var pre = st.mode === "CVVHD" ? 0 : Math.round(qr * prep / 100);
    var post = qr - pre;
    var eff = qd + qr + pbp + nuf;
    var actual = W > 0 ? eff / W : 0;
    var hctOk = has(st.hct) && n(st.hct) > 5 && n(st.hct) < 75;
    var qp = hctOk ? qb * 60 * (1 - n(st.hct)/100) : null;
    var pdf = (qp && qp > 0) ? qp / (qp + pre + pbp) : null;
    var effDose = pdf !== null ? actual * pdf : null;
    var ff = (qp && qp > 0) ? (pre + post + pbp + nuf) / (qp + pre + pbp) * 100 : null;
    var conc = n(st.hepMl) > 0 ? n(st.hepU) / n(st.hepMl) : 0;
    var hep = {
      bolus:n(st.hepBolus), maint:n(st.hepMaint), conc:conc,
      bolusMl: conc > 0 ? n(st.hepBolus)/conc : null,
      rateMl: conc > 0 ? n(st.hepMaint)/conc : null,
      bolusKg: W > 0 ? n(st.hepBolus)/W : null,
      maintKg: W > 0 ? n(st.hepMaint)/W : null
    };
    hep.syrHrs = (hep.rateMl && hep.rateMl > 0) ? n(st.hepMl) / hep.rateMl : null;
    return {W:W, dose:dose, qb:qb, H:H, nuf:nuf, pbp:pbp, target:target, treat:treat, qd:qd, qr:qr, pre:pre, post:post,
      prePct: qr > 0 ? pre/qr*100 : 0, eff:eff, actual:actual, qp:qp, pdf:pdf, effDose:effDose, ff:ff, hep:hep, raw:raw,
      nufKg: W > 0 ? nuf/W : null, mode:st.mode, ac:st.ac, st:st};
  }

  function checks(r){
    var st = r.st, L = [];
    function add(lv, t){ L.push({lv:lv, t:t}); }
    if (!(r.W > 0)) add("crit", "請輸入體重，否則無法換算劑量。");
    if (!(r.dose > 0)) add("crit", "請輸入目標劑量。");
    if (r.W > 0 && r.dose > 0 && r.target - r.nuf - r.pbp <= 0)
      add("crit", "目標 Effluent（" + fmt(r.target) + " mL/hr）≤ Net UF + PBP，無法分配透析液/置換液。請提高目標劑量或降低 Net UF / PBP。");
    if (!(r.qb > 0)) add("crit", "請輸入血流量 Qb。");
    else if (r.qb < 100 || r.qb > 300) add("warn", "Qb " + fmt(r.qb) + " mL/min 超出一般 CRRT 範圍（約 100–300），請再次確認。");
    else if (r.qb < 150 || r.qb > 200) add("info", "Qb " + fmt(r.qb) + " mL/min 不在 Prismaflex 常用的 150–200 範圍，請確認血路狀況與醫囑。");
    if (r.W > 0 && r.eff > 0){
      if (r.actual < 20) add("warn", "實際劑量 " + fmt(r.actual,1) + " mL/kg/hr 低於 KDIGO 建議的 20–25 mL/kg/hr。");
      else if (r.actual > 35) add("info", "實際劑量 " + fmt(r.actual,1) + " mL/kg/hr 偏高（> 35），請確認醫囑；高劑量可能增加電解質與藥物移除。");
      if (r.effDose !== null && r.actual >= 20 && r.effDose < 20) add("info", "考量前稀釋後的有效劑量約 " + fmt(r.effDose,1) + " mL/kg/hr，低於 20；如需達標可提高處方劑量或增加 Post 比例。");
    }
    if (r.ff === null) add("info", "未填 Hct，無法估算 FF 與前稀釋校正劑量。");
    else if (r.ff > 25) add("warn", "過濾分率 FF " + fmt(r.ff,1) + "% > 25%，濾器凝血風險高。可提高 Qb、增加 Pre 比例或提高 CVVHDF 透析液比例。");
    else if (r.ff > 20) add("info", "過濾分率 FF " + fmt(r.ff,1) + "% 介於 20–25%，請留意濾器凝血。");
    if (r.nufKg !== null && r.nufKg > 1.75) add("info", "淨脫水 " + fmt(r.nufKg,2) + " mL/kg/hr（> 1.75）屬較高強度，請密切觀察血行動力學。");
    if (st.mode === "CVVHDF" && (n(st.dratio) === 0 || n(st.dratio) === 100)) add("info", "透析液比例 " + fmt(n(st.dratio)) + "% 實際上等同 " + (n(st.dratio) === 0 ? "CVVH" : "CVVHD") + "。");
    if (st.ac === "無" && st.mode !== "CVVHD" && r.qr > 0 && r.prePct < 50) add("info", "無抗凝時，可考慮提高置換液 Pre 比例（原表單建議 50–100%）以降低凝血。");
    if (st.ac === "肝素"){
      if (!(r.hep.maint > 0)) add("info", "已選擇肝素，但維持劑量為 0 U/hr，請確認醫囑。");
      if (r.hep.maint > 0 && !(r.hep.conc > 0)) add("warn", "請填寫肝素注射筒配製（總量與稀釋體積），才能換算 mL/hr。");
      var sp = syrSpec(st.hepSyr), sz = fmt(n(st.hepSyr)), rng = "0 或 " + sp.min + "–" + sp.max + " mL/hr";
      if (n(st.hepMl) > n(st.hepSyr)) add("warn", "稀釋體積 " + fmt(n(st.hepMl)) + " mL 大於注射筒規格 " + sz + " mL，請確認配製或改選較大注射筒。");
      if (r.hep.rateMl !== null && r.hep.maint > 0){
        if (r.hep.rateMl < sp.min)
          add("warn", "肝素幫浦速率 " + fmt(r.hep.rateMl,2) + " mL/hr 低於 " + sz + " mL 注射筒的最低連續速率 " + sp.min + " mL/hr（Prismaflex 規格：" + rng + "）。可把肝素稀釋得更淡（同劑量需要更多 mL），或改用最低速率較低的注射筒。");
        else if (r.hep.rateMl > sp.max)
          add("warn", "肝素幫浦速率 " + fmt(r.hep.rateMl,2) + " mL/hr 高於 " + sz + " mL 注射筒的最高連續速率 " + sp.max + " mL/hr（Prismaflex 規格：" + rng + "）。可提高肝素濃度，或改用較大的注射筒。");
        else if (Math.abs(r.hep.rateMl*10 - Math.round(r.hep.rateMl*10)) > 1e-6)
          add("info", "Prismaflex 注射筒速率以 0.1 mL/hr 為刻度，" + fmt(r.hep.rateMl,2) + " mL/hr 實際只能設為 " + fmt(Math.round(r.hep.rateMl*10)/10,1) + " mL/hr（約 " + fmt(Math.round(r.hep.rateMl*10)/10*r.hep.conc) + " U/hr）。");
      }
      if (r.hep.bolusMl !== null && r.hep.bolus > 0 && (r.hep.bolusMl < sp.bmin || r.hep.bolusMl > sp.bmax))
        add("warn", "肝素 Bolus " + fmt(r.hep.bolusMl,2) + " mL " + (r.hep.bolusMl < sp.bmin ? "低於" : "高於") + " " + sz + " mL 注射筒可給的 Bolus 範圍 " + sp.bmin + "–" + sp.bmax + " mL；可改由其他途徑推注或調整濃度。");
    }
    if (st.ac === "RCA（枸櫞酸）" && !(r.pbp > 0)) add("info", "RCA 通常以 PBP 給予枸櫞酸；目前 PBP 為 0，劑量計算未含枸櫞酸流量。");
    if (st.round10 && (Math.abs(r.raw.qd - r.qd) >= 1 || Math.abs(r.raw.qr - r.qr) >= 1 || Math.abs(r.raw.pbp - r.pbp) >= 1))
      add("info", "設定值已依機器刻度取整（透析液/置換液 50、PBP 10 mL/hr），實際劑量依取整後數值重算：" + fmt(r.actual,1) + " mL/kg/hr。");
    if (r.qb > 0 && r.qb % 10 !== 0) add("info", "Prismaflex 血流量以 10 mL/min 為刻度，" + fmt(r.qb) + " mL/min 無法直接設定。");
    if (!(r.H > 0)) add("warn", "請輸入預計治療時數。");
    if (!L.some(function(x){ return x.lv === "crit" || x.lv === "warn"; })) L.unshift({lv:"ok", t:"處方分配合理，無需特別處理的警示。"});
    return L;
  }

  return {DEFAULTS:DEFAULTS, SYR:SYR, syrSpec:syrSpec, n:n, has:has, fmt:fmt, rnd:rnd, calc:calc, checks:checks};
});

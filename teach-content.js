(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CrrtTeachContent = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var SOURCES = {
    kdigo: { label: "KDIGO AKI 2012", url: "https://kdigo.org/wp-content/uploads/2016/10/KDIGO-2012-AKI-Guideline-English.pdf", cite: "KDIGO AKI Work Group. KDIGO Clinical Practice Guideline for Acute Kidney Injury. Kidney Int Suppl 2012;2:1–138." },
    neri: { label: "Neri 2016", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5056503/", cite: "Neri M, et al. Nomenclature for renal replacement therapy in acute kidney injury: basic principles. Crit Care 2016;20:318." },
    renal: { label: "RENAL 2009", url: "https://pubmed.ncbi.nlm.nih.gov/19846848/", cite: "RENAL Replacement Therapy Study Investigators. Intensity of continuous renal-replacement therapy in critically ill patients. N Engl J Med 2009;361:1627–38." },
    atn: { label: "ATN 2008", url: "https://pubmed.ncbi.nlm.nih.gov/18492867/", cite: "VA/NIH Acute Renal Failure Trial Network. Intensity of renal support in critically ill patients with acute kidney injury. N Engl J Med 2008;359:7–20." },
    starrt: { label: "STARRT-AKI 2020", url: "https://pubmed.ncbi.nlm.nih.gov/32668114/", cite: "STARRT-AKI Investigators. Timing of initiation of renal-replacement therapy in acute kidney injury. N Engl J Med 2020;383:240–51." },
    akiki2: { label: "AKIKI 2 2021", url: "https://pubmed.ncbi.nlm.nih.gov/33812488/", cite: "Gaudry S, et al. Comparison of two delayed strategies for renal replacement therapy initiation for severe acute kidney injury (AKIKI 2). Lancet 2021;397:1293–300." },
    rich: { label: "RICH 2020", url: "https://pubmed.ncbi.nlm.nih.gov/33095849/", cite: "Zarbock A, et al. Effect of regional citrate anticoagulation vs systemic heparin anticoagulation during CKRT (RICH). JAMA 2020;324:1629–39." },
    schneider: { label: "Schneider 2017", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5694623/", cite: "Schneider AG, Journois D, Rimmelé T. Complications of regional citrate anticoagulation: accumulation or overload? Crit Care 2017;21:281." },
    davenport: { label: "Davenport 2009", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4421325/", cite: "Davenport A, Tolwani A. Citrate anticoagulation for CRRT in patients with AKI admitted to the ICU. NDT Plus 2009;2:439–47." },
    link: { label: "Link 2012", url: "https://pubmed.ncbi.nlm.nih.gov/22643456/", cite: "Link A, et al. Total-to-ionized calcium ratio predicts mortality in CRRT with citrate anticoagulation in critically ill patients. Crit Care 2012;16:R97." },
    ash: { label: "ASH HIT 2018", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6258919/", cite: "Cuker A, et al. American Society of Hematology 2018 guidelines: heparin-induced thrombocytopenia. Blood Adv 2018;2:3360–92." },
    murugan: { label: "Murugan 2019", url: "https://pubmed.ncbi.nlm.nih.gov/31173127/", cite: "Murugan R, et al. Association of net ultrafiltration rate with mortality … secondary analysis of the RENAL trial. JAMA Netw Open 2019;2:e195418." },
    demirjian: { label: "Demirjian 2011", url: "https://pubmed.ncbi.nlm.nih.gov/21382993/", cite: "Demirjian S, et al. Hypophosphatemia during continuous hemodialysis is associated with prolonged respiratory failure. Nephrol Dial Transplant 2011;26:3508–14." },
    roberts: { label: "Roberts 2012", url: "https://pubmed.ncbi.nlm.nih.gov/22511133/", cite: "Roberts DM, et al. Variability of antibiotic concentrations in critically ill patients receiving CRRT: a multicentre pharmacokinetic study. Crit Care Med 2012;40:1523–8." },
    relieve: { label: "RELIEVE-AKI 方案", url: "https://pubmed.ncbi.nlm.nih.gov/37419639/", cite: "Murugan R, et al. Restrictive versus Liberal Rate of Extracorporeal Volume Removal Evaluation in AKI (RELIEVE-AKI): study protocol. BMJ Open 2023;13:e075960." },
    cardoso: { label: "Cardoso 2018", url: "https://pubmed.ncbi.nlm.nih.gov/28859230/", cite: "Cardoso FS, et al. Continuous renal replacement therapy is associated with reduced serum ammonia levels and mortality in acute liver failure. Hepatology 2018;67:711–20." },
    slack: { label: "Slack 2014", url: "https://pubmed.ncbi.nlm.nih.gov/23786538/", cite: "Slack AJ, et al. Ammonia clearance with haemofiltration in adults with liver disease. Liver Int 2014;34:42–8." },
    murphy: { label: "Murphy 2004", url: "https://pubmed.ncbi.nlm.nih.gov/14767999/", cite: "Murphy N, et al. The effect of hypertonic sodium chloride on intracranial pressure in patients with acute liver failure. Hepatology 2004;39:464–70." },
    yessayan: { label: "Yessayan 2014", url: "https://pubmed.ncbi.nlm.nih.gov/24792353/", cite: "Yessayan L, et al. Treatment of severe hyponatremia in patients with kidney failure: role of CVVH with low-sodium replacement fluid. Am J Kidney Dis 2014;64:305–10." },
    cathedia: { label: "Cathedia 2008", url: "https://pubmed.ncbi.nlm.nih.gov/18505951/", cite: "Parienti JJ, et al. Femoral vs jugular venous catheterization and risk of nosocomial events in adults requiring acute RRT. JAMA 2008;299:2413–22." },
    hf20: { label: "NCT02561247", url: "https://clinicaltrials.gov/study/NCT02561247", cite: "Prismaflex HF20 Set 臨床試驗方案（單一套組最長使用 72 小時）。M60／M100／M150 等套組請以該套組 IFU 確認。" },
    citTrial: { label: "NCT02860130", url: "https://clinicaltrials.gov/study/NCT02860130", cite: "Prismocitrate 18 臨床試驗方案（以 Warning: Filter Clotted、Advisory TMP Too High 定義管路壽命終點）。" }
  };

  // 每個情境都由 CrrtEngine.calc 即時計算；expect 由 tests/teach.test.js 核對，內文數字改動時要一起改。
  var CASES = [
    {
      id: "sepsis",
      title: "敗血性休克 AKI 的第一張處方",
      tag: "劑量・肝素幫浦換算",
      stem: "68 歲男性，肺炎併敗血性休克，norepinephrine 0.2 μg/kg/min，KDIGO 第 3 期 AKI，無尿 18 小時。K 6.4 mmol/L、pH 7.16，內科治療後仍未改善。血小板 180 k/μL，無活動性出血。",
      facts: ["體重 70 kg", "Hct 30%", "Qb 180 mL/min", "CVVHDF，透析液 50%，Pre 70%", "Net UF 先設 0", "肝素維持 500 U/hr"],
      question: "主治醫師說「劑量開 25 就好」。實際能給到多少？肝素用院內習慣的 25,000 U／50 mL，幫浦跑得動嗎？",
      base: { weight: 70, mode: "CVVHDF", qb: 180, hct: 30, netuf: 0, dratio: 50, prepct: 70, ac: "肝素", hepMaint: 500, hepSyr: 50, hepMl: 50 },
      scenarios: [
        { label: "劑量 25，肝素 25,000 U／50 mL", patch: { dose: 25, hepU: 25000 }, expect: { eff: 1800, actual: 25.7, effDose: 23.7, ff: 11, level: "warn" } },
        { label: "劑量 25，肝素改 10,000 U／50 mL", patch: { dose: 25, hepU: 10000 }, expect: { eff: 1800, actual: 25.7, effDose: 23.7, ff: 11, level: "ok" } },
        { label: "劑量 30，肝素 10,000 U／50 mL", patch: { dose: 30, hepU: 10000 }, expect: { eff: 2100, actual: 30, effDose: 27.3, ff: 12.7, level: "ok" } }
      ],
      read: [
        "難治性高血鉀合併酸血症是緊急適應症，不屬於「可以等一等」的情境。STARRT-AKI 比的是<em>沒有</em>緊急適應症的病人。",
        "KDIGO 的 20–25 mL/kg/hr 是<strong>實際給到</strong>的劑量，且指引註明通常要開得更高。處方 25 經前稀釋校正後是 23.7；假設停機 15%（教學假設），只剩約 20，貼著下限。處方 30 校正後 27.3，同樣假設下約 23。",
        "500 U/hr ÷ 500 U/mL = 1 mL/hr，低於 50 mL 注射筒最低連續速率 2 mL/hr，幫浦無法執行。改成 200 U/mL 後是 2.5 mL/hr，就在範圍內。"
      ],
      plan: [
        "處方 Effluent 30 mL/kg/hr，並每日比對處方與實際給予的差距。",
        "血行動力學不穩，以 CRRT 優先（KDIGO 2B）；先處理高血鉀與酸血症，休克穩定後再談 Net UF。",
        "KDIGO 對無禁忌者建議 RCA 優先於肝素（2B）。若院內流程使用肝素，要確認注射筒濃度換算後速率落在規格內。",
        "連續治療後要追磷、鉀、鎂；RENAL 的低血磷發生率為 54%（低劑量組）到 65%（高劑量組）。",
        "抗生素濃度在 CRRT 期間個體差異大，與藥師討論劑量並盡量做血中濃度監測。"
      ],
      pitfall: "「更高劑量更好」沒有證據：RENAL（40 vs 25）與 ATN（35 vs 20）都沒有降低死亡率。開到 30 是為了補償耗損，不是為了提高治療強度。",
      src: ["kdigo", "starrt", "renal", "atn", "roberts"]
    },
    {
      id: "clot",
      title: "濾器 12 小時內凝了兩次",
      tag: "過濾分率・Pre／Post",
      stem: "54 歲男性，多發創傷後 AKI，體重 85 kg，輸血後 Hct 42%。使用全 Post 的 CVVH，第 1 套用 9 小時、第 2 套用 3 小時即凝血，治療時間一直被中斷。護理師回報 TMP 持續上升，Effluent 達不到設定。",
      facts: ["體重 85 kg", "Hct 42%", "Qb 150 mL/min", "CVVH，Pre 0%／Post 100%", "目標 30 mL/kg/hr", "Net UF 100 mL/hr"],
      question: "同事想先加肝素。先算 FF：這個處方的濾器裡發生了什麼事？不降劑量時，可以依序調哪些設定？",
      base: { weight: 85, dose: 30, hct: 42, netuf: 100, ac: "無" },
      scenarios: [
        { label: "目前：CVVH 全 Post，Qb 150", patch: { mode: "CVVH", qb: 150, prepct: 0 }, expect: { eff: 2550, actual: 30, effDose: 30, ff: 48.9, level: "warn" } },
        { label: "Qb 提高到 200", patch: { mode: "CVVH", qb: 200, prepct: 0 }, expect: { eff: 2550, actual: 30, effDose: 30, ff: 36.6, level: "warn" } },
        { label: "Qb 200，再改 Pre 70%", patch: { mode: "CVVH", qb: 200, prepct: 70 }, expect: { eff: 2550, actual: 30, effDose: 24.1, ff: 29.4, level: "warn" } },
        { label: "Qb 200，改 CVVHDF 透析液 50%，Pre 70%", patch: { mode: "CVVHDF", qb: 200, dratio: 50, prepct: 70 }, expect: { eff: 2600, actual: 30.6, effDose: 27.2, ff: 17.2, level: "ok" } }
      ],
      read: [
        "FF 48.9%：Qp 只有 5,220 mL/hr，卻要從中濾掉 2,550 mL/hr，遠超過常用的 20–25% 上限。血液在濾器尾端被濃縮，加抗凝只是治標。",
        "Hct 偏高會直接壓低血漿流量，同樣的 Qb 能濾的量就變少。",
        "三步驟分別把 FF 降到 36.6%、29.4%、17.2%。把一部分對流量改成擴散（透析液不計入 FF）的效果最大。",
        "代價是前稀釋會降低有效劑量：最後一列實際 30.6，校正後 27.2，仍可接受。"
      ],
      plan: [
        "先查血路：管路是否扭曲、Access 壓力是否過負、導管位置與功能是否正常。Qb 提高的前提是導管撐得住。",
        "依序調整 Qb、Pre 比例、透析液比例，每一步都重算 FF 與校正劑量。",
        "再依出血風險決定抗凝方式。Advisory TMP Too High 或 Filter Clotted 出現時要準備換套組；已凝血的濾器不要硬撐。",
        "記錄每套濾器壽命與停機時數，檢討處方時一起看。"
      ],
      pitfall: "只看 FF 公式會以為提高 Qb 一定有用。若導管功能不良，提高 Qb 只會帶來更多 Access 警報與停機，反而傷害實際劑量。",
      src: ["neri", "kdigo", "citTrial", "hf20"]
    },
    {
      id: "rca",
      title: "術後高出血風險用 RCA，隔天肝臟出事",
      tag: "RCA・枸櫞酸蓄積",
      stem: "71 歲女性，腸繫膜缺血術後第 1 天，傷口持續滲血，AKI 需要 CRRT，主治決定用 RCA。使用 18 mmol/L 枸櫞酸溶液經 PBP、無鈣透析液，鈣由獨立路徑回輸。第 2 天休克惡化：lactate 9 mmol/L、膽紅素上升、陰離子間隙代謝性酸中毒，鈣回輸速率一直往上加。總鈣 2.6、iCa 0.9 mmol/L。",
      facts: ["體重 70 kg", "Hct 30%", "Qb 150 mL/min", "CVVHD＋PBP", "目標 30 mL/kg/hr", "Net UF 100 mL/hr"],
      question: "第一天 PBP 要開多少才有 3 mmol/L 血液？第二天總鈣／iCa 比是多少？是蓄積還是過量？",
      base: { weight: 70, dose: 30, hct: 30, netuf: 100, ac: "RCA（枸櫞酸）", rcaCit: "18 mmol/L 枸櫞酸，經 PBP", rcaCa: "鈣回輸依院內流程" },
      scenarios: [
        { label: "忘了填 PBP（劑量看似正確）", patch: { mode: "CVVHD", qb: 150, pbp: 0 }, expect: { eff: 2100, actual: 30, effDose: 30, ff: 1.6, level: "ok" } },
        { label: "第 1 天：Qb 150，PBP 1,500", patch: { mode: "CVVHD", qb: 150, pbp: 1500 }, expect: { eff: 2100, actual: 30, effDose: 24.2, ff: 20.5, level: "ok" } },
        { label: "第 2 天：Qb 120，PBP 1,200，透析液增加", patch: { mode: "CVVHD", qb: 120, pbp: 1200 }, expect: { eff: 2100, actual: 30, effDose: 24.2, ff: 20.8, level: "ok" } },
        { label: "未改善：停枸櫞酸，無抗凝 CVVHDF，Pre 100%", patch: { mode: "CVVHDF", qb: 150, pbp: 0, dratio: 50, prepct: 100, ac: "無" }, expect: { eff: 2100, actual: 30, effDose: 25.9, ff: 15.1, level: "ok" } }
      ],
      read: [
        "PBP 算法：150 mL/min = 9 L/hr；9 × 3 mmol/L = 27 mmol/hr；27 ÷ 18 mmol/L = 1.5 L/hr。枸櫞酸劑量與 Qb 綁定。",
        "PBP 要計入 Effluent 與 FF。第一列漏填時 FF 只有 1.6%，看起來很漂亮，但機器實際設定會是第二列的 20.5%。",
        "總鈣／iCa = 2.6 ÷ 0.9 = 2.9，大於 2.5，加上陰離子間隙酸中毒與鈣需求增加，符合<strong>枸櫞酸蓄積</strong>。Link 2012 的觀察則以 ≥ 2.4 作為預後不良的切點。",
        "蓄積（代謝能力不足，可能致命）與<strong>過量</strong>（給太多、比值正常、代謝性鹼中毒，良性）處理方向不同。"
      ],
      plan: [
        "快速降低枸櫞酸淨負荷：降 Qb（連帶減少枸櫞酸）、提高透析液增加移除，或降低目標濃度。第三列的枸櫞酸由 27 降到 21.6 mmol/hr。",
        "若沒有快速改善，改用其他迴路抗凝方式。<strong>不要停 CRRT</strong>，因為還要靠它清除枸櫞酸鈣複合物。",
        "繼續矯正低 iCa，並處理休克與肝灌流不良這個根本原因。",
        "RCA 常規追蹤：濾器後 iCa（常見目標 0.2–0.35 mmol/L）、系統 iCa、總鈣／iCa 比、酸鹼；頻率依院內流程。"
      ],
      pitfall: "看到酸中毒就加快透析或補鹼之前，先算總鈣／iCa 比。休克合併 lactate 上升時，RCA 開始前就要評估代謝能力；目前沒有公認的 lactate 禁用閾值。",
      src: ["kdigo", "schneider", "davenport", "link", "rich"]
    },
    {
      id: "hit",
      title: "計算全綠，但肝素不該再用",
      tag: "HIT・非肝素抗凝",
      stem: "62 歲女性，體重 62 kg，CRRT 使用肝素第 7 天。血小板由 210 掉到 85 k/μL，48 小時內濾器凝血 2 次，右上肢超音波發現導管相關新血栓。近期無其他明顯導致血小板下降的新藥，但仍有敗血症。",
      facts: ["體重 62 kg", "Hct 28%", "目標 30 mL/kg/hr", "Net UF 50 mL/hr", "肝素 1,000 U/hr", "25,000 U／50 mL"],
      question: "4Ts 幾分？若只把抗凝改成 RCA，病人的 HIT 算處理完了嗎？",
      base: { weight: 62, dose: 30, hct: 28, netuf: 50, hepU: 25000, hepMl: 50, hepSyr: 50 },
      scenarios: [
        { label: "維持肝素 1,000 U/hr", patch: { mode: "CVVHDF", qb: 150, dratio: 50, prepct: 70, ac: "肝素", hepMaint: 1000 }, expect: { eff: 1850, actual: 29.8, effDose: 27.2, ff: 13.4, level: "ok" } },
        { label: "停肝素，迴路無抗凝，Pre 100%", patch: { mode: "CVVHDF", qb: 150, dratio: 50, prepct: 100, ac: "無" }, expect: { eff: 1850, actual: 29.8, effDose: 26.2, ff: 12.9, level: "ok" } },
        { label: "改 RCA：Qb 130，PBP 1,300", patch: { mode: "CVVHD", qb: 130, pbp: 1300, ac: "RCA（枸櫞酸）" }, expect: { eff: 1850, actual: 29.8, effDose: 24.2, ff: 19.5, level: "ok" } }
      ],
      read: [
        "4Ts：下降 > 50%（2 分）＋第 5–10 天（2 分）＋新血栓（2 分）＋其他原因可能存在（1 分）= 7 分，屬高機率。",
        "第一列的工具檢核是「OK」：工具只算流量與幫浦規格，<strong>不會知道病人有 HIT</strong>。",
        "RCA 只抗凝迴路，不治療全身血栓。這位病人有急性 HIT 合併血栓，需要全身性非肝素抗凝。"
      ],
      plan: [
        "立即停用<strong>所有</strong>肝素：幫浦、導管封管、沖洗液都要查（KDIGO 1A）。注射筒移除，把幫浦速率設為 0。",
        "送 HIT 免疫測定，必要時加功能性檢驗；高機率不必等報告才換藥。",
        "全身抗凝選 argatroban、danaparoid 或 bivalirudin（ASH 對接受 RRT 者的建議）；重症與肝功能差時，argatroban 要依流程減量。",
        "平均出血風險下不建議例行輸血小板（ASH 條件式建議），活動性出血或高出血風險則另行評估。",
        "病歷註記肝素過敏史，交班時也要明確說明。"
      ],
      pitfall: "只把 CRRT 的肝素幫浦關掉，卻留著肝素封管；或以為換成 RCA、無抗凝就結束，卻沒有治療全身血栓。",
      src: ["kdigo", "ash"]
    },
    {
      id: "fluid",
      title: "想多脫一點水，血壓先掉了",
      tag: "Net UF・體液平衡",
      stem: "72 歲男性，心因性休克合併 AKI，實際體重 92 kg（乾體重約 80 kg）。胸水與周邊水腫明顯。醫囑希望每小時淨負 100 mL。每小時靜脈輸液與灌食 180 mL、尿量 30 mL。Patient Removal 開 350 mL/hr 後 MAP 由 72 掉到 58，升壓劑上調。",
      facts: ["實際體重 92 kg", "Hct 28%", "Qb 180 mL/min", "CVVHDF，透析液 50%，Pre 70%", "目標 25 mL/kg/hr", "肝素 400 U/hr"],
      question: "機器上的 350 mL/hr 等於病人每小時淨負 350 mL 嗎？若要降低脫水強度，有哪些做法不會犧牲體液目標？",
      base: { weight: 92, mode: "CVVHDF", dose: 25, qb: 180, hct: 28, dratio: 50, prepct: 70, ac: "肝素", hepMaint: 400, hepU: 10000, hepMl: 50, hepSyr: 50 },
      scenarios: [
        { label: "Patient Removal 350", patch: { netuf: 350 }, expect: { eff: 2350, actual: 25.5, effDose: 23.4, ff: 15.9, level: "ok" } },
        { label: "Patient Removal 250（淨負 100）", patch: { netuf: 250 }, expect: { eff: 2350, actual: 25.5, effDose: 23.3, ff: 15.3, level: "ok" } },
        { label: "濃縮點滴後輸入 100，淨負 50：Removal 120", patch: { netuf: 120 }, expect: { eff: 2320, actual: 25.2, effDose: 22.9, ff: 14.3, level: "ok" } }
      ],
      read: [
        "Patient Removal 是機器從病人移除的量，不等於病人淨平衡。需要量 = 目標淨負 + 其他輸入 − 尿量 = 100 + 180 − 30 = 250 mL/hr。",
        "350 mL/hr 是 3.8 mL/kg/hr，250 是 2.7，都高於 RENAL 次級分析的最高分組（> 1.75 mL/kg/hr）。該分析中最高組相較 < 1.01 組的死亡率較高（第 7–12 天 aHR 1.51）。這是觀察性關聯，不能證明因果。",
        "總 Effluent 固定時，Net UF 增加會擠壓透析液與置換液：三列的 Effluent 都在 2,320–2,350 mL/hr。",
        "先減少輸入（濃縮點滴、檢視灌食量）的效果等同多脫水，卻不增加 Removal：輸入降到 100、目標淨負 50 時，只要 120 mL/hr（1.3 mL/kg/hr）。"
      ],
      plan: [
        "先設定每日體液目標，再換算每小時 Removal，依血行動力學逐步調整。",
        "每小時核對總平衡（含輸液、灌食、尿量、引流），不要只看機器數字。",
        "低血壓時先確認是否因脫水過快，同時評估心臟功能、敗血症與出血；不要只靠加升壓劑硬撐。",
        "劑量與脫水速率都依體重換算；水腫時使用實際體重或乾體重會差很多（這位病人 92 vs 80 kg），要依院內規則一致採用。",
        "追磷：RENAL 次級分析中，高 NUF 組的低血磷也較常見。"
      ],
      pitfall: "把 1.75 mL/kg/hr 當成絕對安全線。它來自觀察性分組；RELIEVE-AKI 等試驗正是為了回答最適速度而設計，個別病人仍要看血行動力學。",
      src: ["murugan", "relieve", "renal", "kdigo"]
    },
    {
      id: "alf",
      title: "急性肝衰竭合併腦水腫",
      tag: "高血氨・血鈉目標・無抗凝",
      stem: "38 歲女性，急性肝衰竭，第 4 級肝性腦病變。動脈血氨 210 μmol/L，INR 5.2、血小板 45 k/μL，lactate 8 mmol/L，血鈉 132 mmol/L，尿量減少。影像有腦水腫徵象，團隊正評估肝臟移植。",
      facts: ["體重 52 kg", "Hct 25%", "Qb 200 mL/min", "Net UF 0", "暫無抗凝", "溶液鈉 140 mmol/L"],
      question: "為什麼選連續式而非間歇式？RCA 是好選擇嗎？想用高張食鹽水把血鈉拉到 145–150，CRRT 會幫忙還是扯後腿？",
      base: { weight: 52, qb: 200, hct: 25, netuf: 0, ac: "無" },
      scenarios: [
        { label: "CVVHD，劑量 25", patch: { mode: "CVVHD", dose: 25 }, expect: { eff: 1300, actual: 25, effDose: 25, ff: 0, level: "ok" } },
        { label: "CVVH，劑量 35，Pre 100%", patch: { mode: "CVVH", dose: 35, prepct: 100 }, expect: { eff: 1800, actual: 34.6, effDose: 28.8, ff: 16.7, level: "ok" } },
        { label: "CVVH，劑量 50，Pre 100%", patch: { mode: "CVVH", dose: 50, prepct: 100 }, expect: { eff: 2600, actual: 50, effDose: 38.8, ff: 22.4, level: "ok" } }
      ],
      read: [
        "KDIGO 對急性腦損傷、顱內壓升高或全腦水腫建議 CRRT 優先於間歇式（2B）。間歇式透析的快速溶質移除可能加重腦水腫。",
        "觀察資料：US ALF 登錄中，CRRT 前 3 天血氨下降 38%，且與 21 天未移植死亡減少相關（OR 0.47）；間歇式則無顯著血氨下降。",
        "血氨清除與超過濾速率高度相關：35 vs 90 mL/kg/hr 在第 1 小時約 39 vs 85 mL/min。第三列劑量 50 是教學比較，並非標準劑量；工具也會提示偏高，高劑量同時會增加電解質與藥物移除。",
        "枸櫞酸靠肝臟代謝，肝衰竭時蓄積風險高；凝血功能本身已差，因此先以無抗凝、Pre 100% 開始。"
      ],
      plan: [
        "早期開始 CRRT 處理高血氨與酸血症，並依血氨與血鈉調整劑量。",
        "血鈉目標由團隊訂定。Murphy 2004 的小型 RCT 以高張食鹽水維持 145–155 mmol/L，顱內高壓發生率較低。",
        "溶液鈉 140 會持續把血鈉往 140 拉。要維持高血鈉，得一併規劃高張輸注速率或調整溶液鈉，並密切抽血。",
        "同步監測血糖、磷、鎂與藥物濃度；高劑量時移除量更大。"
      ],
      pitfall: "高張食鹽水一直加，血鈉卻上不去，不要只懷疑輸注問題：CRRT 正持續把鈉濾掉。反過來，低血鈉時也要留意矯正過快。",
      src: ["kdigo", "cardoso", "slack", "murphy", "schneider"]
    }
  ];

  // 選項順序固定；A–D 各 5 題，由測試核對。calc 題的答案也由測試對照 CrrtEngine。
  var QUIZ = [
    { level: "基礎", stem: "Prismaflex 的總濾出液（Effluent）包含哪些流量？", options: ["透析液＋置換液＋PBP＋病人淨脫水", "透析液＋置換液，不含 PBP 與淨脫水", "只有病人淨脫水與置換液兩項", "血流量＋透析液＋置換液"], answer: 0, why: "Effluent 泵抽出的液體包含這四項，工具也是用這個總和計算實際劑量。", src: ["neri"] },
    { level: "基礎", stem: "KDIGO 對 AKI 病人 CRRT 建議實際給到多少 Effluent？", options: ["10–15 mL/kg/hr", "20–25 mL/kg/hr", "35–40 mL/kg/hr", "45–50 mL/kg/hr"], answer: 1, why: "KDIGO 5.8.4 建議實際給到 20–25 mL/kg/hr（1A），並註明通常需要開立更高的處方。RENAL 與 ATN 都沒有發現更高劑量能降低死亡率。", src: ["kdigo", "renal", "atn"] },
    { level: "基礎", stem: "哪一種模式主要靠透析液擴散清除溶質，不使用置換液？", options: ["CVVH", "CVVHDF", "CVVHD", "SCUF"], answer: 2, why: "CVVHD 以透析液擴散為主；CVVH 靠置換液與對流；CVVHDF 兩者並用；SCUF 主要用於脫水。", src: ["neri"] },
    { level: "基礎", stem: "60 kg，目標 25 mL/kg/hr，Net UF 100 mL/hr，PBP 0，CVVHDF 透析液比例 50%。依工具取整後，透析液設定是多少？", options: ["1,500 mL/hr", "750 mL/hr", "600 mL/hr", "700 mL/hr"], answer: 3, why: "目標 Effluent 1,500 − Net UF 100 = 治療液 1,400，一半是 700 mL/hr，已符合 50 mL 刻度。", src: [], calc: { patch: { weight: 60, dose: 25, netuf: 100, pbp: 0, mode: "CVVHDF", dratio: 50 }, field: "qd", value: 700 } },
    { level: "基礎", stem: "依 KDIGO，AKI 病人放置透析導管的第一優先靜脈是哪一條？", options: ["右內頸靜脈", "股靜脈", "左內頸靜脈", "鎖骨下靜脈"], answer: 0, why: "KDIGO 5.4.2 的順序：右頸、股靜脈、左頸，最後才是鎖骨下。Cathedia 試驗也顯示，股靜脈與頸靜脈的選擇可依 BMI 考量。", src: ["kdigo", "cathedia"] },
    { level: "基礎", stem: "CRRT 過程中，哪一種變化最提示濾器正在凝血？", options: ["Access 壓力變得較不負", "TMP 持續上升", "Effluent 袋更換間隔變短", "血壓上升"], answer: 1, why: "濾膜阻塞時 TMP 會升高，機器可能出現 Advisory TMP Too High 或 Filter Clotted。Access 壓力主要反映導管端的引血狀況。", src: ["citTrial"] },
    { level: "基礎", stem: "肝素 25,000 U 稀釋到 50 mL，維持 1,000 U/hr。幫浦要設多少？", options: ["0.5 mL/hr", "1 mL/hr", "2 mL/hr", "4 mL/hr"], answer: 2, why: "濃度 500 U/mL，1,000 ÷ 500 = 2 mL/hr，剛好是 50 mL 注射筒的最低連續速率。", src: [], calc: { patch: { weight: 60, ac: "肝素", hepMaint: 1000, hepU: 25000, hepMl: 50 }, field: "hep.rateMl", value: 2 } },

    { level: "進階", stem: "CVVH 全 Post，Qb 150、Hct 40%，置換液 1,800、Net UF 100 mL/hr（76 kg）。FF 約是多少？", options: ["18%", "25%", "30%", "35%"], answer: 3, why: "Qp = 150 × 60 × 0.6 = 5,400 mL/hr；FF = (1,800 + 100) ÷ 5,400 = 35.2%，超過常用的 25% 上限。", src: ["neri"], calc: { patch: { weight: 76, dose: 25, mode: "CVVH", qb: 150, hct: 40, netuf: 100, prepct: 0, pbp: 0 }, field: "ff", value: 35.2 } },
    { level: "進階", stem: "導管無法再提高 Qb，也不想降低劑量。哪個調整最能降低 FF？", options: ["把部分置換液改成透析液", "把 Pre 全部改成 Post", "提高 Net UF 以減少總液量", "提高血比容後再繼續治療"], answer: 0, why: "透析液靠擴散，不經過濾，所以不計入 FF。Post 改多、Net UF 增加都會讓 FF 更高；Hct 上升則會降低血漿流量。", src: ["neri"] },
    { level: "進階", stem: "70 kg，處方 30 mL/kg/hr，CVVHDF 50%、Pre 70%，Qb 180、Hct 30%，Net UF 0。前稀釋校正後的劑量約是多少？", options: ["23.7 mL/kg/hr", "27.3 mL/kg/hr", "30.0 mL/kg/hr", "32.7 mL/kg/hr"], answer: 1, why: "Pre 735；Qp 7,560；校正係數 7,560 ÷ 8,295 ≈ 0.91；30 × 0.91 ≈ 27.3。", src: [], calc: { patch: { weight: 70, dose: 30, mode: "CVVHDF", dratio: 50, prepct: 70, qb: 180, hct: 30, netuf: 0, pbp: 0 }, field: "effDose", value: 27.3 } },
    { level: "進階", stem: "肝素 200 U/hr 用 25,000 U／50 mL、50 mL 注射筒，換算只有 0.4 mL/hr。合理的做法是什麼？", options: ["維持設定，幫浦會自動修正", "改用未稀釋的高濃度肝素", "稀釋成 100 U/mL，速率變 2 mL/hr", "提高 Bolus 量補足維持量"], answer: 2, why: "50 mL 注射筒的連續速率為 0 或 2–20 mL/hr。把濃度降到 100 U/mL（5,000 U／50 mL），同劑量就是 2 mL/hr。", src: [], calc: { patch: { weight: 60, ac: "肝素", hepMaint: 200, hepU: 5000, hepMl: 50, hepSyr: 50 }, field: "hep.rateMl", value: 2 } },
    { level: "進階", stem: "CRRT 第 3 天，特別需要主動監測並補充的是哪一項電解質？", options: ["鈉", "氯", "碳酸氫根", "磷"], answer: 3, why: "連續治療會持續移除磷。RENAL 的低血磷在兩組為 54% 與 65%；另一項世代研究中，血磷下降與呼吸衰竭延長需氣切相關。", src: ["renal", "demirjian"] },
    { level: "進階", stem: "STARRT-AKI 比較加速與標準策略，主要結論是什麼？", options: ["90 天死亡率沒有差異，加速組存活者洗腎依賴較多", "加速策略明顯降低 90 天死亡率，洗腎依賴也隨之減少", "標準策略明顯增加高血鉀相關死亡，試驗因此提前終止", "兩組最後都接受了相同比例的 RRT，所以差異不明顯"], answer: 0, why: "死亡率 43.9% vs 43.7%；存活者持續依賴 RRT 為 10.4% vs 6.0%。但等待也有上限：AKIKI 2 的「更晚」策略沒有獲益，且校正後 60 天死亡風險較高（HR 1.65）。", src: ["starrt", "akiki2"] },
    { level: "進階", stem: "80 kg 病人 Net UF 200 mL/hr。這個速率屬於 RENAL 次級分析的哪一組？", options: ["< 1.01 mL/kg/hr 低速率組", "> 1.75 mL/kg/hr 高速率組", "1.01–1.75 mL/kg/hr 中間組", "該分析未依速率分組"], answer: 1, why: "200 ÷ 80 = 2.5 mL/kg/hr，高於 1.75。高速率組與較高死亡率相關，但屬觀察性資料，不等於因果。", src: ["murugan"], calc: { patch: { weight: 80, netuf: 200 }, field: "nufKg", value: 2.5 } },

    { level: "高階", stem: "RCA 中：總鈣 2.7、iCa 0.9 mmol/L，陰離子間隙酸中毒，lactate 上升，鈣回輸一直增加。最合適的判斷與處置是什麼？", options: ["枸櫞酸過量：屬良性變化，不需處理，靜待自行恢復", "枸櫞酸蓄積：降低枸櫞酸負荷，CRRT 繼續，必要時換抗凝", "枸櫞酸蓄積：立即停止所有 CRRT，以免枸櫞酸繼續進入體內", "單純低血鈣：只要加快鈣回輸，其他設定都不必調整"], answer: 1, why: "總鈣／iCa = 3.0 > 2.5，符合蓄積。要快速降低枸櫞酸負荷；若未快速改善就換迴路抗凝方式，並繼續 CRRT 以清除枸櫞酸鈣複合物。", src: ["schneider", "davenport"] },
    { level: "高階", stem: "RCA 中：pH 7.52、HCO₃⁻ 34，總鈣／iCa 2.1，鈣需求穩定，lactate 正常。最可能是什麼？", options: ["枸櫞酸蓄積（代謝能力不足），應立即停用 RCA 並換抗凝", "稀釋性酸中毒合併高血鈣，應補充碳酸氫鈉並提高透析液", "枸櫞酸過量（代謝性鹼中毒），降低枸櫞酸負荷即可", "濾器凝血造成的酸鹼異常，應立即更換整套管路再評估"], answer: 2, why: "比值正常加上鹼中毒，代表肝臟有在代謝，只是枸櫞酸給太多。這是良性問題，降低負荷或提高移除即可，不必停用 RCA；pH 恢復需要時間。", src: ["schneider"] },
    { level: "高階", stem: "Qb 180 mL/min，目標枸櫞酸 3 mmol/L 血液，溶液濃度 18 mmol/L。PBP 應設多少？", options: ["900 mL/hr", "1,200 mL/hr", "1,500 mL/hr", "1,800 mL/hr"], answer: 3, why: "180 mL/min = 10.8 L/hr；× 3 = 32.4 mmol/hr；÷ 18 = 1.8 L/hr。若 Qb 改變，PBP 也要跟著調整。", src: ["schneider"], arithmetic: { expr: "180*60/1000*3/18*1000", value: 1800 } },
    { level: "高階", stem: "急性 HIT 合併新血栓的 CRRT 病人，已改用 RCA 且迴路運作良好。下一步最重要的是什麼？", options: ["另外開始全身性非肝素抗凝，並移除所有肝素來源", "RCA 已足夠，血小板回升前不需再處理任何抗凝問題", "改回低分子量肝素，因為 HIT 風險較低且不需調整劑量", "例行輸注血小板，把數值提高到安全範圍後再評估抗凝"], answer: 0, why: "RCA 只作用於迴路，不治療全身血栓。LMWH 也是肝素，一樣不能用。ASH 建議 RRT 病人可選 argatroban、danaparoid 或 bivalirudin。", src: ["ash", "kdigo"] },
    { level: "高階", stem: "急性肝衰竭合併腦水腫，正以 3% 食鹽水維持高血鈉，同時接受鈉 140 mmol/L 溶液的 CRRT。血鈉一直掉回 140。最可能的原因是？", options: ["腎臟正在大量保水，使血清鈉被血漿水分稀釋", "高張食鹽水全部進入細胞內，所以需要停藥", "CRRT 持續把血鈉往溶液鈉 140 拉", "檢驗誤差造成的假性低值，不必調整"], answer: 2, why: "血鈉會向透析液與置換液濃度靠近。要維持高血鈉，需要一併規劃高張輸注與溶液鈉，並密切抽血。", src: ["murphy"] },
    { level: "高階", stem: "AKI 合併慢性重度低血鈉（Na 108 mmol/L）與體液過多，需要 RRT。下列哪個策略最能避免矯正過快？", options: ["使用標準鈉濃度的高效率間歇透析，縮短治療時間", "CRRT 使用標準 140 溶液，並提高 Effluent 加快清除", "先給高張食鹽水 bolus，把血鈉拉高後再開始標準透析", "CVVH 調低置換液鈉濃度，並依動力學控制速率"], answer: 3, why: "標準溶液會讓血鈉快速上升，增加滲透性去髓鞘風險。Yessayan 2014 的教學病例說明以低鈉置換液的 CVVH 調控矯正速度。實際配方須由藥師與腎臟科共同確認。", src: ["yessayan"] }
  ];

  var MAP = {
    center: ["Prismaflex CRRT", "處方・抗凝・監測"],
    branches: [
      { title: "何時開始", color: "var(--blood)", leaves: [
        { t: "緊急：難治高血鉀、酸血症、肺水腫、尿毒併發症", c: "sepsis" },
        { t: "無緊急適應症：加速策略沒有降低死亡（STARRT-AKI）" },
        { t: "不宜無限等待：更晚策略校正後死亡風險較高（AKIKI 2）" },
        { t: "血行不穩、顱壓高：CRRT 優先（KDIGO 2B）", c: "alf" },
        { t: "血路：右頸 > 股 > 左頸 > 鎖骨下" }
      ] },
      { title: "模式與溶液", color: "var(--dial)", leaves: [
        { t: "CVVH：置換液，對流" },
        { t: "CVVHD：透析液，擴散" },
        { t: "CVVHDF：兩者並用，可用比例調 FF", c: "clot" },
        { t: "Pre：減少凝血，但會稀釋劑量" },
        { t: "Post：效率高，但 FF 也高" },
        { t: "PBP：血泵前給液；計入 Effluent", c: "rca" }
      ] },
      { title: "劑量計算", color: "var(--eff)", leaves: [
        { t: "Effluent = 透析液 + 置換液 + PBP + Net UF" },
        { t: "KDIGO：實際給 20–25 mL/kg/hr，處方常要更高", c: "sepsis" },
        { t: "更高劑量未降低死亡（RENAL、ATN）" },
        { t: "校正劑量 = 實際 × Qp ÷ (Qp + Pre + PBP)" },
        { t: "停機時間會侵蝕實際劑量，要每日比對" }
      ] },
      { title: "過濾分率 FF", color: "var(--rep)", leaves: [
        { t: "Qp = Qb × 60 × (1 − Hct)" },
        { t: "FF = (Pre + Post + PBP + Net UF) ÷ (Qp + Pre + PBP)" },
        { t: "常用上限 20–25%" },
        { t: "降 FF：提高 Qb → 增加 Pre → 改為擴散", c: "clot" },
        { t: "Hct 高，Qp 就低" }
      ] },
      { title: "肝素與抗凝選擇", color: "var(--hep)", leaves: [
        { t: "KDIGO：無禁忌時 RCA 優先於肝素（2B）" },
        { t: "RICH：RCA 濾器壽命 47 vs 26 小時，出血少，新感染多" },
        { t: "注射筒速率要落在規格內，50 mL 為 2–20 mL/hr", c: "sepsis" },
        { t: "HIT：停所有肝素，改非肝素抗凝", c: "hit" },
        { t: "RCA 只抗凝迴路，不治療全身血栓", c: "hit" }
      ] },
      { title: "RCA 枸櫞酸", color: "var(--accent)", leaves: [
        { t: "目標 3–4 mmol/L 血液；濾器後 iCa 0.2–0.35", c: "rca" },
        { t: "PBP（mL/hr）= Qb 換算 L/hr × 目標 ÷ 溶液濃度 × 1,000" },
        { t: "總鈣／iCa > 2.5 + 酸中毒 → 蓄積：降負荷、必要時換抗凝", c: "rca" },
        { t: "比值正常 + 鹼中毒 → 過量：良性，降負荷" },
        { t: "肝衰竭、休克高 lactate：開始前先評估", c: "alf" }
      ] },
      { title: "體液管理", color: "var(--return)", leaves: [
        { t: "Removal = 目標淨負 + 其他輸入 − 尿量", c: "fluid" },
        { t: "> 1.75 mL/kg/hr：觀察性資料顯示死亡較高" },
        { t: "先減少輸入，再決定要不要加脫水" },
        { t: "Effluent 固定時，Net UF 會擠壓治療液" },
        { t: "機器數字不等於病人總平衡" }
      ] },
      { title: "監測與陷阱", color: "var(--pbp)", leaves: [
        { t: "TMP 升高、Filter Clotted：準備換套組", c: "clot" },
        { t: "套組使用時限依 IFU（HF20 試驗方案為 72 小時）" },
        { t: "磷、鉀、鎂持續被移除" },
        { t: "抗生素濃度差異大：討論劑量、做 TDM" },
        { t: "溶液鈉會牽動血鈉：腦水腫、重度低血鈉要特別處理", c: "alf" },
        { t: "工具全綠不代表臨床正確", c: "hit" }
      ] }
    ]
  };

  return { SOURCES: SOURCES, CASES: CASES, QUIZ: QUIZ, MAP: MAP };
});

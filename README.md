# Prismaflex CRRT 執行方案（肝素版）

互動式 Prismaflex CRRT 自動計算與執行方案工具。

**線上使用**：https://yht5582-source.github.io/prismaflex-crrt/

## 功能
- 依體重、目標劑量、治療模式（CVVHDF / CVVH / CVVHD）自動分配透析液、置換液（Pre/Post）、PBP 與淨脫水
- 實際劑量、前稀釋校正劑量、過濾分率 FF（需 Hct）
- 自動檢核：Effluent ≤ Net UF、Qb 範圍、劑量 < 20、FF > 20/25%、淨脫水強度、肝素幫浦速率
- 肝素 U/kg 與注射筒 mL/hr 換算；依注射筒規格（10/20/30/50 mL）檢核 Prismaflex 連續速率與 Bolus 範圍
- 依 Prismaflex 刻度取整：透析液/置換液 50 mL/hr、PBP 10 mL/hr（淨脫水不取整），實際劑量以取整後數值重算
- 本次與 24 小時耗液量、袋數、換袋間隔
- 護理監測清單、交班文字一鍵複製
- 列印執行方案（可附每小時記錄表）

## 教學分頁
- **示範病例**：6 例（敗血性休克首張處方、濾器凝血與 FF、RCA 與枸櫞酸蓄積、HIT、脫水速度、急性肝衰竭）。表格由計算核心即時算出，可載入工具繼續調整；載入值不會寫入瀏覽器儲存，交班文字與列印會標示「示範病例」。
- **考題**：20 題（基礎 7、進階 7、高階 6），作答後顯示解析與文獻依據。
- **心智圖**：8 大主題，節點可收合並連到對應病例。

檔案：`crrt-engine.js`（計算與檢核）、`teach-content.js`（病例、考題、心智圖、文獻）、`teach.js`、`teach.css`。修改內容後執行 `node --test tests/*.test.js`；發布時所有 `?v=` 要一起更新。

## 計算方式
- 目標 Effluent = 體重 × 目標劑量
- 治療液 = 目標 Effluent − Net UF − PBP，依模式與比例分配
- 實際劑量 = (透析液 + 置換液 + PBP + Net UF) ÷ 體重
- Qp = Qb × 60 × (1 − Hct)；前稀釋校正係數 = Qp ÷ (Qp + Pre + PBP)
- FF = (Pre + Post + PBP + Net UF) ÷ (Qp + Pre + PBP)

## 肝素注射筒規格（Prismaflex System Specifications）
| 注射筒 | 連續速率 | Bolus |
|---|---|---|
| 10 mL | 0 或 0.1–5 mL/hr | 0.5–5 mL |
| 20 mL | 0 或 0.5–5 mL/hr | 0.5–5 mL |
| 30 mL | 0 或 0.5–10 mL/hr | 1–5 mL |
| 50 mL | 0 或 2–20 mL/hr | 2–9.9 mL |

速率刻度 0.1 mL/hr。

## 注意
本工具為計算與執行摘要工具，不取代醫囑；實際處方、溶液種類與抗凝調整請依主治醫師醫囑與院內流程。Prismaflex 各項設定範圍請依機型、套組與軟體版本確認。病人資料不會儲存或上傳。

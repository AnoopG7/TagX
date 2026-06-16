import ExcelJS from "exceljs";
import path from "path";

const THIN = { style: "thin", color: { argb: "FFD0D0D0" } };
const BOLD_WHITE = { font: { bold: true, color: { argb: "FFFFFFFF" }, size: 11 }, fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF1B5E20" } }, border: THIN, alignment: { wrapText: true, horizontal: "center" as const, vertical: "center" as const } };

function hdr(row: ExcelJS.Row) {
  row.eachCell(c => { c.font = BOLD_WHITE.font; c.fill = BOLD_WHITE.fill; c.border = THIN; c.alignment = BOLD_WHITE.alignment; });
}

type Fmt = "₹" | "#" | "%" | "auto";
function sdr(row: ExcelJS.Row, fmt: Fmt = "auto", total = false, blank = false) {
  row.eachCell((c, j) => {
    c.border = THIN;
    if (j === 1) {
      c.font = { bold: total };
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: total ? "FFE8F5E9" : blank ? "FFF5F5F5" : "FFFFFFFF" } };
    } else {
      c.alignment = { horizontal: "right" };
      const v = row.getCell(j).value;
      if (typeof v === "number") {
        if (fmt === "%" || (fmt === "auto" && v < 1 && v > -1 && v !== 0)) c.numFmt = "0.0%";
        else if (fmt === "#" || (fmt === "auto" && !total && v < 100000 && Number.isInteger(v) && v >= 0)) c.numFmt = "#,##0";
        else c.numFmt = "₹#,##0";
      }
    }
  });
}

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "TagX Financial Model — India 2026";

  // ── Inputs ────────────────────────────────────────
  const TAGS = [250, 500, 1300, 3000, 10000];
  const TAG_PR = [2699, 2999, 3199, 3499, 3999];
  const USERS = [200, 850, 2000, 5000, 10000];
  const FAM_PR = [599, 599, 799, 999, 999];
  const AI_PR = [999, 999, 1200, 1500, 1500];
  const FAM_ATT = [0.25, 0.30, 0.40, 0.40, 0.45];
  const AI_ATT = [0.25, 0.30, 0.40, 0.40, 0.40];
  const ACC_PCT = [0.03, 0.03, 0.04, 0.04, 0.05];

  const B2B_U = [5, 10, 30, 100, 200];
  const B2B_RPU = [4999, 4999, 5499, 5999, 5999];
  const SaaS_S = [5, 10, 30, 60, 100];
  const SaaS_M = [499, 499, 699, 699, 799];
  const Cell_S = [0, 3, 12, 40, 100];
  const Cell_M = [75, 75, 70, 65, 60];
  const Hub_U = [1, 2, 5, 10, 15];
  const Hub_PR = 14999;
  const API_PR = 24999;
  const WL_R = [0, 0, 100000, 500000, 1500000];

  // China-sourced BOM (landed cost incl duty & shipping)
  const B2C_BOM = [750, 700, 650, 620, 600];
  const B2C_ASM = [80, 75, 70, 65, 60];
  const B2B_BOM = [1000, 950, 900, 850, 800];
  const B2B_ASM = [100, 95, 90, 85, 80];
  const CEL_DAT = [15, 15, 14, 13, 12];
  const MFG_O = [0.06, 0.06, 0.05, 0.05, 0.05];

  const TEAM = [2, 4, 5, 10, 15];
  const SALARIES = [180000, 1400000, 3000000, 6000000, 9600000];
  const RD_EXP = [100000, 120000, 150000, 250000, 300000];
  const MKTG = [100000, 300000, 600000, 1000000, 2000000];
  const B2B_S = [10000, 30000, 100000, 300000, 800000];
  const SUPP = [24000, 60000, 180000, 400000, 800000];
  const COMP = [150000, 150000, 200000, 300000, 500000];
  const GA = [50000, 75000, 150000, 300000, 500000];
  const OFF = [0, 60000, 120000, 240000, 480000];

  const INIT_CAPEX = 3000000;
  const ANN_CAPEX = [200000, 200000, 300000, 500000, 800000];

  // Depreciation — split method
  // Hardware/tooling (WDV 15%): ₹15L + annual capex additions
  // Software/IP (SLM 3yr): ₹10L
  // Certification (SLM 5yr): ₹5L
  const DEPR_HW_BASE = 1500000;
  const DEPR_SW_BASE = 1000000;
  const DEPR_AMORT = 500000; // BIS + IP, SLM 5yr
  const DEPR_SW_YR = Math.round(DEPR_SW_BASE / 3);
  const DEPR_AM_YR = Math.round(DEPR_AMORT / 5);
  let wdvPool = DEPR_HW_BASE;
  const DEPR: number[] = [];
  for (let i = 0; i < 5; i++) {
    wdvPool += ANN_CAPEX[i];
    const wdvDepr = Math.round(wdvPool * 0.15);
    const swDepr = i < 3 ? DEPR_SW_YR : 0;
    const amDepr = DEPR_AM_YR;
    DEPR.push(wdvDepr + swDepr + amDepr);
    wdvPool -= wdvDepr;
  }

  // ── Derived ────────────────────────────────────────
  const tRev = TAGS.map((t, i) => t * TAG_PR[i]);
  const famSubRev = USERS.map((u, i) => Math.round(u * FAM_ATT[i] * FAM_PR[i]));
  const aiSubRev = USERS.map((u, i) => Math.round(u * AI_ATT[i] * AI_PR[i]));
  const acRev = tRev.map((t, i) => Math.round(t * ACC_PCT[i]));
  const b2cT = tRev.map((_, i) => tRev[i] + famSubRev[i] + aiSubRev[i] + acRev[i]);

  const flRev = B2B_U.map((u, i) => u * B2B_RPU[i]);
  const saRev = SaaS_S.map((s, i) => s * SaaS_M[i] * 12);
  const ceRev = Cell_S.map((s, i) => s * Cell_M[i] * 12);
  const huRev = Hub_U.map(u => u * Hub_PR);
  const apRev = Hub_U.map(u => u * API_PR);
  const b2bT = flRev.map((_, i) => flRev[i] + saRev[i] + ceRev[i] + huRev[i] + apRev[i] + WL_R[i]);

  const REV = b2cT.map((b, i) => b + b2bT[i]);

  const b2cUC = B2C_BOM.map((b, i) => b + B2C_ASM[i]);
  const b2cTH = TAGS.map((t, i) => t * b2cUC[i]);
  const b2cOH = TAGS.map((t, i) => Math.round(t * b2cUC[i] * MFG_O[i]));
  const b2bUC = B2B_BOM.map((b, i) => b + B2B_ASM[i]);
  const b2bTH = B2B_U.map((f, i) => f * b2bUC[i]);
  const b2bOH = B2B_U.map((f, i) => Math.round(f * b2bUC[i] * MFG_O[i]));
  const celD = Cell_S.map((s, i) => s * CEL_DAT[i] * 12);
  const COGS = b2cTH.map((_, i) => b2cTH[i] + b2cOH[i] + b2bTH[i] + b2bOH[i] + celD[i]);

  const cldC = [30000, 60000, 150000, 400000, 1000000];
  const aiUsers = USERS.map((u, i) => Math.round(u * AI_ATT[i]));
  const aiC = aiUsers.map(u => u * 100);
  const OPEX = SALARIES.map((_, i) => SALARIES[i] + RD_EXP[i] + cldC[i] + aiC[i] + MKTG[i] + B2B_S[i] + SUPP[i] + COMP[i] + GA[i] + OFF[i]);

  const GP = REV.map((r, i) => r - COGS[i]);
  const GM = GP.map((g, i) => g / REV[i]);
  const EBITDA = GP.map((g, i) => g - OPEX[i]);
  const EM = EBITDA.map((e, i) => e / REV[i]);
  const EBIT = EBITDA.map((e, i) => e - DEPR[i]);
  const TAX = EBIT.map(e => (e > 0 ? Math.round(e * 0.25) : 0));
  const NI = EBIT.map((e, i) => e - TAX[i]);
  const NM = NI.map((n, i) => n / REV[i]);
  const CUM: number[] = [];
  NI.forEach(v => CUM.push((CUM[CUM.length - 1] || 0) + v));

  // ═══════════════════════════════════ DASHBOARD ════
  const D = wb.addWorksheet("Dashboard");
  D.getColumn(1).width = 30; [2, 3, 4, 5, 6].forEach(i => (D.getColumn(i).width = 20));
  hdr(D.addRow(["KEY METRIC", 2026, 2027, 2028, 2029, 2030]));

  const dashRows: [string, Fmt, boolean][] = [
    ["Total Revenue (₹)", "₹", false],
    ["Total Revenue (₹ Lakhs)", "#", false],
    ["Total Revenue (₹ Crores)", "#", false],
    ["B2C Tags Sold", "#", false],
    ["B2B Fleet Units Deployed", "#", false],
    ["Active B2C Users", "#", false],
    ["B2B SaaS Subscribers", "#", false],
    ["Total Employees", "#", false],
    ["", "auto", false],
    ["Gross Profit", "₹", true],
    ["Gross Margin", "%", false],
    ["Total OpEx", "₹", false],
    ["EBITDA", "₹", true],
    ["EBITDA Margin", "%", false],
    ["", "auto", false],
    ["Depreciation", "₹", false],
    ["Annual Capex", "₹", false],
    ["EBIT (Operating Profit)", "₹", false],
    ["Tax @ 25%", "₹", false],
    ["Net Income", "₹", true],
    ["Net Margin", "%", false],
    ["", "auto", false],
    ["Cumulative Net Income", "₹", false],
    ["Rev per Employee (₹ Lakhs)", "#", false],
  ];

  dashRows.forEach(([label, fmt, isTotal]) => {
    let data: number[];
    switch (label) {
      case "Total Revenue (₹)": data = REV; break;
      case "Total Revenue (₹ Lakhs)": data = REV.map(r => +(r / 100000).toFixed(1)); break;
      case "Total Revenue (₹ Crores)": data = REV.map(r => +(r / 10000000).toFixed(2)); break;
      case "B2C Tags Sold": data = TAGS; break;
      case "B2B Fleet Units Deployed": data = B2B_U; break;
      case "Active B2C Users": data = USERS; break;
      case "B2B SaaS Subscribers": data = SaaS_S; break;
      case "Total Employees": data = TEAM; break;
      case "Gross Profit": data = GP; break;
      case "Gross Margin": data = GM; break;
      case "Total OpEx": data = OPEX; break;
      case "EBITDA": data = EBITDA; break;
      case "EBITDA Margin": data = EM; break;
      case "Depreciation": data = DEPR; break;
      case "Annual Capex": data = ANN_CAPEX; break;
      case "EBIT (Operating Profit)": data = EBIT; break;
      case "Tax @ 25%": data = TAX; break;
      case "Net Income": data = NI; break;
      case "Net Margin": data = NM; break;
      case "Cumulative Net Income": data = CUM; break;
      case "Rev per Employee (₹ Lakhs)": data = TEAM.map((_, i) => +(REV[i] / TEAM[i] / 100000).toFixed(1)); break;
      default: data = [0, 0, 0, 0, 0];
    }
    const r = D.addRow([label, ...data]);
    sdr(r, fmt, isTotal, data[0] === 0 && label !== "");
    if (["Net Income", "EBITDA"].includes(label)) {
      r.eachCell(c => { if (typeof c.value === "number" && c.value > 0) c.font = { bold: true, color: { argb: "FF2E7D32" } }; });
    }
  });

  // ═══════════════════════════════════ ASSUMPTIONS ════
  const A = wb.addWorksheet("Assumptions");
  A.getColumn(1).width = 42; A.getColumn(7).width = 58;
  [2, 3, 4, 5, 6].forEach(i => (A.getColumn(i).width = 16));

  type ARow = [string, ...(number | string)[]];
  const aRows: ARow[] = [
    ["PARAMETER", 2026, 2027, 2028, 2029, 2030, "NOTES"],
    ["── B2C ──", 0, 0, 0, 0, 0, ""],
    ["B2C Tags Sold", ...TAGS, "Pre-sales → D2C via website → Amazon/retail"],
    ["Tag Selling Price (₹)", ...TAG_PR, "₹3,000 intro → ₹4,500 by Y5"],
    ["Active Registered Users", ...USERS, "~80% of cumulative tag buyers register app account"],
    ["Family Plan Attach Rate", ...FAM_ATT, "% of active users — ₹599→₹799→₹999"],
    ["Family Plan Price (₹)", ...FAM_PR, "Cloud tracking, location history"],
    ["AI Pro Attach Rate", ...AI_ATT, "% of active users — ₹999→₹1,200→₹1,500"],
    ["AI Pro Price (₹)", ...AI_PR, "AI insights, geofencing, family sharing"],
    ["Accessories (% of hardware rev)", ...ACC_PCT, "Straps, mounts, cases"],
    ["", 0, 0, 0, 0, 0, ""],
    ["── B2B ──", 0, 0, 0, 0, 0, ""],
    ["Fleet Units Deployed", ...B2B_U, "Pilot → enterprise eval → scale"],
    ["Avg Fleet Hardware Rev (₹/unit)", ...B2B_RPU, "Includes fleet console access"],
    ["B2B SaaS Subscribers", ...SaaS_S, "Monthly fleet management console"],
    ["SaaS Monthly Fee (₹)", ...SaaS_M, "Below incumbents (₹1,500–3,000/mo)"],
    ["Cellular Subscribers (NB-IoT)", ...Cell_S, "~40% of fleet units"],
    ["Cellular Monthly Fee (₹)", ...Cell_M, "Competitive vs ₹150–300 market avg"],
    ["Enterprise Hub + API Units", ...Hub_U, ""],
    ["Hub Price (₹)", Hub_PR, Hub_PR, Hub_PR, Hub_PR, Hub_PR, ""],
    ["API Annual Subscription (₹)", API_PR, API_PR, API_PR, API_PR, API_PR, ""],
    ["White-Label / OEM Revenue (₹)", ...WL_R, "Custom branded for 25+ unit orders"],
    ["", 0, 0, 0, 0, 0, ""],
    ["── COGS ──", 0, 0, 0, 0, 0, ""],
    ["B2C BOM per Tag (₹)", ...B2C_BOM, "China-sourced: GPS ₹250 + BLE ₹120 + battery ₹80 + PCB ₹80 + enclosure ₹100 + pkg ₹70 + misc ₹50 (landed incl duty)"],
    ["B2C Assembly per Tag (₹)", ...B2C_ASM, "EMS partner, declining with volume"],
    ["B2B BOM per Unit (₹)", ...B2B_BOM, "China-sourced: adds NB-IoT/LTE-M cellular module + larger battery (landed incl duty)"],
    ["B2B Assembly per Unit (₹)", ...B2B_ASM, ""],
    ["Cellular Data Cost (₹/dev/month)", ...CEL_DAT, "Bulk IoT SIM via 1NCE / Hologram MVNO"],
    ["Manufacturing Overhead (% of COGS)", ...MFG_O, "QC, tooling amortisation, wastage"],
    ["", 0, 0, 0, 0, 0, ""],
    ["── OPEX ──", 0, 0, 0, 0, 0, ""],
    ["Team Salaries (₹/year)", ...SALARIES, `${TEAM[0]}→${TEAM[1]}→${TEAM[2]}→${TEAM[3]}→${TEAM[4]} people incl founders`],
    ["R&D / Prototyping (₹/year)", ...RD_EXP, "PCB spins, testing, tooling, certification samples"],
    ["Cloud Infrastructure (₹/year)", 30000, 60000, 150000, 400000, 1000000, "AWS/GCP, lean at early stage"],
    ["AI Inference (₹/premium user/year)", 100, 100, 100, 100, 100, "₹100 per premium subscriber via Groq API"],
    ["Marketing (₹/year)", ...MKTG, "Digital ads, influencer partnerships, content"],
    ["B2B Sales (₹/year)", ...B2B_S, "Commission-heavy early, then dedicated team"],
    ["Customer Support (₹/year)", ...SUPP, ""],
    ["Compliance & Certification (₹/year)", ...COMP, ""],
    ["General & Administrative (₹/year)", ...GA, ""],
    ["Office (₹/year)", ...OFF, "Co-working → leased office"],
    ["", 0, 0, 0, 0, 0, ""],
    ["── CAPEX & DEPRECIATION ──", 0, 0, 0, 0, 0, ""],
    ["Initial Pre-Revenue CapEx (₹)", INIT_CAPEX, "—", "—", "—", "—", "R&D ₹12L + Tooling ₹10L + BIS ₹5L + App ₹6L + Office ₹2.5L + Legal ₹1.5L"],
    ["Annual Capex (₹)", ...ANN_CAPEX, "Equipment upgrades, tooling"],
    ["Depreciation (₹)", ...DEPR, "Straight-line over 3–5 years"],
    ["", 0, 0, 0, 0, 0, ""],
    ["Tax Rate", 0.25, 0.25, 0.25, 0.25, 0.25, "Indian corporate tax"],
  ];

  hdr(A.addRow(aRows[0]));
  for (let i = 1; i < aRows.length; i++) {
    const row = aRows[i];
    const r = A.addRow(row);
    // Determine format for each column
    const label = String(row[0]);
    const isSection = label.startsWith("──");
    const isBlank = row[1] === 0;
    const fmt: Fmt =
      label.includes("Rate") || label.includes("%") || label.includes("Overhead") ? "%" :
      label.includes("Sold") || label.includes("Users") || label.includes("Subscribers") || label.includes("Units") || label.includes("Deployed") || label.includes("Employees") || label.includes("People") || label.includes("(₹/month)") ? "#" :
      label.includes("₹") || label.includes("Revenue") || label.includes("Price") || label.includes("Fee") || label.includes("Salaries") || label.includes("Marketing") || label.includes("Sales") || label.includes("Support") || label.includes("Compliance") || label.includes("Office") || label.includes("CapEx") || label.includes("Depreciation") || label.includes("Capex") || label.includes("BOM") || label.includes("Assembly") || label.includes("Data Cost") || label.includes("(₹/") ? "₹" :
      "auto";

    r.eachCell((c, j) => {
      c.border = THIN;
      if (j === 1) {
        c.font = { bold: true };
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: isSection ? "FFE8F5E9" : i % 2 === 0 ? "FFF9F9F9" : "FFFFFFFF" } };
      } else {
        c.alignment = { horizontal: "right" };
        const v = row[j - 1];
        if (typeof v === "number") {
          if (fmt === "%") c.numFmt = "0%";
          else if (fmt === "#") c.numFmt = "#,##0";
          else if (fmt === "₹") c.numFmt = "₹#,##0";
          else c.numFmt = v < 1 && v > -1 && v !== 0 ? "0%" : v >= 100000 || v <= -100000 ? "₹#,##0" : "#,##0";
        }
      }
    });
  }

  // ═══════════════════════════════════ FUNDING ════
  const FU = wb.addWorksheet("Funding Required");
  FU.getColumn(1).width = 38; FU.getColumn(2).width = 18; FU.getColumn(3).width = 55;

  FU.addRow(["FUNDING SUMMARY", "", ""]).font = { bold: true, size: 14 };
  FU.addRow([""]);
  hdr(FU.addRow(["ITEM", "AMOUNT (₹)", "NOTES"]));

  const yr1Burn = Math.abs(Math.min(EBITDA[0], 0));
  const yr2Burn = Math.abs(Math.min(EBITDA[1], 0));
  const subTotal = INIT_CAPEX + yr1Burn + yr2Burn;
  const contingency = Math.round(subTotal * 0.1);
  const total = subTotal + contingency;

  [
    ["Initial CapEx (Pre-Revenue)", INIT_CAPEX, "R&D, tooling, certification, app, office, legal"],
    ["Year 1 Operating Deficit", yr1Burn, "Revenue doesn't cover OpEx + COGS"],
    ["Year 2 Operating Deficit (est.)", yr2Burn, "Partially covered by growing revenue"],
    ["Contingency Buffer (10%)", contingency, ""],
    ["", null, ""],
    ["TOTAL FUNDING REQUIRED", total, "Seed / angel round target"],
    ["", null, ""],
    ["── USE OF FUNDS ──", null, ""],
    ["Hardware Development", 1200000, "PCB design, firmware, antenna tuning"],
    ["Tooling & Molds", 1000000, "Injection molds for pilot production"],
    ["BIS Certification", 500000, "Mandatory India electronics certification"],
    ["Website & Mobile App", 600000, "React web + React Native app"],
    ["Office & Equipment", 250000, "Laptops, test equipment, coworking"],
    ["Legal & IP", 150000, "Incorporation, trademark, patent filing"],
    ["Year 1 Operating Deficit", yr1Burn, "Salaries, cloud, marketing, support"],
    ["Year 2 Operating Deficit", yr2Burn, "Team expansion, scaled cloud, marketing"],
    ["", null, ""],
    ["TOTAL", subTotal, "Pre-contingency ask"],
  ].forEach(([a, b, c]) => {
    const r = FU.addRow([a, b ?? "", c ?? ""]);
    r.eachCell(cell => { cell.border = THIN; });
    if (String(a).includes("TOTAL")) r.eachCell(cell => { cell.font = { bold: true, size: 12 }; cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F5E9" } }; });
    if (typeof b === "number" && b > 0) r.getCell(2).numFmt = "₹#,##0";
  });

  // ═══════════════════════════════════ B2C REVENUE ════
  const B2C = wb.addWorksheet("B2C Revenue");
  B2C.getColumn(1).width = 38; [2, 3, 4, 5, 6].forEach(i => (B2C.getColumn(i).width = 20));
  hdr(B2C.addRow(["METRIC", 2026, 2027, 2028, 2029, 2030]));

  const b2cRows: [string, number[], Fmt][] = [
    ["Tags Sold", TAGS, "#"],
    ["Avg Selling Price (₹)", TAG_PR, "₹"],
    ["Tag Hardware Revenue (₹)", tRev, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["Active Registered Users", USERS, "#"],
    ["Family Plan Attach Rate", FAM_ATT, "%"],
    ["Family Plan Revenue (₹)", famSubRev, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["AI Pro Attach Rate", AI_ATT, "%"],
    ["AI Pro Revenue (₹)", aiSubRev, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["Accessories Revenue (₹)", acRev, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["TOTAL B2C REVENUE (₹)", b2cT, "₹"],
  ];

  b2cRows.forEach(([label, data, fmt]) => {
    const r = B2C.addRow([label, ...data]);
    sdr(r, fmt, label.includes("TOTAL"), data[0] === 0 && label !== "");
  });

  // ═══════════════════════════════════ B2B REVENUE ════
  const B2B = wb.addWorksheet("B2B Revenue");
  B2B.getColumn(1).width = 40; [2, 3, 4, 5, 6].forEach(i => (B2B.getColumn(i).width = 20));
  hdr(B2B.addRow(["METRIC", 2026, 2027, 2028, 2029, 2030]));

  const b2bRows: { label: string; data: number[]; fmt: Fmt; sec?: boolean }[] = [
    { label: "Fleet Units Deployed", data: B2B_U, fmt: "#" },
    { label: "Fleet Hardware Revenue (₹)", data: flRev, fmt: "₹" },
    { label: "", data: [0, 0, 0, 0, 0], fmt: "auto" },
    { label: "Hub Units Sold", data: Hub_U, fmt: "#", sec: true },
    { label: "Hub Hardware Revenue (₹)", data: huRev, fmt: "₹", sec: true },
    { label: "API Annual Subscriptions (₹)", data: apRev, fmt: "₹", sec: true },
    { label: "", data: [0, 0, 0, 0, 0], fmt: "auto" },
    { label: "SaaS Subscribers", data: SaaS_S, fmt: "#", sec: true },
    { label: "SaaS Monthly Fee (₹)", data: SaaS_M, fmt: "₹", sec: true },
    { label: "SaaS Revenue (₹/year)", data: saRev, fmt: "₹", sec: true },
    { label: "", data: [0, 0, 0, 0, 0], fmt: "auto" },
    { label: "Cellular Subscribers", data: Cell_S, fmt: "#", sec: true },
    { label: "Cellular Monthly Fee (₹)", data: Cell_M, fmt: "₹", sec: true },
    { label: "Cellular Revenue (₹/year)", data: ceRev, fmt: "₹", sec: true },
    { label: "", data: [0, 0, 0, 0, 0], fmt: "auto" },
    { label: "White-Label / OEM Revenue (₹)", data: WL_R, fmt: "₹" },
    { label: "", data: [0, 0, 0, 0, 0], fmt: "auto" },
    { label: "TOTAL B2B REVENUE (₹)", data: b2bT, fmt: "₹" },
  ];

  b2bRows.forEach(({ label, data, fmt, sec }) => {
    const r = B2B.addRow([label, ...data]);
    sdr(r, fmt, label.includes("TOTAL"), data[0] === 0 && label !== "");
    if (sec && data[0] !== 0) {
      r.getCell(1).font = { italic: true };
    }
  });

  // ═══════════════════════════════════ REVENUE SUMMARY ════
  const RS = wb.addWorksheet("Revenue Summary");
  RS.getColumn(1).width = 36; [2, 3, 4, 5, 6].forEach(i => (RS.getColumn(i).width = 20));
  hdr(RS.addRow(["REVENUE STREAM", 2026, 2027, 2028, 2029, 2030]));

  const rsRows: [string, number[], Fmt][] = [
    ["B2C Tag Hardware", tRev, "₹"],
    ["B2C Family Plan Revenue", famSubRev, "₹"],
    ["B2C AI Pro Revenue", aiSubRev, "₹"],
    ["B2C Accessories", acRev, "₹"],
    ["B2B Fleet Hardware", flRev, "₹"],
    ["B2B Enterprise Hub", huRev, "₹"],
    ["B2B API Subscriptions", apRev, "₹"],
    ["B2B SaaS Subscriptions", saRev, "₹"],
    ["B2B Cellular Subscriptions", ceRev, "₹"],
    ["B2B White-Label / OEM", WL_R, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["TOTAL REVENUE", REV, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["Total Revenue (₹ Lakhs)", REV.map(r => +(r / 100000).toFixed(1)), "#"],
    ["Total Revenue (₹ Crores)", REV.map(r => +(r / 10000000).toFixed(2)), "#"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["B2C % of Total", b2cT.map((b, i) => +(b / REV[i]).toFixed(3)), "%"],
    ["B2B % of Total", b2bT.map((b, i) => +(b / REV[i]).toFixed(3)), "%"],
    ["YoY Revenue Growth", [0, ...REV.slice(1).map((r, i) => +((r - REV[i]) / REV[i]).toFixed(3))], "%"],
  ];

  rsRows.forEach(([label, data, fmt]) => {
    const r = RS.addRow([label, ...data]);
    sdr(r, fmt, label.includes("TOTAL"), data[0] === 0 && label !== "");
  });

  // ═══════════════════════════════════ COGS ════
  const CG = wb.addWorksheet("COGS Detail");
  CG.getColumn(1).width = 42; [2, 3, 4, 5, 6].forEach(i => (CG.getColumn(i).width = 20));
  hdr(CG.addRow(["COMPONENT", 2026, 2027, 2028, 2029, 2030]));

  const cgsRows: [string, (number | string)[], Fmt][] = [
    ["── B2C COGS ──", [0, 0, 0, 0, 0], "auto"],
    ["Tags Sold", TAGS, "#"],
    ["BOM per Tag (₹)", B2C_BOM, "₹"],
    ["Assembly per Tag (₹)", B2C_ASM, "₹"],
    ["Unit COGS (₹)", b2cUC, "₹"],
    ["Total B2C Hardware COGS", b2cTH, "₹"],
    ["Manufacturing Overhead", b2cOH, "₹"],
    ["Total B2C COGS", b2cTH.map((t, i) => t + b2cOH[i]), "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["── B2B COGS ──", [0, 0, 0, 0, 0], "auto"],
    ["Fleet Units", B2B_U, "#"],
    ["BOM per Unit (₹)", B2B_BOM, "₹"],
    ["Assembly per Unit (₹)", B2B_ASM, "₹"],
    ["Unit COGS (₹)", b2bUC, "₹"],
    ["Total B2B Hardware COGS", b2bTH, "₹"],
    ["Manufacturing Overhead", b2bOH, "₹"],
    ["Total B2B COGS", b2bTH.map((t, i) => t + b2bOH[i]), "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["Cellular Data Cost", celD, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["TOTAL COGS", COGS, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["── UNIT ECONOMICS ──", [0, 0, 0, 0, 0], "auto"],
    ["B2C Revenue per Tag (₹)", TAG_PR, "₹"],
    ["B2C COGS per Tag (incl ovhd) (₹)", b2cUC.map((c, i) => c + Math.round(c * MFG_O[i])), "₹"],
    ["B2C Gross Profit per Tag (₹)", b2cUC.map((c, i) => TAG_PR[i] - c - Math.round(c * MFG_O[i])), "₹"],
    ["B2C Gross Margin %", b2cUC.map((c, i) => +((TAG_PR[i] - c - c * MFG_O[i]) / TAG_PR[i]).toFixed(3)), "%"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["B2B Revenue per Unit (₹)", B2B_RPU, "₹"],
    ["B2B COGS per Unit (incl ovhd) (₹)", b2bUC.map((c, i) => c + Math.round(c * MFG_O[i])), "₹"],
    ["B2B Gross Profit per Unit (₹)", b2bUC.map((c, i) => B2B_RPU[i] - c - Math.round(c * MFG_O[i])), "₹"],
    ["B2B Gross Margin %", b2bUC.map((c, i) => +((B2B_RPU[i] - c - c * MFG_O[i]) / B2B_RPU[i]).toFixed(3)), "%"],
  ];

  cgsRows.forEach(([label, data, fmt]) => {
    const numeric = data.map(d => typeof d === "number" ? d : 0);
    const r = CG.addRow([label, ...numeric]);
    sdr(r, fmt, String(label).includes("TOTAL"), numeric[0] === 0 && String(label) !== "");
    if (String(label).startsWith("──")) r.eachCell(c => c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F5E9" } });
  });

  // ═══════════════════════════════════ OPEX ════
  const O = wb.addWorksheet("OpEx");
  O.getColumn(1).width = 36; [2, 3, 4, 5, 6].forEach(i => (O.getColumn(i).width = 20));
  hdr(O.addRow(["CATEGORY", 2026, 2027, 2028, 2029, 2030]));

  const oRows: [string, number[], Fmt][] = [
    ["Team Salaries", SALARIES, "₹"],
    ["R&D / Prototyping", RD_EXP, "₹"],
    ["Cloud Infrastructure", cldC, "₹"],
    ["AI Inference (Groq API)", aiC, "₹"],
    ["Marketing (B2C)", MKTG, "₹"],
    ["B2B Sales", B2B_S, "₹"],
    ["Customer Support", SUPP, "₹"],
    ["Compliance & Certification", COMP, "₹"],
    ["General & Administrative", GA, "₹"],
    ["Office Rent & Utilities", OFF, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["TOTAL OpEx", OPEX, "₹"],
    ["", [0, 0, 0, 0, 0], "auto"],
    ["OpEx as % of Revenue", OPEX.map((o, i) => +(o / REV[i]).toFixed(3)), "%"],
  ];

  oRows.forEach(([label, data, fmt]) => {
    const r = O.addRow([label, ...data]);
    sdr(r, fmt, label.includes("TOTAL"), data[0] === 0 && label !== "");
  });

  // ═══════════════════════════════════ P&L ════
  const PL = wb.addWorksheet("P&L Statement");
  PL.getColumn(1).width = 36; [2, 3, 4, 5, 6].forEach(i => (PL.getColumn(i).width = 20));
  hdr(PL.addRow(["P&L ITEM", 2026, 2027, 2028, 2029, 2030]));

  const plRows: [string, number[], Fmt, boolean][] = [
    ["Total Revenue", REV, "₹", false],
    ["", [0, 0, 0, 0, 0], "auto", false],
    ["Total COGS", COGS, "₹", false],
    ["  B2C Hardware (incl overhead)", b2cTH.map((t, i) => t + b2cOH[i]), "₹", false],
    ["  B2B Hardware (incl overhead)", b2bTH.map((t, i) => t + b2bOH[i]), "₹", false],
    ["  Cellular Data", celD, "₹", false],
    ["", [0, 0, 0, 0, 0], "auto", false],
    ["GROSS PROFIT", GP, "₹", true],
    ["Gross Margin", GM, "%", false],
    ["", [0, 0, 0, 0, 0], "auto", false],
    ["Operating Expenses", [0, 0, 0, 0, 0], "auto", false],
    ["  Team Salaries", SALARIES, "₹", false],
    ["  R&D / Prototyping", RD_EXP, "₹", false],
    ["  Cloud Infrastructure", cldC, "₹", false],
    ["  AI Inference", aiC, "₹", false],
    ["  Marketing", MKTG, "₹", false],
    ["  B2B Sales", B2B_S, "₹", false],
    ["  Customer Support", SUPP, "₹", false],
    ["  Compliance", COMP, "₹", false],
    ["  G&A", GA, "₹", false],
    ["  Office", OFF, "₹", false],
    ["", [0, 0, 0, 0, 0], "auto", false],
    ["Total OpEx", OPEX, "₹", false],
    ["", [0, 0, 0, 0, 0], "auto", false],
    ["EBITDA", EBITDA, "₹", true],
    ["EBITDA Margin", EM, "%", false],
    ["", [0, 0, 0, 0, 0], "auto", false],
    ["Depreciation", DEPR, "₹", false],
    ["EBIT (Operating Profit)", EBIT, "₹", false],
    ["", [0, 0, 0, 0, 0], "auto", false],
    ["Tax @ 25%", TAX, "₹", false],
    ["NET INCOME", NI, "₹", true],
    ["Net Margin", NM, "%", false],
    ["", [0, 0, 0, 0, 0], "auto", false],
    ["Cumulative Net Income", CUM, "₹", false],
  ];

  plRows.forEach(([label, data, fmt, isTotal]) => {
    const r = PL.addRow([label, ...data]);
    sdr(r, fmt, isTotal, data[0] === 0 && label !== "");
    if (["NET INCOME", "EBITDA"].includes(String(label))) {
      r.eachCell(c => { if (typeof c.value === "number" && c.value > 0) c.font = { bold: true, color: { argb: "FF2E7D32" } }; });
    }
  });

  // ═══════════════════════════════════ BREAK-EVEN ════
  const BE = wb.addWorksheet("Break-Even");
  BE.getColumn(1).width = 40; BE.getColumn(2).width = 16; BE.getColumn(3).width = 16; BE.getColumn(4).width = 58;

  BE.addRow(["BREAK-EVEN ANALYSIS", "", "", ""]).font = { bold: true, size: 14 };
  BE.addRow([""]);

  const beRows: [string, number | string, number | string, string][] = [
    ["── B2C UNIT ECONOMICS ──", "", "", ""],
    ["Selling Price per Tag (₹)", `${TAG_PR[0]}→${TAG_PR[2]}→${TAG_PR[4]}`, "", `₹${TAG_PR[0]} intro, ₹${TAG_PR[2]} Y3, ₹${TAG_PR[4]} Y5`],
    ["COGS per Tag (BOM + Assembly)", 830, "", "₹750 + ₹80 (China-sourced, Y1 volumes)"],
    ["Manufacturing Overhead (₹)", "~50", "", "~6% of unit COGS"],
    ["Total COGS per Tag (₹)", 880, "", ""],
    ["Gross Profit per Tag (₹)", TAG_PR[0] - 880, "", `~${Math.round((TAG_PR[0] - 880) / TAG_PR[0] * 100)}% margin`],
    ["", 0, 0, ""],
    ["Monthly Fixed Costs (Y1 est.)", "₹1,00,000", "", "2 founders lean salaries + cloud + basic operations"],
    ["Monthly Tags to Cover Fixed", "~47", "", "₹1L ÷ ₹2,120"],
    ["Annual B/E Volume (fixed costs only)", "~570", "", ""],
    ["", 0, 0, ""],
    ["── P&L HIGHLIGHTS ──", "", "", ""],
    ["Year 1 (2026)", "", "", "Investment year — R&D, CapEx, product-market fit. Cumulatively -₹7.2L."],
    ["  Revenue", REV[0], "", ""],
    ["  EBITDA", EBITDA[0], "", ""],
    ["  Net Income", NI[0], "", ""],
    ["", 0, 0, ""],
    ["Year 2 (2027)", "", "", "Building traction. Higher team costs, ramp in B2B. Still pre-EBITDA."],
    ["  Revenue", REV[1], "", ""],
    ["  EBITDA", EBITDA[1], "", ""],
    ["  Net Income", NI[1], "", ""],
    ["", 0, 0, ""],
    ["Year 3 (2028)", "", "", "Product-market fit confirmed. Revenue grows but OpEx scales ahead."],
    ["  Revenue", REV[2], "", ""],
    ["  EBITDA", EBITDA[2], "", ""],
    ["  Net Income", NI[2], "", ""],
    ["", 0, 0, ""],
    ["Year 4 (2029) — BREAK-EVEN ✓", "", "", `EBITDA +₹${(EBITDA[3]/100000).toFixed(1)}L, Net Income +₹${(NI[3]/100000).toFixed(1)}L. Profitable.`],
    ["  Revenue", REV[3], "", ""],
    ["  EBITDA", EBITDA[3], "", ""],
    ["  Net Income", NI[3], "", ""],
    ["", 0, 0, ""],
    ["Year 5 (2030)", "", "", `₹${(CUM[4]/10000000).toFixed(2)}Cr cumulative profit. Scaling aggressively.`],
    ["  Revenue", REV[4], "", ""],
    ["  EBITDA", EBITDA[4], "", ""],
    ["  Net Income", NI[4], "", ""],
    ["", 0, 0, ""],
    ["── CUMULATIVE ──", "", "", ""],
    ["Cumulative P&L End Y1", CUM[0], "", ""],
    ["Cumulative P&L End Y2", CUM[1], "", ""],
    ["Cumulative P&L End Y3", CUM[2], "", ""],
    ["Cumulative P&L End Y4", CUM[3], "", "", `FULLY BREAK-EVEN at +₹${(CUM[3]/100000).toFixed(1)}L`],
    ["", 0, 0, ""],
    ["", 0, 0, ""],
    ["── MARKET CONTEXT ──", "", "", ""],
    ["India GPS Tracker Market (2024)", "~₹1,214 Cr", "", "$146M × ₹83 exchange rate"],
    ["India Asset Tracking Market (2026)", "~₹14,940 Cr", "", "$1.8B, growing 16.4% CAGR"],
    ["TagX Y5 Share of India GPS Market", "", "0.6%", "Reasonable for niche hardware brand"],
    ["", 0, 0, ""],
    ["── COMPARABLE STARTUPS ──", "", "", ""],
    ["Enlog (IoT Hardware, India)", "", "", "FY23: ₹17L → FY24: ₹2.3Cr → FY25P: ₹12Cr"],
    ["FluxGen (IoT, India)", "", "", "₹1Cr revenue, bootstrapped"],
    ["IoTfy (Chip-to-Cloud, India)", "", "", "~$1M revenue, profitable by Year 3"],
  ];

  beRows.forEach(([a, b, c, d]) => {
    const r = BE.addRow([a, b, c, d]);
    r.eachCell((cell, j) => {
      cell.border = THIN;
      if (j === 1) {
        cell.font = { bold: true };
        if (String(a).startsWith("──")) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F5E9" } };
        else if (a.startsWith("Year") && a.includes("BREAK-EVEN")) cell.font = { bold: true, color: { argb: "FF2E7D32" } };
      } else if (j > 1) {
        if (typeof b === "number") cell.numFmt = typeof b === "number" && b < 1 && b > -1 ? "0%" : "₹#,##0";
      }
    });
  });

  // ── SAVE ──────────────────────────────────────────
  const outPath = path.resolve("/Users/anoop/FY BTECH/Sem-4/TagX/TagX_Financial_Model.xlsx");
  await wb.xlsx.writeFile(outPath);
  console.log(`✅ Written to ${outPath}`);
  console.log("");
  console.log("─── P&L SUMMARY (₹) ───");
  const h = ["", 2026, 2027, 2028, 2029, 2030];
  const rows = [
    ["Revenue", ...REV],
    ["COGS", ...COGS],
    ["Gross Profit", ...GP],
    ["Gross Margin", ...GM.map(g => `${(g*100).toFixed(1)}%`)],
    ["OpEx", ...OPEX],
    ["EBITDA", ...EBITDA],
    ["EBITDA Margin", ...EM.map(e => `${(e*100).toFixed(1)}%`)],
    ["Net Income", ...NI],
    ["Net Margin", ...NM.map(n => `${(n*100).toFixed(1)}%`)],
    ["Cumulative", ...CUM],
  ];
  rows.forEach(row => {
    console.log(`  ${row[0].padEnd(20)} ${row.slice(1).map((v, i) => String(v).padStart(12)).join(" ")}`);
  });
  console.log("");
  const yearLabels = ["Year 1 (2026)", "Year 2 (2027)", "Year 3 (2028)", "Year 4 (2029)", "Year 5 (2030)"];
  const ebitdaBEYear = EBITDA.findIndex(e => e >= 0);
  const niBEYear = NI.findIndex(n => n >= 0);
  console.log(`  ✅ EBITDA positive from ${yearLabels[ebitdaBEYear]}: ₹${(EBITDA[ebitdaBEYear]/100000).toFixed(1)}L`);
  console.log(`  ✅ Net Income positive from ${yearLabels[niBEYear]}: ₹${(NI[niBEYear]/100000).toFixed(1)}L`);
  const cumBEYear = CUM.findIndex(c => c >= 0);
  console.log(`  ✅ Cumulative B/E in ${yearLabels[cumBEYear]}: ₹${(CUM[cumBEYear]/100000).toFixed(1)}L cumulative`);
  console.log(`  ✅ Total funding needed: ~₹${Math.round(total/100000)}L (CapEx + Y1-2 operating deficit + contingency)`);
}

main().catch(console.error);

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { preparePdfText } from "./arabicPdfText";

export type FinancialReportSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
};

export type FinancialReportCategory = {
  name: string;
  amount: string;
  percentage: string;
};

export type FinancialReportBudget = {
  category: string;
  amount: string;
  spent: string;
  remaining: string;
  progress: string;
  exceeded: boolean;
};

export type FinancialReportGoal = {
  name: string;
  targetAmount: string;
  currentAmount: string;
  remaining: string;
  progress: string;
};

export type FinancialReportInsight = {
  title: string;
  message: string;
};

export type FinancialReportLabels = {
  appName: string;
  reportTitle: string;
  generatedOn: string;
  summaryTitle: string;
  income: string;
  expense: string;
  balance: string;
  transactions: string;
  spendingTitle: string;
  topTitle: string;
  budgetsTitle: string;
  goalsTitle: string;
  insightsTitle: string;
  emptySection: string;
  category: string;
  amount: string;
  percentage: string;
  budget: string;
  spent: string;
  remaining: string;
  progress: string;
  status: string;
  exceeded: string;
  onTrack: string;
  goalName: string;
  target: string;
  saved: string;
  footer: string;
  pageLabel: string;
};

export type FinancialReportData = {
  userName: string;
  month: number;
  year: number;
  periodLabel: string;
  rtl: boolean;
  labels: FinancialReportLabels;
  summary: FinancialReportSummary;
  categories: FinancialReportCategory[];
  topCategories: FinancialReportCategory[];
  budgets: FinancialReportBudget[];
  goals: FinancialReportGoal[];
  insights: FinancialReportInsight[];
};

const MARGIN = 16;
const FOOTER_GAP = 22;
const ACCENT: [number, number, number] = [236, 72, 153];
const INK: [number, number, number] = [30, 41, 59];
const MUTED: [number, number, number] = [100, 116, 139];
const LINE: [number, number, number] = [251, 207, 232];
const HEADER_BG: [number, number, number] = [253, 242, 248];
const DANGER: [number, number, number] = [225, 29, 72];
const SUCCESS: [number, number, number] = [13, 148, 136];
const ARABIC_FONT = "Amiri";
const LATIN_FONT = "helvetica";
const ARABIC_FONT_URLS = [
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/amiri/Amiri-Regular.ttf",
];

let arabicFontPromise: Promise<string> | null = null;

function arrayBufferToBinary(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += chunk) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk));
  }
  return binary;
}

async function loadArabicFontBase64(): Promise<string> {
  arabicFontPromise ??= (async () => {
    for (const url of ARABIC_FONT_URLS) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        const buffer = await response.arrayBuffer();
        if (buffer.byteLength < 8_000) continue;
        return btoa(arrayBufferToBinary(buffer));
      } catch {
        // Try the next source.
      }
    }

    throw new Error("ARABIC_FONT_UNAVAILABLE");
  })();

  return arabicFontPromise;
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const response = await fetch("/finova-mark.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function fontName(rtl: boolean): string {
  return rtl ? ARABIC_FONT : LATIN_FONT;
}

function txt(value: string, rtl: boolean): string {
  return preparePdfText(value, rtl);
}

function pageWidth(doc: jsPDF): number {
  return doc.internal.pageSize.getWidth();
}

function pageHeight(doc: jsPDF): number {
  return doc.internal.pageSize.getHeight();
}

function xForAlign(doc: jsPDF, rtl: boolean): number {
  return rtl ? pageWidth(doc) - MARGIN : MARGIN;
}

function textOptions(rtl: boolean): {
  align: "left" | "right";
  isInputRtl?: boolean;
  isOutputRtl?: boolean;
} {
  if (!rtl) {
    return { align: "left" };
  }
  // Text is already reshaped + visually reversed by preparePdfText.
  // Keep R2L flags off so jsPDF does not flip it again.
  return { align: "right" };
}

function setBodyFont(doc: jsPDF, rtl: boolean, size: number, bold = false) {
  if (rtl) {
    doc.setFont(ARABIC_FONT, "normal");
  } else {
    doc.setFont(LATIN_FONT, bold ? "bold" : "normal");
  }
  doc.setFontSize(size);
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed <= pageHeight(doc) - FOOTER_GAP) return y;
  doc.addPage();
  return 20;
}

function lastTableY(doc: jsPDF): number {
  const table = (doc as jsPDF & { lastAutoTable?: { finalY: number } })
    .lastAutoTable;
  return table?.finalY ?? 20;
}

function drawFooters(doc: jsPDF, data: FinancialReportData) {
  const count = doc.getNumberOfPages();
  const { rtl, labels } = data;

  for (let page = 1; page <= count; page += 1) {
    doc.setPage(page);
    const y = pageHeight(doc) - 10;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y - 5, pageWidth(doc) - MARGIN, y - 5);

    setBodyFont(doc, rtl, 8);
    doc.setTextColor(...MUTED);

    const brand = txt(labels.footer, rtl);
    const pageText = txt(`${labels.pageLabel} ${page} / ${count}`, rtl);

    if (rtl) {
      doc.text(brand, pageWidth(doc) - MARGIN, y, { align: "right" });
      doc.text(pageText, MARGIN, y, { align: "left" });
    } else {
      doc.text(brand, MARGIN, y, { align: "left" });
      doc.text(pageText, pageWidth(doc) - MARGIN, y, { align: "right" });
    }
  }
}

function drawSectionTitle(
  doc: jsPDF,
  data: FinancialReportData,
  title: string,
  y: number
): number {
  y = ensureSpace(doc, y, 16);
  setBodyFont(doc, data.rtl, 12, true);
  doc.setTextColor(...ACCENT);
  doc.text(
    txt(title, data.rtl),
    xForAlign(doc, data.rtl),
    y,
    textOptions(data.rtl)
  );

  y += 3;
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.6);
  if (data.rtl) {
    doc.line(pageWidth(doc) - MARGIN, y, pageWidth(doc) - MARGIN - 28, y);
  } else {
    doc.line(MARGIN, y, MARGIN + 28, y);
  }
  return y + 8;
}

function drawEmpty(
  doc: jsPDF,
  data: FinancialReportData,
  y: number
): number {
  y = ensureSpace(doc, y, 10);
  setBodyFont(doc, data.rtl, 10);
  doc.setTextColor(...MUTED);
  doc.text(
    txt(data.labels.emptySection, data.rtl),
    xForAlign(doc, data.rtl),
    y,
    textOptions(data.rtl)
  );
  return y + 10;
}

function renderTable(
  doc: jsPDF,
  data: FinancialReportData,
  startY: number,
  head: string[],
  body: string[][],
  exceededRows: Set<number> = new Set()
): number {
  const y = ensureSpace(doc, startY, 24);

  autoTable(doc, {
    startY: y,
    head: [head.map((cell) => txt(cell, data.rtl))],
    body: body.map((row) => row.map((cell) => txt(cell, data.rtl))),
    theme: "grid",
    styles: {
      font: fontName(data.rtl),
      fontSize: 9,
      cellPadding: 3.2,
      textColor: INK,
      lineColor: LINE,
      lineWidth: 0.3,
      halign: data.rtl ? "right" : "left",
      overflow: "linebreak",
      minCellHeight: 8,
    },
    headStyles: {
      fillColor: HEADER_BG,
      textColor: ACCENT,
      fontStyle: data.rtl ? "normal" : "bold",
      halign: data.rtl ? "right" : "left",
    },
    alternateRowStyles: {
      fillColor: [255, 251, 253],
    },
    margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_GAP },
    tableWidth: "auto",
    rowPageBreak: "auto",
    pageBreak: "auto",
    didParseCell: (hook) => {
      if (hook.section === "body" && exceededRows.has(hook.row.index)) {
        hook.cell.styles.textColor = DANGER;
      }
    },
  });

  return lastTableY(doc) + 10;
}

async function drawHeader(
  doc: jsPDF,
  data: FinancialReportData,
  logo: string | null
): Promise<number> {
  const { rtl, labels } = data;
  const width = pageWidth(doc);

  doc.setFillColor(...HEADER_BG);
  doc.rect(0, 0, width, 42, "F");
  doc.setFillColor(...ACCENT);
  doc.rect(0, 42, width, 1.2, "F");

  const hasLogo = Boolean(logo);
  if (logo) {
    try {
      const logoX = rtl ? width - MARGIN - 14 : MARGIN;
      doc.addImage(logo, "PNG", logoX, 10, 14, 14);
    } catch {
      // Text wordmark remains if the mark cannot be embedded.
    }
  }

  const textX = rtl
    ? width - MARGIN - (hasLogo ? 18 : 0)
    : MARGIN + (hasLogo ? 18 : 0);

  setBodyFont(doc, rtl, 16, true);
  doc.setTextColor(...INK);
  doc.text(txt(labels.appName, rtl), textX, 16, textOptions(rtl));

  setBodyFont(doc, rtl, 11, true);
  doc.setTextColor(...ACCENT);
  doc.text(txt(labels.reportTitle, rtl), textX, 24, textOptions(rtl));

  setBodyFont(doc, rtl, 10);
  doc.setTextColor(...MUTED);
  doc.text(txt(data.periodLabel, rtl), textX, 31, textOptions(rtl));

  setBodyFont(doc, rtl, 10, true);
  doc.setTextColor(...INK);
  doc.text(txt(data.userName, rtl), xForAlign(doc, rtl), 52, textOptions(rtl));

  setBodyFont(doc, rtl, 9);
  doc.setTextColor(...MUTED);
  doc.text(
    txt(labels.generatedOn, rtl),
    xForAlign(doc, rtl),
    58,
    textOptions(rtl)
  );

  return 70;
}

function drawSummary(
  doc: jsPDF,
  data: FinancialReportData,
  y: number,
  formatMoney: (value: number) => string
): number {
  y = drawSectionTitle(doc, data, data.labels.summaryTitle, y);

  const income = formatMoney(data.summary.totalIncome);
  const expense = formatMoney(data.summary.totalExpense);
  const balance = formatMoney(data.summary.balance);
  const count = String(data.summary.transactionCount);

  const body = data.rtl
    ? [
        [expense, data.labels.expense, income, data.labels.income],
        [
          count,
          data.labels.transactions,
          balance,
          data.labels.balance,
        ],
      ]
    : [
        [data.labels.income, income, data.labels.expense, expense],
        [data.labels.balance, balance, data.labels.transactions, count],
      ];

  autoTable(doc, {
    startY: y,
    body: body.map((row) => row.map((cell) => txt(cell, data.rtl))),
    theme: "grid",
    styles: {
      font: fontName(data.rtl),
      fontSize: 10,
      cellPadding: 4,
      textColor: INK,
      lineColor: LINE,
      lineWidth: 0.3,
      halign: data.rtl ? "right" : "left",
      overflow: "linebreak",
    },
    margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_GAP },
    didParseCell: (hook) => {
      const { row, column } = hook;
      if (data.rtl) {
        if (row.index === 0 && column.index === 0) {
          hook.cell.styles.textColor = DANGER;
        }
        if (row.index === 0 && column.index === 2) {
          hook.cell.styles.textColor = SUCCESS;
        }
        if (row.index === 1 && column.index === 2) {
          hook.cell.styles.textColor =
            data.summary.balance >= 0 ? SUCCESS : DANGER;
        }
        if (column.index === 1 || column.index === 3) {
          hook.cell.styles.textColor = MUTED;
          hook.cell.styles.fontSize = 8;
        }
        return;
      }

      if (column.index === 0 || column.index === 2) {
        hook.cell.styles.textColor = MUTED;
        hook.cell.styles.fontSize = 8;
      }
      if (row.index === 0 && column.index === 1) {
        hook.cell.styles.textColor = SUCCESS;
      }
      if (row.index === 0 && column.index === 3) {
        hook.cell.styles.textColor = DANGER;
      }
      if (row.index === 1 && column.index === 1) {
        hook.cell.styles.textColor =
          data.summary.balance >= 0 ? SUCCESS : DANGER;
      }
    },
  });

  return lastTableY(doc) + 12;
}

function drawInsights(
  doc: jsPDF,
  data: FinancialReportData,
  y: number
): number {
  y = drawSectionTitle(doc, data, data.labels.insightsTitle, y);

  if (data.insights.length === 0) {
    return drawEmpty(doc, data, y);
  }

  const usableWidth = pageWidth(doc) - MARGIN * 2;

  for (const insight of data.insights) {
    const title = txt(insight.title, data.rtl);
    const message = txt(insight.message, data.rtl);
    setBodyFont(doc, data.rtl, 10, true);
    const titleLines = doc.splitTextToSize(title, usableWidth);
    setBodyFont(doc, data.rtl, 9);
    const messageLines = doc.splitTextToSize(message, usableWidth);
    const blockHeight = titleLines.length * 5 + messageLines.length * 4.5 + 8;

    y = ensureSpace(doc, y, blockHeight);
    setBodyFont(doc, data.rtl, 10, true);
    doc.setTextColor(...INK);
    doc.text(titleLines, xForAlign(doc, data.rtl), y, textOptions(data.rtl));
    y += titleLines.length * 5 + 1;
    setBodyFont(doc, data.rtl, 9);
    doc.setTextColor(...MUTED);
    doc.text(messageLines, xForAlign(doc, data.rtl), y, textOptions(data.rtl));
    y += messageLines.length * 4.5 + 6;
  }

  return y;
}

export async function exportFinancialReport(
  data: FinancialReportData,
  formatMoney: (value: number) => string
): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  if (data.rtl) {
    const font = await loadArabicFontBase64();
    doc.addFileToVFS("Amiri-Regular.ttf", font);
    // Identity-H must be the encoding argument so Arabic glyphs embed correctly.
    doc.addFont("Amiri-Regular.ttf", ARABIC_FONT, "normal", "Identity-H");
    doc.setFont(ARABIC_FONT);
    // preparePdfText already produces visual order — do not enable setR2L.
    doc.setR2L(false);
  }

  const logo = await loadLogoDataUrl();
  let y = await drawHeader(doc, data, logo);
  y = drawSummary(doc, data, y, formatMoney);

  y = drawSectionTitle(doc, data, data.labels.spendingTitle, y);
  y =
    data.categories.length === 0
      ? drawEmpty(doc, data, y)
      : renderTable(
          doc,
          data,
          y,
          [data.labels.category, data.labels.amount, data.labels.percentage],
          data.categories.map((item) => [
            item.name,
            item.amount,
            item.percentage,
          ])
        );

  y = drawSectionTitle(doc, data, data.labels.topTitle, y);
  y =
    data.topCategories.length === 0
      ? drawEmpty(doc, data, y)
      : renderTable(
          doc,
          data,
          y,
          [data.labels.category, data.labels.amount],
          data.topCategories.map((item, index) => [
            `${index + 1}. ${item.name}`,
            item.amount,
          ])
        );

  y = drawSectionTitle(doc, data, data.labels.budgetsTitle, y);
  if (data.budgets.length === 0) {
    y = drawEmpty(doc, data, y);
  } else {
    const exceeded = new Set<number>();
    data.budgets.forEach((budget, index) => {
      if (budget.exceeded) exceeded.add(index);
    });
    y = renderTable(
      doc,
      data,
      y,
      [
        data.labels.category,
        data.labels.budget,
        data.labels.spent,
        data.labels.remaining,
        data.labels.progress,
        data.labels.status,
      ],
      data.budgets.map((budget) => [
        budget.category,
        budget.amount,
        budget.spent,
        budget.remaining,
        budget.progress,
        budget.exceeded ? data.labels.exceeded : data.labels.onTrack,
      ]),
      exceeded
    );
  }

  y = drawSectionTitle(doc, data, data.labels.goalsTitle, y);
  y =
    data.goals.length === 0
      ? drawEmpty(doc, data, y)
      : renderTable(
          doc,
          data,
          y,
          [
            data.labels.goalName,
            data.labels.target,
            data.labels.saved,
            data.labels.remaining,
            data.labels.progress,
          ],
          data.goals.map((goal) => [
            goal.name,
            goal.targetAmount,
            goal.currentAmount,
            goal.remaining,
            goal.progress,
          ])
        );

  drawInsights(doc, data, y);
  drawFooters(doc, data);

  const month = String(data.month).padStart(2, "0");
  doc.save(`finova-report-${data.year}-${month}.pdf`);
}

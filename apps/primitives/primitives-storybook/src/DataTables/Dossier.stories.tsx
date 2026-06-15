import { VirtualizedDataTable } from "@rs/solid-primitives";
import { createSignal, type JSX } from "solid-js";

import {
  dos,
  dsClassified,
  dsFolder,
  dsFooter,
  dsHeader,
  dsMeta,
  dsPage,
  dsTableWrap,
  dsTitleBar,
  redact,
  stamp,
  stampConf,
  stampSecret,
  stampTop,
  stampUnclas,
} from "./exemplars/dossier.css";

import type { ColumnDef, RowSelectionState } from "@tanstack/solid-table";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

// EXEMPLAR 5 · DOSSIER — classified case file.

type Klass = "conf" | "secret" | "top" | "unclas";
interface CaseFile {
  caseNo: string;
  op: string;
  subject: string;
  klass: string;
  klassCls: Klass;
  date: string;
  officer: string;
  redact?: boolean;
}

const data: CaseFile[] = [
  {
    caseNo: "AX-2611-04",
    op: "Operation BLUEBIRD",
    subject: "M. Halloway — port of entry, LHR T2",
    klass: "TOP SECRET",
    klassCls: "top",
    date: "11 MAY 2026",
    officer: "Agt. R. Voss",
  },
  {
    caseNo: "AX-2611-08",
    op: "Operation CINDER",
    subject: "Containerised cargo manifest no. 4421-J",
    klass: "SECRET",
    klassCls: "secret",
    date: "13 MAY 2026",
    officer: "Agt. K. Ito",
  },
  {
    caseNo: "AX-2611-11",
    op: "Operation BLUEBIRD",
    subject: "Subject ███████ — known associates, Berlin",
    klass: "TOP SECRET",
    klassCls: "top",
    date: "16 MAY 2026",
    officer: "Agt. R. Voss",
    redact: true,
  },
  {
    caseNo: "AX-2611-12",
    op: "Operation HEARTH",
    subject: "Custodial transfer, file 14·B",
    klass: "CONFIDENTIAL",
    klassCls: "conf",
    date: "17 MAY 2026",
    officer: "Off. P. Sykes",
  },
  {
    caseNo: "AX-2611-19",
    op: "Operation FERRY",
    subject: "Maritime intercept — vessel ███████",
    klass: "SECRET",
    klassCls: "secret",
    date: "20 MAY 2026",
    officer: "Lt. Cmdr A. Pell",
    redact: true,
  },
  {
    caseNo: "AX-2611-22",
    op: "Operation CINDER",
    subject: "Forensic audit — accounts B-203 to B-218",
    klass: "SECRET",
    klassCls: "secret",
    date: "21 MAY 2026",
    officer: "Agt. K. Ito",
  },
  {
    caseNo: "AX-2611-25",
    op: "Operation LANTERN",
    subject: "Surveillance summary, week ending 22 May",
    klass: "CONFIDENTIAL",
    klassCls: "conf",
    date: "22 MAY 2026",
    officer: "Agt. D. Mensah",
  },
  {
    caseNo: "AX-2611-26",
    op: "Operation BLUEBIRD",
    subject: "Dead-drop, Kreuzberg · contents inventory",
    klass: "TOP SECRET",
    klassCls: "top",
    date: "23 MAY 2026",
    officer: "Agt. R. Voss",
  },
  {
    caseNo: "AX-2611-28",
    op: "—",
    subject: "Press enquiry — declined, ref. PR-128",
    klass: "UNCLASSIFIED",
    klassCls: "unclas",
    date: "24 MAY 2026",
    officer: "P.A.O. J. Lin",
  },
  {
    caseNo: "AX-2611-29",
    op: "Operation FERRY",
    subject: "Witness statement, deposition 04",
    klass: "SECRET",
    klassCls: "secret",
    date: "24 MAY 2026",
    officer: "Lt. Cmdr A. Pell",
  },
];

const stampClass: Record<Klass, string> = {
  conf: `${stamp} ${stampConf}`,
  secret: `${stamp} ${stampSecret}`,
  top: `${stamp} ${stampTop}`,
  unclas: `${stamp} ${stampUnclas}`,
};

const renderSubject = (r: CaseFile): JSX.Element => {
  if (!r.redact) return r.subject;
  const parts = r.subject.split("███████");
  const out: JSX.Element[] = [];
  parts.forEach((p, i) => {
    out.push(p);
    if (i < parts.length - 1) out.push(<span class={redact}>REDACTED</span>);
  });
  return out;
};

const columns: ColumnDef<CaseFile>[] = [
  { id: "case", accessorKey: "caseNo", header: "Case №" },
  { accessorKey: "op", header: "Operation" },
  {
    id: "subject",
    accessorKey: "subject",
    header: "Subject of file",
    cell: (c) => renderSubject(c.row.original),
  },
  {
    id: "class",
    accessorKey: "klass",
    header: "Class.",
    cell: (c) => (
      <span class={stampClass[c.row.original.klassCls]}>
        {c.row.original.klass}
      </span>
    ),
  },
  { accessorKey: "date", header: "Filed" },
  { accessorKey: "officer", header: "Officer" },
];

const meta = {
  title: "Primitives/VirtualizedDataTable/Exemplars/05 Dossier",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const CaseFile: Story = {
  render: () => {
    const [selection, setSelection] = createSignal<RowSelectionState>({
      "2": true,
    });
    return (
      <div class={dos} style={{ height: "100vh" }}>
        <div class={dsHeader}>
          <div class={dsFolder}>
            File Group · F/26-AX
            <b>BUREAU OF AFFAIRS</b>
            Records Division, London
          </div>
          <div class={dsClassified}>
            CLASSIFIED
            <small>Eyes only · §14(2)(b)</small>
          </div>
          <div class={dsMeta}>
            Folio <b>26-AX</b>
            <br />
            Rev. 03 · 25 May 2026
            <br />
            Distribution: 4 of 12
          </div>
        </div>
        <div class={dsTitleBar}>
          <span>
            <b>INDEX</b> · cases registered between 11–24 May 2026
          </span>
          <span>
            10 entries · <b>3 sealed</b> · 1 pulled
          </span>
        </div>
        <div class={dsTableWrap}>
          <VirtualizedDataTable<CaseFile>
            data={() => data}
            columns={() => columns}
            estimateSize={() => 50}
            defaultSorting={[{ id: "date", desc: true }]}
            rowSelection={selection}
            onRowClick={(row) => setSelection({ [row.id]: true })}
          />
        </div>
        <div class={dsFooter}>
          <span>
            Filed by · <b>P. Sykes</b>, Records Officer
          </span>
          <span>Retention · 75 yrs from close of investigation</span>
          <span class={dsPage}>PAGE 01 / 04</span>
        </div>
      </div>
    );
  },
};

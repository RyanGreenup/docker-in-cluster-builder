import { VirtualizedDataTable } from "@rs/solid-primitives";
import { createSignal } from "solid-js";

import {
  alarm,
  code,
  dot,
  dotAlarm,
  dotWarn,
  ok,
  teChrome,
  teClock,
  teFoot,
  teMark,
  teMode,
  teSub,
  teTableWrap,
  teVehicle,
  tele,
  unit,
  warn,
} from "./exemplars/telemetry.css";

import type { ColumnDef, RowSelectionState } from "@tanstack/solid-table";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

// EXEMPLAR 3 · TELEMETRY — mission-control subsystem readout.

type Tag = "ok" | "warn" | "alarm";
interface Channel {
  sys: string;
  code: string;
  sensor: string;
  value: string;
  unit: string;
  range: string;
  t: string;
  tag: Tag;
}

const data: Channel[] = [
  {
    sys: "ECLSS",
    code: "O2-PP-01",
    sensor: "Cabin oxygen partial pressure",
    value: "21.34",
    unit: "kPa",
    range: "20.0 – 23.5",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "ECLSS",
    code: "CO2-SCRB",
    sensor: "CO₂ scrubber bed A · loading",
    value: "62.1",
    unit: "%",
    range: "0 – 85",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "ECLSS",
    code: "H2O-CON",
    sensor: "Condensate accumulator level",
    value: "78.4",
    unit: "%",
    range: "0 – 90",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "EPS",
    code: "BUS-A-V",
    sensor: "Main bus A voltage",
    value: "124.6",
    unit: "Vdc",
    range: "120 – 128",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "EPS",
    code: "BUS-B-V",
    sensor: "Main bus B voltage",
    value: "118.2",
    unit: "Vdc",
    range: "120 – 128",
    t: "T+02:14:37",
    tag: "warn",
  },
  {
    sys: "EPS",
    code: "PV-ARR-I",
    sensor: "Solar array current · total",
    value: "84.1",
    unit: "A",
    range: "75 – 110",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "PROP",
    code: "OX-T-01",
    sensor: "Oxidizer tank · ullage temp",
    value: "−183.4",
    unit: "°C",
    range: "−195 – −175",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "PROP",
    code: "FUEL-P-A",
    sensor: "Fuel manifold pressure",
    value: "2.83",
    unit: "MPa",
    range: "2.6 – 3.1",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "PROP",
    code: "RCS-He",
    sensor: "RCS helium pressurant",
    value: "13.8",
    unit: "MPa",
    range: "≥ 12.0",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "ATCS",
    code: "RAD-OUT-T",
    sensor: "Radiator panel outlet temp",
    value: "+38.6",
    unit: "°C",
    range: "+10 – +40",
    t: "T+02:14:36",
    tag: "warn",
  },
  {
    sys: "GNC",
    code: "IMU-RATE",
    sensor: "IMU body rate · X",
    value: "0.012",
    unit: "°/s",
    range: "≤ 0.50",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "GNC",
    code: "STAR-LOCK",
    sensor: "Star tracker · lock count",
    value: "14 / 16",
    unit: "stars",
    range: "≥ 8",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "COMM",
    code: "S-BAND-RX",
    sensor: "S-band receiver · Eb/N0",
    value: "10.4",
    unit: "dB",
    range: "≥ 6.0",
    t: "T+02:14:38",
    tag: "ok",
  },
  {
    sys: "COMM",
    code: "HGA-PT",
    sensor: "High-gain antenna point error",
    value: "1.82",
    unit: "°",
    range: "≤ 1.20",
    t: "T+02:14:32",
    tag: "alarm",
  },
  {
    sys: "TCS",
    code: "BAT-CELL",
    sensor: "Battery 3 · cell delta",
    value: "42",
    unit: "mV",
    range: "≤ 30",
    t: "T+02:14:35",
    tag: "warn",
  },
  {
    sys: "HAB",
    code: "INT-PRES",
    sensor: "Hab module · internal pressure",
    value: "101.2",
    unit: "kPa",
    range: "100 – 103",
    t: "T+02:14:38",
    tag: "ok",
  },
];

const dotClass = (tag: Tag): string => {
  if (tag === "alarm") return `${dot} ${dotAlarm}`;
  if (tag === "warn") return `${dot} ${dotWarn}`;
  return dot;
};

const columns: ColumnDef<Channel>[] = [
  {
    id: "status",
    header: "",
    enableSorting: false,
    cell: (c) => <span class={dotClass(c.row.original.tag)} />,
  },
  { accessorKey: "sys", header: "Bus" },
  {
    accessorKey: "sensor",
    header: "Sensor",
    cell: (c) => (
      <>
        <span class={code}>{c.row.original.code}</span>
        {c.row.original.sensor}
      </>
    ),
  },
  {
    accessorKey: "value",
    header: "Reading",
    cell: (c) => (
      <>
        {c.row.original.value}
        <span class={unit}>{c.row.original.unit}</span>
      </>
    ),
  },
  { accessorKey: "range", header: "Nominal" },
  { accessorKey: "t", header: "Last" },
];

const meta = {
  title: "Primitives/VirtualizedDataTable/Exemplars/03 Telemetry",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const MissionControl: Story = {
  render: () => {
    const [selection, setSelection] = createSignal<RowSelectionState>({
      "13": true,
    });
    return (
      <div class={tele} style={{ height: "100vh" }}>
        <div class={teChrome}>
          <span class={teMark}>
            FLIGHT-OPS <b>Aurora</b>
          </span>
          <span class={teVehicle}>
            VEH · <b>ARTEMIS-IV / ORION CM-04</b>
          </span>
          <span class={teClock}>
            MET <b>T+02:14:38</b>
          </span>
          <span class={teMode}>
            MODE<b>ORBIT / NOM</b>
          </span>
          <span class={teMode}>
            CREW<b>4/4 OK</b>
          </span>
        </div>
        <div class={teSub}>
          <div>
            Power<b class={ok}>96.4 %</b>
          </div>
          <div>
            Thermal<b class={warn}>+38.6 °C</b>
          </div>
          <div>
            Comm<b class={alarm}>DEGRADED</b>
          </div>
          <div>
            Caution &amp; Warning<b class={warn}>2 ADV · 1 CAUT</b>
          </div>
        </div>
        <div class={teTableWrap}>
          <VirtualizedDataTable<Channel>
            data={() => data}
            columns={() => columns}
            estimateSize={() => 34}
            defaultSorting={[{ id: "sys", desc: false }]}
            rowSelection={selection}
            onRowClick={(row) => setSelection({ [row.id]: true })}
          />
        </div>
        <div class={teFoot}>
          <span>16 channels · 1 alarm · 3 cautions · all data validated</span>
          <span>
            downlink <b>OK</b> · uplink <b>OK</b> · cadence 1Hz
          </span>
        </div>
      </div>
    );
  },
};

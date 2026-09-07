'use client';
import { useState } from 'react';
import { bySymbol, type Element } from '../../data/elements';
import type { Compound } from '../../lib/chemistry';

export const atomColor = (s: string) =>
  ({
    H: '#e3eaf8',
    O: '#ffb1b4',
    N: '#b6cbff',
    C: '#c2bddb',
    Na: '#d4b8ff',
    Cl: '#b9e9ac',
    S: '#ffe48b',
    Ca: '#ffd4a2',
    P: '#ffc391',
  })[s] || '#bde9e3';

type Point = [string, number, number];
type Graph = { points: Point[]; bonds: number[][] };

const graphs: Record<string, Graph> = {
  H2: {
    points: [
      ['H', 90, 95],
      ['H', 190, 95],
    ],
    bonds: [[0, 1, 1]],
  },
  O2: {
    points: [
      ['O', 90, 95],
      ['O', 190, 95],
    ],
    bonds: [[0, 1, 2]],
  },
  N2: {
    points: [
      ['N', 90, 95],
      ['N', 190, 95],
    ],
    bonds: [[0, 1, 3]],
  },
  H2O: {
    points: [
      ['O', 140, 65],
      ['H', 75, 120],
      ['H', 205, 120],
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
    ],
  },
  CO2: {
    points: [
      ['O', 55, 95],
      ['C', 140, 95],
      ['O', 225, 95],
    ],
    bonds: [
      [0, 1, 2],
      [1, 2, 2],
    ],
  },
  CO: {
    points: [
      ['C', 90, 95],
      ['O', 190, 95],
    ],
    bonds: [[0, 1, 3]],
  },
  CH4: {
    points: [
      ['C', 140, 95],
      ['H', 65, 95],
      ['H', 140, 25],
      ['H', 215, 95],
      ['H', 140, 165],
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
      [0, 4, 1],
    ],
  },
  NH3: {
    points: [
      ['N', 140, 80],
      ['H', 60, 130],
      ['H', 140, 155],
      ['H', 220, 130],
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
    ],
  },
  H2O2: {
    points: [
      ['H', 35, 120],
      ['O', 100, 75],
      ['O', 180, 115],
      ['H', 245, 65],
    ],
    bonds: [
      [0, 1, 1],
      [1, 2, 1],
      [2, 3, 1],
    ],
  },
};
for (const s of ['F', 'Cl', 'Br', 'I'])
  graphs[s + '2'] = {
    points: [
      [s, 90, 95],
      [s, 190, 95],
    ],
    bonds: [[0, 1, 1]],
  };
for (const s of ['F', 'Cl', 'Br', 'I'])
  graphs['H' + s] = {
    points: [
      ['H', 90, 95],
      [s, 190, 95],
    ],
    bonds: [[0, 1, 1]],
  };
export function Formula({ value }: { value: string }) {
  const parts = value.split(/(\d+)/);
  return (
    <span className="formula">
      {parts.map((s, i) =>
        /^\d+$/.test(s) && i > 0 && !/[·.]$/.test(parts[i - 1]) ? (
          <sub key={i}>{s}</sub>
        ) : (
          <span key={i}>{s}</span>
        ),
      )}
    </span>
  );
}
export function MoleculeModel({ compound: c }: { compound: Compound }) {
  const [transfer, setTransfer] = useState(false);
  const graph = graphs[c.formula];
  if (c.formula === 'NaCl')
    return (
      <div className="model">
        <div className={'ion-transfer ' + (transfer ? 'transferred' : '')}>
          <span className="model-ion" style={{ background: atomColor('Na') }}>
            Na{transfer ? '⁺' : ''}
          </span>
          <span className="moving-electron">e⁻</span>
          <span className="model-ion" style={{ background: atomColor('Cl') }}>
            Cl{transfer ? '⁻' : ''}
          </span>
        </div>
        <button className="secondary" onClick={() => setTransfer(!transfer)}>
          {transfer ? 'Replay electron transfer' : 'Watch an electron move'}
        </button>
        <p>
          Na loses 1 electron → Na⁺
          <br />
          Cl gains 1 electron → Cl⁻
        </p>
        <p>
          Opposite charges attract! In salt, many ions form a repeating crystal.
          This pair shows one formula unit, not a separate molecule.
        </p>
      </div>
    );
  return (
    <div className="model">
      {graph ? (
        <>
          <svg
            viewBox="0 0 280 190"
            role="img"
            aria-label={c.name + ' simplified ball-and-stick model'}
          >
            {graph.bonds.flatMap(([a, b, n], i) =>
              Array.from({ length: n }, (_, j) => {
                const p = graph.points[a],
                  q = graph.points[b],
                  dx = q[1] - p[1],
                  dy = q[2] - p[2],
                  len = Math.hypot(dx, dy),
                  off = (j - (n - 1) / 2) * 8;
                return (
                  <line
                    key={i + '-' + j}
                    x1={p[1] - (dy / len) * off}
                    y1={p[2] + (dx / len) * off}
                    x2={q[1] - (dy / len) * off}
                    y2={q[2] + (dx / len) * off}
                    stroke="#8b87a1"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                );
              }),
            )}
            {graph.points.map(([s, x, y], i) => (
              <g
                key={i}
                className="model-node"
                style={{ animationDelay: i * 65 + 'ms' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={s === 'H' ? 22 : 27}
                  fill={atomColor(s)}
                  stroke="#fff"
                  strokeWidth="3"
                />
                <text
                  x={x}
                  y={y + 7}
                  textAnchor="middle"
                  fill="#23314a"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {s}
                </text>
              </g>
            ))}
          </svg>
          <p>
            Each line is a bond: one, two, or three shared pairs of electrons. A
            flat model simplifies the real 3D shape.
          </p>
        </>
      ) : (
        <>
          <div className="composition">
            {Object.entries(c.counts).map(([s, n]) => (
              <span key={s} style={{ background: atomColor(s) }}>
                <b>{s}</b> × {n}
              </span>
            ))}
          </div>
          <p>
            {c.category === 'Ionic compound'
              ? 'Ions attract in a repeating solid. This counts one formula unit, not a separate molecule.'
              : c.category === 'Network solid'
                ? 'These atoms belong to a repeating solid network. The formula gives their ratio.'
                : 'This is an atom-count picture, not a bond or shape model. Atom connections matter too!'}
          </p>
        </>
      )}
      <div className="model-legend">
        {Object.keys(c.counts).map((s) => (
          <span key={s}>
            <i style={{ background: atomColor(s) }} />
            {s} = {bySymbol[s].name}
          </span>
        ))}
      </div>
    </div>
  );
}
export function AtomModel({ element: e }: { element: Element }) {
  return (
    <div className="atom-model">
      <svg
        viewBox="0 0 320 320"
        role="img"
        aria-label={e.name + ' shell model with ' + e.number + ' electrons'}
      >
        <circle cx="160" cy="160" r="27" fill="#e1d6ff" />
        <text x="160" y="156" textAnchor="middle" fontSize="13" fill="#47357d">
          {e.number} p⁺
        </text>
        <text x="160" y="173" textAnchor="middle" fontSize="11" fill="#47357d">
          {e.neutrons === null ? 'n varies' : e.neutrons + ' n'}
        </text>
        {e.shells.map((count, index) => {
          const r = 44 + index * 15;
          return (
            <g key={index}>
              <circle cx="160" cy="160" r={r} fill="none" stroke="#cbd5e7" />
              <g
                className="electron-orbit"
                style={{ animationDuration: 12 + index * 5 + 's' }}
              >
                {Array.from({ length: count }, (_, i) => {
                  const a = (2 * Math.PI * i) / count;
                  return (
                    <circle
                      key={i}
                      cx={160 + r * Math.cos(a)}
                      cy={160 + r * Math.sin(a)}
                      r="3.5"
                      fill="#6750ce"
                    />
                  );
                })}
              </g>
            </g>
          );
        })}
      </svg>
      <b>Electron shells: {e.shells.join(' — ')}</b>
      <p>
        A shell model helps us count electrons. Real electrons do not travel
        along these little circular tracks.
      </p>
      {e.number >= 104 && (
        <p>
          Electron arrangements for these very heavy atoms are partly predicted.
        </p>
      )}
    </div>
  );
}

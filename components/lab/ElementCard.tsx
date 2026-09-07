'use client';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { bySymbol, categoryClass, type Element } from '../../data/elements';
import { AtomModel, Formula } from './Models';
import type { Compound } from '../../lib/chemistry';

export function ElementCard({
  element: e,
  onClose,
  onAdd,
  compounds,
}: {
  element: Element | null;
  onClose: () => void;
  onAdd: (s: string) => void;
  compounds: Compound[];
}) {
  return (
    <Sheet
      open={!!e}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        className="element-sheet"
        initialFocus={() => document.querySelector<HTMLElement>('.sheet-title')}
      >
        {e && (
          <>
            <SheetTitle tabIndex={-1} className="sheet-title">
              {e.name}
            </SheetTitle>
            <SheetDescription>Meet element number {e.number}.</SheetDescription>
            <div className={'element-hero ' + categoryClass(e.category)}>
              <span>{e.number}</span>
              <strong>{e.symbol}</strong>
              <b>{e.name}</b>
            </div>
            <div className="mini-stats">
              <span>
                <small>Atomic mass</small>
                <b>{e.mass} u</b>
              </span>
              <span>
                <small>Standard state</small>
                <b>{e.phase}</b>
              </span>
            </div>
            <span className="family-badge">{e.category}</span>
            <p>{e.description}</p>
            <div className="tip">
              <b>Did you know?</b>
              <p>{e.funFact}</p>
            </div>
            {e.hazardous && (
              <p className="safety">
                ⚠ Scientists handle this substance carefully.
              </p>
            )}
            <button className="primary" onClick={() => onAdd(e.symbol)}>
              Add {e.symbol} to the lab +
            </button>
            <details>
              <summary>Tell me more!</summary>
              <AtomModel element={e} />
              <dl className="details-grid">
                {[
                  ['Protons', e.number],
                  ['Electrons (neutral atom)', e.number],
                  [
                    'Common isotope neutrons',
                    e.neutrons === null
                      ? 'No single common isotope listed'
                      : e.neutrons + ' (' + e.name + '-' + e.isotope + ')',
                  ],
                  ['Electron configuration', e.configuration || 'Not measured'],
                  ['Outermost-shell electrons', e.shells.at(-1)],
                  [
                    'Valence note',
                    'For transition metals, inner-shell electrons can join in bonding too.',
                  ],
                  ['Period', e.period],
                  ['Group', e.group ?? 'f-block series'],
                  ['Family', e.category],
                  [
                    'Element type',
                    e.category === 'Metalloid'
                      ? 'Metalloid'
                      : (e.category.toLowerCase().includes('metal') &&
                            !e.category.toLowerCase().includes('nonmetal')) ||
                          ['Lanthanide', 'Actinide'].includes(e.category)
                        ? 'Metal'
                        : 'Nonmetal',
                  ],
                  [
                    'Melting point',
                    e.melting === null
                      ? 'Not measured'
                      : (e.melting - 273.15).toFixed(2) +
                        ' °C' +
                        (e.symbol === 'He' ? ' (under pressure)' : ''),
                  ],
                  [
                    'Boiling point',
                    e.boiling === null
                      ? 'Not measured'
                      : (e.boiling - 273.15).toFixed(2) + ' °C',
                  ],
                  [
                    'Density',
                    e.density ? e.density + ' g/cm³' : 'Not measured',
                  ],
                  ['Discovered', e.year],
                  ['Discoverer', e.discoverer],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="fine-print">
                Masses are standard atomic weights where available; bracketed
                values refer to an isotope. Density and phase-change values
                depend on conditions. Carbon sublimes at ordinary pressure;
                helium solidifies only under pressure. Heavy-element values may
                be predicted.
              </p>
              <h3>Where it is found or used</h3>
              <p>{e.uses.join(' ')}</p>
              <h3>Discoveries containing {e.symbol}</h3>
              <div className="related">
                {compounds
                  .filter((c) => c.counts[e.symbol])
                  .slice(0, 5)
                  .map((c) => (
                    <span key={c.id}>
                      {c.name} <Formula value={c.formula} />
                    </span>
                  ))}
              </div>
              <details>
                <summary>Element history & name</summary>
                <p>{e.history}</p>
                <a href={e.source} target="_blank" rel="noreferrer">
                  Read the element history reference ↗
                </a>
              </details>
              <a
                href={'https://pubchem.ncbi.nlm.nih.gov/element/' + e.number}
                target="_blank"
                rel="noreferrer"
              >
                Element data: PubChem ↗
              </a>
            </details>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

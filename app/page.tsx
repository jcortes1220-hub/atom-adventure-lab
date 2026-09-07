'use client';
import DataCredits from "../components/lab/DataCredits";
import { useEffect, useMemo, useState } from 'react';
import {
  Atom,
  FlaskConical,
  BookOpen,
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  Plus,
  Minus,
  Trash2,
  Lock,
  ArrowRight,
  Check,
  Lightbulb,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Progress as ProgressBar } from '../components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '../components/ui/sheet';
import { elements, bySymbol, categoryClass } from '../data/elements';
import rawCompounds from '../data/compounds.json';
import { challenges } from '../data/challenges';
import {
  atomTotal,
  matchCompounds,
  parseFormula,
  validateCounts,
  type Counts,
  type Compound,
} from '../lib/chemistry';
import {
  emptyProgress,
  readProgress,
  storageKey,
  type Progress,
} from '../lib/progress';
import { playSound } from '../lib/sound';
import {
  AtomModel,
  Formula,
  MoleculeModel,
  atomColor,
} from '../components/lab/Models';
import { ElementCard } from '../components/lab/ElementCard';
} from '@/lib/chemistry';
import {
  emptyProgress,
  readProgress,
  storageKey,
  type Progress,
} from '@/lib/progress';
import { playSound } from '@/lib/sound';
import {
  AtomModel,
  Formula,
  MoleculeModel,
  atomColor,
} from '@/components/lab/Models';
import { ElementCard } from '@/components/lab/ElementCard';
const compounds = rawCompounds as unknown as Compound[];
const ids = new Set(compounds.map((c) => c.id)),
  missionIds = new Set(challenges.map((c) => c.id)),
  symbols = new Set(elements.map((e) => e.symbol));
const categories = [...new Set(elements.map((e) => e.category))];
function Discovery({
  compound: c,
  units = 1,
}: {
  compound: Compound;
  units?: number;
}) {
  return (
    <div className="discovery-content">
      <span className="family-badge">
        {c.category} · Level {c.level}
      </span>
      <div className="big-formula">
        <Formula value={c.formula} />
      </div>
      {units > 1 && (
        <b>
          {units}{' '}
          {c.category === 'Ionic compound' || c.category === 'Network solid'
            ? 'formula units'
            : 'molecules'}{' '}
          match your atoms
        </b>
      )}
      {c.commonName && <p className="common-name">{c.commonName}</p>}
      <MoleculeModel key={c.id} compound={c} />
      <h3>Made from</h3>
      <div className="made-from">
        {Object.entries(c.counts).map(([s, n]) => (
          <span key={s}>
            {n * units} {bySymbol[s].name} {n * units === 1 ? 'atom' : 'atoms'}
          </span>
        ))}
      </div>
      <h3>Where you’ll find it</h3>
      <p>{c.description}</p>
      <div className="tip">
        <Lightbulb size={18} />
        <div>
          <b>Did you know?</b>
          <p>{c.funFact}</p>
        </div>
      </div>
      {c.hazardous && (
        <p className="safety">⚠ Scientists handle this substance carefully.</p>
      )}
      <p className="fine-print">
        This is a formula match in our virtual model. It does not mean these
        substances form just by mixing elements.
      </p>
      <a
        className="source-link"
        href={c.source}
        target="_blank"
        rel="noreferrer"
      >
        Chemistry reference ↗
      </a>
    </div>
  );
}
export default function Home() {
  const [mode, setMode] = useState('lab'),
    [counts, setCounts] = useState<Counts>({}),
    [peek, setPeek] = useState('H'),
    [detail, setDetail] = useState<string | null>(null),
    [progress, setProgress] = useState<Progress>(emptyProgress),
    [ready, setReady] = useState(false),
    [saveError, setSaveError] = useState(false),
    [message, setMessage] = useState(''),
    [results, setResults] = useState<ReturnType<typeof matchCompounds>>([]),
    [found, setFound] = useState<{ compound: Compound; units: number } | null>(
      null,
    ),
    [bookDetail, setBookDetail] = useState<Compound | null>(null),
    [search, setSearch] = useState(''),
    [bookSearch, setBookSearch] = useState(''),
    [foundOnly, setFoundOnly] = useState(false),
    [bookLimit, setBookLimit] = useState(24),
    [missionIndex, setMissionIndex] = useState(0),
    [showHint, setShowHint] = useState(false),
    [formulaInput, setFormulaInput] = useState(''),
    [celebration, setCelebration] = useState(0),
    [category, setCategory] = useState<string | null>(null);
  const mission = challenges[missionIndex],
    total = atomTotal(counts),
    selected = bySymbol[peek];
  useEffect(() => {
    try {
      setProgress(
        readProgress(localStorage.getItem(storageKey), ids, missionIds),
      );
    } catch {
      setSaveError(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      setSaveError(true);
    }
  }, [progress, ready]);
  function changeAtoms(next: Counts) {
    setCounts(next);
    setFound(null);
    setResults([]);
    setMessage('');
  }
  function add(s: string) {
    if (!symbols.has(s)) return;
    setPeek(s);
    if (total >= 2000 || (counts[s] || 0) >= 999) {
      setMessage('The lab holds 2,000 atoms, with up to 999 of each kind.');
      return;
    }
    changeAtoms({ ...counts, [s]: (counts[s] || 0) + 1 });
    playSound('add', progress.muted);
  }
  function quantity(s: string, n: number) {
    const next = { ...counts };
    if (n <= 0) delete next[s];
    else next[s] = n;
    try {
      changeAtoms(validateCounts(next, symbols));
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  function unlock(result: { compound: Compound; units: number }) {
    setFound(result);
    setCelebration((v) => v + 1);
    const won = mode === 'challenge' && result.compound.id === mission.target;
    setProgress((p) => ({
      ...p,
      found: [...new Set([...p.found, result.compound.id])],
      completed: won ? [...new Set([...p.completed, mission.id])] : p.completed,
    }));
    setMessage(
      won
        ? 'Mission complete! Three stars for your discovery.'
        : 'You discovered ' + result.compound.name + '!',
    );
    playSound(won ? 'challenge' : 'success', progress.muted);
  }
  function discover(atoms = counts) {
    const matches = matchCompounds(atoms, compounds);
    setResults(matches);
    setFound(null);
    if (!matches.length) {
      setMessage(
        'No discovery yet! These atoms do not match a substance in our book. Try adding or removing an atom.',
      );
      return;
    }
    if (matches.length === 1) unlock(matches[0]);
    else
      setMessage(
        'Interesting! These atom counts match several discoveries. Choose one to learn about its structure.',
      );
  }
  function loadFormula() {
    try {
      const next = validateCounts(parseFormula(formulaInput.trim()), symbols);
      changeAtoms(next);
      setMessage('Atoms are ready. What can they make?');
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (tool: unknown, options: unknown) => unknown;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: 'stage_lab_atoms',
      title: 'Put atoms in the lab',
      description:
        'Set atom counts in the visible virtual lab. Does not unlock a discovery; use the discovery button to complete it.',
      inputSchema: {
        type: 'object',
        properties: {
          counts: {
            type: 'object',
            additionalProperties: { type: 'integer', minimum: 1, maximum: 999 },
          },
        },
        required: ['counts'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (input: unknown) => {
        const value = input as { counts: unknown };
        const next = validateCounts(value?.counts, symbols);
        setMode('lab');
        changeAtoms(next);
        await new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        );
        return { counts: next, total: atomTotal(next), status: 'staged' };
      },
    };
    try {
      void Promise.resolve(
        context.registerTool(tool, { signal: lifecycle.signal }),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, []);
  const filteredBook = useMemo(
    () =>
      compounds.filter(
        (c) =>
          (!foundOnly || progress.found.includes(c.id)) &&
          (!bookSearch ||
            (progress.found.includes(c.id) &&
              (c.name + ' ' + c.formula + ' ' + c.commonName)
                .toLowerCase()
                .includes(bookSearch.toLowerCase()))),
      ),
    [foundOnly, bookSearch, progress.found],
  );
  const matchingSearch = (s: string) => {
    const e = bySymbol[s];
    return (
      (!search ||
        (e.name + ' ' + e.symbol + ' ' + e.number)
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (!category || e.category === category)
    );
  };
  return (
    <main>
      <header>
        <div className="brand">
          <span className="brand-icon">
            <Atom />
          </span>
          Element Lab<span className="pill">JUNIOR SCIENTIST</span>
        </div>
        <button
          aria-label={progress.muted ? 'Turn sound on' : 'Mute sound'}
          aria-pressed={!progress.muted}
          onClick={() => {
            setProgress((p) => ({ ...p, muted: !p.muted }));
            if (progress.muted) playSound('add', false);
          }}
        >
          {progress.muted ? <VolumeX /> : <Volume2 />}
        </button>
      </header>
      <div className="workspace">
        <div className="topline">
          <div>
            <span className="eyebrow">BIG DISCOVERIES START SMALL</span>
            <h1>A little curiosity. A whole universe.</h1>
            <p>Pick your atoms. Explore what they can make.</p>
          </div>
          <div className="score">
            <Trophy /> {progress.completed.length * 3} stars
          </div>
        </div>
        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(String(v));
            setMessage('');
          }}
        >
          <TabsList className="modes" aria-label="Choose your lab mode">
            <TabsTrigger value="explore">
              <Atom />
              Explore
            </TabsTrigger>
            <TabsTrigger value="lab">
              <FlaskConical />
              Element Lab
            </TabsTrigger>
            <TabsTrigger value="challenge">
              <Trophy />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="book">
              <BookOpen />
              Discovery Book{' '}
              <span className="nav-count">{progress.found.length}</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={mode}>
            {saveError && (
              <p className="safety" role="status">
                Your browser could not save progress. You can keep playing, but
                discoveries may not stay after you close this page.
              </p>
            )}
            {mode === 'book' ? (
              <section className="book">
                <div className="book-heading">
                  <div>
                    <span className="eyebrow">YOUR GROWING COLLECTION</span>
                    <h2>Small atoms. Amazing discoveries.</h2>
                    <p>
                      {progress.found.length} / {compounds.length} substances
                      discovered
                    </p>
                  </div>
                  <BookOpen size={52} />
                </div>
                <ProgressBar
                  value={(progress.found.length / compounds.length) * 100}
                  aria-label="Discovery book progress"
                  className="book-progress"
                />
                <div className="book-controls">
                  <label className="search-box">
                    <Search size={18} />
                    <input
                      type="search"
                      placeholder="Search your discoveries"
                      aria-label="Search unlocked discoveries"
                      value={bookSearch}
                      onChange={(e) => {
                        setBookSearch(e.target.value);
                        setBookLimit(24);
                      }}
                    />
                  </label>
                  <button
                    className="secondary"
                    aria-pressed={foundOnly}
                    onClick={() => {
                      setFoundOnly(!foundOnly);
                      setBookLimit(24);
                    }}
                  >
                    {foundOnly
                      ? 'Show all mystery cards'
                      : 'Show discoveries only'}
                  </button>
                </div>
                <p className="hint">
                  Every element is available from the start. Levels are guides,
                  never locks.
                </p>
                <div className="book-grid">
                  {filteredBook.slice(0, bookLimit).map((c) =>
                    progress.found.includes(c.id) ? (
                      <button
                        className="book-card unlocked"
                        key={c.id}
                        onClick={() => setBookDetail(c)}
                      >
                        <span className="card-level">
                          {c.rarity} · {'⚛'.repeat(c.level)}
                        </span>
                        <Formula value={c.formula} />
                        <h3>{c.name}</h3>
                        <span>{c.commonName || c.category}</span>
                        <span className="card-arrow">
                          Explore discovery <ArrowRight size={16} />
                        </span>
                      </button>
                    ) : (
                      <div className="book-card mystery" key={c.id}>
                        <span className="card-level">
                          Level {c.level} · {c.rarity}
                        </span>
                        <Lock size={29} />
                        <h3>Mystery substance</h3>
                        <span>Waiting for your curiosity</span>
                        <span aria-label={'Difficulty ' + c.level + ' of 5'}>
                          {'⚛'.repeat(c.level)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
                {!filteredBook.length && (
                  <div className="empty-book">
                    <Atom size={40} />
                    <h3>No discoveries here yet.</h3>
                    <p>
                      Visit the lab and start with two hydrogen atoms and one
                      oxygen atom.
                    </p>
                    <button
                      className="secondary"
                      onClick={() => setMode('lab')}
                    >
                      Go to the lab
                    </button>
                  </div>
                )}
                {filteredBook.length > bookLimit && (
                  <button
                    className="secondary show-more"
                    onClick={() => setBookLimit((v) => v + 24)}
                  >
                    Show more mystery cards ({filteredBook.length - bookLimit}{' '}
                    left)
                  </button>
                )}
              </section>
            ) : (
              <>
                {mode === 'challenge' && (
                  <section className="mission">
                    <div className="mission-icon">
                      <Trophy />
                    </div>
                    <div>
                      <span className="eyebrow">
                        MISSION {missionIndex + 1} OF {challenges.length} · 3
                        STARS
                      </span>
                      <h2>{mission.title}</h2>
                      {showHint && <p>{mission.hint}</p>}
                      {progress.completed.includes(mission.id) && (
                        <b className="mission-done">
                          ✓ Mission complete — three stars earned!
                        </b>
                      )}
                    </div>
                    <div className="mission-actions">
                      <button
                        className="secondary"
                        onClick={() => setShowHint(!showHint)}
                      >
                        {showHint ? 'Hide hint' : 'A little hint'}
                      </button>
                      <button
                        className="text-button"
                        onClick={() => {
                          setMissionIndex((v) => (v + 1) % challenges.length);
                          setShowHint(false);
                          changeAtoms({});
                        }}
                      >
                        Next mission →
                      </button>
                    </div>
                  </section>
                )}
                <div
                  className={
                    'lab-layout ' + (mode === 'explore' ? 'explore-layout' : '')
                  }
                >
                  <section className="table-panel">
                    <div className="section-head">
                      <h2>The periodic table</h2>
                      <span>118 elements · all yours to explore</span>
                    </div>
                    <div className="table-toolbar">
                      <p className="hint">
                        {mode === 'explore'
                          ? 'Tap an element to meet it.'
                          : 'Tap or drag an element to add an atom.'}{' '}
                        Swipe the table to see more.
                      </p>
                      <label className="search-box compact">
                        <Search size={15} />
                        <input
                          aria-label="Find an element"
                          type="search"
                          placeholder="Find an element"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </label>
                    </div>
                    <div
                      className="table-scroll"
                      tabIndex={0}
                      aria-label="Scrollable periodic table"
                    >
                      <div className="periodic">
                        <div className="table-peek">
                          <span
                            className={
                              'peek-symbol ' + categoryClass(selected.category)
                            }
                          >
                            {selected.symbol}
                          </span>
                          <div>
                            <b>{selected.name}</b>
                            <p>
                              {selected.category} ·{' '}
                              {selected.phase.toLowerCase()}
                            </p>
                            <button
                              className="peek-link"
                              onClick={() => setDetail(peek)}
                            >
                              Meet this element ↗
                            </button>
                          </div>
                        </div>
                        {elements.map((e) => (
                          <button
                            key={e.symbol}
                            aria-label={
                              (mode === 'explore' ? 'Explore ' : 'Add ') +
                              e.name +
                              ' (' +
                              e.symbol +
                              '), atomic number ' +
                              e.number
                            }
                            className={
                              'element ' +
                              categoryClass(e.category) +
                              (peek === e.symbol ? ' selected' : '') +
                              (!matchingSearch(e.symbol) ? ' dimmed' : '')
                            }
                            style={{
                              gridColumn: e.position.x,
                              gridRow: e.position.y,
                            }}
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.setData(
                                'text/plain',
                                e.symbol,
                              );
                              event.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => {
                              setPeek(e.symbol);
                              if (mode === 'explore') {
                                setDetail(e.symbol);
                                playSound('add', progress.muted);
                              } else add(e.symbol);
                            }}
                          >
                            <small>{e.number}</small>
                            <strong>{e.symbol}</strong>
                            <span>{e.name}</span>
                            {counts[e.symbol] > 0 && mode !== 'explore' && (
                              <em>{counts[e.symbol]}</em>
                            )}
                          </button>
                        ))}
                        <span
                          className="series-label"
                          style={{ gridColumn: 3, gridRow: 6 }}
                        >
                          57–71
                          <br />↓
                        </span>
                        <span
                          className="series-label"
                          style={{ gridColumn: 3, gridRow: 7 }}
                        >
                          89–103
                          <br />↓
                        </span>
                      </div>
                    </div>
                    {search &&
                      !elements.some((e) => matchingSearch(e.symbol)) && (
                        <p role="status">
                          No matching element. Try its name, symbol, or atomic
                          number.
                        </p>
                      )}
                    <div className="legend" aria-label="Element families">
                      {categories.map((c) => (
                        <button
                          key={c}
                          aria-pressed={category === c}
                          onClick={() => setCategory(category === c ? null : c)}
                        >
                          <i className={categoryClass(c)} />
                          {c}
                        </button>
                      ))}
                    </div>
                    {category && (
                      <button
                        className="text-button"
                        onClick={() => setCategory(null)}
                      >
                        Show every family
                      </button>
                    )}
                    <div className="table-bottom">
                      <span>
                        <span className="live-dot" /> All 118 elements unlocked
                      </span>
                      <button onClick={() => setMode('book')}>
                        <BookOpen size={16} /> {progress.found.length} /{' '}
                        {compounds.length} discoveries <ArrowRight size={15} />
                      </button>
                    </div>
                  </section>
                  {mode === 'explore' ? (
                    <aside className="experiment explore-aside">
                      <span className="eyebrow">MEET THE BUILDING BLOCKS</span>
                      <h2>
                        {selected.name}{' '}
                        <span className="family-badge">{selected.symbol}</span>
                      </h2>
                      <AtomModel element={selected} />
                      <p>{selected.description}</p>
                      <button
                        className="primary"
                        onClick={() => setDetail(peek)}
                      >
                        Tell me more!
                      </button>
                      <div className="bond-guide">
                        <h3>How atoms stick together</h3>
                        <p>
                          <b>Covalent:</b> atoms share electrons.
                        </p>
                        <p>
                          <b>Ionic:</b> positive and negative ions attract.
                        </p>
                        <p>
                          <b>Metallic:</b> electrons move through a group of
                          metal atoms.
                        </p>
                        <span>H—H &nbsp; O=O &nbsp; N≡N</span>
                        <p>One, two, or three shared electron pairs.</p>
                      </div>
                    </aside>
                  ) : (
                    <aside
                      className="experiment"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'copy';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        add(e.dataTransfer.getData('text/plain'));
                      }}
                    >
                      <span className="eyebrow">YOUR VIRTUAL WORKBENCH</span>
                      <h2>
                        <FlaskConical /> Experiment Lab
                      </h2>
                      <p>
                        {total
                          ? total + ' atoms on your workbench'
                          : 'Every discovery starts with an atom.'}
                      </p>
                      <div
                        className="quick-atoms"
                        aria-label="Quick atom choices"
                      >
                        {['H', 'O', 'C', 'N', 'Na', 'Cl'].map((s) => (
                          <button
                            key={s}
                            style={{ background: atomColor(s) }}
                            aria-label={'Quick add ' + bySymbol[s].name}
                            onClick={() => add(s)}
                          >
                            {s}
                            <Plus size={12} />
                          </button>
                        ))}
                      </div>
                      <div className="atom-zone">
                        {!total ? (
                          <div>
                            <Atom size={54} />
                            <h3>What will you discover?</h3>
                            <p>
                              Choose atoms from the table
                              <br />
                              and bring them together here.
                            </p>
                          </div>
                        ) : total <= 16 ? (
                          Object.entries(counts).flatMap(([s, n]) =>
                            Array.from({ length: n }, (_, i) => (
                              <button
                                className="atom-ball"
                                style={{ background: atomColor(s) }}
                                key={s + i}
                                aria-label={
                                  'Remove one ' + bySymbol[s].name + ' atom'
                                }
                                onClick={() => quantity(s, n - 1)}
                              >
                                {s}
                                <span>−</span>
                              </button>
                            )),
                          )
                        ) : (
                          <div className="composition">
                            {Object.entries(counts).map(([s, n]) => (
                              <button
                                key={s}
                                style={{ background: atomColor(s) }}
                                onClick={() => quantity(s, n - 1)}
                                aria-label={
                                  'Remove one ' + bySymbol[s].name + ' atom'
                                }
                              >
                                <b>{s}</b> × {n}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {total > 0 && (
                        <div className="atom-controls">
                          {Object.entries(counts).map(([s, n]) => (
                            <div key={s}>
                              <button
                                className="atom-name"
                                onClick={() => setDetail(s)}
                              >
                                {s}
                                <small>{bySymbol[s].name}</small>
                              </button>
                              <button
                                aria-label={'Decrease ' + s}
                                onClick={() => quantity(s, n - 1)}
                              >
                                <Minus size={16} />
                              </button>
                              <input
                                aria-label={bySymbol[s].name + ' atom count'}
                                type="number"
                                min="1"
                                max="999"
                                value={n}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  if (Number.isInteger(v) && v >= 1)
                                    quantity(s, v);
                                }}
                              />
                              <button
                                aria-label={'Increase ' + s}
                                onClick={() => quantity(s, n + 1)}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        className="primary"
                        disabled={!total || !ready}
                        onClick={() => discover()}
                      >
                        <Sparkles size={19} /> What can this make?
                      </button>
                      <button
                        className="text-button"
                        disabled={!total}
                        onClick={() => changeAtoms({})}
                      >
                        <Trash2 size={15} /> Clear lab
                      </button>
                      <div
                        role="status"
                        aria-live="polite"
                        className={message ? 'lab-message' : ''}
                      >
                        {message}
                      </div>
                      {results.length > 1 && !found && (
                        <div className="candidates">
                          <p>
                            {results.every((r) => r.units === 1)
                              ? 'These candidates contain the same numbers of atoms, connected differently. Scientists call different molecular structures with one formula isomers. Counts alone cannot choose a structure.'
                              : 'Your atoms can match different groups of molecules or formula units. A matching ratio is not enough to tell their structure.'}
                          </p>
                          {results.map((r) => (
                            <button
                              className="candidate"
                              key={r.compound.id}
                              onClick={() => unlock(r)}
                            >
                              <span>
                                <b>{r.compound.name}</b>
                                <small>
                                  <Formula value={r.compound.formula} />
                                  {r.units > 1 ? ' × ' + r.units : ''}
                                </small>
                              </span>
                              <ArrowRight size={18} />
                            </button>
                          ))}
                        </div>
                      )}
                      {found && (
                        <section key={celebration} className="success">
                          <span className="success-mark">
                            <Check />
                          </span>
                          <span className="eyebrow">YOU DISCOVERED</span>
                          <h3>{found.compound.name}!</h3>
                          <Discovery
                            compound={found.compound}
                            units={found.units}
                          />
                          {mode === 'challenge' &&
                            progress.completed.includes(mission.id) && (
                              <button
                                className="primary"
                                onClick={() => {
                                  setMissionIndex(
                                    (v) => (v + 1) % challenges.length,
                                  );
                                  setShowHint(false);
                                  changeAtoms({});
                                }}
                              >
                                Next mission →
                              </button>
                            )}
                        </section>
                      )}
                      <details className="advanced">
                        <summary>Advanced Builder</summary>
                        <p>
                          Add elements from the table, then use +, −, or the
                          number boxes. Big molecules are welcome!
                        </p>
                        <label htmlFor="formula-entry">
                          Or enter a formula
                        </label>
                        <div className="formula-entry">
                          <input
                            id="formula-entry"
                            placeholder="e.g. C6H12O6"
                            value={formulaInput}
                            onChange={(e) => setFormulaInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') loadFormula();
                            }}
                          />
                          <button className="secondary" onClick={loadFormula}>
                            Load atoms
                          </button>
                        </div>
                        <p className="fine-print">
                          Use ordinary digits. Parentheses and hydrate dots work
                          too: CaSO4·2H2O.
                        </p>
                      </details>
                      <div className="tip">
                        <Lightbulb size={19} />
                        <span>
                          Start with water: <b>2 H + 1 O</b>. Each little number
                          counts atoms.
                        </span>
                      </div>
                    </aside>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
        <footer>
          <span>Virtual atoms. Real curiosity.</span>
          <span>This is a model — never mix real chemicals.</span>
          <a
            href="https://pubchem.ncbi.nlm.nih.gov/ptable/"
            target="_blank"
            rel="noreferrer"
          >
            Element data: PubChem ↗
          </a>
        </footer>
        <DataCredits />
      </div>
      <ElementCard
        element={detail ? bySymbol[detail] : null}
        onClose={() => setDetail(null)}
        onAdd={(s) => {
          add(s);
          setDetail(null);
          setMode('lab');
        }}
        compounds={compounds}
      />
      <Sheet
        open={!!bookDetail}
        onOpenChange={(open) => {
          if (!open) setBookDetail(null);
        }}
      >
        <SheetContent
          className="element-sheet"
          initialFocus={() =>
            document.querySelector<HTMLElement>('.sheet-title')
          }
        >
          {bookDetail && (
            <>
              <SheetTitle tabIndex={-1} className="sheet-title">
                {bookDetail.name}
              </SheetTitle>
              <SheetDescription>
                Your discovery, saved in the book.
              </SheetDescription>
              <Discovery compound={bookDetail} />
              <button
                className="primary"
                onClick={() => {
                  changeAtoms({ ...bookDetail.counts });
                  setBookDetail(null);
                  setMode('lab');
                }}
              >
                Build these atoms again
              </button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}

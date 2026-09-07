export function DataCredits() {
  return (
    <details className="data-credits">
      <summary>For grown-ups: sources & model notes</summary>
      <p>
        Formulas and names were checked against PubChem, with NIST and the
        Handbook of Mineralogy used for a few exceptions. Each discovery links
        to its reference. Mineral formulas describe ideal compositions; real
        samples can vary.
      </p>
      <p>
        Element masses, configurations, standard states, and physical data:{' '}
        <a
          href="https://pubchem.ncbi.nlm.nih.gov/ptable/"
          target="_blank"
          rel="noreferrer"
        >
          PubChem
        </a>
        . Supplementary history and shell data:{' '}
        <a
          href="https://github.com/Bowserinator/Periodic-Table-JSON"
          target="_blank"
          rel="noreferrer"
        >
          Bowserinator / Periodic-Table-JSON
        </a>{' '}
        and Wikipedia contributors, licensed under{' '}
        <a
          href="https://creativecommons.org/licenses/by-sa/3.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY-SA 3.0
        </a>
        . The adapted element-reference data is shared under that license.
        History links identify the original articles.
      </p>
      <p>
        This finite discovery book matches atom counts; it is not a reaction
        predictor. Exact molecular formulas come before whole-number multiples.
        A formula may describe structures outside this book too. Small bond
        models are simplified; other entries show composition only. Levels guide
        curiosity and do not indicate safety. No real-world mixing is part of
        the game.
      </p>
    </details>
  );
}

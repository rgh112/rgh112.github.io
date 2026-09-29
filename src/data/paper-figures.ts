export type PaperFigure = {
  id: string; placement: 'approach' | 'finding'; src: string; width: number; height: number;
  title: string; alt: string; caption: string; attribution: string;
  source?: string; license?: {label: string; href: string};
  guide: {label: string; text: string}[];
};

// Explicit selections from the seven public/accepted papers only.
// Private source paths and extraction coordinates are kept outside the website.
export const paperFigures: Record<string, PaperFigure> = {
  'beyond-local-validity': {
    id:'local-environments', placement:'approach', src:'/figures/local-validity-environments.webp', width:1804, height:592,
    title:'One editing protocol, three kinds of search.',
    alt:'Original Figure 1: Word Ladder edits one letter, the alloy proxy transfers composition mass, and GB1 edits a protein sequence. Each follows partial artifact, local edit, and delayed objective. Evidence is exact on the finite Word Ladder and GB1 graphs; the alloy audit uses bounded probes and rounded states.',
    caption:'Figure 1 brings the three environments onto the same editing protocol. A locally admissible change and a successful final artifact are separate checks.',
    attribution:'Ryu, Lee & Lee · Findings of EMNLP 2026 · Figure 1 from the accepted manuscript.',
    guide:[
      {label:'The same decision', text:'At each step, the agent changes a partial artifact. The objective is evaluated after a sequence of edits.'},
      {label:'Different audit limits', text:'Read the evidence bands: Word Ladder and GB1 permit exact graph checks; the alloy proxy uses bounded probes and a rounded-state audit.'},
    ],
  },
  'ood-resolution': {
    id:'ood-audit', placement:'finding', src:'/figures/ood-checkpoint-audit.webp', width:1816, height:648,
    title:'What a tied score can conceal.',
    alt:'Original Figure 1 with three measured panels: normalized token log probability rises before substantial exact-match improvement in a representative COGS run; checkpoint-selection regret varies with labeled OOD budget; early-window zero scores and tied maxima become less frequent as the budget increases.',
    caption:'These are the paper’s measured results. Panel A is a representative COGS trajectory; panels B and C summarize the checkpoint-selection audit. The criteria and reference budgets must be read together.',
    attribution:'Ryu & Lee · Findings of EMNLP 2026 · Figure 1 from the accepted manuscript.',
    guide:[
      {label:'A / Learning signals', text:'Orange token likelihood moves while blue exact match is still near zero. The signals reveal different aspects of the same trajectory.'},
      {label:'B / Selection regret', text:'Lower is better. The plot compares development EM, hard OOD EM, and soft OOD likelihood across labeled reference budgets.'},
      {label:'C / Unresolved ties', text:'Brown marks all-zero early windows; purple marks tied maxima. Pale bars count checkpoints distinguished only by token likelihood.'},
    ],
  },
  autometa: {
    id:'autometa-framework', placement:'approach', src:'/figures/autometa-framework.png', width:1530, height:675,
    title:'From study-level evidence to a pooled estimate.',
    alt:'Original AutoMETA framework: document preprocessing, study-agent initialization, iterative extraction and critique, and statistical synthesis.',
    caption:'Figure 2 shows how study-centered agents extract and check evidence before a separate statistical module combines the results. Figure content is unchanged; surrounding page material was cropped.',
    attribution:'Lee & Ryu · AAMAS 2026 · Figure 2.', source:'https://doi.org/10.65109/HXKA2256',
    license:{label:'CC BY 4.0',href:'https://creativecommons.org/licenses/by/4.0/'},
    guide:[
      {label:'Keep the study attached', text:'Each agent works with one primary study and preserves page-anchored evidence for its extracted entries.'},
      {label:'Check before pooling', text:'Agents critique and revise disputed entries. Statistical synthesis is a separate step after that verification.'},
    ],
  },
  'clinician-trust': {
    id:'trust-framework', placement:'approach', src:'/figures/clinician-trust-framework.webp', width:2718, height:1220,
    title:'Transparency meets a person’s verification process.',
    alt:'Original Figure 1: biomedical QA limitations on the left, a loop between information foraging and sensemaking in the center, and system-side transparency, interpretability, and explainability on the right, leading toward user trust.',
    caption:'The conceptual framework places information foraging and sensemaking on the user side. Interface transparency supports that process; it does not directly determine whether an answer should be trusted.',
    attribution:'Ryu et al. · CHI EA 2026 · Figure 1, reproduced unchanged.', source:'https://doi.org/10.1145/3772363.3798817',
    license:{label:'CC BY-NC-ND 4.0',href:'https://creativecommons.org/licenses/by-nc-nd/4.0/'},
    guide:[
      {label:'Follow the loop', text:'People seek evidence, interpret it, and return for more. The central loop is the organizing idea of the paper.'},
      {label:'Read it as a framework', text:'The three-participant pilot explores this process. The diagram is a conceptual account, not an estimated causal model.'},
    ],
  },
  'moral-profile-dynamics': {
    id:'profile-architecture', placement:'approach', src:'/figures/moral-profiles-architecture.webp', width:1857, height:1049,
    title:'Different priorities inside one shared dormitory.',
    alt:'Original Figure 1: a four-agent dormitory environment connects a language-model agent system, moral-profile prompts, episodic memory updates, a QMIX credit-assignment module, and experimental metrics.',
    caption:'The architecture connects profile-conditioned actions, shared consequences, memory, and contribution feedback. Country-derived labels identify the paper’s artificial profile prompts; they are not claims about real populations.',
    attribution:'Lee, Ryu & Yoo · AAMAS ASI 2026 · Figure 1 from the non-archival workshop paper.', source:'https://openreview.net/forum?id=X20DwkvYeV',
    guide:[
      {label:'Experience becomes memory', text:'Action histories, rewards, and profile-specific lessons feed into subsequent decisions.'},
      {label:'Credit returns to the agent', text:'QMIX decomposes team value into individual contribution signals. The experiment varies 15 group compositions.'},
    ],
  },
  'norm-dynamics': {
    id:'norm-architecture', placement:'approach', src:'/figures/norm-dynamics-architecture.webp', width:1993, height:1114,
    title:'Change the rules. Keep the shared world.',
    alt:'Original Figure 1: four rule regimes above a shared dormitory, agent observations to the left, available actions to the right, profile-conditioned agents around the environment, and contribution feedback and evaluation metrics below.',
    caption:'The figure separates population composition from institutional rules in the co-living simulation. Its profile labels and outcomes describe artificial agents, not validated models of human cultures.',
    attribution:'Lee, Ryu, Kim & Yoo · CHI PoliSim 2026 · Figure 1 from the workshop paper.',
    source:'https://polisim.net/assets/papers/accepted_papers/Manners_Maketh_MAN_Multi-Agent_Norm_Dynamics_under_Cultural_Moral_Values.pdf',
    guide:[
      {label:'Two experimental choices', text:'The top row gives four rule regimes. Group composition is varied separately across 15 configurations.'},
      {label:'Trace the consequences', text:'Observations lead to actions in the shared environment. Rewards and contribution feedback connect those actions to later behavior.'},
    ],
  },
  'counting-pixels': {
    id:'pixel-method', placement:'approach', src:'/figures/pixel-axis-detection.webp', width:1003, height:529,
    title:'A chart becomes a grid of candidate pixels.',
    alt:'Original Figure 2: the left grid illustrates RGB color matching and candidate pixels; the right grid illustrates counting axis-like pixels and identifying the horizontal and vertical axes.',
    caption:'The method uses color thresholds and the spatial arrangement of candidate pixels to find chart axes. This original schematic explains the rule-based procedure; it is not an accuracy plot.',
    attribution:'Lee, Sohn, Ryu & Oh · IEEE IRI 2022 · Figure 2. © 2022 IEEE.', source:'https://doi.org/10.1109/IRI54793.2022.00041',
    guide:[
      {label:'Filter by color', text:'RGB thresholds select pixels that could belong to black or gray chart axes.'},
      {label:'Recover the geometry', text:'Counts and location rules across rows and columns identify the axis structure used in later chart extraction.'},
    ],
  },
};

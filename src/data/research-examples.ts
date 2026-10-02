export type ResearchExample = {
  kind:'checkpoints'|'extraction'|'verification'|'memory'|'configurations'|'pixels';
  title:string; description:string; note:string;
  steps:{label:string;text:string}[];
};

export const researchExamples:Record<string,ResearchExample>={
  'ood-resolution':{
    kind:'checkpoints',title:'Three checkpoints, one tied score',
    description:'Three illustrative checkpoints all score zero out of four on exact match. Token likelihood separates them, while a latest-checkpoint rule selects by training order.',
    note:'Invented checkpoint values with four labeled targets. Token likelihood also uses those target labels.',
    steps:[
      {label:'Exact match',text:'All three checkpoints miss all four target outputs. Exact match assigns each the same score, so the score alone leaves the choice unresolved.'},
      {label:'Token likelihood',text:'The average target-token log probabilities differ. In this example, C gives the highest likelihood to the labeled targets. This does not guarantee better performance on unseen examples.'},
      {label:'Tie rule',text:'A latest-among-ties rule also chooses C here, using training order. It is a separate selection rule; its usefulness depends on how performance changes during training.'},
    ],
  },
  autometa:{
    kind:'extraction',title:'Follow one entry back to its source',
    description:'A source page says 30 days. An extracted entry says 12 months. Critique identifies the mismatch, the study agent revises the entry, and verified evidence proceeds to statistical pooling.',
    note:'Fictional source and extraction record used to illustrate the workflow.',
    steps:[
      {label:'Extract',text:'An agent creates a structured entry and keeps its source-page reference. Here the follow-up field has been extracted incorrectly.'},
      {label:'Check',text:'A critique compares the field with its cited passage. The page reference makes the disagreement specific: 30 days in the source versus 12 months in the entry.'},
      {label:'Revise',text:'The study agent corrects the field and retains the citation. A revision can be traced back to the same source.'},
      {label:'Pool',text:'Checked study-level data are passed to a separate statistical module. The agents’ agreement is part of verification; statistical pooling is a subsequent operation.'},
    ],
  },
  'clinician-trust':{
    kind:'verification',title:'Checking the scope of an answer',
    description:'A fixed AI answer refers to group B. Inspecting the cited source reveals group A. The reader revisits the claim and defers judgment about group B.',
    note:'Scripted verification example. Group A and group B are placeholders.',
    steps:[
      {label:'Read',text:'The answer makes a claim about group B. Its wording stays fixed throughout this example, as the AI answer did across the study’s transparency conditions.'},
      {label:'Inspect',text:'The reader opens a supporting source and checks which group it actually describes.'},
      {label:'Revisit',text:'The source covers group A. The reader returns to the claim about group B and checks whether that extension is justified.'},
      {label:'Judge',text:'Support for group B remains unclear, so the reader can defer reliance and seek more evidence. Access to a citation is one part of that judgment.'},
    ],
  },
  'moral-profile-dynamics':{
    kind:'memory',title:'One shared task, then another decision',
    description:'Four artificial agents observe a shared-kitchen task, take scripted actions, and retain action histories alongside contribution feedback before a later decision.',
    note:'Scripted interaction between four artificial agents, with fictional actions and memories.',
    steps:[
      {label:'Observe',text:'Four agents encounter the same shared-kitchen task. In the study, individual moral-profile prompts provide part of each agent’s decision context.'},
      {label:'Act',text:'In this scripted round, agents choose different actions around the shared task. Their interactions become part of the environment’s history.'},
      {label:'Record',text:'The simulation records actions and outcomes. Episodic memory and QMIX contribution feedback provide information for subsequent decisions.'},
      {label:'Next round',text:'A later decision is made with the profile prompt, remembered experience, and contribution feedback available. The study examines this repeated interaction across group compositions.'},
    ],
  },
  'norm-dynamics':{
    kind:'configurations',title:'Separate the group from the rules',
    description:'A matrix of 15 group compositions and four rule regimes shows a single configuration, comparisons within one group, and comparisons under one rule regime.',
    note:'Each cell represents a group–rule configuration. G1–G15 label the group compositions; R1–R4 label the rule regimes.',
    steps:[
      {label:'One setting',text:'Choose a group composition and a rule regime. The highlighted cell identifies one setting of the shared environment.'},
      {label:'Vary rules',text:'Keep group G8 fixed and compare the four rule regimes. This isolates the rule choice in the experimental design.'},
      {label:'Vary groups',text:'Keep rule regime R2 fixed and compare the 15 group compositions. Outcomes such as welfare and equity are then evaluated for these settings.'},
    ],
  },
  'counting-pixels':{
    kind:'pixels',title:'Find the axes in a small pixel grid',
    description:'A synthetic chart is filtered to a candidate pixel color. Row and column counts reveal two long lines, whose position and intersection identify axis candidates.',
    note:'Synthetic pixel grid illustrating color filtering, counting, and geometric checks.',
    steps:[
      {label:'Chart pixels',text:'The grid contains axis pixels, a plotted series, and two stray dark pixels. The image is still a collection of pixels at this stage.'},
      {label:'Count',text:'Select the dark candidate color and count it in each row and column. The strongest row has 10 candidate pixels; the strongest column has 8.'},
      {label:'Check geometry',text:'The long horizontal and vertical runs meet at the chart’s lower-left corner. Their counts and arrangement identify axis candidates. The stray pixels remain outside those runs.'},
    ],
  },
};

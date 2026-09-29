export const profile = {
  name: 'Kunhee Ryu',
  email: 'rgh00826@yonsei.ac.kr',
  affiliation: 'Human Artificial Intelligence Research Lab',
  university: 'Yonsei University',
  role: 'Researcher',
  updated: 'September 2026',
  links: {
    scholar: 'https://scholar.google.com/citations?user=QdTKpxgAAAAJ&hl=en',
    github: 'https://github.com/rgh112',
    orcid: 'https://orcid.org/0009-0002-3714-1010',
    linkedin: 'https://www.linkedin.com/in/kunhee-ryu-2296b81b5',
    lab: 'https://hairlab.yonsei.ac.kr/',
  },
};

export const questions = [
  { id: 'represent', number: '01', title: 'Learn what carries over.', question: 'Which relations must a model preserve to reason in a new situation?', body: 'I want to learn representations that capture relationships and changes in the environment. The test is whether those representations support prediction and planning when familiar elements appear in unfamiliar combinations.', approach: 'Vary the learned representation and prediction objective, then test unseen combinations of relations and changes in the environment.', measure: 'Transfer, predictive accuracy, and the quality of downstream decisions.', connection: 'My work on checkpoint selection asks whether our measurements can detect the progress that precedes a visible change in generalization.', paper: 'ood-resolution', label: 'Representation & generalization' },
  { id: 'anticipate', number: '02', title: 'Anticipate what an action changes.', question: 'Can an agent recognize when its next move would close off its goal?', body: 'Scientific exploration often proceeds through edits: change a composition, modify a sequence, evaluate the result. I want agents to learn how each edit changes the future options available to them.', approach: 'Begin with environments where goal reachability can be checked, then introduce partial observations and changing constraints.', measure: 'Goal attainment, preservation of feasible paths, constraint violations, and computational cost.', connection: 'My work on local edit validity makes loss of recoverability observable. It motivates learning to anticipate that loss before acting.', paper: 'beyond-local-validity', label: 'World models & planning' },
  { id: 'inquire', number: '03', title: 'Know what to ask next.', question: 'When should an agent observe, consult another agent, or ask a person?', body: 'A useful decision may depend on information the agent does not yet have. I want information gathering to be part of planning, with explicit attention to what a new observation could change.', approach: 'Control what is visible and remembered; compare additional observations, peer evidence, and expert input under a shared cost budget.', measure: 'Decision improvement, information cost, correction of errors, and whether people can understand and act on requests.', connection: 'AutoMETA and my work on clinician trust connect this question to evidence synthesis and human judgment.', paper: 'autometa', label: 'Information & collaboration' },
];

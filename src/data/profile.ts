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
  { id: 'represent', number: '01', title: 'Generalization', question: 'Which relations must a model preserve to reason in a new situation?', body: 'I’m particularly interested in how models represent relationships and changes in their environment. Can a model still use these relationships to predict and plan when the objects or conditions change?', approach: 'Vary the learned representation and prediction objective, then test unseen combinations of relations and changes in the environment.', measure: 'Transfer, predictive accuracy, and the quality of downstream decisions.', connection: 'Planning depends on representations that preserve how actions change a situation. Testing transfer can help reveal which of those relationships a model has learned.', paper: 'ood-resolution', label: 'Representation & generalization' },
  { id: 'anticipate', number: '02', title: 'Predicting action outcomes', question: 'Can an agent recognize when its next move would close off its goal?', body: 'In scientific search, an agent may edit a composition or a sequence over several steps. I’m interested in whether it can predict how each edit affects the chance of reaching the goal.', approach: 'Begin with environments where goal reachability can be checked, then introduce partial observations and changing constraints.', measure: 'Goal attainment, preservation of feasible paths, constraint violations, and computational cost.', connection: 'For planning, a world model needs to predict how an action affects later choices. Constraints such as a limited edit budget make it possible to test whether those predictions are useful.', paper: 'beyond-local-validity', label: 'World models & planning' },
  { id: 'inquire', number: '03', title: 'Information gathering', question: 'When should an agent observe, consult another agent, or ask a person?', body: 'An agent may need to check a source or consult someone before acting. I’m interested in how it decides what information to seek, and whether that information changes its decision.', approach: 'Control what is visible and remembered; compare additional observations, peer evidence, and expert input under a shared cost budget.', measure: 'Decision improvement, information cost, correction of errors, and whether people can understand and act on requests.', connection: 'Active learning asks which observations are worth acquiring. In collaborative tasks, a related question is who to ask and how to use the answer.', paper: 'autometa', label: 'Information & collaboration' },
];

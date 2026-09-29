export type Point = [number, number];
export type StoryNode = { position: Point; radius: number; opacity: number };
export type StoryEdge = { from: number; to: number; weights: number[]; bends: number[] };

// The same 19 nodes and their edges persist through all four arrangements.
// Source measurements become evidence neighborhoods, then candidate states.
const charts: Point[] = [
  [76,127],[114,97],[152,112],[190,77],
  [76,267],[114,237],[152,257],[190,212],
  [76,407],[114,372],[152,387],[190,352],
  [390,102],[390,242],[390,382],[490,242],
  [400,172],[475,172],[530,172],
];
const review: Point[] = [
  [99,110],[129,82],[185,86],[212,123],
  [389,88],[435,82],[470,115],[454,167],
  [253,358],[269,413],[328,411],[351,360],
  [157,145],[422,143],[302,350],[290,240],
  [400,220],[475,220],[530,220],
];
const editing: Point[] = [
  [529,91],[465,95],[393,108],[300,127],
  [511,277],[454,265],[385,250],[297,246],
  [516,399],[450,409],[376,389],[294,367],
  [185,151],[185,246],[185,344],[64,246],
  [386,181],[455,181],[530,181],
];
const planning: Point[] = [
  [533,73],[457,79],[376,97],[278,130],
  [518,293],[450,283],[376,257],[281,246],
  [520,419],[449,412],[375,397],[278,364],
  [172,158],[172,246],[172,338],[64,246],
  [374,173],[452,174],[532,187],
];

export const layouts: StoryNode[][] = [charts,review,editing,planning].map((points,stage)=>points.map((position,i)=>({
  position,
  radius: i===15 ? 10 : i>=12&&i<=14 ? (stage<2?11:7) : i===0&&stage>=2?8:4.5,
  opacity: i>=16 ? (stage===3?1:0) : i===15&&stage===0?0:1,
})));

const edges: StoryEdge[] = [];
for(let group=0;group<3;group++) {
  const start=group*4;
  for(let j=0;j<3;j++) edges.push({from:start+j,to:start+j+1,weights:[.86,.52,group===1?1:.45,group===0?.9:.28],bends:[0,0,0,0]});
  edges.push({from:start+3,to:12+group,weights:[.65,.72,group===1?1:.55,group===0?1:.3],bends:[0,0,0,0]});
  edges.push({from:12+group,to:15,weights:[0,.8,group===1?1:.6,group===0?1:.3],bends:[0,0,0,0]});
  for(let j=0;j<3;j++) edges.push({from:start+j,to:12+group,weights:[0,.26,0,0],bends:[0,0,0,0]});
}
edges.push(
  {from:12,to:13,weights:[0,.5,0,0],bends:[0,-38,0,0]},
  {from:13,to:14,weights:[0,.5,0,0],bends:[0,-28,0,0]},
  {from:14,to:12,weights:[0,.5,0,0],bends:[0,-28,0,0]},
  {from:3,to:16,weights:[0,0,0,.55],bends:[0,0,0,0]},
  {from:16,to:17,weights:[0,0,0,.55],bends:[0,0,0,0]},
  {from:17,to:18,weights:[0,0,0,.55],bends:[0,0,0,0]},
  {from:7,to:16,weights:[0,0,0,.3],bends:[0,0,0,0]},
);
export const storyEdges=edges;

const projectColors = [
  "from-chart-1 to-chart-2",
  "from-chart-2 to-chart-3",
  "from-chart-3 to-chart-4",
  "from-chart-4 to-chart-5",
  "from-chart-5 to-chart-1",
  "from-chart-1 to-chart-3",
];

export const getProjectColor = (index: number): string => {
  return projectColors[index % projectColors.length];
};
export const currencyFormat = (num) => {
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
export const colorArray = [
  "#1f77b498",
  "#ff7f0e98",
  "#2ca02c98",
  "#d6272898",
  "#9467bd98",
  "#8c564b98",
  "#e377c298",
  "#7f7f7f98",
  "#bcbd2298",
  "#17becf98",
  "#9edae598",
  "#a6562898",
  "#98df8a98",
  "#ff989698",
  "#c5b0d598",
  "#c49c9498",
  "#f7b6d298",
  "#c7c7c798",
  "#dbdb8d98",
  "#9c9ede98",
  "#8c6d3198",
  "#c8e7a898",
  "#e7969c98",
  "#d6616b98",
];

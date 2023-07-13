const tolerance = 80;

function hashcode(points, _varphi) {
  let total_hash = "";
  for (let i = 0; i < points.length; i++) {
    total_hash += optimal_discretization(
      points[i][0],
      points[i][1],
      _varphi[i][0],
      _varphi[i][1],
    );
  }
  return (total_hash);
}

function getVarphi(points) {
  let return_array = new Array();
  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y = points[i][1];

    let fi = (x % (2 * tolerance)) >= (tolerance)
      ? x % tolerance
      : (x % (2 * tolerance)) - tolerance;

    let fiy = (y % (2 * tolerance)) >= (tolerance)
      ? y % tolerance
      : (y % (2 * tolerance)) - tolerance;

    return_array.push([fi, fiy]);
  }
  return return_array;
}

function optimal_discretization(x, y, fi, fiy) {
  let hash = Math.floor((x - fi) / (2 * tolerance)).toString();
  hash += Math.floor((y - fiy) / (2 * tolerance)).toString();
  return hash;
}

module.exports = { hashcode, getVarphi, tolerance };

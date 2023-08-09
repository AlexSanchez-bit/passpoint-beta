const tolerance = 0.1;

function hashcode(points, _varphi, scale) {
  let total_hash = "";
  for (let i = 0; i < points.length; i++) {
    total_hash += optimal_discretization(
      points[i][0],
      points[i][1],
      _varphi[i][0],
      _varphi[i][1],
      scale,
    );
  }
  return (total_hash);
}

function getVarphi(points, scale) {
  let return_array = new Array();
  const _tolerance = Math.trunc(tolerance * scale);
  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y = points[i][1];

    let fi = (x % (2 * _tolerance)) >= (_tolerance)
      ? x % _tolerance
      : (x % (2 * _tolerance)) - _tolerance;

    let fiy = (y % (2 * _tolerance)) >= (_tolerance)
      ? y % _tolerance
      : (y % (2 * _tolerance)) - _tolerance;

    return_array.push([fi, fiy]);
  }
  return return_array;
}

function optimal_discretization(x, y, fi, fiy, scale) {
  const _tolerance = Math.trunc(tolerance * scale);
  let hash = Math.trunc((x - fi) / (2 * _tolerance)).toString();
  hash += Math.trunc((y - fiy) / (2 * _tolerance)).toString();
  return hash;
}

module.exports = { hashcode, getVarphi, tolerance };

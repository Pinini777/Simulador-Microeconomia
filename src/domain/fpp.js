const EPS = Number.EPSILON;

export const calcularFPP = (techX, techY, pointX, pointY) => {
  const maxPossibleYAtX = pointX <= techX
    ? techY * Math.sqrt(1 - Math.pow(pointX / techX, 2))
    : 0;

  const residual = Math.pow(pointX / techX, 2) + Math.pow(pointY / techY, 2) - 1;

  let status = 'eficiente';
  if (pointX > techX || residual > EPS) {
    status = 'inalcanzable';
  } else if (residual < -EPS) {
    status = 'ineficiente';
  }

  const nearFrontier = Math.abs(pointY - maxPossibleYAtX) <= 0.5;

  return { maxPossibleYAtX, status, nearFrontier };
};

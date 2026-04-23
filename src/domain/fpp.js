export const calcularFPP = (techX, techY, pointX, pointY) => {
  const maxPossibleYAtX = pointX <= techX ? techY * Math.sqrt(1 - Math.pow(pointX / techX, 2)) : 0;
  let status = 'eficiente';
  
  if (pointX > techX || pointY > maxPossibleYAtX + 2) {
    status = 'inalcanzable';
  } else if (pointY < maxPossibleYAtX - 2) {
    status = 'ineficiente';
  } else {
    status = 'eficiente';
  }

  return { maxPossibleYAtX, status };
};

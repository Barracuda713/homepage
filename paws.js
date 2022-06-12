function paws(frequency) {
  const pawSize = 60;
  const pawSideStep = 40;

  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;
  let minDistance = 400;
  
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
  const getRandomPointOnScreen = () => {
    return [
      getRandomInt(-minDistance / 2, screenWidth + minDistance / 2),
      getRandomInt(-minDistance / 2, screenHeight + minDistance / 2)
    ];
  };
  const getDistanceBetweenDots = (p1, p2) => {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  };
  const getBezierCurvePointForThree = (t, pointsArray) => {
    return [
      Math.floor(Math.pow(1 - t, 2) * pointsArray[0][0] + 2 * (1 - t) * t * pointsArray[1][0] + Math.pow(t, 2) * pointsArray[2][0]),
      Math.floor(Math.pow(1 - t, 2) * pointsArray[0][1] + 2 * (1 - t) * t * pointsArray[1][1] + Math.pow(t, 2) * pointsArray[2][1])
    ]
  };
  
  const getPosArray = () => {
    const curvePoints = 3;
    let pos = [getRandomPointOnScreen()];
    for (let j = 1; j < curvePoints; j++) {
      let point = getRandomPointOnScreen();
      while (getDistanceBetweenDots(pos[j - 1], point) < minDistance) {
        point = getRandomPointOnScreen();
      }
      pos.push(point);
    }
    return pos;
  };

  const draw = (iD, p, d, del) => {
    const main = document.getElementById('main');
    let paw = document.createElement('div');
    paw.classList.add('paw');
    paw.style.height = `${pawSize}px`;
    paw.style.width = `${pawSize}px`;
    paw.style.left = `${p[0] - Math.floor(pawSize / 2)}px`;
    paw.style.top = `${p[1] - Math.floor(pawSize / 2)}px`;
    paw.style.transform = `rotate(${-d + iD}deg)`;
    paw.style.animationDelay = `${del}s`;
    main.appendChild(paw);
    setTimeout((p) => {
      p.remove();
    }, 2000 + del * 1000, paw);
  };

  const createPaws = () => {
    let pos = getPosArray();
    const tShift = 0.01;
    const initialDeg = 90;
    
    let step = 0;
    let prevPoint = pos[0];

    let point;
    let distance;

    let basicVector = [1, 0];
    let degVectors = 0;

    for (let j = 0; j <= 1; j += tShift) {
      let delay = 0.25 * step;
      
      do {
        point = getBezierCurvePointForThree(j, pos);
        distance = getDistanceBetweenDots(prevPoint, point);
        j += tShift;
      } while (distance < pawSize * 1.5);
      
      let vector = [point[0] - prevPoint[0], -point[1] - -prevPoint[1]];
      degVectors = Math.floor(Math.acos((basicVector[0] * vector[0] + basicVector[1] * vector[1]) / (Math.sqrt(Math.pow(basicVector[0], 2) + Math.pow(basicVector[1], 2)) * Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2)))) * (180 / Math.PI));

      let normalVector = (step % 2) ? [-vector[1], vector[0]] : [vector[1], -vector[0]];
      let pawPoint = [
        Math.floor(point[0] + pawSideStep * normalVector[0] / Math.sqrt(Math.pow(normalVector[0], 2) + Math.pow(normalVector[1], 2))),
        Math.floor(point[1] - pawSideStep * normalVector[1] / Math.sqrt(Math.pow(normalVector[0], 2) + Math.pow(normalVector[1], 2)))
      ];

      if (vector[1] >= 0) {
        draw(initialDeg, pawPoint, degVectors, delay);
      } else {
        draw(initialDeg, pawPoint, -degVectors, delay);
      }

      prevPoint = point;
      step++;
    }
  };

  let timer = setInterval(createPaws, frequency);
}

paws(7000);
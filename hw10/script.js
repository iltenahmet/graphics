let curvePoints = [];

canvas1.animate = function() {
	let w = width();
	let h = height();
	let x = this.mouseX;
	
	let t = x/400;
	color("#dd95b4")
	text("t: " + t, w * 0.4, 10, 0, 0);
	
	var pointA = { x: w * 0.2, y: h * 0.5 };
	var pointB = { x: w * 0.5, y: h * 0.2 };
	var pointC = { x: w * 0.8, y: h * 0.5 };
	
	color("white");
	line(pointA.x, pointA.y, pointB.x, pointB.y);
	line(pointB.x, pointB.y, pointC.x, pointC.y);
	
	color("yellow");
	text("A", pointA.x - w * 0.05, pointA.y - w * 0.05, 0, 0);
	fillOval(pointA.x - w * 0.01, pointA.y - w * 0.01, w * 0.02, w * 0.02);
	text("B", pointB.x - w * 0.05, pointB.y - w * 0.05, 0, 0);
	fillOval(pointB.x - w * 0.01, pointB.y - w * 0.01, w * 0.02, w * 0.02);
	text("C", pointC.x + w * 0.05, pointC.y - w * 0.05, 0, 0);
	fillOval(pointC.x - w * 0.01, pointC.y - w * 0.01, w * 0.02, w * 0.02);
	
	
	// point here -> (1-t) A + t B
	let point1 = {x: (1-t) * pointA.x + t * pointB.x, y: (1-t) * pointA.y + t * pointB.y};
		
	// point here -> (1-t) B + t C
	let point2 = {x: (1-t) * pointB.x + t * pointC.x, y: (1-t) * pointB.y + t * pointC.y};
			
	color("red");
	fillOval(point1.x - w * 0.01, point1.y - w * 0.01, w * 0.02, w * 0.02);
	fillOval(point2.x - w * 0.01, point2.y - w * 0.01, w * 0.02, w * 0.02);
	
	line(point1.x, point1.y, point2.x, point2.y);
	
	//point here -> P = (1-t) ( (1-t) A + t B ) + t ( (1-t) B + t C ) 
	// which is A (1-t)^2 + 2 B (1-t) t + C t^2
	let curvePoint = {
		x: pointA.x * pow((1-t),2) + 2 * pointB.x * (1-t) * t + pointC.x * pow(t,2),
		y: pointA.y * pow((1-t),2) + 2 * pointB.y * (1-t) * t + pointC.y * pow(t,2)
	};
	
	color("#dd95b4")
	curvePoints.push(curvePoint);
	
	// Draw lines connecting consecutive points
	for (let i = 1; i < curvePoints.length; i++) {
		line(curvePoints[i - 1].x, curvePoints[i - 1].y, curvePoints[i].x, curvePoints[i].y);
	}
	// Draw the last point
	fillOval(curvePoint.x - w * 0.01, curvePoint.y - w * 0.01, w * 0.02, w * 0.02);
	
	
	// Remove the points after some time 
	if (curvePoints.length > 0) {
		setTimeout(() => {
			curvePoints.shift();
		}, 1500);
	}
}
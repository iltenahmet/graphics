// global variables
let gl = null;
let uProj = null; 
let uModel = null;
let uView = null;
let uIsSphere = null;
let uIsSkeleton = null;
let uTime = null;

let view = null;
let viewMoveSpeed = 0.5;
let viewRotateSpeed = 0.03;

let initialPos = new vec3(0, 0, -30);
let viewPos = initialPos;
let target = viewPos.subtract(new vec3(0, 0, -1));
let viewDirection = target.subtract(viewPos); 

let startTime = 0;

let vertexSize = 8;
let vertexShader = "";
let fragmentShader = "";

let w, a, s, d, e, q, up, down, left, right, space = false;

let platform = createPlatform(40, 40);

let projectiles = [ ];
let projectilesDir = [ ];
let projectileSpeed = 1;
let lastProjectileTime = Date.now() / 1000;
let projectileWaitDuration = 0.2;

let projectileLastKilled = Date.now() / 1000;
let projectileLifetime = 5;

let skeletons = [ new vec3(5, 0, 5)];
let skeletonSpeed = 0.1;
let skeletonLastSpawned = Date.now() / 1000;
let skeletonSpawnTime = 2;

let killCount = 0;
let maxCount = 0;

main();

async function main() {
    vertexShader =  await fetchShader("./vert.glsl");
    fragmentShader = await fetchShader("./frag.glsl");
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    setTimeout(afterTimeOut, 100);
}

function afterTimeOut() {
    gl = start_gl(canvas1, vertexSize, vertexShader, fragmentShader);

    uModel = gl.getUniformLocation(gl.program, "uModel");
    uProj = gl.getUniformLocation(gl.program, "uProj");
    uView = gl.getUniformLocation(gl.program, "uView");
    uIsSphere = gl.getUniformLocation(gl.program, "uIsSphere");
    uIsSkeleton = gl.getUniformLocation(gl.program, "uIsSkeleton");
    uTime = gl.getUniformLocation(gl.program, "uTime");

    // source: https://opengameart.org
    addTexture(0, 'metal.png');
    addTexture(1, 'skeleton.png');

    let textures = gl.getUniformLocation(gl.program, "textures");
    gl.uniform1iv(textures, [0,1]);

    view = mTranslate(0, 0, -10, mIdentity()); 

    startTime = Date.now() / 1000;
    setInterval(tick, 30);
} 

function tick() {
    let time = Date.now() / 1000 - startTime;
    document.getElementById('killCount').textContent = `Kill Count: ${killCount}`;
    document.getElementById('maxCount').textContent = `Max Count: ${maxCount}`;

    gl.uniform1f(uTime, time);

    let proj = mPerspectiveNO(0.78, canvas1.width / canvas1.height, 0.1, 1000); 
    
    viewDirection = target.subtract(viewPos);
    view = lookAt(viewPos, target, new vec3(0,1,0));
    view = mInverse(view);

    handleInput();	

    // draw platform
    for(let i = 0; i < platform.length; i++)
    {
        let m = mIdentity();
        m = mTranslate(platform[i].x, platform[i].y, platform[i].z, m);
        drawShape(cube, 'TRIANGLES', m, view, proj, false, false); 
    }

    // draw projectiles 
    for (let i = 0; i < projectiles.length; i++) {
        let m = mIdentity();
        m = mTranslate(projectiles[i].x, projectiles[i].y, projectiles[i].z, m);
        let scaleFactor = 0.2;
        m = mScale(scaleFactor, scaleFactor, scaleFactor, m);
        let sphere20 = sphere(20, 10);
        drawShape(sphere20, 'TRIANGLE_STRIP', m, view, proj, true, false); 

        projectiles[i] = projectiles[i].add(projectilesDir[i].multiplyByNum(projectileSpeed));

        if (Date.now() / 1000 - projectileLastKilled > projectileLifetime){ 
            projectiles.shift();
            projectilesDir.shift();
            projectileLastKilled = Date.now() / 1000;
        }
    }

    // draw skeletons
    spawnSkeleton();
    for (let i = 0; i < skeletons.length; i++) {
        m = lookAt(skeletons[i], viewPos, new vec3(0,1,0));
        let dir = skeletons[i].subtract(viewPos);
        dir.normalize();
        skeletons[i] = skeletons[i].subtract(dir.multiplyByNum(skeletonSpeed));
        let plane20 = plane(20, 10); 
        drawShape(plane20, 'TRIANGLE_STRIP', m, view, proj, false, true);
    }

    // check if any projectile collides with the skeleton
    let projectilesToRemove = [];
    let skeletonsToRemove = [];
    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < skeletons.length; j++) {
            let diff = projectiles[i].subtract(skeletons[j]); 
            if (diff.length() < 1) {
                projectilesToRemove.push(i);
                skeletonsToRemove.push(j);
                killCount++;
                if (killCount > maxCount) maxCount++;
            }
        }
    }
    
    // remove projectiles that hit skeletons
    for (let i = 0; i < projectilesToRemove.length; i++) {
        projectiles.splice(projectilesToRemove[i], 1);
        projectilesDir.splice(projectilesToRemove[i], 1);
    }

    // remove skeletons who have been hit
    for (let i = 0; i < skeletonsToRemove.length; i++) {
        skeletons.splice(skeletonsToRemove[i], 1);
    }

    // check if skeletons collide with us
    for (let i = 0; i < skeletons.length; i++) {
        let diff = skeletons[i].subtract(viewPos); 
        if (diff.length() < 1.5) {
                restartGame();
        }
    }
}

function drawShape(vertices, type, model, view, proj, isSphere, isSkeleton) {
    gl.uniformMatrix4fv(uProj, false, proj);
    gl.uniformMatrix4fv(uView, false, view);
    gl.uniformMatrix4fv(uModel , false, model);
    gl.uniform1i(uIsSphere, isSphere);
    gl.uniform1i(uIsSkeleton, isSkeleton);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.drawArrays(type == 'TRIANGLES' ? gl.TRIANGLES : gl.TRIANGLE_STRIP, 0, vertices.length / vertexSize);
}

function drawShapeFromStack(mesh, color) {
    gl.uniform3fv      (uColor    , color);
    gl.uniformMatrix4fv(matrix   , false, mTop());
    gl.uniformMatrix4fv(invMatrix, false, mInverse(mTop()));
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
    gl.drawArrays(mesh.type == 'TRIANGLES' ? gl.TRIANGLES : gl.TRIANGLE_STRIP, 0, mesh.length / vertexSize);
}

let addTexture = (index, file) => {
    let image = new Image();
    image.onload = () => {
        gl.activeTexture (gl.TEXTURE0 + index);
        gl.bindTexture   (gl.TEXTURE_2D, gl.createTexture());
        gl.pixelStorei   (gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D    (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    image.src = file;
}
	
async function fetchShader(path) {
    try {
        const response = await fetch(path);
        const text = await response.text();
        return text;
    } catch (error) {
        console.error(`There was a problem fetching the shader from ${path}:`, error);
    }
}

function handleKeyDown(event) {
    switch (event.key) {
        case 'w':
            w = true;
            break;
        case 'a':
            a = true;
            break;
        case 's':
            s = true;
            break;
        case 'd':
            d = true;
            break;
        case 'e':
            e = true;
            break;
        case 'q':
            q = true;
            break;
        case 'ArrowUp':
            up = true;
            break;
        case 'ArrowDown':
            down = true;
            break;
        case 'ArrowLeft':
            left = true;
            break;
        case 'ArrowRight':
            right = true;
            break;
        case ' ':
            space = true;
    }
}

function handleKeyUp(event) {
    switch (event.key) {
        case 'w':
            w = false;
            break;
        case 'a':
            a = false;
            break;
        case 's':
            s = false;
            break;
        case 'd':
            d = false;
            break;
        case 'e':
            e = false;
            break;
        case 'q':
            q = false;
            break;
        case 'ArrowUp':
            up = false;
            break;
        case 'ArrowDown':
            down = false;
            break;
        case 'ArrowLeft':
            left = false;
            break;
        case 'ArrowRight':
            right = false;
            break;
        case ' ':
            space = false;
            break;
    }
}

function handleInput() {
	if (w || a || d || s) {
            let dir = viewDirection;
            if (a || d) dir = viewDirection.cross(new vec3(0, 1, 0));

            dir.normalize();
            dir.multiplyByNum(viewMoveSpeed);
            
            let bAdd = true;
            if (s || a) bAdd = false;	  

            viewPos = bAdd ? viewPos.add(dir) : viewPos.subtract(dir);	
            target = bAdd ? target.add(dir) : target.subtract(dir);
	} 

	if (left || right) {
            // send target around origin
            target = target.subtract(viewPos);

            // rotate around origin
            let m = mIdentity();
            if (left) m = mRotateY(-viewRotateSpeed, m);
            if (right) m = mRotateY(viewRotateSpeed, m);
            let v4 = mMultVec4(m, [target.x, target.y, target.z, 1]);
            target.x = v4[0];
            target.y = v4[1];
            target.z = v4[2];

            // bring it back the same distance
            target = target.add(viewPos);
	}

	if (space) {
            if ((Date.now() / 1000) - lastProjectileTime < projectileWaitDuration) return;
            lastProjectileTime = Date.now() / 1000;

            projectiles.push(new vec3(viewPos.x, viewPos.y - 0.5, viewPos.z));
            
            // view direction become the projectile movement direction
            viewDirection.normalize();
            projectilesDir.push(new vec3(viewDirection.x, viewDirection.y, viewDirection.z));
	}
}

function createPlatform(n, m){
    let out = [];
    //ground
    for (let i = -n; i < n; i++){
        for (let j = -m; j < m; j++) {
                out.push(new vec3(i, -3, j));
        }
    }

    //walls
    for (let i = -n; i < n; i++) {
        for (let j = -2; j < 4; j++) {
            out.push(new vec3(i, j, -n));
        }
    }

    for (let i = -n; i < n; i++) {
        for (let j = -2; j < 4; j++) {
            out.push(new vec3(i, j, n));
        }
    }

    for (let i = -m; i < m; i++) {
        for (let j = -2; j < 4; j++) {
                out.push(new vec3(m, j, i));
        }
    }

    for (let i = -m; i < m; i++) {
        for (let j = -2; j < 4; j++) {
                out.push(new vec3(-m, j, i));
        }
    }

    return out;
}

function spawnSkeleton() {
    if (Date.now() / 1000 - skeletonLastSpawned < skeletonSpawnTime) return;

    skeletonLastSpawned = Date.now() / 1000;
    skeletonSpawnTime -= 0.05;

    let x = (Math.random() - 0.5) * 20;
    let z = (Math.random() - 0.5) * 20;

    skeletons.push(new vec3(x, 0, z));
}

function restartGame() {
    projectiles = [];
    projectilesDir = [ ];
    skeletons = [ new vec3(5, 0, 5)];
    skeletonSpawnTime = 2;
    killCount = 0;
    viewPos = initialPos;
    target = viewPos.subtract(new vec3(0, 0, -1));
    viewDirection = target.subtract(viewPos); 
}

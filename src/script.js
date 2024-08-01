window.addEventListener("DOMContentLoaded", initiateGame);

var sprite = new Image();
var spriteExplosion = new Image();
sprite.src = 'https://marclopezavila.github.io/planet-defense-game/img/sprite.png';

window.onload = function() {
    spriteExplosion.src = 'https://marclopezavila.github.io/planet-defense-game/img/explosion.png';
};

function initiateGame() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var cH = ctx.canvas.height = window.innerHeight;
    var cW = ctx.canvas.width = window.innerWidth;

    var bullets = [];
    var asteroids = [];
    var explosions = [];
    var destroyed = 0;
    var record = 0;
    var count = 0;
    var playing = false;
    var gameOver = false;
    var _planet = { deg: 0 };

    var player = {
        posX: -35,
        posY: -(100 + 82),
        width: 70,
        height: 79,
        deg: 0
    };

    canvas.addEventListener('click', handleAction);
    canvas.addEventListener('mousemove', handleAction);
    window.addEventListener("resize", resizeCanvas);

    function resizeCanvas() {
        cH = ctx.canvas.height = window.innerHeight;
        cW = ctx.canvas.width = window.innerWidth;
    }

    function movePlayer(e) {
        player.deg = Math.atan2(e.offsetX - (cW / 2), -(e.offsetY - (cH / 2)));
    }

    function handleAction(e) {
        e.preventDefault();
        if (playing) {
            var bullet = {
                x: -8,
                y: -179,
                sizeX: 2,
                sizeY: 10,
                realX: e.offsetX,
                realY: e.offsetY,
                dirX: e.offsetX,
                dirY: e.offsetY,
                deg: Math.atan2(e.offsetX - (cW / 2), -(e.offsetY - (cH / 2))),
                destroyed: false
            };
            bullets.push(bullet);
        } else {
            var dist;
            if (gameOver) {
                dist = Math.sqrt(((e.offsetX - cW / 2) ** 2) + ((e.offsetY - (cH / 2 + 45 + 22)) ** 2));
                if (dist < 27) {
                    if (e.type == 'click') {
                        resetGame();
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            } else {
                dist = Math.sqrt(((e.offsetX - cW / 2) ** 2) + ((e.offsetY - cH / 2) ** 2));
                if (dist < 27) {
                    if (e.type == 'click') {
                        startPlaying();
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            }
        }
    }

    function resetGame() {
        gameOver = false;
        count = 0;
        bullets = [];
        asteroids = [];
        explosions = [];
        destroyed = 0;
        player.deg = 0;
        canvas.removeEventListener('contextmenu', handleAction);
        canvas.removeEventListener('mousemove', movePlayer);
        canvas.style.cursor = "default";
    }

    function startPlaying() {
        playing = true;
        canvas.removeEventListener("mousemove", handleAction);
        canvas.addEventListener('contextmenu', handleAction);
        canvas.addEventListener('mousemove', movePlayer);
        canvas.setAttribute("class", "playing");
        canvas.style.cursor = "default";
    }

    function fireBullets() {
        var distance;

        for (var i = 0; i < bullets.length; i++) {
            if (!bullets[i].destroyed) {
                ctx.save();
                ctx.translate(cW / 2, cH / 2);
                ctx.rotate(bullets[i].deg);
                ctx.drawImage(sprite, 211, 100, 50, 75, bullets[i].x, bullets[i].y -= 20, 19, 30);
                ctx.restore();

                bullets[i].realX = -(bullets[i].y + 10) * Math.sin(bullets[i].deg) + cW / 2;
                bullets[i].realY = (bullets[i].y + 10) * Math.cos(bullets[i].deg) + cH / 2;

                for (var j = 0; j < asteroids.length; j++) {
                    if (!asteroids[j].destroyed) {
                        distance = Math.sqrt((asteroids[j].realX - bullets[i].realX) ** 2 + (asteroids[j].realY - bullets[i].realY) ** 2);
                        if (distance < (((asteroids[j].width / asteroids[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                            destroyed += 1;
                            asteroids[j].destroyed = true;
                            bullets[i].destroyed = true;
                            explosions.push(asteroids[j]);
                        }
                    }
                }
            }
        }
    }

    function renderPlanet() {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.shadowBlur = 100;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "#999";
        ctx.arc(cW / 2, cH / 2, 100, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(cW / 2, cH / 2);
        ctx.rotate((_planet.deg += 0.1) * (Math.PI / 180));
        ctx.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200, 200);
        ctx.restore();
    }

    function renderPlayer() {
        ctx.save();
        ctx.translate(cW / 2, cH / 2);
        ctx.rotate(player.deg);
        ctx.drawImage(sprite, 200, 0, player.width, player.height, player.posX, player.posY, player.width, player.height);
        ctx.restore();

        if (bullets.length - destroyed && playing) {
            fireBullets();
        }
    }

    function createAsteroid() {
        var type = getRandomInt(1, 4);
        var coordsX, coordsY;

        switch (type) {
            case 1:
                coordsX = getRandomInt(0, cW);
                coordsY = -150;
                break;
            case 2:
                coordsX = cW + 150;
                coordsY = getRandomInt(0, cH);
                break;
            case 3:
                coordsX = getRandomInt(0, cW);
                coordsY = cH + 150;
                break;
            case 4:
                coordsX = -150;
                coordsY = getRandomInt(0, cH);
                break;
        }

        var asteroid = {
            x: 278,
            y: 0,
            state: 0,
            stateX: 0,
            width: 134,
            height: 123,
            realX: coordsX,
            realY: coordsY,
            moveY: 0,
            coordsX: coordsX,
            coordsY: coordsY,
            size: getRandomInt(1, 3),
            deg: Math.atan2(coordsX - (cW / 2), -(coordsY - (cH / 2))),
            destroyed: false
        };
        asteroids.push(asteroid);
    }

    function renderAsteroids() {
        var distance;

        for (var i = 0; i < asteroids.length; i++) {
            if (!asteroids[i].destroyed) {
                ctx.save();
                ctx.translate(asteroids[i].coordsX, asteroids[i].coordsY);
                ctx.rotate(asteroids[i].deg);
                ctx.drawImage(sprite, asteroids[i].x, asteroids[i].y, asteroids[i].width, asteroids[i].height,
                    -(asteroids[i].width / asteroids[i].size) / 2, asteroids[i].moveY += 1 / (asteroids[i].size),
                    asteroids[i].width / asteroids[i].size, asteroids[i].height / asteroids[i].size);
                ctx.restore();

                asteroids[i].realX = -(asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size) / 2)) * Math.sin(asteroids[i].deg) + asteroids[i].coordsX;
                asteroids[i].realY = (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size) / 2)) * Math.cos(asteroids[i].deg) + asteroids[i].coordsY;

                distance = Math.sqrt((asteroids[i].realX - cW / 2) ** 2 + (asteroids[i].realY - cH / 2) ** 2);
                if (distance < (((asteroids[i].width / asteroids[i].size) / 2) - 4) + 100) {
                    gameOver = true;
                    playing = false;
                    canvas.addEventListener('mousemove', handleAction);
                }
            } else if (!asteroids[i].extinct) {
                createExplosion(asteroids[i]);
            }
        }

        if (asteroids.length - destroyed < 10 + (Math.floor(destroyed / 6))) {
            createAsteroid();
        }
    }

    function createExplosion(asteroid) {
        ctx.save();
        ctx.translate(asteroid.realX, asteroid.realY);
        ctx.rotate(asteroid.deg);

        var spriteY;
        var spriteX = 256;
        if (asteroid.state == 0) {
            spriteY = 0;
            spriteX = 0;
        } else if (asteroid.state < 8) {
            spriteY = 0;
        } else if (asteroid.state < 16) {
            spriteY = 256;
        } else if (asteroid.state < 24) {
            spriteY = 512;
        } else {
            spriteY = 768;
        }

        if (asteroid.state == 8 || asteroid.state == 16 || asteroid.state == 24) {
            asteroid.stateX = 0;
        }

        ctx.drawImage(spriteExplosion, asteroid.stateX += spriteX, spriteY, 256, 256, -(asteroid.width / asteroid.size) / 2,
            -(asteroid.height / asteroid.size) / 2, asteroid.width / asteroid.size, asteroid.height / asteroid.size);
        asteroid.state += 1;

        if (asteroid.state == 31) {
            asteroid.extinct = true;
        }

        ctx.restore();
    }

    function startGame() {
        if (!gameOver) {
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();

            renderPlanet();
            renderPlayer();

            if (playing) {
                renderAsteroids();

                ctx.font = "20px Verdana";
                ctx.fillStyle = "white";
                ctx.textBaseline = 'middle';
                ctx.textAlign = "left";
                ctx.fillText('Record: ' + record, 20, 30);

                ctx.font = "40px Verdana";
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx.strokeText('' + destroyed, cW / 2, cH / 2);
                ctx.fillText('' + destroyed, cW / 2, cH / 2);

            } else {
                ctx.drawImage(sprite, 428, 12, 70, 70, cW / 2 - 35, cH / 2 - 35, 70, 70);
            }
        } else if (count < 1) {
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.rect(0, 0, cW, cH);
            ctx.fill();

            ctx.font = "60px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", cW / 2, cH / 2 - 150);

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Total destroyed: " + destroyed, cW / 2, cH / 2 + 140);

            record = destroyed > record ? destroyed : record;

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("RECORD: " + record, cW / 2, cH / 2 + 185);

            ctx.drawImage(sprite, 500, 18, 70, 70, cW / 2 - 35, cH / 2 + 40, 70, 70);

            canvas.removeAttribute('class');
        }
    }

    function gameLoop() {
        window.requestAnimationFrame(gameLoop);
        startGame();
    }

    gameLoop();

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (~window.location.href.indexOf('full')) {
        var full = document.getElementsByTagName('a');
        full[0].setAttribute('style', 'display: none');
    }
}

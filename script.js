window.addEventListener("DOMContentLoaded", initGame);

var sprite = new Image();
var spriteExplosion = new Image();
sprite.src = 'https://marclopezavila.github.io/planet-defense-game/img/sprite.png';

window.onload = function() {
    spriteExplosion.src = 'https://marclopezavila.github.io/planet-defense-game/img/explosion.png';
};

function initGame() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        cH = ctx.canvas.height = window.innerHeight,
        cW = ctx.canvas.width = window.innerWidth;

    var bullets = [],
        asteroids = [],
        explosions = [],
        destroyed = 0,
        record = 0,
        count = 0,
        playing = false,
        gameOver = false,
        planet = { deg: 0 };

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

    function rotatePlayer(e) {
        player.deg = Math.atan2(e.offsetX - (cW / 2), -(e.offsetY - (cH / 2)));
    }

    function handleAction(e) {
        e.preventDefault();
        if (playing) {
            bullets.push({
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
            });
        } else {
            var dist;
            if (gameOver) {
                dist = Math.sqrt(((e.offsetX - cW / 2) * (e.offsetX - cW / 2)) + ((e.offsetY - (cH / 2 + 45 + 22)) * (e.offsetY - (cH / 2 + 45 + 22))));
                if (dist < 27) {
                    if (e.type == 'click') {
                        gameOver = false;
                        count = 0;
                        bullets = [];
                        asteroids = [];
                        explosions = [];
                        destroyed = 0;
                        player.deg = 0;
                        canvas.removeEventListener('contextmenu', handleAction);
                        canvas.removeEventListener('mousemove', rotatePlayer);
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            } else {
                dist = Math.sqrt(((e.offsetX - cW / 2) * (e.offsetX - cW / 2)) + ((e.offsetY - cH / 2) * (e.offsetY - cH / 2)));
                if (dist < 27) {
                    if (e.type == 'click') {
                        playing = true;
                        canvas.removeEventListener("mousemove", handleAction);
                        canvas.addEventListener('contextmenu', handleAction);
                        canvas.addEventListener('mousemove', rotatePlayer);
                        canvas.setAttribute("class", "playing");
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            }
        }
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

                bullets[i].realX = (0) - (bullets[i].y + 10) * Math.sin(bullets[i].deg);
                bullets[i].realY = (0) + (bullets[i].y + 10) * Math.cos(bullets[i].deg);
                bullets[i].realX += cW / 2;
                bullets[i].realY += cH / 2;

                for (var j = 0; j < asteroids.length; j++) {
                    if (!asteroids[j].destroyed) {
                        distance = Math.sqrt(Math.pow(asteroids[j].realX - bullets[i].realX, 2) + Math.pow(asteroids[j].realY - bullets[i].realY, 2));
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

    function drawPlanet() {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.shadowBlur = 100;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "#999";
        ctx.arc(cW / 2, cH / 2, 100, 0, Math.PI * 2);
        ctx.fill();
        ctx.translate(cW / 2, cH / 2);
        ctx.rotate((planet.deg += 0.1) * (Math.PI / 180));
        ctx.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200, 200);
        ctx.restore();
    }

    function drawPlayer() {
        ctx.save();
        ctx.translate(cW / 2, cH / 2);
        ctx.rotate(player.deg);
        ctx.drawImage(sprite, 200, 0, player.width, player.height, player.posX, player.posY, player.width, player.height);
        ctx.restore();

        if (bullets.length - destroyed && playing) {
            fireBullets();
        }
    }

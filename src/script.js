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


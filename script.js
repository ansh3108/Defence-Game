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


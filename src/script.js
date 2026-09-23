/*
RollUp
COPYRIGHT 2026 ☁️ KILLED BY A PIXEL
Made by Frank Force for JS1024 2026
https://js1024.fun/demos/2026/25/readme

An endless race in the sky inspired by 90's 3D games like sky roads, marble madness, and Sonic 3d. My goal was to create a dreamlike experience with full resolution full speed graphics that would be easy to pick up and play.

Features
- 3D rendering system
- procedurally generated levels
- level increases in difficulty over time
- 3D player sphere with shadow
- mouse controls
- colorful sky with stars
*/
'use strict';

// RollUp canvas setup
const a = document.createElement('canvas');
const c = a.getContext("2d");
a.style.position = 'relative';
a.style.zIndex = '1';
a.style.background = 'transparent';
document.body.appendChild(a);
document.body.style='margin:0;overflow:hidden;background:linear-gradient(180deg, #020712 0%, #0a2140 26%, #2e6ea5 65%, #dfefff 100%)';
a.width = innerWidth;
a.height = innerHeight;

const ui = document.createElement('div');
ui.id = 'game-ui';
ui.innerHTML = `
    <div id="start-screen">
        <div class="start-box">
            <span class="start-kicker">ROLLUP</span>
            <h1>RollUp</h1>
            <p>Roll through the sky and stay on the path.</p>
            <button id="start-button" type="button">START GAME</button>
        </div>
    </div>
  <div id="status-bar">READY</div>
    <div id="distance-meter">
        <strong id="distance-value">0 m</strong>
        <span id="shape-value">FORM: BALL</span>
    </div>
  <div id="ball-colors">
    <button class="ball-swatch active" data-color="#ff7a59" style="background:#ff7a59" aria-label="Coral ball"></button>
    <button class="ball-swatch" data-color="#8b5cf6" style="background:#8b5cf6" aria-label="Purple ball"></button>
    <button class="ball-swatch" data-color="#3b82f6" style="background:#3b82f6" aria-label="Blue ball"></button>
  </div>
    <div id="developer-credit">
        <button id="developer-button" type="button" aria-label="Open developer details" aria-expanded="false" aria-controls="developer-card">i</button>
        <div id="developer-card" role="dialog" aria-label="Developer details" hidden>
            <div class="developer-card-header"><strong>Developer details</strong><button id="developer-close" type="button" aria-label="Close developer details">×</button></div>
            <strong>Abhijith Kumar</strong>
            <a href="mailto:abhijithkumar023@gmail.com">abhijithkumar023@gmail.com</a>
            <a href="https://www.linkedin.com/in/abhijithkumar3/" target="_blank" rel="noreferrer">linkedin.com/in/abhijithkumar3</a>
        </div>
    </div>
  <div id="controls-bar">
        <span>Move <kbd>A</kbd><kbd>D</kbd><kbd>←</kbd><kbd>→</kbd></span>
        <span>Jump <kbd>↑</kbd> / click</span>
        <span>Pause <kbd>SPACE</kbd></span>
        <span>Reset <kbd>R</kbd></span>
  </div>
    <div id="touch-controls" aria-label="Mobile movement controls">
        <button id="touch-left" type="button" aria-label="Move left">←</button>
        <button id="touch-right" type="button" aria-label="Move right">→</button>
    </div>
`;
document.body.appendChild(ui);

const style = document.createElement('style');
style.textContent = `
  #game-ui {
    position: fixed;
    inset: 0;
    pointer-events: none;
    font-family: Arial, sans-serif;
    z-index: 20;
  }
  #status-bar {
    position: absolute;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 18px;
    border-radius: 999px;
    background: rgba(12, 16, 24, 0.7);
    color: #fff;
    font-size: 13px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 700;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.28);
    opacity: 0;
    transition: opacity .2s ease;
  }
    #start-screen {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        background: rgba(8, 7, 22, 0.38);
        pointer-events: auto;
    }
    #start-screen[hidden] { display: none !important; }
    .start-box {
        width: min(430px, calc(100vw - 40px));
        box-sizing: border-box;
        padding: 32px 28px 30px;
        border: 6px solid #fff4bf;
        border-radius: 8px;
        background: #663399;
        color: #fff4bf;
        text-align: center;
        box-shadow: 0 0 0 5px #32154f, 0 16px 0 #211034, 0 24px 36px rgba(0, 0, 0, 0.4);
    }
    .start-kicker { font-size: 11px; letter-spacing: 0.24em; }
    .start-box h1 { margin: 8px 0 6px; font-size: clamp(42px, 10vw, 72px); letter-spacing: 0.08em; text-shadow: 4px 4px 0 #32154f; }
    .start-box p { margin: 0 0 24px; color: #eadcf6; font-size: 12px; letter-spacing: 0.05em; }
    #start-button {
        padding: 13px 24px;
        border: 3px solid #fff4bf;
        border-radius: 4px;
        background: #d52f35;
        color: #fff4bf;
        font: 700 13px Arial, sans-serif;
        letter-spacing: 0.14em;
        cursor: pointer;
        box-shadow: 0 5px 0 #651827;
    }
    #start-button:hover { background: #ef4650; }
    #status-bar.paused {
        top: 50%;
        transform: translate(-50%, -50%);
        min-width: min(520px, calc(100vw - 48px));
        box-sizing: border-box;
        padding: 28px 34px;
        border: 6px solid #fff4bf;
        border-radius: 6px;
        background: #d52f35;
        color: #fff4bf;
        font-size: clamp(24px, 5vw, 56px);
        letter-spacing: 0.08em;
        text-align: center;
        text-shadow: 4px 4px 0 #8e1e2b;
        box-shadow: 0 0 0 5px #8e1e2b, 0 16px 0 #651827, 0 22px 34px rgba(0, 0, 0, 0.4);
    }
  #status-bar.show { opacity: 1; }
  #status-bar.out {
        top: 50%;
        transform: translate(-50%, -50%);
        min-width: min(520px, calc(100vw - 48px));
        box-sizing: border-box;
        padding: 28px 34px;
        border: 6px solid #ffd6d6;
        border-radius: 6px;
    background: rgba(198, 32, 40, 0.82);
        color: #fff4bf;
        font-size: clamp(20px, 4vw, 44px);
        letter-spacing: 0.06em;
        text-align: center;
        text-shadow: 4px 4px 0 #721b28;
        box-shadow: 0 0 0 5px #721b28, 0 16px 0 #4a1420, 0 22px 34px rgba(0, 0, 0, 0.4);
  }
    #distance-meter {
        position: absolute;
        top: 18px;
        right: 18px;
        display: grid;
        gap: 3px;
        min-width: 112px;
        padding: 8px 12px;
        border: 1px solid rgba(255, 244, 191, 0.36);
        border-radius: 6px;
        background: rgba(18, 12, 32, 0.72);
        color: #fff4bf;
        text-align: right;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 11px;
    }
    #distance-meter span { color: #d8c7e8; font-size: 9px; }
  #ball-colors {
    position: absolute;
    top: 18px;
    left: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 14px;
    background: rgba(12, 16, 24, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.18);
    pointer-events: auto;
  }
  .ball-swatch {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255,255,255,0.4);
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .ball-swatch.active {
    transform: scale(1.18);
    box-shadow: 0 0 0 2px rgba(255,255,255,0.7);
  }
  #controls-bar {
    position: absolute;
    left: 18px;
    bottom: 18px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-width: min(460px, calc(100vw - 36px));
  }
    #developer-credit {
        position: absolute;
        right: 18px;
        bottom: 18px;
        pointer-events: auto;
    }
    #developer-button {
        width: 42px;
        height: 42px;
        border: 2px solid #fff4bf;
        border-radius: 50%;
        background: #8b5cf6;
        color: #fff4bf;
        font: italic 700 21px Georgia, serif;
        cursor: pointer;
        box-shadow: 0 4px 0 #32154f, 0 8px 16px rgba(0, 0, 0, 0.28);
    }
    #developer-button:hover { background: #3b82f6; }
    #developer-card {
        position: absolute;
        right: 0;
        bottom: 54px;
        display: grid;
        gap: 7px;
        width: min(270px, calc(100vw - 36px));
        padding: 14px;
        border: 2px solid #fff4bf;
        border-radius: 6px;
        background: rgba(23, 16, 45, 0.96);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.38);
        color: #fff4bf;
        font-size: 11px;
    }
    #developer-card[hidden] { display: none !important; }
    .developer-card-header { display: flex; align-items: center; justify-content: space-between; font-size: 12px; }
    #developer-close { border: 0; background: transparent; color: #fff4bf; font-size: 20px; line-height: 1; cursor: pointer; }
    #developer-card a { color: #d8c7e8; text-decoration: none; overflow-wrap: anywhere; }
    #developer-card a:hover { color: #fff; text-decoration: underline; }
  #controls-bar span {
    background: rgba(12, 16, 24, 0.58);
    color: #edf7ff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }
    #controls-bar kbd {
        display: inline-grid;
        place-items: center;
        min-width: 20px;
        height: 20px;
        margin-left: 4px;
        padding: 0 5px;
        border: 1px solid rgba(255, 244, 191, 0.7);
        border-bottom-width: 3px;
        border-radius: 4px;
        background: rgba(255, 244, 191, 0.14);
        color: #fff4bf;
        font: 700 10px Arial, sans-serif;
        letter-spacing: 0.04em;
    }
    #touch-controls { display: none; }
    #touch-controls button {
        width: 58px;
        height: 52px;
        border: 2px solid #fff4bf;
        border-bottom-width: 5px;
        border-radius: 8px;
        background: rgba(139, 92, 246, 0.82);
        color: #fff4bf;
        font-size: 30px;
        line-height: 1;
        cursor: pointer;
        touch-action: none;
        user-select: none;
    }
    #touch-controls button:active { transform: translateY(3px); border-bottom-width: 2px; background: #3b82f6; }
  @keyframes bgDrift {
    0% { transform: scale(1) translate3d(-3%, 0, 0); }
    100% { transform: scale(1.15) translate3d(3%, 2%, 0); }
  }
  @keyframes bgPulse {
    0% { transform: scale(0.96); opacity: 0.45; }
    100% { transform: scale(1.08); opacity: 0.9; }
  }
  @media (max-width: 640px) {
    #status-bar {
      font-size: 11px;
      letter-spacing: 0.1em;
      padding: 8px 12px;
    }
        #status-bar.paused {
            min-width: calc(100vw - 40px);
            padding: 22px 18px;
            border-width: 4px;
            font-size: 25px;
            box-shadow: 0 0 0 3px #8e1e2b, 0 10px 0 #651827, 0 16px 24px rgba(0, 0, 0, 0.4);
        }
        #status-bar.out {
            min-width: calc(100vw - 40px);
            padding: 22px 18px;
            border-width: 4px;
            font-size: 23px;
            box-shadow: 0 0 0 3px #721b28, 0 10px 0 #4a1420, 0 16px 24px rgba(0, 0, 0, 0.4);
        }
        #distance-meter { top: 12px; right: 12px; min-width: 92px; padding: 7px 9px; font-size: 10px; }
        #distance-meter span { font-size: 8px; }
    #color-panel {
      left: 12px;
      top: 12px;
      gap: 8px;
      font-size: 10px;
      padding: 7px 10px;
    }
    #controls-bar {
      left: 12px;
      right: 12px;
      bottom: 12px;
      max-width: none;
    }
    #controls-bar span {
      font-size: 10px;
      padding: 7px 10px;
    }
        #controls-bar kbd { min-width: 18px; height: 18px; padding: 0 4px; font-size: 9px; }
        #touch-controls {
            position: absolute;
            left: 12px;
            right: 12px;
            bottom: 62px;
            display: flex;
            justify-content: space-between;
            pointer-events: auto;
        }
        #developer-credit { right: 12px; bottom: 12px; }
  }
`;
document.head.appendChild(style);

const statusBar = document.getElementById('status-bar');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const developerButton = document.getElementById('developer-button');
const developerCard = document.getElementById('developer-card');
const developerClose = document.getElementById('developer-close');
const distanceValue = document.getElementById('distance-value');
const shapeValue = document.getElementById('shape-value');
const touchLeft = document.getElementById('touch-left');
const touchRight = document.getElementById('touch-right');
const ballSwatches = [...document.querySelectorAll('.ball-swatch')];
let playerColor = '#ff7a59';
const SHAPES = ['ball', 'diamond', 'star', 'hexagon'];
let shapeIndex = 0;
let previousShape = SHAPES[0];
let shapeMix = 1;
let shapeStage = 0;
let gameStarted = false;
let mobileDirection = 0;
let mobileTouchStartedAt = 0;
let mobileTouchMoved = false;

const setTouchDirection = key => {
    if (!gameStarted) return;
    mouseMode = 0;
    mobileDirection = key === 'ArrowLeft' ? -1 : 1;
    keyInput[key] = 1;
};
const clearTouchDirection = key => {
    keyInput[key] = 0;
    mobileDirection = 0;
};
for (const [button, key] of [[touchLeft, 'ArrowLeft'], [touchRight, 'ArrowRight']])
{
    button.addEventListener('pointerdown', event => { event.preventDefault(); setTouchDirection(key); });
    button.addEventListener('pointerup', event => { event.preventDefault(); clearTouchDirection(key); });
    button.addEventListener('pointercancel', () => clearTouchDirection(key));
    button.addEventListener('pointerleave', () => clearTouchDirection(key));
    button.addEventListener('touchstart', event => { event.preventDefault(); setTouchDirection(key); }, { passive: false });
    button.addEventListener('touchend', event => { event.preventDefault(); clearTouchDirection(key); }, { passive: false });
}

const startGame = () => {
    if (gameStarted) return;
    gameStarted = true;
    startScreen.hidden = true;
    startScreen.remove();
};
startButton.addEventListener('click', startGame);
startButton.addEventListener('touchend', event => { event.preventDefault(); startGame(); }, { passive: false });

developerButton.addEventListener('click', () => {
    const isOpen = !developerCard.hidden;
    developerCard.hidden = isOpen;
    developerButton.setAttribute('aria-expanded', String(!isOpen));
});
developerClose.addEventListener('click', () => {
    developerCard.hidden = true;
    developerButton.setAttribute('aria-expanded', 'false');
});

ballSwatches.forEach(sw => {
    sw.addEventListener('click', () => {
        playerColor = sw.dataset.color;
        ballSwatches.forEach(btn => btn.classList.toggle('active', btn === sw));
    });
});

////////////////////////////////////////////////

const ENHANCED = 1;      // keyboard and touch input
const test = 0;          // test stuff
const cameraInFront = 3; // camera distance
const F = .7;            // focal length

// locals (remove from minified)
let i, j, r, p, s, px, py;
let ax, ay, bx, by, ex, ey, fx, fy;
let mouseJustPressed, mouseMode, keyInput;

// game variables
let x=0, y=0, z=0, vy=0; // ship
let trackGap = 0;        // track gap
let mouseDown = 0;       // mouse jump
let trackSx = 3;         // track side
let trackSw = 3;         // track width
let mouseX = a.width/2;  // mouse
let trackRows = [];      // track
let isOut = false;
let isPaused = false;

const setStatus = (text, out = false) => {
    statusBar.textContent = text;
    statusBar.classList.toggle('out', out);
    statusBar.classList.toggle('paused', text === 'RollUp PAUSED');
    statusBar.classList.toggle('show', !!text);
};

const togglePause = () => {
    if (isOut) return;
    isPaused = !isPaused;
    setStatus(isPaused ? 'RollUp PAUSED' : '', false);
};

const resetGame = () => {
    x = y = z = vy = trackGap = 0;
    trackSx = trackSw = 3;
    trackRows = [];
    isOut = false;
    isPaused = false;
    mobileDirection = 0;
    shapeIndex = 0;
    previousShape = SHAPES[0];
    shapeMix = 1;
    shapeStage = 0;
    distanceValue.textContent = '0 m';
    shapeValue.textContent = 'FORM: BALL';
    setStatus('', false);
    mouseDown = 0;
    mouseJustPressed = 0;
};

// set draw color
let hsl = (h, s, l, a=1)=> 
    c.fillStyle = `hsl(${h},${s}%,${l}%,${a})`;

// project point to screen
let P = (px, py, dz) =>
    [a.width/2 + 
    (px-x+(dz-cameraInFront)**2/50*Math.cos((z+dz)/49))*a.height*F/dz,
    a.height/2 - (py-2+dz*dz/50)*a.height*F/dz, a.height*F/dz];

const drawPlayerShape = (shape, cx, cy, radius, opacity) => {
    c.save();
    c.globalAlpha = opacity;
    c.translate(cx, cy);
    c.rotate(shape === 'ball' ? 0 : (1 - shapeMix) * Math.PI * .5);
    c.fillStyle = playerColor;
    c.strokeStyle = playerColor;
    c.lineWidth = Math.max(2, radius * .12);
    c.beginPath();
    if (shape === 'ball')
        c.ellipse(0, 0, radius, radius, 0, 0, 9);
    else if (shape === 'diamond')
    {
        c.moveTo(0, -radius * 1.15); c.lineTo(radius, 0);
        c.lineTo(0, radius * 1.15); c.lineTo(-radius, 0); c.closePath();
    }
    else if (shape === 'star')
    {
        for (let point = 0; point < 10; point++)
        {
            const angle = -Math.PI / 2 + point * Math.PI / 5;
            const pointRadius = point % 2 ? radius * .48 : radius * 1.12;
            const pointX = Math.cos(angle) * pointRadius;
            const pointY = Math.sin(angle) * pointRadius;
            if (!point) c.moveTo(pointX, pointY); else c.lineTo(pointX, pointY);
        }
        c.closePath();
    }
    else
    {
        for (let point = 0; point < 6; point++)
        {
            const angle = point * Math.PI / 3;
            const pointX = Math.cos(angle) * radius;
            const pointY = Math.sin(angle) * radius;
            if (!point) c.moveTo(pointX, pointY); else c.lineTo(pointX, pointY);
        }
        c.closePath();
    }
    c.fill();
    if (shape === 'hexagon') c.stroke();
    c.restore();
};

// main loop
let update = () =>
{
    if (!gameStarted || isPaused)
        return;

    const distanceMeters = Math.floor(Math.max(0, z));
    distanceValue.textContent = `${distanceMeters.toLocaleString()} m`;
    shapeValue.textContent = `FORM: ${SHAPES[shapeIndex].toUpperCase()}`;
    shapeMix = Math.min(1, shapeMix + .035);

    const sky = c.createLinearGradient(0, 0, 0, a.height);
    sky.addColorStop(0, '#020712');
    sky.addColorStop(.18, '#071a2d');
    sky.addColorStop(.46, '#123454');
    sky.addColorStop(.72, '#2a6c88');
    sky.addColorStop(.88, '#89d0d8');
    sky.addColorStop(1, '#dff7ff');
    c.fillStyle = sky;
    c.fillRect(0, 0, a.width, a.height);

    // distant tunnel + atmospheric rings
    for (i = 0; i < 78; i++)
    {
        let t = i / 78;
        let ringY = a.height * (0.58 + t * 0.28) - (z * 1.5 % 24);
        let ringW = a.width * (0.22 + t * 1.7);
        let ringH = a.height * (0.12 + t * 1.1);
        c.beginPath();
        c.ellipse(a.width / 2, ringY, ringW, ringH, 0, 0, 7);
        c.strokeStyle = `hsla(${185 + t * 24}, 80%, ${50 + t * 26}%, ${0.08 + t * 0.26})`;
        c.lineWidth = 1.5 + t * 4;
        c.stroke();
    }

    // fog / water glow near the horizon
    let horizon = a.height * 0.72;
    let haze = c.createLinearGradient(0, horizon - 60, 0, a.height);
    haze.addColorStop(0, 'rgba(126,208,255,0)');
    haze.addColorStop(.35, 'rgba(126,208,255,0.14)');
    haze.addColorStop(1, 'rgba(11, 46, 74, 0.72)');
    c.fillStyle = haze;
    c.fillRect(0, horizon - 60, a.width, a.height - horizon + 60);

    // stars and distant glitter
    for(i=500; i--;)
    {
        hsl(0, 0, 99);
        c.fillRect((i*i + z*i/99)%a.width, i**3.3%a.height, i%4*a.height/500, i%4*a.height/500);
    }

    // track, far to near
    for (r = z+40|0; r > z; r--)
    {
        // create new track rows if needed
        for (i = trackRows.length; i <= r; )
        {
            // randomize new segment
            if (trackGap < -8 & Math.random() < Math.min(.2,i/1e4))
            {
                // sometimes a gap
                trackGap = 2 + Math.min(4, i/400);
            }
            if (Math.random() < .1)
            {
                // new span width 2-4
                trackSw = 2 + Math.random()*3|0;
                //trackSx = Math.random()*(8-trackSw)|0;
                trackSx = Math.max(0, Math.min(7-trackSw, trackSx - 2 + Math.random()*5|0));
            }
            trackGap--;

            // create the row
            trackRows[i++] = p = [];
            for (j = 7; j--;)
            {
                p[j] = i < 35 // start area
                    | Math.random() > .9 // pillar
                    | trackGap < 0 // gap
                    & trackSx <= j & j < trackSx + trackSw // track
                    & Math.random() > Math.min(.2,z/1e4); // holes
            }
        }
        // draw the track row
        for (j = 2; j--;)
        for (i = 7; i--;)
        {
            if (trackRows[r][i])
            {
                // calculate grid points
                [ax, ay] = P(i-3.5, 0, r-z);
                [bx, by] = P(i-2.5, 0, r-z);
                [ex, ey] = P(i-3.5, 0, r-z+1);
                [fx, fy] = P(i-2.5, 0, r-z+1);

                // draw the track tile
                if (j)
                {
                    // back and sides
                    c.fillStyle = `rgba(120, 72, 26, ${0.62 + ((r + i) & 1) * 0.12})`;
                    c.fillRect(ex,ey,fx-ex,(40-r+z)/30*a.height);
                }
                else
                {
                    // front
                    c.fillStyle = `rgba(184, 113, 39, ${0.78 + ((r + i) & 1) * 0.1})`;
                    c.fillRect(ax,ay,bx-ax,(40-r+z)/30*a.height);

                    // top
                    c.fillStyle = `rgba(255, 210, 110, ${0.96 + ((r + i) & 1) * 0.04})`;
                    //if (test && ((r|0)==(z+cameraInFront|0)) && i==(Math.round(x)+3|0)) hsl(0,99,50)
                    c.lineTo(ax, ay); c.lineTo(bx, by);
                    c.lineTo(fx, fy); c.lineTo(ex, ey); 
                    c.beginPath(c.fill());
                }
            }
        }
    }

    // draw player
    if (y >= 0 & trackRows[z+cameraInFront|0][Math.round(x+3)])
    {
        // draw player shadow
        c.fillStyle = 'rgba(0,0,0,0.38)';
        [px, py, s] = P(x, 0, cameraInFront);
        c.ellipse(px, py, s/3.5, s/8, 0, 0, 9);
        c.beginPath(c.fill());
    }

    [px, py, s] = P(x, y, cameraInFront);
    const shapeScale = 1 + Math.sin(shapeMix * Math.PI) * .12;
    drawPlayerShape(previousShape, px, py, s * .24 * shapeScale, 1 - shapeMix);
    drawPlayerShape(SHAPES[shapeIndex], px, py, s * .24 * shapeScale, shapeMix);

    // update player
    if (y > -4)
    {
        // update physics
        if (ENHANCED)
        {
            if (mobileDirection)
                x += mobileDirection * .12;
            else if (mouseMode)
                x += mouseX/a.width/2 - .25;
            else
            {
                // keyboard controls
                if (keyInput['d'] || keyInput['ArrowRight'])
                    x += .1;
                if (keyInput['a'] || keyInput['ArrowLeft'])
                    x -= .1;
            }
        }
        else
            x += mouseX/a.width/2 - .25;
        y += vy -= .006;

        // ramp up speed
        z += Math.min(.5, .2 + z/5e3);
        if (test) z += .5

        const newShapeStage = Math.floor(z / 200);
        if (newShapeStage > shapeStage)
        {
            shapeStage = newShapeStage;
            previousShape = SHAPES[shapeIndex];
            shapeIndex = shapeStage % SHAPES.length;
            shapeMix = 0;
        }

        // check if close enough to land
        if (y < 0 & y > -.3 & 
            trackRows[z+cameraInFront|0][Math.round(x+3)])
        {
            // land and jump
            y = vy = mouseDown;
            if (ENHANCED && window.ontouchstart !== undefined)
                mouseDown = 0; // touch jump
        }
        if (test && y < 0 & vy < 0)
            y = vy = 0;
    }
    else if (ENHANCED)
    {
        if (!isOut)
        {
            isOut = true;
            setStatus(`OUT AT ${Math.floor(Math.max(0, z)).toLocaleString()} M · Press R or click to restart`, true);
        }
        if (mouseJustPressed)
            resetGame();
    }
    else if (y <= -4 && !isOut)
    {
        isOut = true;
        setStatus(`OUT AT ${Math.floor(Math.max(0, z)).toLocaleString()} M · Press R or click to restart`, true);
    }

    if (ENHANCED)
        mouseJustPressed = 0;

    // hud
    if (test)
    {
        c.font = 'bold 56px impact';
        for(i=9;i--;)
        {
            hsl(0, 99, i?50:100);
            c.fillText((z|0), 9+ i, 62+i);
        }
    }
}

// mouse controls
onmousemove = e => mouseX = e.x;
onmousedown = e => {
    if (isOut) { resetGame(); return; }
    mouseDown = .1;
};
onmouseup   = e => mouseDown = 0;

if (!ENHANCED)
    setInterval(update, 16); // 60 fps update
else
{
    // enhanced rendering system for smoother frame rate
    let frameTimeLastMS = 0, frameTimeBufferMS=0;
    const updateAnimation = (frameTimeMS=0)=>
    {
        requestAnimationFrame(updateAnimation);
        
        // update time keeping
        let frameTimeDeltaMS = frameTimeMS - frameTimeLastMS;
        frameTimeLastMS = frameTimeMS;
        frameTimeBufferMS += frameTimeDeltaMS;
        frameTimeBufferMS = Math.min(frameTimeBufferMS, 50);

        // apply time delta smoothing, improves smoothness of framerate in some browsers
        let deltaSmooth = 0;
        if (frameTimeBufferMS < 0 && frameTimeBufferMS > -9)
        {
            // force an update each frame if time is close enough (not just a fast refresh rate)
            deltaSmooth = frameTimeBufferMS;
            frameTimeBufferMS = 0;
        }
        
        // update multiple frames if necessary in case of slow framerate
        for (;frameTimeBufferMS >= 0; frameTimeBufferMS -= 1e3 / 60)
            update();

        // add the time smoothing back in
        frameTimeBufferMS += deltaSmooth;
    }

    mouseMode = 1;
    keyInput = [];
    onmousemove = e => mouseX = e.clientX;
    onmousedown = e =>
    {
        if (isOut) { resetGame(); return; }
        mouseDown = .1; 
        mouseJustPressed = 1;
        mouseMode = 1;
    }

    onkeydown = e=>
    {
        mouseMode = 0;
        keyInput[e.key] = 1;
        if (e.key === 'r')
            resetGame();
        if (e.key === ' ')
        {
            e.preventDefault();
            togglePause();
            return;
        }
        if (e.key === 'ArrowUp' || e.key === 'w')
        {
            if (isOut) { resetGame(); return; }
            mouseDown = .1; 
            mouseJustPressed = 1;
        }
    }
    onkeyup = e=>
    {
        keyInput[e.key] = 0;
        if (e.key === 'ArrowUp' || e.key === 'w')
        {
            mouseDown = 0; 
        }
    }

    onresize = e=>
    {
        a.width = innerWidth;
        a.height = innerHeight;
    }

    // touch support
    if (window.ontouchstart !== undefined)
    {
        // disable mobile text selection, long-press callout/magnifier, and touch gestures
        for (const el of [document.documentElement, document.body, a])
        {
            el.style.userSelect = el.style.webkitUserSelect = 'none';
            el.style.webkitTouchCallout = 'none';
            el.style.touchAction = 'none';
        }

        // simulate mouse down on touch start
        ontouchstart = e=> {
            if (e.target.closest('button, a')) return;
            e.preventDefault();
            mobileTouchStartedAt = performance.now();
            mobileTouchMoved = false;
            mobileDirection = e.touches[0].clientX < innerWidth / 2 ? -1 : 1;
            mouseMode = 0;
        };
        ontouchend = e=> {
            if (e.target.closest('button, a')) return;
            e.preventDefault();
            const wasTap = performance.now() - mobileTouchStartedAt < 220 && !mobileTouchMoved;
            mobileDirection = 0;
            if (wasTap) onmousedown();
        };
        ontouchmove = e=>
        {
            if (e.target.closest('button, a')) return;
            e.preventDefault();
            mobileTouchMoved = true;
            const touch = e.touches[0];
            mobileDirection = touch.clientX < innerWidth / 2 ? -1 : 1;
        }
    }
    
    updateAnimation();
}

// RollUp by KilledByAPixel 2026 - 1019 bytes!
//for(_=']=o(Ge=F=F>S=E--;)D;eDC),BBc.Av,w@p,q#,${"i(!99 e/-1e3,=(e,h,2+500,e*l/30Ge-a.heighte%4*/)**.7/t,B[m,n,lGQc.fill&&(onmouse,(40-g+M)/30**(g+e&1)3Aellipse(m,n,Math.min(.5,g-M	for($&d[M+3|0][round(Q+3)]a.widthAlineTo(! +70*(g>>7B6BRect(AbeginPath(())random()Q=$=M=P=R=S=T=b=3,I=/2,d=[],ia,t=1)=>{StylF`hsl(${e}"h}%"a}%"t})`},ot)=>[/(e-Q+(t-3)**2/*cos((M+t)/49)/2-(h-t*t/.7*/t];movFF>I=e.x,downE.1,upEsetInterval(F>{F0C!170+9+M,770-9*,/2B! (e*e+M* )%,e**3.3%,0);g=M+40|0;g>M;g--){Fd.length;e<=g;)R<-8&<.2,1e4)R=4,400)B<.1b=3*|T=max(7-b,T-5*|0))BR--,d[e++]=s=[],f=7;fDs[f]=e<35|.9<|R<0&T<=f&f<T+b&>.2,M/1e4);f=2;fDF7Cd[g][e][#3	B[r,u2	B[@3	+1B[x,y2	+1Bf?(30+9@,x-v)):(9+5#,r-pB60+30#r,ux,y@))}0<=!.5,l/4,l/9,9BF C!M/9-3,9 -.7*e+.1$+.359;-4<$Q+=I//2-.25,$+=P-=.006,M+=.5,.M/5e3B$<0&-.3<)$=P=S)},16)';G=/[-#@-G]/.exec(_);)with(_.split(G))_=join(shift());eval(_)
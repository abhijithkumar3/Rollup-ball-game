# RollUp

RollUp is a fast, arcade-style endless sky runner. Guide the ball across the floating golden track, avoid gaps, and see how far you can travel before falling.

## Features

- Endless 3D-style sky track rendered with a 2D canvas
- Distance meter that displays progress in metres
- Automatic shape changes every 200 metres
- Smooth transitions between ball, diamond, star, and hexagon forms
- Three selectable ball colours: coral, purple, and blue
- Centered pause and game-over notifications
- Custom RollUp favicon and start screen
- Responsive controls for desktop and touch-friendly play

## Controls

| Action | Keyboard | Mouse or touch |
| --- | --- | --- |
| Move | `A` / `D` or `Left` / `Right` | Move the pointer |
| Jump | `Up` | Click or tap |
| Pause | `Space` | - |
| Reset after game over | `R` | Click or tap |

## How To Play

1. Open the game and press **START GAME**.
2. Move the ball left and right to stay on the golden track.
3. Jump over gaps with `Up`, click, or tap.
4. Watch the distance meter and reach each 200 metre shape milestone.
5. If you fall, the game-over message shows the distance reached. Press `R` or click to restart.

## Run Locally

The game is a static browser project. From the project directory, run:

```bash
python -m http.server 8000 --directory dist
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.

## Project Files

- `src/script.js` - editable game source
- `dist/script.js` - served game script
- `dist/index.html` - browser entry page
- `dist/favicon.svg` - RollUp browser icon

## Development

RollUp is developed and maintained by Abhijith Kumar in Visual Studio Code.

- Email: <abhijithkumar023@gmail.com>
- LinkedIn: [abhijithkumar3](https://www.linkedin.com/in/abhijithkumar3/)
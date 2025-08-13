# Website Paty Salgados

## Using HTML, CSS, Javascript and node.js

### Modules (Node.js)

> express mongoose ejs bcrypt dotenv

## Salgados disability

- How ability again

> Remove this css:

```
.desativada {
  pointer-events: none; 
  -webkit-user-select: none;   
  user-select: none;
  opacity: 0.5;        
}
.indisponivel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  font-size: 4vh;
  text-transform: uppercase;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-shadow: 2px 2px 15px rgb(0, 0, 0);
}  
```
> Remova a div no home.ejs

```
  <div class="slider-wrapper slider-wrapper1" aria-readonly="">
          <div class="desativada">                                <<<remover a div>>>
          <div id="sliderTrack1" class="slider-track"></div>
          <button type="button" class="nav-button prev-button" data-target="1">
            ◀
          </button>
          <button type="button" class="nav-button next-button" data-target="1">
            ▶
          </button>
        </div>
      </div>
```


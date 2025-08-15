/* ---------- seu script.js (versão corrigida) ---------- */

/* CONFIG */
const config = {
  slidesToShow: 5,
  centerMode: true,
  gap: 20,
};

const salgados = [
  {
    id: 0,
    label: "Pão de queijo",
    src: "pao_de_Queijo.jpeg",
    pequeno: { mim: 50, value: 50 },
    medio: { mim: 25, value: 25 },
    price: { small: 0.3, medium: 1.0 },
    minimum: true,
    text: "Pão de queijo quentinho, feito com queijo fresco e polvilho azedo. Com o  minimo de 50 unidade do pequeno e 25 do médio.",
  },
  {
    id: 1,
    label: "Bolinha de Queijo",
    src: "Bolinho_de_queijo.jpg",
    pequeno: { mim: 100, value: 100 },
    medio: { mim: 50, value: 50 },
    price: { small: 0.4, medium: 1.5 },
    minimum: true,
    text: "Bolinha de Queijo crocante por fora e recheio cremoso de queijo por dentro. Com o  minimo de 100 unidade do pequeno e 50 do médio.",
  },
  {
    id: 2,
    label: "Coxinha",
    src: "coxinha.jpg",
    pequeno: { mim: 100, value: 100 },
    medio: { mim: 50, value: 50 },
    price: { small: 0.4, medium: 1.5 },
    minimum: true,
    text: "Coxinha de frango com massa crocante e recheio suculento. Com o  minimo de 100 unidade do pequeno e 50 do médio.",
  },
];

const doces = [
  {
    id: 0,
    label: "Brigadeiro",
    src: "brigadeiro.jpg",
    pequeno: { mim: 100, value: 100 },
    medio: { mim: 5, value: 5 },
    price: { small: 0.25, medium: 2 },
    minimum: true,
    text: "Brigadeiro cremoso, feito com leite condensado e granulado. Com o  minimo de 100 unidade do pequeno e 5 do médio gourmet.",
  },
  {
    id: 1,
    label: "Beijinho",
    src: "beijinho.jpg",
    pequeno: { mim: 100, value: 100 },
    medio: { mim: 5, value: 5 },
    price: { small: 0.25, medium: 2 },
    minimum: true,
    text: "Beijinho de coco, feito com leite condensado e coberto com coco ralado. Com o  minimo de 100 unidade do pequeno e 5 do médio gourmet.",
  },
  {
    id: 2,
    label: "Olho de sogra ",
    src: "olho_de_sogra.webp",
    pequeno: { mim: 100, value: 100 },
    medio: { mim: 50, value: 50 },
    price: { small: 0.3, medium: 2 },
    minimum: true,
    text: "Olho de sogra  feito com damasco, recheado com doce de leite e coberto com chocolate. Com o  minimo de 100 unidade do pequeno e 5 do médio. ",
  },
];

/* ----------------- SLIDER (mantive seu código) ----------------- */
function initSlider(images, trackId, wrapperClass) {
  const track = document.getElementById(trackId);
  const wrapper = document.querySelector(`.${wrapperClass}`);
  let slides = [];
  let currentLogicalIndex = 0;
  let currentPhysicalIndex = 0;
  let isTransitioning = false;

  let sideSlideSize = 0;
  let centerSlideSize = 0;
  let isMobile = window.innerWidth <= 768;

  function calculateWidths() {
    const containerSize = isMobile ? wrapper.offsetHeight : wrapper.offsetWidth;
    const totalGaps = config.gap * (config.slidesToShow - 1);
    const availableSize = containerSize - totalGaps;

    if (isMobile) {
      if (config.centerMode) {
        centerSlideSize = availableSize * 0.9;
        sideSlideSize =
          (availableSize - centerSlideSize) / (config.slidesToShow - 4);
      } else {
        sideSlideSize = availableSize / config.slidesToShow;
        centerSlideSize = sideSlideSize;
      }
    } else {
      if (config.centerMode) {
        centerSlideSize = availableSize * 0.4;
        sideSlideSize =
          (availableSize - centerSlideSize) / (config.slidesToShow - 1);
      } else {
        sideSlideSize = availableSize / config.slidesToShow;
        centerSlideSize = sideSlideSize;
      }
    }
  }

  function createSlide(item) {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.dataset.label = item.label;
    slide.dataset.id = item.id;
    slide.innerHTML = `
      <button type="button" class="btn-order" onclick='openOrder(${JSON.stringify(
        item
      )})'>
        <img src="${item.src}" alt="${item.label}">
      </button>
    `;
    return slide;
  }

  function buildInfiniteTrack() {
    track.innerHTML = "";
    calculateWidths();
    const repeatCount = 20;

    for (let rep = 0; rep < repeatCount; rep++) {
      images.forEach((item) => {
        const slide = createSlide(item);
        track.appendChild(slide);
      });
    }

    slides = Array.from(track.children);
    currentPhysicalIndex = Math.floor(slides.length / 2);
    currentLogicalIndex = currentPhysicalIndex % images.length;
    applyWidths();
  }

  function applyWidths() {
    slides.forEach((slide, index) => {
      const isCenter = index === currentPhysicalIndex && config.centerMode;
      const size = isCenter ? centerSlideSize : sideSlideSize;

      if (isMobile) {
        slide.style.height = `${size}px`;
        slide.style.marginTop = "0px";
        slide.style.marginBottom = `${config.gap}px`;
      } else {
        slide.style.width = `${size}px`;
        slide.style.height = "300px";
        slide.style.marginLeft = "0px";
        slide.style.marginRight = `${config.gap}px`;
      }
    });

    if (slides.length > 0) {
      if (isMobile) {
        slides[slides.length - 1].style.marginBottom = "0px";
      } else {
        slides[slides.length - 1].style.marginRight = "0px";
      }
    }
  }

  function getCenterOffset(slideIndex) {
    const containerCenter = isMobile
      ? wrapper.offsetHeight / 2
      : wrapper.offsetWidth / 2;
    let offset = 0;

    for (let i = 0; i < slideIndex; i++) {
      const size = i === currentPhysicalIndex ? centerSlideSize : sideSlideSize;
      offset += size + config.gap;
    }

    const currentSize =
      slideIndex === currentPhysicalIndex ? centerSlideSize : sideSlideSize;
    offset += currentSize / 2;

    return offset - containerCenter;
  }

  function updateSlider(animate = true) {
    if (isTransitioning && animate) return;
    applyWidths();

    slides.forEach((slide) => slide.classList.remove("active"));
    if (slides[currentPhysicalIndex] && config.centerMode) {
      slides[currentPhysicalIndex].classList.add("active");
    }

    const offset = getCenterOffset(currentPhysicalIndex);
    const direction = isMobile ? "translateY" : "translateX";
    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `${direction}(-${offset}px)`;

    if (animate) {
      isTransitioning = true;
      setTimeout(() => {
        isTransitioning = false;
        resetPositionIfNeeded();
      }, 600);
    }
  }

  function resetPositionIfNeeded() {
    const resetThreshold = images.length * 2;
    const middlePosition = Math.floor(slides.length / 2);
    if (
      currentPhysicalIndex < resetThreshold ||
      currentPhysicalIndex > slides.length - resetThreshold
    ) {
      const targetLogical = currentLogicalIndex;
      currentPhysicalIndex =
        middlePosition + (targetLogical - (middlePosition % images.length));
      updateSlider(false);
    }
  }

  function nextSlide() {
    if (isTransitioning) return;
    currentPhysicalIndex++;
    currentLogicalIndex = (currentLogicalIndex + 1) % images.length;
    updateSlider(true);
  }

  function prevSlide() {
    if (isTransitioning) return;
    currentPhysicalIndex--;
    currentLogicalIndex =
      (currentLogicalIndex - 1 + images.length) % images.length;
    updateSlider(true);
  }

  function bindEvents() {
    document
      .querySelectorAll(`.next-button[data-target="${trackId.slice(-1)}"]`)
      .forEach((btn) => btn.addEventListener("click", nextSlide));
    document
      .querySelectorAll(`.prev-button[data-target="${trackId.slice(-1)}"]`)
      .forEach((btn) => btn.addEventListener("click", prevSlide));

    window.addEventListener("resize", () => {
      isMobile = window.innerWidth <= 768;
      calculateWidths();
      applyWidths();
      updateSlider(false);
    });
  }

  buildInfiniteTrack();
  updateSlider(false);
  bindEvents();
}

/* Inicializa os sliders */
initSlider(salgados, "sliderTrack1", "slider-wrapper1");
initSlider(doces, "sliderTrack2", "slider-wrapper2");


// Em cima do arquivo (script.js)
const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000"           // URL do backend local
  : "https://paty-pedidos.vercel.app/"; // URL do backend em produção (ex: Render/Railway)

// helper para checar se a resposta é JSON, evitando o "Unexpected token '<'"
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const txt = await res.text();
    throw new Error(`Resposta não-JSON (${res.status}). Início: ${txt.slice(0,120)}`);
  }
  return res.json();
}


/* ----------- CARRINHO (corrigido) ----------- */

/* Use var para garantir que a variável esteja disponível globalmente se precisar acessar via console */
var arry = []; // arry agora é array de objetos { uid, id, label, src, quantidade, tamanho, unitPrice, subtotal }

/* Helper para somar */
function updateTotal() {
  const finalOrder = document.getElementById("final-order");
  const basketQt = document.getElementById("basket-qt");

  const total = arry.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  finalOrder.innerHTML = `<p id="total-order">Total: £ ${total.toFixed(2)}</p>`;
  basketQt.textContent = arry.length;
}

/* Permite limpar o carrinho (usado após enviar pedido) */
function clearBasket() {
  arry = [];
  const basketItem = document.getElementById("basket-item");
  if (basketItem) basketItem.innerHTML = "";
  updateTotal();
}
window.clearBasket = clearBasket; // expõe para usar de outros scripts se necessário

/* Abre a caixa de pedido (mantive sua estrutura, só adicionei currentItem com preços) */
function openOrder(item) {
  const orderDiv = document.getElementById("orderBox");

  orderDiv.innerHTML = `
    <div class="order-content">
      <button type="button" class="btn-info" onclick="toggleInfo()"><img src="info.png" alt="Info" class="info"></button>
      <h3>${item.label}</h3>
      <img src="${item.src}" alt="${item.label}" style="width: 200px;">
      <p id="text">${item.text}</p>

      <!-- hidden current item data -->
      <div id="currentItem"
           data-id="${item.id}"
           data-label="${item.label}"
           data-src="${item.src}"
           data-price-small="${item.price.small}"
           data-price-medium="${item.price.medium}"
           style="display:none;"></div>

      <div class="precos" role="region" tabindex="0">
        <table>
          <caption><p>Preços</p></caption>
          <thead>
            <tr><th>Tamanho</th><th>£</th></tr>
          </thead>
          <tbody>
            <tr><td>Pequeno</td><td>${item.price.small.toFixed(2)}</td></tr>
            <tr><td>Medio</td><td>${item.price.medium.toFixed(2)}</td></tr>
          </tbody>
        </table>
      </div>

      <div id="quantidade-order">
        <div class="custom-select">
          <select name="tamanho" id="tamanho" required>
            <option value="" disabled selected>Tamanho</option>
            <option value="Pequeno">P</option>
            <option value="Medio">M</option>
          </select>
        </div>
      </div>

      <input type="number" min="1" value="0" id="quantityInput" placeholder="Quantidade" required disabled />

      <div class="btns-order">
        <button onclick="addToBasket()" id="adicionar" type="button">
          <img src="add.png" alt="Add" class="add-img">
        </button>
        <p id="soma"></p>
        <button onclick="closeOrder()" id="close" type="button"><img src="delete.png" alt="Close" id="close-img"></button>
      </div>
    </div>
  `;

  orderDiv.style.display = "block";
  document.getElementById("container").style.opacity = "0.5";

  // desabilita os botões do slider enquanto o modal está aberto
  const btnOrder = document.querySelectorAll(".btn-order");
  for (let i = 0; i < btnOrder.length; i++) {
    btnOrder[i].setAttribute("disabled", "");
  }

  const quantityInput = document.getElementById("quantityInput");
  const somaElement = document.getElementById("soma");
  const tamanhoSelect = document.getElementById("tamanho");

  tamanhoSelect.addEventListener("change", function () {
    const current = document.getElementById("currentItem").dataset;
    if (tamanhoSelect.value === "Pequeno") {
      quantityInput.setAttribute("min", `${item.pequeno.mim}`);
      quantityInput.value = `${item.pequeno.value}`;
      quantityInput.removeAttribute("disabled");
    } else if (tamanhoSelect.value === "Medio") {
      quantityInput.setAttribute("min", `${item.medio.mim}`);
      quantityInput.value = `${item.medio.value}`;
      quantityInput.removeAttribute("disabled");
    } else {
      quantityInput.setAttribute("disabled", "");
    }
    atualizarTotal(); // atualiza soma ao trocar tamanho
  });

  function atualizarTotal() {
    const value = parseInt(quantityInput.value, 10);
    const tamanho = tamanhoSelect.value;
    let precoUnitario;

    if (tamanho === "Pequeno") precoUnitario = item.price.small;
    else if (tamanho === "Medio") precoUnitario = item.price.medium;
    else {
      somaElement.textContent = "Tamanho...";
      return;
    }

    if (!isNaN(value) && value >= 0) {
      const total = value * precoUnitario;
      somaElement.textContent = "£ " + total.toFixed(2);
    } else {
      somaElement.textContent = " £0.00";
    }
  }

  quantityInput.addEventListener("input", atualizarTotal);
  tamanhoSelect.addEventListener("change", atualizarTotal);

  // Atualizar total ao abrir
  atualizarTotal();
}

/* Fecha o modal de pedido */
function closeOrder() {
  document.getElementById("orderBox").style.display = "none";
  document.getElementById("container").style.opacity = "1";

  const btnOrder = document.querySelectorAll(".btn-order");
  for (let i = 0; i < btnOrder.length; i++) {
    btnOrder[i].removeAttribute("disabled", "");
  }
}

/* Toggle info (mantive igual) */
function toggleInfo() {
  const el = document.getElementById("text");
  el.style.display = el.style.display === "flex" ? "none" : "flex";
}

/* ADICIONAR AO CARRINHO (corrigido) */
function addToBasket() {
  const current = document.getElementById("currentItem").dataset;
  const id = current.id;
  const label = current.label;
  const src = current.src;

  const tamanhoSelect = document.getElementById("tamanho");
  const quantityInput = document.getElementById("quantityInput");
  const somaE = document.getElementById("soma");

  const quantidade = parseInt(quantityInput.value, 10) || 0;
  const tamanho = tamanhoSelect.value;

  if (!tamanho) {
    alert("Selecione o tamanho.");
    return;
  }
  if (quantidade <= 0) {
    alert("Quantidade inválida.");
    return;
  }

  let unitPrice = null;
  if (tamanho === "Pequeno")
    unitPrice =
      parseFloat(current.priceSmall || current["priceSmall"]) ||
      parseFloat(document.getElementById("currentItem").dataset["priceSmall"]);
  if (tamanho === "Medio")
    unitPrice =
      parseFloat(current.priceMedium || current["priceMedium"]) ||
      parseFloat(document.getElementById("currentItem").dataset["priceMedium"]);
  if (!unitPrice) {
    // fallback: se por algum motivo não pegarmos preço, calculamos pelo campo soma / qtd
    const somaParse = parseFloat(somaE.textContent) || 0;
    unitPrice = quantidade ? somaParse / quantidade : 0;
  }

  const subtotal = parseFloat((unitPrice * quantidade).toFixed(2));
  const uid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  const itemObj = {
    uid,
    id,
    label,
    src,
    quantidade,
    tamanho,
    unitPrice,
    subtotal,
  };

  // adiciona ao array do carrinho (objeto completo)
  arry.push(itemObj);

  // cria o elemento visual do pedido
  const pedido = document.createElement("div");
  pedido.classList.add("pedidos");
  pedido.setAttribute("data-uid", uid);
  pedido.setAttribute("data-price", subtotal);

  pedido.innerHTML = `
    <ul>
      <li><img src="${src}" alt="${label}" class="imgs"></li>
      <li>${label}</li>
      <li>QT: ${quantidade}</li>
      <li><span>£ </span>${subtotal.toFixed(2)}</li>
    </ul>
    <button type="button" class="delete"><img src="Delete1.png" alt="Delete" class="imgs"></button>
  `;

  // adiciona listener ao botão de deletar (remove por uid)
  const deleteBtn = pedido.querySelector(".delete");
  deleteBtn.addEventListener("click", () => {
    const uidToRemove = pedido.getAttribute("data-uid");
    const index = arry.findIndex((it) => it.uid === uidToRemove);
    if (index !== -1) {
      arry.splice(index, 1);
    }
    pedido.remove();
    updateTotal();
  });

  document.getElementById("basket-item").appendChild(pedido);

  updateTotal();
  closeOrder();
}

/* ABRIR / FECHAR CARRINHO (mantive seu comportamento) */
function closeOrderBasket() {
  document.getElementById("basket").style.display = "none";
  document.getElementById("box-img").src = "box_close.png";
}

function openBasket() {
  if (arry.length === 0) {
    const message = document.getElementById("message");
    message.style.display = "block";

    message.textContent =
      "Carrinho vazio! Adicione itens antes de abrir o carrinho.";
    setTimeout(() => {
      message.textContent = "";
      message.style.display = "none";
    }, 5000);
  } else {
    if (document.getElementById("basket").style.display === "flex") {
      document.getElementById("basket").style.display = "none";
      document.getElementById("box-img").src = "box_close.png";
    } else {
      document.getElementById("basket").style.display = "flex";
      document.getElementById("box-img").src = "box_open.png";
    }
  }
}

/* ---------- MENU (mantive seu código, sem mudanças) ---------- */
const menuWrapper = document.getElementById("menuWrapper");
const menuCircle = document.getElementById("menuCircle");
const menuIcon = document.getElementById("menuIcon");
const arcButtons = document.getElementById("arcButtons");
const modal = document.getElementById("modal");
const textHTML = document.getElementById("textHTML");

const totalButtons = 4;
const radius = 180;
const centerX = 28;
const centerY = 28;
const imgs = [
  "about-us.png",
  "photo-gallery.png",
  "commercial.png",
  "price-list.png",
];

const images = [
  "https://images.unsplash.com/photo-1743300873241-55cc4d602663?crop=entropy&cs=srgb&fm=jpg",
  "https://images.unsplash.com/photo-1748519707841-df414b70a215?crop=entropy&cs=srgb&fm=jpg",
  "https://images.unsplash.com/photo-1745750747234-9584cbd65358?crop=entropy&cs=srgb&fm=jpg",
];

let slideshowInterval;

for (let i = 0; i < totalButtons; i++) {
  const angle = (Math.PI / 2) * (i / (totalButtons - 1));
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  const aboutUs = `
      <h3>About Me</h3>
      <p>Sou Patricia, apaixonada por salgados, doces e bolos que fazem qualquer momento ficar mais especial. Minha história na cozinha começou no Brasil, na minha própria casa, onde cozinhar sempre foi sinônimo de amor e união em família.</p>
      <p>Aprendi desde cedo que a melhor receita é aquela feita “no olho” — usando o coração, sentindo o ponto certo e escolhendo cada ingrediente com cuidado. É assim que preparo cada salgado crocante, cada doce irresistível e cada bolo fofinho: sem pressa, com carinho e com o sabor caseiro que lembra as melhores lembranças da infância.</p>
      <p>Aqui, cada encomenda é feita como se fosse para minha própria família, porque acredito que comida boa é aquela que aquece o coração. Seja para um café da tarde, uma festa ou um momento especial, você vai encontrar aqui o sabor e a qualidade que merecem estar na sua mesa.</p>
      <p>Hoje, trago essa tradição para você, oferecendo produtos feitos com ingredientes frescos e selecionados, sempre com aquele toque especial que só quem ama cozinhar pode dar. Seja para uma festa, um lanche da tarde ou um momento de confraternização, estou aqui para tornar seu dia mais doce e saboroso.</p>
    `;
  const photoGallery = `
      <h3>Photo Gallery</h3>  
      <img src="${images[0]}" alt="Gallery" id="img">
    `;
  const commercial = `
      <h3>Pedidos</h3>
      <div ="commercial"></div>

    `;
  const priceList = `
      <h3>Tabela de precos</h3>
      <table>
    <caption>
        <p>Salgados</p>
    </caption>
  <tr>
    <th>Tipos</th>
    <td>Tamanho</td>
    <td>Preço</td>
  </tr>
  <tr>
    <th rowspan="2">${salgados[2].label}</th>
    <td>Pequeno</td>
    <td>£ ${salgados[2].price.small.toFixed(2)}</td>
  </tr>
  <tr>
    <td>Medio</td>
    <td>£ ${salgados[2].price.medium.toFixed(2)}</td>
  </tr>
  
  <tr>
    <th rowspan="2">${salgados[0].label}</th>
    <td>Pequeno</td>
    <td>£ ${salgados[0].price.small.toFixed(2)}</td>
  </tr>
  <tr>
    <td>Medio</td>
    <td>£ ${salgados[0].price.medium.toFixed(2)}</td>
  </tr>
  
  <tr>
    <th rowspan="2">${salgados[1].label}</th>
    <td>Pequeno</td>
    <td>£ ${salgados[1].price.small.toFixed(2)}</td>
  </tr>
  <tr>
    <td>Medio</td>
    <td>£ ${salgados[1].price.medium.toFixed(2)}</td>
  </tr>
</table>
<table>
  <caption>
      <p>Doces</p>
  </caption>
  <tr>
    <th>Tipos</th>
    <td>Tamanho</td>
    <td>Preço</td>
  </tr>
  <tr>
    <th rowspan="2"> ${doces[2].label}</th>
    <td>Pequeno</td>
    <td>£ ${doces[2].price.small.toFixed(2)}</td>
  </tr>
  <tr>
    <td>Medio</td>
    <td>£ ${doces[2].price.medium.toFixed(2)}</td>
  </tr>
  
  <tr>
    <th rowspan="2">${doces[0].label}</th>
    <td>Pequeno</td>
    <td>£ ${doces[0].price.small.toFixed(2)}</td>
  </tr>
  <tr>
    <td>Medio</td>
    <td>£ ${doces[0].price.medium.toFixed(2)}</td>
  </tr>
  
  <tr>
    <th rowspan="2">${doces[1].label}</th>
    <td>Pequeno</td>
    <td>£ ${doces[1].price.small.toFixed(2)}</td>
  </tr>
  <tr>
    <td>Medio</td>
    <td>£ ${doces[1].price.medium.toFixed(2)}</td>
  </tr>
</table>
    `;

  const btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.className = "arc-button";
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;

  const imgEl = document.createElement("img");
  imgEl.src = imgs[i];
  imgEl.alt = `img-${i + 1}`;
  btn.appendChild(imgEl);

  btn.addEventListener("click", () => {
    clearInterval(slideshowInterval);

    if (i === 0) {
      textHTML.innerHTML = aboutUs;
    } else if (i === 1) {
      textHTML.innerHTML = photoGallery;

      let index = 1;
      const imgElement = document.getElementById("img");

      slideshowInterval = setInterval(() => {
        if (imgElement) imgElement.src = images[index];
        index = (index + 1) % images.length;
      }, 5000);
    } else if (i === 2) {
      // Mostra título
      textHTML.innerHTML = "<h3>Pedidos</h3><p>Carregando...</p>";

      // Busca pedidos do usuário logado
      fetchJSON(`${API_BASE_URL}/meus-pedidos`, { credentials: "include" })
        .then((res) => res.json())
        .then((pedidos) => {
          if (!pedidos.length) {
            textHTML.innerHTML =
              "<h3>Pedidos</h3><p>Você não tem pedidos ainda.</p>";
            return;
          }

          // Monta HTML
          let html = `<h3>Pedidos</h3>
      
      <p>Você tem ${pedidos.length} pedido(s).</p>
      <hr>`;
          pedidos.forEach((p) => {
            html += `
          <div class="pedido">
            <p><strong>Pedido em:</strong> ${new Date(
              p.data
            ).toLocaleString()}</p>
            <p><strong>Cliente:</strong> ${p.cliente}</p>
            <p><strong>Itens:</strong></p>
            <ul>
              ${p.itens
                .map(
                  (item) =>
                    `<li>${item.label} (${
                      item.qtd
                    }) - £ ${item.subtotal.toFixed(2)}</li>`
                )
                .join("")}
            </ul>
            <p><strong>Total:</strong> R$ ${p.total.toFixed(2)}</p>
            <p><strong>Status:</strong> ${p.status}</p>
            <p><strong>Observações:</strong> ${p.observacoes || "Nenhuma"}</p>
            <p><strong>Entregue:</strong> ${p.entregue}</p>
            <p><strong>Data de entrega:</strong> ${
              p.dataEntrega
                ? new Date(p.dataEntrega).toLocaleString()
                : "Não definida"
            }</p>
            <p><strong>Data de pagamento:</strong> ${
              p.dataPagamento
                ? new Date(p.dataPagamento).toLocaleString()
                : "Não definido"
            }</p>
            <p><strong>Data de cancelamento:</strong> ${
              p.dataCancelamento
                ? new Date(p.dataCancelamento).toLocaleString()
                : "Não definido"
            }</p>
          </div>
          <hr>
        `;
          });

          textHTML.innerHTML = html;
        })
        .catch((err) => {
          console.error(err);
          textHTML.innerHTML =
            "<h3>Pedidos</h3><p>Erro ao carregar pedidos.</p>";
        });
    } else if (i === 3) {
      textHTML.innerHTML = priceList;
    }

    modal.style.display = "flex";
  });

  arcButtons.appendChild(btn);
}

function closeModal() {
  modal.style.display = "none";
  clearInterval(slideshowInterval);
}

menuCircle.addEventListener("click", () => {
  menuWrapper.classList.toggle("open");
  menuIcon.textContent = menuWrapper.classList.contains("open") ? "✕" : "☰";
});

/* ---------- ENVIO DO PEDIDO AO BACKEND (/pedido) ---------- */
document.getElementById("pedir")?.addEventListener("click", async () => {
  // Se o carrinho for salvo em "arry", usa ele. Se não, tenta pegar do window.basketItems.
  const carrinho = Array.isArray(window.arry)
    ? window.arry
    : window.basketItems || [];

  if (!Array.isArray(carrinho) || carrinho.length === 0) {
    document.getElementById("basket").style.display = "none";
    alert("O carrinho será limpo!");
    
    return;
  }

  // Monta o array no formato que o servidor espera
  const solicita = carrinho.map((it) => ({
    label: it.label || it.nome || "Item",
    qtd: it.quantidade || 1,
    tamanho: it.tamanho || "",
    unitPrice: it.unitPrice || it.preco || 0,
    subtotal: it.subtotal || (it.preco ? it.preco * (it.quantidade || 1) : 0),
  }));

  const total = solicita.reduce((sum, it) => sum + it.subtotal, 0);

  console.log("📦 Enviando pedido para o servidor:", { solicita, total });

  try {
    const res = await fetch("/pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solicita, total }),
    });

    const data = await res.json();
    if (data.sucesso) {
      alert("✅ Pedido enviado com sucesso!");
      document.getElementById("basket").style.display = "none";
      if (typeof clearBasket === "function") clearBasket(); // limpa o carrinho se função existir
    } else {
      alert(
        "❌ Erro: " + (data.mensagem || "Não foi possível enviar o pedido")
      );
    }
  } catch (err) {
    console.error("Erro ao enviar pedido:", err);
    alert("Erro ao enviar pedido.");
  }
});

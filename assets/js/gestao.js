let products = [];
const $ = selector => document.querySelector(selector);
const slugify = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const money = value => value == null ? "Consultar valor" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function status(message) { const box = $("#status"); box.textContent = message; box.hidden = false; setTimeout(() => box.hidden = true, 3200); }

async function init() {
  try { products = await (await fetch("data/products.json", { cache: "no-store" })).json(); renderProducts(); }
  catch { status("Importe um products.json para começar."); }
}

function renderProducts() {
  $("#admin-products").innerHTML = products.map((product, index) => `<article class="admin-product"><img src="${product.image}" alt=""><div><strong>${product.name}</strong><small>${product.category} · ${money(product.price)}</small></div><button type="button" data-delete="${index}" aria-label="Remover ${product.name}">×</button></article>`).join("") || "<p>Nenhum produto cadastrado.</p>";
  $("#news-product").innerHTML = products.map((product, index) => `<option value="${index}">${product.name}</option>`).join("");
}

$("#product-form").addEventListener("submit", event => {
  event.preventDefault(); const data = new FormData(event.currentTarget); const rawPrice = String(data.get("price") || "").replace(",", "."); const fileName = String(data.get("image")).trim();
  products.push({ id: slugify(String(data.get("name"))), name: String(data.get("name")).trim(), category: String(data.get("category")).trim(), description: String(data.get("description")).trim(), price: rawPrice ? Number(rawPrice) : null, image: `assets/images/products/${fileName}`, featured: data.get("featured") === "on", active: true });
  event.currentTarget.reset(); renderProducts(); status("Produto adicionado. Baixe o JSON para publicar.");
});

document.addEventListener("click", event => {
  if (event.target.matches("[data-delete]")) { products.splice(Number(event.target.dataset.delete), 1); renderProducts(); }
  if (event.target.matches("[data-tab]")) { document.querySelectorAll("[data-tab]").forEach(button => button.classList.toggle("active", button === event.target)); document.querySelectorAll(".admin-panel").forEach(panel => panel.classList.toggle("active", panel.id === event.target.dataset.tab)); }
});

$("#download-json").addEventListener("click", () => download(new Blob([JSON.stringify(products, null, 2)], { type: "application/json" }), "products.json"));
$("#import-json").addEventListener("change", async event => { const file = event.target.files[0]; if (!file) return; try { products = JSON.parse(await file.text()); renderProducts(); status("Catálogo importado."); } catch { status("Arquivo JSON inválido."); } });

function generateNews() {
  const product = products[Number($("#news-product").value)]; if (!product) return status("Selecione um produto.");
  const hooks = { novidade:"Novidade fresquinha saindo do ateliê!", presente:"Um presente cheio de afeto para surpreender alguém especial.", estoque:"Poucas unidades disponíveis — garanta a sua!", bastidor:"Cada corte e cada ponto carregam uma história." };
  $("#news-caption").value = `${hooks[$("#news-type").value]} ✨\n\n${product.name} — ${product.description}\n\nFeito à mão, com atenção aos detalhes e muito carinho. Personalize cores e estampas para deixar a peça com a sua cara. 💗\n\n📲 Encomendas: (81) 99979-6165\n@donacosturice_\n\n#DonaCosturice #FeitoAMão #ArtesanatoComAmor #CosturaCriativa #PresenteAfetivo`;
  drawNews(product);
}

function drawNews(product) {
  const canvas = $("#news-canvas"), ctx = canvas.getContext("2d"), title = $("#news-title").value || "Novidade por aqui!"; ctx.fillStyle="#f8eee3";ctx.fillRect(0,0,1080,1350);
  const image = new Image(); image.onload = () => { const sourceWidth = /kit-floral|almofada/.test(product.image) ? image.width : image.width*.58; const scale=Math.max(1080/sourceWidth,820/image.height);ctx.drawImage(image,0,0,sourceWidth,image.height,0,0,sourceWidth*scale,image.height*scale);const gradient=ctx.createLinearGradient(0,590,0,920);gradient.addColorStop(0,"rgba(248,238,227,0)");gradient.addColorStop(1,"#f8eee3");ctx.fillStyle=gradient;ctx.fillRect(0,590,1080,360);ctx.fillStyle="#bf765f";ctx.fillRect(70,72,255,54);ctx.fillStyle="#fff";ctx.font="700 25px Arial";ctx.fillText("NOVIDADE",105,108);ctx.fillStyle="#4a3029";ctx.font="700 62px Georgia";wrap(ctx,title,75,930,900,72);ctx.fillStyle="#7f655b";ctx.font="34px Georgia";ctx.fillText(product.name,75,1140);ctx.strokeStyle="#c99291";ctx.setLineDash([8,8]);ctx.lineWidth=3;ctx.strokeRect(34,34,1012,1282);ctx.setLineDash([]);ctx.fillStyle="#bf765f";ctx.font="italic 38px Georgia";ctx.fillText("Dona Costurice",75,1265);ctx.fillStyle="#7f655b";ctx.font="22px Arial";ctx.fillText("afeto em forma de costura  •  @donacosturice_",365,1264);}; image.onerror=()=>status("Envie a foto para a pasta de produtos antes de gerar a arte."); image.src=product.image;
}

function wrap(ctx,text,x,y,maxWidth,lineHeight){let line="";for(const word of text.split(" ")){const test=`${line}${word} `;if(ctx.measureText(test).width>maxWidth){ctx.fillText(line,x,y);line=`${word} `;y+=lineHeight}else line=test}ctx.fillText(line,x,y)}
function download(blob,name){const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000)}
$("#generate-news").addEventListener("click",generateNews);$("#copy-caption").addEventListener("click",async()=>{await navigator.clipboard.writeText($("#news-caption").value);status("Legenda copiada.")});$("#download-art").addEventListener("click",()=>{$("#news-canvas").toBlob(blob=>blob&&download(blob,`dona-costurice-news-${Date.now()}.png`),"image/png")});
init();

let lista = document.getElementById("lista");
let input = document.getElementById("tarefa");

// ENTER adiciona
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") adicionar();
});

// placeholder inteligente
input.addEventListener("focus", () => {
  input.placeholder = "Digite e aperte ENTER...";
});

input.addEventListener("blur", () => {
  input.placeholder = "Digite uma tarefa";
});

// carregar tarefas
window.onload = function() {
  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.forEach(t => criarTarefa(t.texto, t.concluida));
  atualizarContador();
};

function adicionar() {
  if (input.value === "") return;

  criarTarefa(input.value, false);
  salvar();
  input.value = "";
}

function criarTarefa(texto, concluida) {
  let li = document.createElement("li");

  let span = document.createElement("span");
  span.textContent = texto;

  if (concluida) {
    span.classList.add("concluida");
  }

  // marcar como concluída
  span.onclick = function () {
    span.classList.toggle("concluida");
    salvar();
  };

  // editar (duplo clique)
  span.ondblclick = function () {
    let inputEdit = document.createElement("input");
    inputEdit.value = span.textContent;

    li.replaceChild(inputEdit, span);
    inputEdit.focus();

    inputEdit.onblur = function () {
      if (inputEdit.value !== "") {
        span.textContent = inputEdit.value;
      }
      li.replaceChild(span, inputEdit);
      salvar();
    };

    inputEdit.onkeypress = function (e) {
      if (e.key === "Enter") {
        inputEdit.blur();
      }
    };
  };

  // botão excluir com animação
  let btn = document.createElement("button");
  btn.textContent = "X";

  btn.onclick = function () {
    li.style.opacity = "0";
    li.style.transform = "translateX(50px)";

    setTimeout(() => {
      li.remove();
      salvar();
    }, 300);
  };

  li.appendChild(span);
  li.appendChild(btn);
  lista.appendChild(li);

  atualizarContador();
}

function salvar() {
  let tarefas = [];

  document.querySelectorAll("li").forEach(li => {
    let span = li.querySelector("span");

    tarefas.push({
      texto: span.textContent,
      concluida: span.classList.contains("concluida")
    });
  });

  localStorage.setItem("tarefas", JSON.stringify(tarefas));

  atualizarContador();
}

// filtro
function filtrar(tipo) {
  document.querySelectorAll("li").forEach(li => {
    let concluida = li.querySelector("span").classList.contains("concluida");

    if (tipo === "todas") li.style.display = "flex";
    if (tipo === "ativas") li.style.display = concluida ? "none" : "flex";
    if (tipo === "concluidas") li.style.display = concluida ? "flex" : "none";
  });
}

// contador inteligente
function atualizarContador() {
  let total = document.querySelectorAll("li").length;
  let concluidas = document.querySelectorAll(".concluida").length;
  let pendentes = total - concluidas;

  let contador = document.getElementById("contador");

  if (contador) {
    contador.textContent =
      `Total: ${total} | ✔ ${concluidas} | ⏳ ${pendentes}`;
  }
}

// modo escuro
function toggleDark() {
  document.body.classList.toggle("dark");
}

// limpar tudo
function limparTudo() {
  if (confirm("Tem certeza que quer apagar tudo?")) {
    lista.innerHTML = "";
    salvar();
  }
}
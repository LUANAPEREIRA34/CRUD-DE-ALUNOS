const API_URL = "https://proweb.leoproti.com.br/alunos";

const form = document.getElementById("formAluno");
const tabela = document.getElementById("tabelaAlunos");
const idAluno = document.getElementById("idAluno");
const nome = document.getElementById("nome");
const turma = document.getElementById("turma");
const curso = document.getElementById("curso");
const matricula = document.getElementById("matricula");

// Botão cancelar (reseta o form)
const btnCancelar = document.getElementById("btn-cancelar");
if (btnCancelar) {
  btnCancelar.addEventListener("click", () => form.reset());
} else {
  console.warn("Elemento #btn-cancelar não encontrado no DOM.");
}

// LISTAR
async function listarAlunos() {
  try {
    const resp = await fetch(`${API_URL}/listarTodos`);
    if (!resp.ok) throw new Error("Erro ao buscar alunos");
    const alunos = await resp.json();

    tabela.innerHTML = "";
    alunos.forEach(a => {
      tabela.innerHTML += `
        <tr>
          <td>${a.id}</td>
          <td>${a.nome}</td>
          <td>${a.turma}</td>
          <td>${a.curso}</td>
          <td>${a.matricula}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editarAluno(${a.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deletarAluno(${a.id})">Excluir</button>
          </td>
        </tr>
      `;
    });
  } catch (erro) {
    console.error(erro);
    alert("Erro ao carregar a lista de alunos!");
  }
}

// CRIAR ou ATUALIZAR
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const aluno = {
    nome: nome.value.trim(),
    turma: turma.value.trim(),
    curso: curso.value.trim(),
    matricula: matricula.value.trim(),
  };

  if (!aluno.nome || !aluno.turma || !aluno.curso || !aluno.matricula) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const id = idAluno.value;

    if (id) {
      await fetch(`${API_URL}/atualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno),
      });
      alert("Aluno atualizado com sucesso!");
    } else {
      await fetch(`${API_URL}/adicionar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno),
      });
      alert("Aluno cadastrado com sucesso!");
    }

    form.reset();
    idAluno.value = "";
    listarAlunos();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar aluno!");
  }
});

// EDITAR
async function editarAluno(id) {
  try {
    const resp = await fetch(`${API_URL}/${id}`);
    if (!resp.ok) throw new Error("Erro ao buscar aluno");
    const a = await resp.json();

    idAluno.value = a.id;
    nome.value = a.nome;
    turma.value = a.turma;
    curso.value = a.curso;
    matricula.value = a.matricula;
  } catch (erro) {
    console.error(erro);
    alert("Erro ao carregar aluno!");
  }
}

// DELETAR
async function deletarAluno(id) {
  if (confirm("Deseja realmente excluir este aluno?")) {
    try {
      await fetch(`${API_URL}/deletar/${id}`, { method: "DELETE" });
      alert("Aluno excluído com sucesso!");
      listarAlunos();
    } catch (erro) {
      console.error(erro);
      alert("Erro ao excluir aluno!");
    }
  }
}

// INICIALIZA
listarAlunos();
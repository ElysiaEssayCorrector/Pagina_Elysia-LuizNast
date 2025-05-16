// ================================
// Seletores e Constantes Globais
// ================================
document.addEventListener("DOMContentLoaded", function () {
  // Seletores DOM
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");
  const feedback = document.getElementById("feedback");
  const submitButton = document.getElementById("submitButton");
  const buttonText = document.getElementById("buttonText");
  const spinner = document.getElementById("spinner");
  const dropArea = document.getElementById("drop-area");
  const toggleTheme = document.getElementById("toggleTheme");
  const fileIcon = document.getElementById("file-icon");
  const fileName = document.getElementById("file-name");
  const fileText = document.getElementById("file-text");
  const removeFileButton = document.getElementById("remove-file");

  // Tipos de arquivos permitidos
  const tiposPermitidos = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // ================================
  // Funções Utilitárias
  // ================================

  function mostrarFeedback(mensagem, cor) {
    feedback.textContent = mensagem;
    feedback.style.color = cor;
    feedback.classList.add("active");
    setTimeout(() => {
      feedback.classList.remove("active");
    }, 5000);
  }

  function iniciarEnvio() {
    buttonText.style.display = "none";
    spinner.style.display = "block";
    submitButton.disabled = true;
    submitButton.classList.add("pulsing");
  }

  function finalizarEnvio() {
    buttonText.style.display = "block";
    spinner.style.display = "none";
    submitButton.disabled = false;
    submitButton.classList.remove("pulsing");
  }

  function ativarModoEscuro() {
    document.body.classList.toggle("dark-mode");
    document.querySelector("header").classList.toggle("dark-mode");
    document.querySelector("footer").classList.toggle("dark-mode");
    dropArea.classList.toggle("dark-mode");
    submitButton.classList.toggle("dark-mode");
  }

  function atualizarPreviewArquivo(arquivo) {
    const nome = arquivo.name;
    const extensao = nome.split('.').pop().toLowerCase();
    fileText.style.display = "none";   // Esconde texto padrão
    fileName.style.display = "block";  // Mostra nome do arquivo
    fileName.textContent = nome;
    fileIcon.style.display = "block";  // Mostra ícone
    removeFileButton.style.display = "flex";  // Mostra botão de remover
    if (extensao === "pdf") {
      fileIcon.src = "assets/pdf-icon.png";
    } else if (extensao === "doc" || extensao === "docx") {
      fileIcon.src = "assets/docx-icon.png";
    } else if (extensao === "txt") {
      fileIcon.src = "assets/txt-icon.png";
    } else {
      fileIcon.src = "assets/unsupported-icon.png"; // Arquivo não suportado
    }
  }

  function resetarDropArea() {
    fileText.style.display = "block"; // Mostra texto padrão
    fileName.style.display = "none";  // Esconde nome de arquivo
    fileIcon.src = "assets/upload-icon.png"; // Volta para ícone de upload padrão
    fileIcon.style.display = "block";
    removeFileButton.style.display = "none"; // Esconde botão de remover
  }

  function mostrarErroUpload() {
    fileText.style.display = "block";
    fileName.style.display = "none";
    fileIcon.src = "assets/error-icon.png"; // Ícone de erro
    fileIcon.style.display = "block";
    removeFileButton.style.display = "none";
    mostrarFeedback("Erro ao enviar o arquivo. Tente novamente.", "#e57373");
  }

  function mostrarArquivoInvalido() {
    fileText.style.display = "block";
    fileName.style.display = "none";
    fileIcon.src = "assets/unsupported-icon.png"; // Ícone de arquivo inválido
    fileIcon.style.display = "block";
    removeFileButton.style.display = "none";
    mostrarFeedback("Tipo de arquivo inválido. Envie .pdf, .txt ou .docx.", "#e57373");
  }

  // ================================
  // Event Handlers
  // ================================

  // Remover arquivo selecionado
  removeFileButton.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    fileInput.value = "";
    resetarDropArea();
  });

  // Envio do formulário
  uploadForm.addEventListener("submit", function (e) {
    e.preventDefault();
    feedback.textContent = "";
    const arquivo = fileInput.files[0];
    if (!arquivo) {
      mostrarFeedback("Por favor, selecione um arquivo.", "#e57373");
      return;
    }
    if (!tiposPermitidos.includes(arquivo.type)) {
      mostrarArquivoInvalido();
      return;
    }
    const formData = new FormData();
    formData.append("file", arquivo);
    iniciarEnvio();

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }
        return res.text();
      })
      .then((html) => {
        document.open();
        document.write(html);
        document.close();
      })
      .catch((err) => {
        console.error(err);
        mostrarErroUpload();
      })
      .finally(finalizarEnvio);

  });

  // Drag & Drop
  dropArea.addEventListener("click", () => fileInput.click());

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = "#f5f0e8";
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.style.backgroundColor = "#f5f0e8";
  }); // Fecha o listener de dragleave

  // Evento ao soltar arquivos na área de drop
  dropArea.addEventListener("drop", (e) => {
    e.preventDefault(); // Impede o comportamento padrão do navegador
    dropArea.style.backgroundColor = "#f5f0e8"; // Restaura a cor de fundo
    const arquivos = e.dataTransfer.files; // Obtém os arquivos arrastados
    if (arquivos.length > 0) { // Se há pelo menos um arquivo
      fileInput.files = arquivos; // Define os arquivos no input de arquivo
      atualizarPreviewArquivo(arquivos[0]); // Atualiza o preview com o primeiro arquivo
    }
  });

  // Evento ao selecionar arquivo pelo input
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) { // Se há algum arquivo selecionado
      atualizarPreviewArquivo(fileInput.files[0]); // Atualiza o preview com o arquivo selecionado
    }
  });

  // Evento para alternar o tema claro/escuro
  toggleTheme.addEventListener("change", ativarModoEscuro); // Chama a função de alternância de tema
}); // Fecha o DOMContentLoaded


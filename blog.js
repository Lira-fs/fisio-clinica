// blog.js - Sistema de carregamento de posts do blog
// ================================================

class BlogManager {
  constructor() {
    this.apiUrl = "http://localhost:3000/posts"; // URL do backend
    this.maxPostsPerCategory = 3;
    this.posts = [];
    this.init();
  }

  async init() {
    console.log("🚀 Inicializando Blog Manager...");
    try {
      await this.loadPosts();
      this.renderAllCategories();
    } catch (error) {
      console.error("❌ Erro ao carregar posts:", error);
      this.showErrorMessage();
    }
  }

  async loadPosts() {
    const response = await fetch(this.apiUrl);
    if (!response.ok) throw new Error("Erro ao buscar posts");

    const posts = await response.json();
    this.posts = posts.sort((a, b) => new Date(b.data) - new Date(a.data));
    console.log(`✅ ${this.posts.length} posts carregados`);
  }

  renderAllCategories() {
    this.renderCategoryPosts("clinica", "clinica-posts");
    this.renderCategoryPosts("fisioterapia", "fisioterapia-posts");
    this.renderCategoryPosts("tratamentos", "tratamentos-posts");
  }

  renderCategoryPosts(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const categoryPosts = this.posts
      .filter((p) => p.categoria === category)
      .slice(0, this.maxPostsPerCategory);

    container.innerHTML = "";

    if (categoryPosts.length === 0) {
      container.innerHTML = this.getNoPostsHTML(category);
      return;
    }

    categoryPosts.forEach((post) => {
      const postElement = this.createPostCard(post);
      container.appendChild(postElement);
    });
  }

  createPostCard(post) {
    const article = document.createElement("article");
    article.className = "post-card fade-in";
    article.addEventListener("click", () => this.openPost(post));

    article.innerHTML = `
            <div class="post-image">
                ${
                  post.imagem
                    ? `<img src="${post.imagem}" alt="${post.titulo}">`
                    : `<div class="post-image-placeholder"><i class="fas fa-image"></i></div>`
                }
            </div>
            <div class="post-content">
                <span class="post-category ${
                  post.categoria
                }">${this.getCategoryLabel(post.categoria)}</span>
                <h3 class="post-title">${post.titulo}</h3>
                <p class="post-summary">${post.resumo}</p>
                <div class="post-date">
                    <i class="fas fa-calendar"></i>
                    ${this.formatDate(post.data)}
                </div>
            </div>
        `;

    return article;
  }

  getCategoryLabel(category) {
    const labels = {
      clinica: "Clínica",
      fisioterapia: "Fisioterapia",
      tratamentos: "Tratamentos",
    };
    return labels[category] || category;
  }

  formatDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  getNoPostsHTML(category) {
    const categoryLabels = {
      clinica: "da Clínica",
      fisioterapia: "de Fisioterapia",
      tratamentos: "de Tratamentos",
    };

    return `
            <div class="no-posts">
                <i class="fas fa-newspaper"></i>
                <h4>Nenhum post encontrado</h4>
                <p>Ainda não há notícias ${categoryLabels[category]} publicadas.</p>
            </div>
        `;
  }

  openPost(post) {
    this.showPostModal(post);
  }

  showPostModal(post) {
    const modal = document.createElement("div");
    modal.className = "post-modal-overlay";
    modal.innerHTML = `
            <div class="post-modal">
                <button class="post-modal-close"><i class="fas fa-times"></i></button>
                <div class="post-modal-content">
                    ${
                      post.imagem
                        ? `<img src="${post.imagem}" class="post-modal-image">`
                        : ""
                    }
                    <h1>${post.titulo}</h1>
                    <div class="post-modal-info">
                        <span><i class="fas fa-user"></i> ${
                          post.autor || "Equipe FISIO"
                        }</span>
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(
                          post.data
                        )}</span>
                    </div>
                    <div class="post-summary-modal">${post.resumo}</div>
                    <div class="post-content-modal">${
                      post.conteudo || "Conteúdo em breve..."
                    }</div>
                </div>
                <div class="post-modal-footer">
                    <a href="https://wa.me/5511999999999?text=Olá! Li o post '${
                      post.titulo
                    }' e gostaria de saber mais." class="btn btn-success" target="_blank">
                        <i class="fab fa-whatsapp"></i> Fale Conosco
                    </a>
                </div>
            </div>
        `;

    modal
      .querySelector(".post-modal-close")
      .addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    const observer = new MutationObserver(() => {
      if (!document.querySelector(".post-modal-overlay")) {
        document.body.style.overflow = "";
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
  }

  showErrorMessage() {
    ["clinica-posts", "fisioterapia-posts", "tratamentos-posts"].forEach(
      (containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h4>Erro ao carregar posts</h4>
                        <p>Não foi possível carregar o conteúdo do blog.</p>
                    </div>
                `;
        }
      }
    );
  }
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => new BlogManager());

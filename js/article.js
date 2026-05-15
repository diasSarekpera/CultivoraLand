/* ============================================================
   article.js — Chargement dynamique d'un article depuis le JSON
   Rendu sans titres de section — signaux visuels CSS uniquement
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ── Éléments du DOM ── */
  const titleEl    = document.getElementById("articleTitle");
  const contentEl  = document.getElementById("articleContent");
  const breadcrumb = document.getElementById("breadcrumb");
  const relatedEl  = document.getElementById("articleTags");

  /* ── Lecture de l'id dans l'URL ── */
  const params    = new URLSearchParams(window.location.search);
  const articleId = params.get("id");

  /* ── Pas d'id fourni ── */
  if (!articleId) {
    setError("Article introuvable", "Aucun identifiant d'article n'a été fourni dans l'URL.");
    return;
  }

  /* ── Chargement du JSON ── */
  fetch("/json/articles.json")
    .then(res => {
      if (!res.ok) throw new Error(`Réponse réseau inattendue : ${res.status}`);
      return res.json();
    })
    .then(data => {
      const article = data.find(item => item.id === articleId);
      if (!article) {
        setError("Article introuvable", "Cet article n'existe pas dans la base de données.");
        return;
      }
      renderArticle(article, data);
    })
    .catch(err => {
      setError("Erreur de chargement", "Impossible de charger les données. Veuillez réessayer.");
      console.error("[article.js] Erreur :", err);
    });


  /* ============================================================
     UTILITAIRE : convertit **texte** en <strong>texte</strong>
     et \n\n en séparateurs de paragraphes
  ============================================================ */
  function parseBold(text) {
    return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  /* Crée un <p> avec gestion du gras inline */
  function makeParagraph(text, className) {
    const p = document.createElement("p");
    if (className) p.className = className;
    p.innerHTML = parseBold(text);
    return p;
  }

  /* Divise un texte multi-lignes en plusieurs <p> */
  function appendMultiParagraph(container, rawText, className) {
    const chunks = rawText.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
    chunks.forEach(chunk => {
      /* Les lignes simples (\n) deviennent des <br> à l'intérieur du même <p> */
      const p = document.createElement("p");
      if (className) p.className = className;
      const lines = chunk.split(/\n/).map(l => parseBold(l.trim()));
      p.innerHTML = lines.join("<br>");
      container.appendChild(p);
    });
  }

  /* Séparateur visuel entre grandes sections */
  function makeDivider(type) {
    const div = document.createElement("div");
    div.className = type === "soft"
      ? "reading-section-divider reading-section-divider--soft"
      : "reading-section-divider";
    return div;
  }


  /* ============================================================
     RENDU PRINCIPAL
  ============================================================ */
  function renderArticle(article, allData) {

    /* ── Titre de l'onglet ── */
    document.title = `${article.shortTitle} — Cultivora Land`;

    /* ── Titre de l'article ── */
    titleEl.textContent = article.title;

    /* ── Fil d'Ariane ── */
    breadcrumb.innerHTML = `
      <a href="/index.html">Accueil</a>
      <span class="breadcrumb-sep">›</span>
      <a href="/05-pages/categories.html">Catégories</a>
      <span class="breadcrumb-sep">›</span>
      <a href="/05-pages/category/notions/index.html">${article.category}</a>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current">${article.shortTitle}</span>
    `;

    /* ── Vider le conteneur ── */
    contentEl.innerHTML = "";

    /* ────────────────────────────────────────────────────────
       1. INTRODUCTION — accroche + questions
    ──────────────────────────────────────────────────────── */
    if (article.intro) {
      if (article.intro.hook) {
        appendMultiParagraph(contentEl, article.intro.hook, "reading-card-hook");
      }

      if (Array.isArray(article.intro.questions) && article.intro.questions.length > 0) {
        const ul = document.createElement("ul");
        ul.className = "reading-card-questions";
        article.intro.questions.forEach(q => {
          const li = document.createElement("li");
          li.innerHTML = parseBold(q);
          ul.appendChild(li);
        });
        contentEl.appendChild(ul);
      }
    }

    /* ────────────────────────────────────────────────────────
       2. HISTOIRE — contexte narratif + dialogues
    ──────────────────────────────────────────────────────── */
    if (article.story) {
      contentEl.appendChild(makeDivider("soft"));

      const storyDiv = document.createElement("div");
      storyDiv.className = "reading-card-story";

      /* Contexte (texte narratif multi-paragraphes) */
      if (article.story.context) {
        appendMultiParagraph(storyDiv, article.story.context, "");
      }

      /* Dialogues */
      if (Array.isArray(article.story.dialogue)) {
        article.story.dialogue.forEach(line => {
          if (line.speaker === "Narrateur") {
            /* Narration entre dialogues — paragraphe italique sobre */
            const p = document.createElement("p");
            p.className = "reading-card-narration";
            p.innerHTML = parseBold(line.text);
            storyDiv.appendChild(p);
          } else {
            /* Réplique d'un personnage */
            const p = document.createElement("p");
            p.className = "reading-card-dialogue";
            p.innerHTML = `<strong class="reading-card-speaker">${line.speaker} :</strong> ${parseBold(line.text)}`;
            storyDiv.appendChild(p);
          }
        });
      }

      contentEl.appendChild(storyDiv);
    }

    /* ────────────────────────────────────────────────────────
       3. EXPLICATION — paragraphes avec mots-clés en gras
          Pas de titres de section — signal visuel par divider
    ──────────────────────────────────────────────────────── */
    if (Array.isArray(article.explanation) && article.explanation.length > 0) {
      contentEl.appendChild(makeDivider());

      const explanationDiv = document.createElement("div");
      explanationDiv.className = "reading-card-explanation";

      article.explanation.forEach(para => {
        explanationDiv.appendChild(makeParagraph(para, "reading-card-explanation__para"));
      });

      contentEl.appendChild(explanationDiv);
    }

    /* ────────────────────────────────────────────────────────
       4. ANALOGIE — bloc encadré, pas de titre
    ──────────────────────────────────────────────────────── */
    if (article.analogy) {
      const analogyDiv = document.createElement("div");
      analogyDiv.className = "reading-card-analogy";
      appendMultiParagraph(analogyDiv, article.analogy.text, "");
      contentEl.appendChild(analogyDiv);
    }

    /* ────────────────────────────────────────────────────────
       5. CONCLUSION
    ──────────────────────────────────────────────────────── */
    if (article.conclusion) {
      contentEl.appendChild(makeDivider("soft"));
      appendMultiParagraph(contentEl, article.conclusion, "reading-card-conclusion");
    }

    /* ────────────────────────────────────────────────────────
       6. CITATION
    ──────────────────────────────────────────────────────── */
    if (article.quote) {
      const quoteBlock = document.createElement("blockquote");
      quoteBlock.className = "reading-card-quote";
      quoteBlock.innerHTML = `
        <p>${parseBold(article.quote)}</p>
        <cite>— ${article.quoteAuthor || "Cultivora Land"}</cite>
      `;
      contentEl.appendChild(quoteBlock);
    }

    /* ── Marque Cultivora Land ── */
    const brand = document.createElement("p");
    brand.className = "reading-card-brand";
    brand.textContent = "Cultivora Land";
    contentEl.appendChild(brand);

    /* ────────────────────────────────────────────────────────
       7. NOTIONS ASSOCIÉES
    ──────────────────────────────────────────────────────── */
    relatedEl.innerHTML = "";

    if (Array.isArray(article.related) && article.related.length > 0) {
      article.related.forEach(relId => {
        const related = allData.find(item => item.id === relId);
        if (!related) return;
        const a = document.createElement("a");
        a.href      = `/05-pages/article.html?id=${related.id}`;
        a.className = "tag";
        a.textContent = related.shortTitle;
        relatedEl.appendChild(a);
      });
    } else {
      const relatedSection = relatedEl.closest("section");
      if (relatedSection) relatedSection.style.display = "none";
    }
  }


  /* ============================================================
     AFFICHAGE D'ERREUR
  ============================================================ */
  function setError(title, message) {
    document.title       = `${title} — Cultivora Land`;
    titleEl.textContent  = title;
    contentEl.innerHTML  = `<p>${message}</p>`;
    relatedEl.innerHTML  = "";
    breadcrumb.innerHTML = `<a href="/index.html">Accueil</a>`;
  }

});

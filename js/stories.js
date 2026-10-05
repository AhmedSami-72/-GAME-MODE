/**
 * Between Us ♾️ - Stories Universe Engine
 */

(function () {
  "use strict";

  window.BetweenUsStories = {
    activeCategory: "all",

    init() {
      this.bindCategoryTabs();
      this.renderStories();
      this.checkUrlParams();
    },

    getAllStories() {
      const defaultStories = (window.BetweenUsData && window.BetweenUsData.stories) || [];
      const customContent = (window.BetweenUsStorage && window.BetweenUsStorage.getCustomContent()) || [];

      const customStories = customContent
        .filter(c => c.type === "story")
        .map(c => ({
          id: c.id,
          category: "custom",
          title: c.title,
          origin: "حكايتنا الخاصة",
          intro: c.content.slice(0, 100) + "...",
          story: c.content,
          characters: ["نحن"],
          lessons: ["كل تجربة مشتركة تبني رصيدنا الأبدي."],
          discussion: ["إيه اللي اتعلمناه من الحكاية دي سوا؟"],
          tags: c.tags || ["قصة خاصة"]
        }));

      return [...customStories, ...defaultStories];
    },

    bindCategoryTabs() {
      document.querySelectorAll(".story-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          document.querySelectorAll(".story-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          this.activeCategory = tab.getAttribute("data-category") || "all";
          this.renderStories();
        });
      });

      const searchInput = document.getElementById("storiesSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", e => {
          this.renderStories(e.target.value.trim().toLowerCase());
        });
      }
    },

    renderStories(searchQuery = "") {
      const grid = document.getElementById("storiesGrid");
      if (!grid) return;

      let list = this.getAllStories();

      if (this.activeCategory !== "all") {
        list = list.filter(s => s.category === this.activeCategory);
      }

      if (searchQuery) {
        list = list.filter(s =>
          s.title.toLowerCase().includes(searchQuery) ||
          s.intro.toLowerCase().includes(searchQuery) ||
          s.story.toLowerCase().includes(searchQuery) ||
          (s.origin && s.origin.toLowerCase().includes(searchQuery))
        );
      }

      if (list.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 48px 16px; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 12px;">📖</div>
            <h4 style="color: var(--text-primary); margin-bottom: 6px;">لا توجد قصص في هذا التصنيف حالياً</h4>
            <p style="font-size: 0.9rem;">اختاروا تصنيفاً آخر، أو استمتعوا بقراءة قصص الأساطير والقصص الدينية الموثوقة.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = list.map(story => {
        const isFav = window.BetweenUsStorage.isFavorite(story.id);
        const originLabel = story.origin || "قصة خالدة";

        return `
          <div class="story-card" onclick="BetweenUsStories.openStoryReader('${story.id}')">
            <div class="story-card-body">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="story-category">${originLabel}</span>
                <button class="btn-card-action ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); BetweenUsStories.toggleFavorite('${story.id}')">
                  ${isFav ? '❤️' : '♡'}
                </button>
              </div>
              <h3 class="story-title" style="margin-top: 6px;">${story.title}</h3>
              <p class="story-intro">${story.intro}</p>
              <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-hairline); padding-top: 8px;">
                <span style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 600;">اقرأ القصة والنقاش ←</span>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${story.discussion ? story.discussion.length + ' أسئلة للنقاش' : ''}</span>
              </div>
            </div>
          </div>
        `;
      }).join("");
    },

    toggleFavorite(storyId) {
      const story = this.getAllStories().find(s => s.id === storyId);
      if (!story) return;

      const isNowFav = window.BetweenUsStorage.toggleFavorite({
        id: story.id,
        type: "story",
        title: story.title,
        category: story.category
      });

      this.renderStories();
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast(isNowFav ? "❤️ أُضيفت القصة للمفضلة" : "تم الحذف من المفضلة");
      }
    },

    openStoryReader(storyId) {
      const story = this.getAllStories().find(s => s.id === storyId);
      if (!story) return;

      const modal = document.getElementById("storyReaderModal");
      const content = document.getElementById("storyReaderContent");
      if (!modal || !content) {
        window.location.href = `stories.html?id=${storyId}`;
        return;
      }

      const charactersHtml = story.characters && story.characters.length
        ? `<div style="margin-bottom: 16px; font-size: 0.85rem; color: var(--text-muted);">
             <strong>الشخصيات:</strong> ${story.characters.join(" · ")}
           </div>`
        : "";

      const lessonsHtml = story.lessons && story.lessons.length
        ? `<div style="background: rgba(216, 178, 110, 0.08); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px 16px; margin: 20px 0;">
             <h4 style="font-size: 0.95rem; color: var(--accent-gold); margin-bottom: 8px;">العبر والدروس المستفادة:</h4>
             <ul style="padding-right: 20px; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
               ${story.lessons.map(l => `<li>${l}</li>`).join("")}
             </ul>
           </div>`
        : "";

      const discussionHtml = story.discussion && story.discussion.length
        ? `<div style="background: linear-gradient(135deg, rgba(104, 24, 38, 0.3) 0%, rgba(35, 31, 39, 0.8) 100%); border: 1px solid rgba(212, 122, 136, 0.35); border-radius: var(--radius-md); padding: 18px; margin: 24px 0;">
             <h4 style="font-size: 1.05rem; color: #FFFFFF; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
               <span>💬</span> طيب لو كنت مكان الشخصية؟
             </h4>
             <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">أسئلة ونقاط نقاش بينكم بعد قراءة القصة:</p>
             <div style="display: flex; flex-direction: column; gap: 10px;">
               ${story.discussion.map((q, idx) => `
                 <div style="padding: 10px 14px; background: rgba(0, 0, 0, 0.25); border-radius: var(--radius-sm); font-size: 0.92rem; color: var(--text-primary); line-height: 1.5;">
                   <strong style="color: var(--accent-gold);">${idx + 1}.</strong> ${q}
                 </div>
               `).join("")}
             </div>
           </div>`
        : "";

      content.innerHTML = `
        <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 600; margin-bottom: 6px;">
          ${story.origin || "حكاية عالمية"}
        </div>
        <h2 style="font-size: 1.55rem; color: var(--text-primary); margin-bottom: 12px; line-height: 1.35;">
          ${story.title}
        </h2>
        ${charactersHtml}
        <div style="font-size: 0.98rem; color: var(--text-primary); line-height: 1.85; white-space: pre-line; margin-bottom: 20px;">
          ${story.story}
        </div>
        ${lessonsHtml}
        ${discussionHtml}
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
          <button class="btn-primary" onclick="BetweenUsStorage.addToTalk('${story.title}', '${story.category}'); BetweenUsApp.showToast('📌 تم حفظ موضوع القصة في نتكلم فيه بعدين');">
            📌 نضيف مناقشتها لـ 'نتكلم فيه بعدين'
          </button>
          <button class="btn-secondary" onclick="BetweenUsStories.closeStoryReader()">
            إغلاق القصة
          </button>
        </div>
      `;

      modal.classList.add("active");
    },

    closeStoryReader() {
      const modal = document.getElementById("storyReaderModal");
      if (modal) modal.classList.remove("active");
    },

    checkUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const storyId = params.get("id");
      if (storyId) {
        setTimeout(() => this.openStoryReader(storyId), 200);
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.BetweenUsStories.init());
  } else {
    window.BetweenUsStories.init();
  }
})();

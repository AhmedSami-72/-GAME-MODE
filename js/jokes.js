/**
 * Between Us ♾️ - Jokes & Humor Universe Engine
 * Pure Vanilla JS, Mobile-First, Touch-Optimized (48px targets)
 */

(function () {
  "use strict";

  let currentCategory = "all";
  let searchQuery = "";
  let currentJokeIndex = 0;
  let showOnlyFavorites = false;

  // Joke Battle State
  let battleState = {
    active: false,
    currentRound: 1,
    currentTurn: "p1", // "p1" (Ahmed) reading, "p2" (Esraa) trying not to laugh
    currentJoke: null
  };

  const JokesApp = {
    init() {
      this.initDailyJoke();
      this.initCategoryTabs();
      this.initSearch();
      this.renderJokesList();
      this.initBattleStats();
      this.setupEventListeners();
    },

    getJokes() {
      return (window.BetweenUsJokesData && window.BetweenUsJokesData.jokes) || [];
    },

    // 1. Daily Joke (Deterministic based on date, stable on refresh)
    initDailyJoke() {
      const container = document.getElementById("dailyJokeCard");
      if (!container) return;

      const jokes = this.getJokes();
      if (jokes.length === 0) return;

      const now = new Date();
      const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      const dailyIndex = dateSeed % jokes.length;
      const dailyJoke = jokes[dailyIndex];

      const isFav = window.BetweenUsStorage.isFavorite(dailyJoke.id);
      const ratings = window.BetweenUsStorage.getJokeRatings();
      const userRating = ratings[dailyJoke.id];

      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span class="hero-evening-badge" style="background: rgba(216, 178, 110, 0.15); color: var(--accent-gold); border-color: var(--border-subtle);">
            😂 نكتة اليوم الحصرية
          </span>
          <div style="display: flex; gap: 8px;">
            <button class="btn-icon" onclick="BetweenUsJokes.copyJoke('${dailyJoke.id}')" title="نسخ النكتة" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;" aria-label="نسخ">
              📋
            </button>
            <button class="btn-icon" onclick="BetweenUsJokes.toggleFav('${dailyJoke.id}')" title="المفضلة" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px; color: ${isFav ? 'var(--accent-gold)' : 'var(--text-muted)'};" aria-label="المفضلة">
              ${isFav ? '★' : '☆'}
            </button>
          </div>
        </div>

        <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); line-height: 1.6; margin-bottom: 16px; white-space: pre-line;">
          ${dailyJoke.text}
        </div>

        <!-- Rating Section -->
        <div style="border-top: 1px solid var(--border-hairline); padding-top: 14px; margin-top: 14px;">
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">كيف كانت النكتة؟</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${this.renderRatingButtons(dailyJoke.id, userRating)}
          </div>
        </div>
      `;
    },

    // 2. Category Tabs
    initCategoryTabs() {
      const container = document.getElementById("jokeCategoryTabs");
      if (!container || !window.BetweenUsJokesData) return;

      const categories = window.BetweenUsJokesData.categories || [];
      const jokes = this.getJokes();

      container.innerHTML = `
        <button class="selector-tab ${showOnlyFavorites ? 'active' : ''}" onclick="BetweenUsJokes.toggleFavoritesFilter()">
          <span>❤️</span>
          <span>المفضلة</span>
        </button>
        ${categories.map(cat => {
          const count = cat.id === "all"
            ? jokes.length
            : jokes.filter(j => j.category === cat.id).length;
          
          return `
            <button class="selector-tab ${(!showOnlyFavorites && currentCategory === cat.id) ? 'active' : ''}" onclick="BetweenUsJokes.setCategory('${cat.id}')">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
              <span style="font-size: 0.75rem; opacity: 0.75; margin-right: 4px;">(${count})</span>
            </button>
          `;
        }).join("")}
      `;
    },

    setCategory(catId) {
      showOnlyFavorites = false;
      currentCategory = catId;
      this.initCategoryTabs();
      this.renderJokesList();
    },

    toggleFavoritesFilter() {
      showOnlyFavorites = !showOnlyFavorites;
      this.initCategoryTabs();
      this.renderJokesList();
    },

    // 3. Search
    initSearch() {
      const input = document.getElementById("jokeSearchInput");
      if (!input) return;

      input.addEventListener("input", e => {
        searchQuery = e.target.value.trim().toLowerCase();
        this.renderJokesList();
      });
    },

    // 4. Render Jokes List
    renderJokesList() {
      const container = document.getElementById("jokesFeedContainer");
      if (!container) return;

      const jokes = this.getJokes();
      let filtered = jokes;

      if (showOnlyFavorites) {
        filtered = filtered.filter(j => window.BetweenUsStorage.isFavorite(j.id));
      } else if (currentCategory !== "all") {
        filtered = filtered.filter(j => j.category === currentCategory);
      }

      if (searchQuery) {
        filtered = filtered.filter(j =>
          j.text.toLowerCase().includes(searchQuery) ||
          j.tags.some(t => t.toLowerCase().includes(searchQuery))
        );
      }

      const countLabel = document.getElementById("jokesCountLabel");
      if (countLabel) {
        countLabel.textContent = `عرض ${filtered.length} نكتة وموقف مضحك`;
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-hairline);">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">😂</div>
            <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">لا توجد نكت مطابقة</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">${showOnlyFavorites ? 'لم تقم بحفظ أي نكتة في المفضلة بعد. اضغط على رمز ★ لحفظ النكت المفضلة!' : 'جرب البحث بكلمة تانية أو اختيار تصنيف مختلف.'}</p>
          </div>
        `;
        return;
      }

      const ratings = window.BetweenUsStorage.getJokeRatings();

      container.innerHTML = filtered.map(joke => {
        const isFav = window.BetweenUsStorage.isFavorite(joke.id);
        const userRating = ratings[joke.id];

        return `
          <article class="topic-card" id="card-${joke.id}" style="margin-bottom: 16px; cursor: default;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <span class="topic-meta-tag" style="background: rgba(216, 178, 110, 0.12); color: var(--accent-gold); font-weight: 700;">
                ${this.getCategoryIcon(joke.category)} ${this.getCategoryName(joke.category)}
              </span>

              <div style="display: flex; gap: 6px; align-items: center;">
                <button class="btn-icon" onclick="BetweenUsJokes.copyJoke('${joke.id}')" title="نسخ النكتة" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;" aria-label="نسخ">
                  📋
                </button>
                <button class="btn-icon" onclick="BetweenUsJokes.toggleFav('${joke.id}')" title="المفضلة" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px; color: ${isFav ? 'var(--accent-gold)' : 'var(--text-muted)'};" aria-label="المفضلة">
                  ${isFav ? '★' : '☆'}
                </button>
              </div>
            </div>

            <div style="font-size: 1.18rem; font-weight: 600; color: var(--text-primary); line-height: 1.6; margin-bottom: 14px; white-space: pre-line;">
              ${joke.text}
            </div>

            <!-- Interactive Footer -->
            <div style="border-top: 1px solid var(--border-hairline); padding-top: 12px; margin-top: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                ${this.renderRatingButtons(joke.id, userRating)}
              </div>

              <button class="btn-secondary" onclick="BetweenUsJokes.scrollToNextJoke('${joke.id}')" style="min-height: 48px; padding: 0 16px; font-size: 0.88rem;">
                ➡️ نكتة تانية
              </button>
            </div>
          </article>
        `;
      }).join("");
    },

    renderRatingButtons(jokeId, currentRating) {
      const ratingOptions = [
        { id: "dead", emoji: "😂", label: "ميت من الضحك" },
        { id: "awesome", emoji: "🤣", label: "جامدة" },
        { id: "nice", emoji: "🙂", label: "حلوة" },
        { id: "normal", emoji: "😐", label: "عادية" },
        { id: "bad", emoji: "💀", label: "وحشة" }
      ];

      return ratingOptions.map(r => `
        <button onclick="BetweenUsJokes.rateJoke('${jokeId}', '${r.id}')" class="selector-tab ${currentRating === r.id ? 'active' : ''}" style="min-height: 48px; min-width: 48px; padding: 6px 12px; font-size: 0.85rem;" title="${r.label}">
          <span>${r.emoji}</span>
          <span style="font-size: 0.75rem; margin-right: 2px;">${r.label}</span>
        </button>
      `).join("");
    },

    rateJoke(jokeId, ratingId) {
      window.BetweenUsStorage.setJokeRating(jokeId, ratingId);
      this.initDailyJoke();
      this.renderJokesList();
      window.BetweenUsApp.showToast("✓ تم حفظ تقييمك للنكتة!");
    },

    getCategoryName(catId) {
      const cats = window.BetweenUsJokesData.categories || [];
      const found = cats.find(c => c.id === catId);
      return found ? found.name : "نكت";
    },

    getCategoryIcon(catId) {
      const cats = window.BetweenUsJokesData.categories || [];
      const found = cats.find(c => c.id === catId);
      return found ? found.icon : "😂";
    },

    toggleFav(jokeId) {
      const jokes = this.getJokes();
      const item = jokes.find(j => j.id === jokeId);
      if (!item) return;

      const isNowFav = window.BetweenUsStorage.toggleFavorite({
        id: item.id,
        type: "joke",
        title: item.text.substring(0, 50) + "...",
        category: item.category
      });

      this.initDailyJoke();
      this.renderJokesList();
      window.BetweenUsApp.showToast(isNowFav ? "★ تم الحفظ في المفضلة" : "تمت الإزالة من المفضلة");
    },

    copyJoke(jokeId) {
      const jokes = this.getJokes();
      const item = jokes.find(j => j.id === jokeId);
      if (!item) return;

      const text = `😂 نكتة من Between Us ♾️:\n"${item.text}"`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        window.BetweenUsApp.showToast("📋 تم نسخ النكتة!");
      }
    },

    scrollToNextJoke(currentId) {
      const jokes = this.getJokes();
      const idx = jokes.findIndex(j => j.id === currentId);
      if (idx !== -1 && idx + 1 < jokes.length) {
        const nextId = jokes[idx + 1].id;
        const el = document.getElementById(`card-${nextId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        this.pickRandomJoke();
      }
    },

    // 5. Random Joke Picker ("😂 اضحكنا")
    pickRandomJoke() {
      const jokes = this.getJokes();
      if (jokes.length === 0) return;

      const random = jokes[Math.floor(Math.random() * jokes.length)];

      const modal = document.getElementById("randomJokeModal");
      const content = document.getElementById("randomJokeModalContent");
      if (!modal || !content) return;

      const isFav = window.BetweenUsStorage.isFavorite(random.id);
      const ratings = window.BetweenUsStorage.getJokeRatings();
      const userRating = ratings[random.id];

      content.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700;">😂 اضحكنا · نكتة عشوائية</span>
          <button class="btn-icon" data-close-modal style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;">✕</button>
        </div>

        <div style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); line-height: 1.6; margin: 16px 0 24px; white-space: pre-line;">
          ${random.text}
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
          ${this.renderRatingButtons(random.id, userRating)}
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;">
          <button class="btn-secondary" onclick="BetweenUsJokes.copyJoke('${random.id}')" style="min-height: 48px; padding: 0 16px;">
            📋 نسخ
          </button>
          <button class="btn-secondary" onclick="BetweenUsJokes.toggleFav('${random.id}')" style="min-height: 48px; padding: 0 16px; color: ${isFav ? 'var(--accent-gold)' : 'var(--text-muted)'};">
            ${isFav ? '★ محفوظ' : '☆ حفظ'}
          </button>
          <button class="btn-primary" onclick="BetweenUsJokes.pickRandomJoke()" style="min-height: 48px; padding: 0 22px;">
            😂 اضحكنا بنكتة تانية
          </button>
        </div>
      `;

      window.BetweenUsApp.openModal("randomJokeModal");
    },

    // 6. Joke Battle ("😂 مين هيضحك الأول؟")
    initBattleStats() {
      const container = document.getElementById("jokeBattleStatsContainer");
      if (!container) return;

      const battle = window.BetweenUsStorage.getJokeBattle();
      const settings = window.BetweenUsStorage.getSettings();
      const p1 = settings.partner1 || "أحمد";
      const p2 = settings.partner2 || "إسراء";

      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700;">تحدي الصمود والضحك</div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">
              😂 مين هيضحك الأول؟
            </h3>
          </div>

          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="padding: 6px 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); text-align: center;">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">ضحك ${p1} أولاً</span>
              <span style="font-weight: 800; font-size: 1.1rem; color: var(--accent-rose);">${battle.p1LaughedFirst} مرات</span>
            </div>
            <div style="padding: 6px 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); text-align: center;">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">ضحك ${p2} أولاً</span>
              <span style="font-weight: 800; font-size: 1.1rem; color: var(--accent-gold);">${battle.p2LaughedFirst} مرات</span>
            </div>
          </div>
        </div>
      `;
    },

    startJokeBattle() {
      const jokes = this.getJokes();
      if (jokes.length === 0) return;

      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

      battleState = {
        active: true,
        currentRound: 1,
        currentTurn: "p1",
        currentJoke: randomJoke
      };

      this.renderBattleStep();
      window.BetweenUsApp.openModal("jokeBattleModal");
    },

    renderBattleStep() {
      const content = document.getElementById("jokeBattleModalContent");
      if (!content) return;

      const settings = window.BetweenUsStorage.getSettings();
      const p1 = settings.partner1 || "أحمد";
      const p2 = settings.partner2 || "إسراء";

      const reader = battleState.currentTurn === "p1" ? p1 : p2;
      const listener = battleState.currentTurn === "p1" ? p2 : p1;

      content.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <span class="hero-evening-badge" style="background: rgba(104, 24, 38, 0.4); color: var(--accent-rose);">
            😂 جولة التحدي #${battleState.currentRound}
          </span>
          <button class="btn-icon" data-close-modal style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;">✕</button>
        </div>

        <div style="text-align: center; margin-bottom: 16px; padding: 10px; background: rgba(216, 178, 110, 0.1); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.9rem; color: var(--accent-gold); font-weight: 700;">
            🗣️ <strong>${reader}</strong> يقرأ النكتة بصوت واضح
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
            🤫 <strong>${listener}</strong> ممنوع يبتسم أو يضحك تماماً!
          </div>
        </div>

        <div style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); line-height: 1.6; margin: 20px 0; text-align: center; white-space: pre-line;">
          ${battleState.currentJoke.text}
        </div>

        <div style="border-top: 1px solid var(--border-hairline); padding-top: 16px; margin-top: 20px;">
          <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); text-align: center; margin-bottom: 12px;">
            مين ضحك الأول في الجولة دي؟ 😂
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr)); gap: 10px;">
            <button class="btn-primary" onclick="BetweenUsJokes.recordBattleRound('p1', '${p1}')" style="min-height: 48px; font-size: 0.95rem;">
              😂 ${p1} ضحك الأول
            </button>
            <button class="btn-primary" onclick="BetweenUsJokes.recordBattleRound('p2', '${p2}')" style="min-height: 48px; font-size: 0.95rem;">
              😂 ${p2} ضحكت الأولى
            </button>
            <button class="btn-secondary" onclick="BetweenUsJokes.nextBattleRound()" style="min-height: 48px; font-size: 0.9rem;">
              😐 محدش ضحك! (نكتة تانية)
            </button>
          </div>
        </div>
      `;
    },

    recordBattleRound(loserKey, loserName) {
      window.BetweenUsStorage.recordJokeBattle(loserKey, loserName, battleState.currentJoke.text);
      this.initBattleStats();

      const content = document.getElementById("jokeBattleModalContent");
      if (!content) return;

      content.innerHTML = `
        <div style="text-align: center; padding: 24px 10px;">
          <div style="font-size: 3.5rem; margin-bottom: 10px;">😂</div>
          <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 8px;">
            😂 ${loserName} مَقِدرش يمسك نفسه وضحك!
          </h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 24px;">
            تم تسجيل النقطة في سجل التحدي المشترك!
          </p>

          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" onclick="BetweenUsJokes.nextBattleRound()" style="min-height: 48px; padding: 0 22px;">
              🔄 الجولة التالية وتبديل الأدوار
            </button>
            <button class="btn-secondary" data-close-modal style="min-height: 48px; padding: 0 18px;">
              إنهاء التحدي
            </button>
          </div>
        </div>
      `;
    },

    nextBattleRound() {
      const jokes = this.getJokes();
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

      battleState.currentRound += 1;
      battleState.currentTurn = battleState.currentTurn === "p1" ? "p2" : "p1";
      battleState.currentJoke = randomJoke;

      this.renderBattleStep();
    },

    setupEventListeners() {
      document.addEventListener("jokeBattleUpdated", () => this.initBattleStats());
      document.addEventListener("favoritesUpdated", () => {
        this.initDailyJoke();
        this.renderJokesList();
      });
    }
  };

  window.BetweenUsJokes = JokesApp;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => JokesApp.init());
  } else {
    JokesApp.init();
  }
})();

/**
 * Between Us ♾️ - Core Application Engine
 * Shell logic, UI initialization, Settings, Modals, Daily Discovery, Unified "هات حاجة" Engine,
 * Share Manager, Favorite Manager, Evening Session Generator, and Clean Navigation.
 */

(function () {
  "use strict";

  // Anti-repeat memory for "هات حاجة"
  const seenContentIds = new Set();
  let currentActiveHatHagaItem = null;

  window.BetweenUsApp = {
    init() {
      this.applyThemeAndSettings();
      this.initTopNav();
      this.initMobileDrawer();
      this.initModals();
      this.initDailyDiscovery();
      this.initSurpriseButtons();
      this.initGlobalSearch();
      this.initCustomContentForm();
      this.initSettingsModal();
      this.setupEventListeners();
    },

    // Navigation: Back Button Helper
    goBack() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    },

    // Mobile Navigation Drawer (All Sections / كل الأقسام)
    initMobileDrawer() {
      let drawer = document.getElementById("mobileMenuDrawer");
      if (!drawer) {
        drawer = document.createElement("div");
        drawer.id = "mobileMenuDrawer";
        drawer.className = "mobile-drawer-overlay";
        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

        drawer.innerHTML = `
          <div class="mobile-drawer-panel">
            <div class="drawer-header">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">Between Us</span>
                <span style="color: var(--accent-gold); font-size: 1.25rem;">♾️</span>
              </div>
              <button class="btn-icon drawer-close-btn" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;" aria-label="إغلاق القائمة">✕</button>
            </div>
            
            <div style="margin-bottom: 16px; padding: 10px 14px; background: rgba(216, 178, 110, 0.1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); text-align: center;">
              <span class="greeting-names" style="font-size: 0.95rem; font-weight: 700; color: var(--accent-gold);">أهلاً بكم ♾️</span>
            </div>

            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; padding-right: 4px;">الأقسام الرئيسية:</div>
            <nav class="drawer-links" style="margin-bottom: 16px;">
              <a href="index.html" class="drawer-link ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">
                <span class="drawer-link-icon">🏠</span>
                <span>الرئيسية</span>
              </a>
              <a href="topics.html" class="drawer-link ${currentPage === 'topics.html' ? 'active' : ''}">
                <span class="drawer-link-icon">💬</span>
                <span>نتكلم (مواضيع وأسئلة)</span>
              </a>
              <a href="games.html" class="drawer-link ${currentPage === 'games.html' ? 'active' : ''}">
                <span class="drawer-link-icon">🎮</span>
                <span>نلعب (ألعاب وتحديات)</span>
              </a>
              <a href="stories.html" class="drawer-link ${currentPage === 'stories.html' ? 'active' : ''}">
                <span class="drawer-link-icon">📚</span>
                <span>نحكي (قصص وحكايات)</span>
              </a>
              <a href="favorites.html" class="drawer-link ${currentPage === 'favorites.html' ? 'active' : ''}">
                <span class="drawer-link-icon">❤️</span>
                <span>المحفوظات والسجل</span>
              </a>
            </nav>

            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; padding-right: 4px;">عالم الاستكشاف والضحك:</div>
            <nav class="drawer-links">
              <a href="riddles.html" class="drawer-link ${currentPage === 'riddles.html' ? 'active' : ''}">
                <span class="drawer-link-icon">🧩</span>
                <span>الفوازير والألغاز</span>
              </a>
              <a href="jokes.html" class="drawer-link ${currentPage === 'jokes.html' ? 'active' : ''}">
                <span class="drawer-link-icon">😂</span>
                <span>النكت والضحك</span>
              </a>
              <a href="universes.html" class="drawer-link ${currentPage === 'universes.html' ? 'active' : ''}">
                <span class="drawer-link-icon">🏡</span>
                <span>عوالم الحياة وبيتنا</span>
              </a>
              <a href="movies.html" class="drawer-link ${currentPage === 'movies.html' ? 'active' : ''}">
                <span class="drawer-link-icon">🎬</span>
                <span>أفلام وسينما</span>
              </a>
              <a href="memories.html" class="drawer-link ${currentPage === 'memories.html' ? 'active' : ''}">
                <span class="drawer-link-icon">⏳</span>
                <span>صندوق الذكريات</span>
              </a>
            </nav>

            <div style="border-top: 1px solid var(--border-hairline); padding-top: 14px; margin-top: auto; display: flex; flex-direction: column; gap: 8px;">
              <button class="drawer-link" onclick="BetweenUsApp.openHatHaga();" style="color: var(--accent-gold);">
                <span class="drawer-link-icon">🎲</span>
                <span>هات حاجة (اختيار عشوائي)</span>
              </button>
              <button class="drawer-link" data-open-modal="settingsModal">
                <span class="drawer-link-icon">⚙️</span>
                <span>إعدادات التطبيق والمظهر</span>
              </button>
              <button class="drawer-link" onclick="BetweenUsApp.toggleTheme();">
                <span class="drawer-link-icon">🌓</span>
                <span>تبديل المظهر (داكن / فاتح)</span>
              </button>
            </div>
          </div>
        `;
        document.body.appendChild(drawer);

        drawer.addEventListener("click", e => {
          if (e.target === drawer || e.target.closest(".drawer-close-btn")) {
            drawer.classList.remove("active");
          }
        });

        drawer.querySelectorAll(".drawer-link").forEach(link => {
          link.addEventListener("click", () => {
            drawer.classList.remove("active");
          });
        });
      }

      document.querySelectorAll(".btn-menu-drawer-trigger").forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          if (drawer) drawer.classList.add("active");
        });
      });
    },

    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      const settings = window.BetweenUsStorage.getSettings();
      settings.theme = nextTheme;
      window.BetweenUsStorage.saveSettings(settings);
      this.applyThemeAndSettings();
      this.showToast(`تم التبديل للمظهر ${nextTheme === 'dark' ? 'الداكن' : 'الفاتح'}`);
    },

    // 1. Theme & Personalization
    applyThemeAndSettings() {
      const settings = window.BetweenUsStorage.getSettings();
      document.documentElement.setAttribute("data-theme", settings.theme || "dark");
      document.body.setAttribute("data-motion", settings.motion !== false ? "true" : "false");

      const p1 = settings.partner1 || "أحمد";
      const p2 = settings.partner2 || "إسراء";

      document.querySelectorAll(".partner-names-label").forEach(el => {
        el.textContent = `${p1} & ${p2}`;
      });

      document.querySelectorAll(".greeting-names").forEach(el => {
        el.textContent = `أهلاً ${p1} و${p2} ♾️`;
      });
    },

    // 2. Active Nav Link Detection (Standard 5 Core Tabs)
    initTopNav() {
      const currentPath = window.location.pathname;
      const currentPage = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

      document.querySelectorAll(".nav-link, .bottom-nav-item").forEach(link => {
        const href = link.getAttribute("href");
        if (href && (href === currentPage || (currentPage === "" && href === "index.html"))) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    },

    // 3. Daily Discovery Engine (Stable by date)
    initDailyDiscovery() {
      const discoveryBox = document.getElementById("dailyDiscoveryContent");
      if (!discoveryBox || !window.BetweenUsData) return;

      const now = new Date();
      const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      const allTopics = window.BetweenUsData.topics || [];
      if (allTopics.length === 0) return;

      const topicIndex = dateSeed % allTopics.length;
      const dailyTopic = allTopics[topicIndex];
      const isFav = window.BetweenUsStorage.isFavorite(dailyTopic.id);

      discoveryBox.innerHTML = `
        <div class="discovery-kicker">✦ اكتشاف الليلة · ${dailyTopic.tags.slice(0, 3).join(" · ")}</div>
        <h3 class="discovery-title">${dailyTopic.title}</h3>
        <p class="discovery-body">${dailyTopic.description}</p>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button class="btn-primary" onclick="BetweenUsApp.openTopicSession('${dailyTopic.id}')" style="min-height: 48px; padding: 0 22px; font-size: 0.95rem;">
            ابدأ نقاش الليلة →
          </button>
          <button class="btn-secondary" onclick="BetweenUsStorage.addToTalk('${dailyTopic.title}', '${dailyTopic.category}'); BetweenUsApp.showToast('📌 تم حفظ الموضوع في نتكلم فيه بعدين');" style="min-height: 48px; padding: 0 16px; font-size: 0.9rem;">
            📌 بعدين
          </button>
          <button class="btn-icon" onclick="BetweenUsApp.shareContent({ title: '${dailyTopic.title.replace(/'/g, "\\'")}', text: '${dailyTopic.description.replace(/'/g, "\\'")}' })" title="مشاركة" aria-label="مشاركة">
            🔗
          </button>
        </div>
      `;
    },

    // 4. "هات حاجة" - Unified Primary Random Content Engine (Core Loop)
    initSurpriseButtons() {
      // Any button with class .btn-surprise-trigger or .btn-hat-haga opens unified Hat Haga
      document.querySelectorAll(".btn-surprise-trigger, .btn-hat-haga, .btn-boredom-trigger").forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          const filter = btn.getAttribute("data-filter") || "all";
          this.openHatHaga(filter);
        });
      });

      // Duration buttons for "اعمل لنا سهرة"
      document.querySelectorAll("[data-evening-duration]").forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          const mins = parseInt(btn.getAttribute("data-evening-duration"), 10) || 15;
          this.startEveningSession(mins);
        });
      });

      document.querySelectorAll(".btn-evening-generator-trigger").forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.startEveningSession(15);
        });
      });
    },

    // Collect all unified items across every data universe
    getAllContentPool(filter = "all") {
      const data = window.BetweenUsData || {};
      const riddles = (window.BetweenUsRiddlesData && window.BetweenUsRiddlesData.riddles) || [];
      const jokes = (window.BetweenUsJokesData && window.BetweenUsJokesData.jokes) || [];
      const pool = [];

      // 1. Topics (مواضيع)
      if (filter === "all" || filter === "topic" || filter === "topics") {
        (data.topics || []).forEach(t => {
          pool.push({
            id: t.id,
            type: "topic",
            typeLabel: "💬 موضوع نقاش",
            icon: "💬",
            title: t.title,
            body: t.description,
            subtext: `يشمل ${t.questions ? t.questions.length : 5} أسئلة متدرجة بعمق`,
            link: `topics.html?id=${t.id}`,
            openAction: `BetweenUsApp.openTopicSession('${t.id}')`,
            openLabel: "ابدأ النقاش الآن →"
          });
        });
      }

      // 2. Riddles (فوازير)
      if (filter === "all" || filter === "riddle" || filter === "riddles") {
        riddles.forEach(r => {
          pool.push({
            id: r.id,
            type: "riddle",
            typeLabel: "🧩 فزورة ولغز",
            icon: "🧩",
            title: r.question,
            body: `💡 تلميح: ${r.hint}`,
            subtext: `الصعوبة: ${r.difficulty === 'easy' ? 'سهلة' : (r.difficulty === 'hard' ? 'صعبة' : 'متوسطة')}`,
            link: "riddles.html",
            answer: r.answer,
            explanation: r.explanation,
            openAction: `window.location.href='riddles.html'`,
            openLabel: "افتح الفوازير →"
          });
        });
      }

      // 3. Jokes (نكت)
      if (filter === "all" || filter === "joke" || filter === "jokes") {
        jokes.forEach(j => {
          pool.push({
            id: j.id,
            type: "joke",
            typeLabel: "😂 نكتة وموقف",
            icon: "😂",
            title: j.text,
            body: "ابتسموا وفرفشوا سوا!",
            subtext: j.tags ? j.tags.join(" · ") : "ضحك ومواقف",
            link: "jokes.html",
            openAction: `window.location.href='jokes.html'`,
            openLabel: "المزيد من النكت →"
          });
        });
      }

      // 4. Stories (قصص)
      if (filter === "all" || filter === "story" || filter === "stories") {
        (data.stories || []).forEach(s => {
          pool.push({
            id: s.id,
            type: "story",
            typeLabel: "📖 قصة ملهمة",
            icon: "📖",
            title: s.title,
            body: s.intro,
            subtext: `المصدر: ${s.source || 'تراث وفكر'}`,
            link: `stories.html?id=${s.id}`,
            openAction: `window.location.href='stories.html?id=${s.id}'`,
            openLabel: "اقرأ القصة كاملة →"
          });
        });
      }

      // 5. Games & WYR (ألعاب)
      if (filter === "all" || filter === "game" || filter === "games") {
        (data.wouldYouRather || []).forEach(w => {
          pool.push({
            id: w.id,
            type: "game",
            typeLabel: "🎮 لعبة: لو خيروك",
            icon: "🎮",
            title: `${w.scenarioA}\nأَم\n${w.scenarioB}`,
            body: "كل واحد فيكم يختار ويقول السبب!",
            subtext: "لعبة التوافق واكتشاف التفضيلات",
            link: "games.html",
            openAction: `window.location.href='games.html'`,
            openLabel: "العب في ساحة الألعاب →"
          });
        });

        (data.challenges || []).forEach(c => {
          pool.push({
            id: c.id,
            type: "game",
            typeLabel: "🎯 تحدي اللحظة",
            icon: "🎯",
            title: c.title,
            body: c.action,
            subtext: "تحدي فوري للاتنين",
            link: "games.html",
            openAction: `window.location.href='games.html'`,
            openLabel: "المزيد من التحديات →"
          });
        });
      }

      // 6. Movies (سينما)
      if (filter === "all" || filter === "movie" || filter === "movies") {
        (data.movies || []).forEach(m => {
          pool.push({
            id: m.id,
            type: "movie",
            typeLabel: "🎬 نقاش سينمائي",
            icon: "🎬",
            title: `${m.title} (${m.year || ''})`,
            body: m.story,
            subtext: `النوع: ${m.genre || 'دراما'} · إخراج: ${m.director || ''}`,
            link: `movies.html?id=${m.id}`,
            openAction: `window.location.href='movies.html?id=${m.id}'`,
            openLabel: "افتح أسئلة الفيلم →"
          });
        });
      }

      return pool;
    },

    // Unified "هات حاجة" Modal Launcher
    openHatHaga(filter = "all") {
      let pool = this.getAllContentPool(filter);
      if (pool.length === 0) {
        pool = this.getAllContentPool("all");
      }

      // Filter out recently seen items to avoid repetition
      let freshPool = pool.filter(item => !seenContentIds.has(item.id));
      if (freshPool.length === 0) {
        seenContentIds.clear();
        freshPool = pool;
      }

      const randomItem = freshPool[Math.floor(Math.random() * freshPool.length)];
      if (!randomItem) return;

      seenContentIds.add(randomItem.id);
      currentActiveHatHagaItem = randomItem;

      this.renderHatHagaModal(randomItem, filter);
      this.openModal("hatHagaModal");
    },

    renderHatHagaModal(item, currentFilter) {
      let modal = document.getElementById("hatHagaModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "hatHagaModal";
        modal.className = "modal-overlay";
        document.body.appendChild(modal);
      }

      const isFav = window.BetweenUsStorage.isFavorite(item.id);

      modal.innerHTML = `
        <div class="modal-box" style="max-width: 620px; text-align: right;">
          <!-- Top Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; border-bottom: 1px solid var(--border-hairline); padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">🎲</span>
              <span style="font-size: 1.1rem; font-weight: 800; color: var(--accent-gold);">هات حاجة!</span>
            </div>
            <button class="btn-icon" data-close-modal style="width: 44px; height: 44px; min-width: 44px; min-height: 44px;" aria-label="إغلاق">✕</button>
          </div>

          <!-- Filter Pills -->
          <div class="pill-selector" style="margin-bottom: 18px; padding-bottom: 6px;">
            <button class="selector-tab ${currentFilter === 'all' ? 'active' : ''}" onclick="BetweenUsApp.openHatHaga('all')" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">🎲 الكل</button>
            <button class="selector-tab ${currentFilter === 'topic' ? 'active' : ''}" onclick="BetweenUsApp.openHatHaga('topic')" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">💬 مواضيع</button>
            <button class="selector-tab ${currentFilter === 'riddle' ? 'active' : ''}" onclick="BetweenUsApp.openHatHaga('riddle')" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">🧩 فوازير</button>
            <button class="selector-tab ${currentFilter === 'joke' ? 'active' : ''}" onclick="BetweenUsApp.openHatHaga('joke')" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">😂 نكت</button>
            <button class="selector-tab ${currentFilter === 'story' ? 'active' : ''}" onclick="BetweenUsApp.openHatHaga('story')" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">📖 قصص</button>
            <button class="selector-tab ${currentFilter === 'game' ? 'active' : ''}" onclick="BetweenUsApp.openHatHaga('game')" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">🎮 ألعاب</button>
            <button class="selector-tab ${currentFilter === 'movie' ? 'active' : ''}" onclick="BetweenUsApp.openHatHaga('movie')" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">🎬 سينما</button>
          </div>

          <!-- Main Content Card -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 22px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="hero-evening-badge" style="background: rgba(216, 178, 110, 0.15); color: var(--accent-gold);">
                ${item.typeLabel}
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${item.subtext || ''}</span>
            </div>

            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); line-height: 1.5; margin-bottom: 12px; white-space: pre-line;">
              ${item.title}
            </h3>

            <p style="font-size: 0.96rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 16px;">
              ${item.body}
            </p>

            ${item.answer ? `
              <!-- Riddle Reveal inside Hat Haga -->
              <div id="hathaga-riddle-answer" style="display: none; padding: 12px 14px; background: rgba(216, 178, 110, 0.12); border: 1px solid var(--accent-gold); border-radius: var(--radius-md); margin-bottom: 14px;">
                <div style="font-weight: 800; color: var(--accent-gold); margin-bottom: 4px;">💡 الحل: ${item.answer}</div>
                ${item.explanation ? `<div style="font-size: 0.88rem; color: var(--text-secondary);">${item.explanation}</div>` : ''}
              </div>
              <button id="hathaga-reveal-btn" class="btn-secondary" onclick="document.getElementById('hathaga-riddle-answer').style.display='block'; this.style.display='none';" style="min-height: 44px; padding: 0 16px; font-size: 0.88rem; margin-bottom: 14px;">
                🔐 اكشف الحل
              </button>
            ` : ''}

            <!-- Primary Action for Item -->
            <div>
              <button class="btn-primary" onclick="${item.openAction}" style="width: 100%; min-height: 48px; font-size: 0.95rem;">
                ${item.openLabel}
              </button>
            </div>
          </div>

          <!-- Bottom Unified Actions -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <button id="hathaga-fav-btn" class="btn-icon ${isFav ? 'active' : ''}" onclick="BetweenUsApp.toggleHatHagaFav()" title="حفظ في المفضلة" style="width: 48px; height: 48px; color: ${isFav ? 'var(--accent-gold)' : 'var(--text-muted)'};" aria-label="حفظ">
                ${isFav ? '★' : '☆'}
              </button>
              <button class="btn-icon" onclick="BetweenUsStorage.addToTalk('${item.title.replace(/'/g, "\\'")}', '${item.type}'); BetweenUsApp.showToast('📌 تم حفظها في نتكلم فيه بعدين');" title="نتكلم فيه بعدين" aria-label="نتكلم فيه بعدين">
                📌
              </button>
              <button class="btn-icon" onclick="BetweenUsApp.shareContent({ title: '${item.title.replace(/'/g, "\\'")}', text: '${item.body.replace(/'/g, "\\'")}' })" title="مشاركة" aria-label="مشاركة">
                🔗
              </button>
            </div>

            <button class="btn-gold" onclick="BetweenUsApp.openHatHaga('${currentFilter}')" style="min-height: 48px; padding: 0 22px; font-size: 0.95rem;">
              🎲 التالي (هات حاجة تانية) →
            </button>
          </div>
        </div>
      `;

      // Re-init close listeners
      modal.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", () => modal.classList.remove("active"));
      });
      modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.remove("active");
      });
    },

    toggleHatHagaFav() {
      if (!currentActiveHatHagaItem) return;
      const item = currentActiveHatHagaItem;
      const isFav = window.BetweenUsStorage.toggleFavorite({
        id: item.id,
        type: item.type,
        title: item.title
      });

      const btn = document.getElementById("hathaga-fav-btn");
      if (btn) {
        btn.classList.toggle("active", isFav);
        btn.style.color = isFav ? "var(--accent-gold)" : "var(--text-muted)";
        btn.textContent = isFav ? "★" : "☆";
      }

      this.showToast(isFav ? "★ تم الحفظ في المفضلة" : "تمت الإزالة من المفضلة");
    },

    // 5. Unified Share System (Web Share API + Clipboard Fallback)
    shareContent({ title, text, url }) {
      const shareData = {
        title: title ? `Between Us ♾️ | ${title}` : "Between Us ♾️",
        text: text ? `"${title ? title + '\n\n' : ''}${text}"\n\n— من تطبيق Between Us ♾️` : "Between Us ♾️",
        url: url || window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {
          // If cancelled or failed, fallback to copy
          this.copyToClipboard(shareData.text);
        });
      } else {
        this.copyToClipboard(shareData.text);
      }
    },

    copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast("📋 تم نسخ المحتوى للمشاركة بنجاح!");
        }).catch(() => {
          this.fallbackCopyText(text);
        });
      } else {
        this.fallbackCopyText(text);
      }
    },

    fallbackCopyText(text) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        this.showToast("📋 تم نسخ المحتوى للمشاركة!");
      } catch (err) {
        this.showToast("تعذر النسخ التلقائي");
      }
      document.body.removeChild(ta);
    },

    // 6. Interactive Evening Session Generator (5, 15, 30, 60 minutes)
    startEveningSession(minutes = 15) {
      const data = window.BetweenUsData || {};
      const topics = data.topics || [];
      const stories = data.stories || [];
      const riddles = (window.BetweenUsRiddlesData && window.BetweenUsRiddlesData.riddles) || [];
      const jokes = (window.BetweenUsJokesData && window.BetweenUsJokesData.jokes) || [];
      const wyr = data.wouldYouRather || [];

      let modal = document.getElementById("eveningSessionModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "eveningSessionModal";
        modal.className = "modal-overlay";
        document.body.appendChild(modal);
      }

      // Build program based on minutes
      const randomTopic = topics[Math.floor(Math.random() * topics.length)] || { title: "نقاش الليلة", questions: ["سؤال محبة"] };
      const randomStory = stories[Math.floor(Math.random() * stories.length)] || { title: "قصة الليلة", intro: "حكاية ملهمة" };
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)] || { text: "نكتة لابتسامة الليلة" };
      const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)] || { question: "فزورة الليلة" };
      const randomWyr = wyr[Math.floor(Math.random() * wyr.length)] || { scenarioA: "الخيار الأول", scenarioB: "الخيار الثاني" };

      let stepsHtml = "";

      if (minutes <= 5) {
        stepsHtml = `
          <div class="evening-step-item">
            <span class="step-num">1</span>
            <div>
              <div class="step-title">💬 سؤال نقاش سريع ودافي</div>
              <div class="step-desc">${randomTopic.questions ? randomTopic.questions[0] : randomTopic.title}</div>
            </div>
          </div>
          <div class="evening-step-item">
            <span class="step-num">2</span>
            <div>
              <div class="step-title">😂 نكتة للضحك وفرفشة اللحظة</div>
              <div class="step-desc">${randomJoke.text}</div>
            </div>
          </div>
        `;
      } else if (minutes <= 15) {
        stepsHtml = `
          <div class="evening-step-item">
            <span class="step-num">1</span>
            <div>
              <div class="step-title">📖 قصة قصيرة دافئة</div>
              <div class="step-desc"><strong>${randomStory.title}</strong>: ${randomStory.intro}</div>
            </div>
          </div>
          <div class="evening-step-item">
            <span class="step-num">2</span>
            <div>
              <div class="step-title">💬 موضوع نقاش وسؤال عميق</div>
              <div class="step-desc"><strong>${randomTopic.title}</strong>: ${randomTopic.questions ? randomTopic.questions[0] : ''}</div>
            </div>
          </div>
          <div class="evening-step-item">
            <span class="step-num">3</span>
            <div>
              <div class="step-title">🎮 لعبة سريعة: لو خيروك</div>
              <div class="step-desc">${randomWyr.scenarioA} <strong>أَم</strong> ${randomWyr.scenarioB}</div>
            </div>
          </div>
          <div class="evening-step-item">
            <span class="step-num">4</span>
            <div>
              <div class="step-title">😂 نكتة مسك الختام</div>
              <div class="step-desc">${randomJoke.text}</div>
            </div>
          </div>
        `;
      } else {
        stepsHtml = `
          <div class="evening-step-item">
            <span class="step-num">1</span>
            <div>
              <div class="step-title">📖 قصة ملهمة للحوار</div>
              <div class="step-desc"><strong>${randomStory.title}</strong>: ${randomStory.intro}</div>
            </div>
          </div>
          <div class="evening-step-item">
            <span class="step-num">2</span>
            <div>
              <div class="step-title">💬 جلسة نقاش متكاملة</div>
              <div class="step-desc"><strong>${randomTopic.title}</strong> (${randomTopic.questions ? randomTopic.questions.length : 5} أسئلة)</div>
            </div>
          </div>
          <div class="evening-step-item">
            <span class="step-num">3</span>
            <div>
              <div class="step-title">🧩 فزورة ذكاء وتحدي</div>
              <div class="step-desc">${randomRiddle.question}</div>
            </div>
          </div>
          <div class="evening-step-item">
            <span class="step-num">4</span>
            <div>
              <div class="step-title">🎮 لعبة لو خيروك</div>
              <div class="step-desc">${randomWyr.scenarioA} <strong>أَم</strong> ${randomWyr.scenarioB}</div>
            </div>
          </div>
          <div class="evening-step-item">
            <span class="step-num">5</span>
            <div>
              <div class="step-title">😂 نكتة وضحك للختام</div>
              <div class="step-desc">${randomJoke.text}</div>
            </div>
          </div>
        `;
      }

      modal.innerHTML = `
        <div class="modal-box" style="max-width: 640px; text-align: right;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid var(--border-hairline); padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">🌙</span>
              <span style="font-size: 1.15rem; font-weight: 800; color: var(--accent-gold);">سهرة بيننا الليلة (${minutes} دقيقة)</span>
            </div>
            <button class="btn-icon" data-close-modal style="width: 44px; height: 44px; min-width: 44px; min-height: 44px;">✕</button>
          </div>

          <!-- Duration Selector Pills -->
          <div class="pill-selector" style="margin-bottom: 16px; padding-bottom: 6px;">
            <button class="selector-tab ${minutes === 5 ? 'active' : ''}" onclick="BetweenUsApp.startEveningSession(5)" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">⚡ 5 دقائق</button>
            <button class="selector-tab ${minutes === 15 ? 'active' : ''}" onclick="BetweenUsApp.startEveningSession(15)" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">🌙 15 دقيقة</button>
            <button class="selector-tab ${minutes === 30 ? 'active' : ''}" onclick="BetweenUsApp.startEveningSession(30)" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">✨ 30 دقيقة</button>
            <button class="selector-tab ${minutes === 60 ? 'active' : ''}" onclick="BetweenUsApp.startEveningSession(60)" style="min-height: 40px; padding: 6px 14px; font-size: 0.85rem;">🔥 ساعة كاملة</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; max-height: 55vh; overflow-y: auto;">
            ${stepsHtml}
          </div>

          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" onclick="BetweenUsApp.openTopicSession('${randomTopic.id}')" style="min-height: 48px; padding: 0 24px; font-size: 0.95rem;">
              ابدأ السهرة الآن →
            </button>
            <button class="btn-secondary" onclick="BetweenUsApp.startEveningSession(${minutes})" style="min-height: 48px; padding: 0 18px; font-size: 0.9rem;">
              🎲 ولّد سهرة جديدة
            </button>
          </div>
        </div>
      `;

      modal.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", () => modal.classList.remove("active"));
      });
      modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.remove("active");
      });

      this.openModal("eveningSessionModal");
    },

    // 7. Global Search Engine (Topics, Stories, Movies, WYR, Riddles, Jokes)
    initGlobalSearch() {
      const searchInputs = document.querySelectorAll(".global-search-input");
      const resultsContainer = document.getElementById("globalSearchResults");

      searchInputs.forEach(input => {
        input.addEventListener("input", e => {
          const query = e.target.value.trim().toLowerCase();
          if (!query || query.length < 2) {
            if (resultsContainer) resultsContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 24px;">اكتب كلمتين للبحث في كل مواضيع، وقصص، وفوازير، ونكت، وأفلام بيننا...</div>';
            return;
          }
          this.executeGlobalSearch(query, resultsContainer);
        });
      });
    },

    executeGlobalSearch(query, container) {
      if (!container) return;
      const data = window.BetweenUsData || {};
      const riddles = (window.BetweenUsRiddlesData && window.BetweenUsRiddlesData.riddles) || [];
      const jokes = (window.BetweenUsJokesData && window.BetweenUsJokesData.jokes) || [];
      const matches = [];

      (data.topics || []).forEach(t => {
        if (t.title.includes(query) || t.description.includes(query) || t.tags.some(tag => tag.includes(query))) {
          matches.push({ type: "موضوع نقاش", title: t.title, link: `topics.html?id=${t.id}`, desc: t.description });
        }
      });

      riddles.forEach(r => {
        if (r.question.includes(query) || r.answer.includes(query) || (r.explanation && r.explanation.includes(query)) || r.tags.some(t => t.includes(query))) {
          matches.push({ type: "فزورة ولغز", title: r.question, link: `riddles.html`, desc: `الحل: ${r.answer}` });
        }
      });

      jokes.forEach(j => {
        if (j.text.includes(query) || j.tags.some(t => t.includes(query))) {
          matches.push({ type: "نكتة وموقف", title: j.text.substring(0, 50) + "...", link: `jokes.html`, desc: j.text });
        }
      });

      (data.stories || []).forEach(s => {
        if (s.title.includes(query) || s.intro.includes(query) || s.story.includes(query)) {
          matches.push({ type: "قصة", title: s.title, link: `stories.html?id=${s.id}`, desc: s.intro });
        }
      });

      (data.movies || []).forEach(m => {
        if (m.title.includes(query) || m.story.includes(query)) {
          matches.push({ type: "فيلم / مسلسل", title: m.title, link: `movies.html?id=${m.id}`, desc: m.story });
        }
      });

      if (matches.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">لم نجد نتائج مطابقة لـ "${query}". جرب كلمة أخرى...</div>`;
        return;
      }

      container.innerHTML = matches.slice(0, 20).map(m => `
        <a href="${m.link}" class="search-result-item" style="display: block; padding: 12px 14px; background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); margin-bottom: 8px; transition: border-color 0.2s; text-decoration: none;">
          <div style="font-size: 0.78rem; color: var(--accent-gold); font-weight: 600;">${m.type}</div>
          <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 3px 0;">${m.title}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${m.desc}</div>
        </a>
      `).join("");
    },

    // 8. Custom Content Form
    initCustomContentForm() {
      const form = document.getElementById("addCustomContentForm");
      if (!form) return;

      form.addEventListener("submit", e => {
        e.preventDefault();
        const type = document.getElementById("customType").value;
        const title = document.getElementById("customTitle").value;
        const content = document.getElementById("customText").value;
        const tags = (document.getElementById("customTags").value || "").split(",").map(t => t.trim()).filter(Boolean);

        if (!title.trim() || !content.trim()) {
          this.showToast("من فضلك اكتب عنواناً ومحتوى للمشاركة");
          return;
        }

        window.BetweenUsStorage.addCustomContent({
          type,
          title,
          content,
          tags
        });

        form.reset();
        this.closeModal("addCustomModal");
        this.showToast("✨ تمت إضافة مشاركتكم بنجاح!");
      });
    },

    // 9. Settings Modal
    initSettingsModal() {
      const p1Input = document.getElementById("settingsPartner1");
      const p2Input = document.getElementById("settingsPartner2");
      const themeSelect = document.getElementById("settingsTheme");
      const motionToggle = document.getElementById("settingsMotion");

      if (p1Input && p2Input) {
        const settings = window.BetweenUsStorage.getSettings();
        p1Input.value = settings.partner1;
        p2Input.value = settings.partner2;
        if (themeSelect) themeSelect.value = settings.theme || "dark";
        if (motionToggle) motionToggle.checked = settings.motion !== false;
      }

      const saveBtn = document.getElementById("saveSettingsBtn");
      if (saveBtn) {
        saveBtn.addEventListener("click", () => {
          window.BetweenUsStorage.saveSettings({
            partner1: p1Input.value.trim() || "أحمد",
            partner2: p2Input.value.trim() || "إسراء",
            theme: themeSelect ? themeSelect.value : "dark",
            motion: motionToggle ? motionToggle.checked : true
          });
          this.applyThemeAndSettings();
          this.closeModal("settingsModal");
          this.showToast("✓ تم حفظ الإعدادات بنجاح");
        });
      }

      // Export Data
      const exportBtn = document.getElementById("exportDataBtn");
      if (exportBtn) {
        exportBtn.addEventListener("click", () => {
          window.BetweenUsStorage.exportAllData();
          this.showToast("📥 تم تصدير بياناتكم بأمان");
        });
      }

      // Import Data
      const importInput = document.getElementById("importDataInput");
      if (importInput) {
        importInput.addEventListener("change", e => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = ev => {
            const res = window.BetweenUsStorage.importData(ev.target.result);
            if (res.success) {
              this.showToast("✓ تم استيراد البيانات بنجاح!");
              setTimeout(() => window.location.reload(), 1000);
            } else {
              this.showToast("❌ فشل استيراد الملف: صيغة غير صالحة");
            }
          };
          reader.readAsText(file);
        });
      }

      // Reset Data
      const resetBtn = document.getElementById("resetDataBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (confirm("هل أنتم متأكدون من رغبتكم في إعادة ضبط كل البيانات والذكريات المحفوظة؟")) {
            window.BetweenUsStorage.resetAll();
            this.showToast("تمت إعادة ضبط البيانات");
            setTimeout(() => window.location.reload(), 800);
          }
        });
      }
    },

    // Modal Helpers
    initModals() {
      document.querySelectorAll("[data-open-modal]").forEach(trigger => {
        trigger.addEventListener("click", e => {
          e.preventDefault();
          const target = trigger.getAttribute("data-open-modal");
          this.openModal(target);
        });
      });

      document.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", () => {
          const overlay = btn.closest(".modal-overlay");
          if (overlay) overlay.classList.remove("active");
        });
      });

      document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", e => {
          if (e.target === overlay) {
            overlay.classList.remove("active");
          }
        });
      });
    },

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        const firstInput = modal.querySelector("input, select, textarea");
        if (firstInput) setTimeout(() => firstInput.focus(), 150);
      }
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove("active");
    },

    // Toast Notification (No alerts)
    showToast(message, duration = 3000) {
      let container = document.querySelector(".toast-container");
      if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
      }

      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = message;
      container.appendChild(toast);

      requestAnimationFrame(() => toast.classList.add("show"));

      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 260);
      }, duration);
    },

    // Topic Session Launcher
    openTopicSession(topicId) {
      if (window.BetweenUsTopics && typeof window.BetweenUsTopics.startSession === "function") {
        window.BetweenUsTopics.startSession(topicId);
      } else {
        window.location.href = `topics.html?session=${topicId}`;
      }
    },

    setupEventListeners() {
      document.addEventListener("settingsUpdated", () => this.applyThemeAndSettings());
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.BetweenUsApp.init());
  } else {
    window.BetweenUsApp.init();
  }
})();

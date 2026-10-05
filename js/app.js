/**
 * Between Us ♾️ - Core Application Engine
 * Shell logic, UI initialization, Settings, Modals, Daily Discovery, Search & Surprise Engine.
 */

(function () {
  "use strict";

  // Global App Namespace
  window.BetweenUsApp = {
    init() {
      this.applyThemeAndSettings();
      this.initTopNav();
      this.initMobileDrawer();
      this.initModals();
      this.initDailyDiscovery();
      this.initSurpriseButton();
      this.initGlobalSearch();
      this.initCustomContentForm();
      this.initSettingsModal();
      this.setupEventListeners();
    },

    // Mobile Navigation Drawer (Sidebar / Sheet for ☰ button)
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

            <nav class="drawer-links">
              <a href="index.html" class="drawer-link ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">
                <span class="drawer-link-icon">🏠</span>
                <span>الرئيسية</span>
              </a>
              <a href="topics.html" class="drawer-link ${currentPage === 'topics.html' ? 'active' : ''}">
                <span class="drawer-link-icon">💬</span>
                <span>مواضيع النقاش والأسئلة</span>
              </a>
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
              <a href="stories.html" class="drawer-link ${currentPage === 'stories.html' ? 'active' : ''}">
                <span class="drawer-link-icon">📖</span>
                <span>قصص ملهمة وحكايات</span>
              </a>
              <a href="games.html" class="drawer-link ${currentPage === 'games.html' ? 'active' : ''}">
                <span class="drawer-link-icon">🎮</span>
                <span>ألعاب وتحديات الزوجين</span>
              </a>
              <a href="movies.html" class="drawer-link ${currentPage === 'movies.html' ? 'active' : ''}">
                <span class="drawer-link-icon">🎬</span>
                <span>أفلام ومسلسلات للنقاش</span>
              </a>
              <a href="memories.html" class="drawer-link ${currentPage === 'memories.html' ? 'active' : ''}">
                <span class="drawer-link-icon">⏳</span>
                <span>ذكرياتنا وخريطة الطريق</span>
              </a>
              <a href="favorites.html" class="drawer-link ${currentPage === 'favorites.html' ? 'active' : ''}">
                <span class="drawer-link-icon">⭐</span>
                <span>المفضلة وما تم حفظه</span>
              </a>
            </nav>

            <div style="border-top: 1px solid var(--border-hairline); padding-top: 14px; margin-top: auto; display: flex; flex-direction: column; gap: 8px;">
              <button class="drawer-link btn-surprise-trigger" style="color: var(--accent-gold);">
                <span class="drawer-link-icon">🎲</span>
                <span>فاجئنا بلحظة عشوائية</span>
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

      // Update personalized names throughout the UI
      const p1 = settings.partner1 || "أحمد";
      const p2 = settings.partner2 || "إسراء";

      document.querySelectorAll(".partner-names-label").forEach(el => {
        el.textContent = `${p1} & ${p2}`;
      });

      document.querySelectorAll(".greeting-names").forEach(el => {
        el.textContent = `أهلاً ${p1} و${p2} ♾️`;
      });
    },

    // 2. Active Nav Link Detection
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

    // 3. Daily Discovery Engine (Deterministic based on date, stable on refresh)
    initDailyDiscovery() {
      const discoveryBox = document.getElementById("dailyDiscoveryContent");
      if (!discoveryBox || !window.BetweenUsData) return;

      const now = new Date();
      // Generate day index from year, month, date
      const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      const allTopics = window.BetweenUsData.topics || [];
      if (allTopics.length === 0) return;

      const topicIndex = dateSeed % allTopics.length;
      const dailyTopic = allTopics[topicIndex];

      discoveryBox.innerHTML = `
        <div class="discovery-kicker">✦ اكتشاف الليلة · ${dailyTopic.tags.join(" · ")}</div>
        <h3 class="discovery-title">${dailyTopic.title}</h3>
        <p class="discovery-body">${dailyTopic.description}</p>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button class="btn-primary" onclick="BetweenUsApp.openTopicSession('${dailyTopic.id}')" style="min-height: 48px; min-width: 48px; padding: 0 20px; font-size: 0.95rem;">
            ابدأ نقاش الليلة →
          </button>
          <button class="btn-secondary" onclick="BetweenUsStorage.addToTalk('${dailyTopic.title}', '${dailyTopic.category}'); BetweenUsApp.showToast('📌 تم حفظ الموضوع في نتكلم فيه بعدين');" style="min-height: 48px; min-width: 48px; padding: 0 18px; font-size: 0.9rem;">
            📌 نتكلم فيه بعدين
          </button>
        </div>
      `;
    },

    // 4. Surprise Engine ("✦ Surprise Us & زهقانين؟ هات حاجة")
    initSurpriseButton() {
      const surpriseBtns = document.querySelectorAll(".btn-surprise-trigger");
      surpriseBtns.forEach(btn => {
        btn.addEventListener("click", () => this.triggerSurprise());
      });

      const boredomBtns = document.querySelectorAll(".btn-boredom-trigger");
      boredomBtns.forEach(btn => {
        btn.addEventListener("click", () => this.openBoredomSurprise());
      });

      const laughNightBtns = document.querySelectorAll(".btn-laugh-night-trigger");
      laughNightBtns.forEach(btn => {
        btn.addEventListener("click", () => this.openLaughNightSession());
      });
    },

    triggerSurprise() {
      const data = window.BetweenUsData || {};
      const riddles = (window.BetweenUsRiddlesData && window.BetweenUsRiddlesData.riddles) || [];
      const jokes = (window.BetweenUsJokesData && window.BetweenUsJokesData.jokes) || [];

      // Pick randomly across: topics, stories, movies, wouldYouRather, riddles, jokes, challenges
      const pool = [];

      if (data.topics) {
        data.topics.forEach(t => pool.push({ type: "موضوع نقاش", title: t.title, desc: t.description, id: t.id, actionType: "topic" }));
      }
      if (data.stories) {
        data.stories.forEach(s => pool.push({ type: "قصة ملهمة", title: s.title, desc: s.intro, id: s.id, actionType: "story" }));
      }
      if (data.movies) {
        data.movies.forEach(m => pool.push({ type: "نقاش سينمائي", title: m.title, desc: m.story, id: m.id, actionType: "movie" }));
      }
      if (data.challenges) {
        data.challenges.forEach(c => pool.push({ type: "تحدي اللحظة", title: c.title, desc: c.action, id: c.id, actionType: "challenge" }));
      }
      if (data.wouldYouRather) {
        data.wouldYouRather.forEach(w => pool.push({ type: "لو خيروك", title: `${w.scenarioA} أَم ${w.scenarioB}`, desc: "اختاروا وشوفوا هل اختياراتكم هتتفق؟", id: w.id, actionType: "game" }));
      }
      if (riddles.length > 0) {
        riddles.slice(0, 30).forEach(r => pool.push({ type: "فزورة ذكاء", title: r.question, desc: `تلميح: ${r.hint}`, id: r.id, actionType: "riddle" }));
      }
      if (jokes.length > 0) {
        jokes.slice(0, 30).forEach(j => pool.push({ type: "نكتة وضحك", title: j.text, desc: "اضحكوا وفرفشوا سوا!", id: j.id, actionType: "joke" }));
      }

      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      if (!randomItem) return;

      const modal = document.getElementById("surpriseModal");
      const content = document.getElementById("surpriseModalContent");
      if (!modal || !content) return;

      content.innerHTML = `
        <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 600; margin-bottom: 8px;">
          ✦ مفاجأة الليلة · ${randomItem.type}
        </div>
        <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--text-primary); line-height: 1.4; white-space: pre-line;">
          ${randomItem.title}
        </h3>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
          ${randomItem.desc}
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary" onclick="BetweenUsApp.handleSurpriseAction('${randomItem.actionType}', '${randomItem.id}')" style="min-height: 48px; padding: 0 22px;">
            يلا نخوض التجربة →
          </button>
          <button class="btn-secondary" onclick="BetweenUsApp.triggerSurprise()" style="min-height: 48px; padding: 0 18px;">
            🎲 اختر حاجة تانية
          </button>
        </div>
      `;

      this.openModal("surpriseModal");
    },

    // "زهقانين؟ هات حاجة" (Picks randomly from Topics, Stories, Games, Riddles, Jokes, Challenges, Movies, Memories)
    openBoredomSurprise() {
      const data = window.BetweenUsData || {};
      const riddles = (window.BetweenUsRiddlesData && window.BetweenUsRiddlesData.riddles) || [];
      const jokes = (window.BetweenUsJokesData && window.BetweenUsJokesData.jokes) || [];
      const memories = window.BetweenUsStorage.getMemories() || [];

      const universePicks = [
        { type: "😂 نكتة للضحك", link: "jokes.html", action: "نكتة", icon: "😂", text: jokes.length ? jokes[Math.floor(Math.random() * jokes.length)].text : "مرة واحد..." },
        { type: "🧩 فزورة تفكير", link: "riddles.html", action: "فزورة", icon: "🧩", text: riddles.length ? riddles[Math.floor(Math.random() * riddles.length)].question : "شيء كلما أخذت منه كبر..." },
        { type: "💬 موضوع نقاش دافي", link: "topics.html", action: "موضوع", icon: "💬", text: data.topics ? data.topics[Math.floor(Math.random() * data.topics.length)].title : "نقاش عن طموحاتنا" },
        { type: "📖 قصة ملهمة", link: "stories.html", action: "قصة", icon: "📖", text: data.stories ? data.stories[Math.floor(Math.random() * data.stories.length)].title : "حكاية من التاريخ" },
        { type: "🎮 لعبة سريعة", link: "games.html", action: "لعبة", icon: "🎮", text: "لعبة ده ولا ده أو مين يعرف التاني أكتر؟" },
        { type: "🎬 نقاش سينمائي", link: "movies.html", action: "فيلم", icon: "🎬", text: data.movies ? data.movies[Math.floor(Math.random() * data.movies.length)].title : "فيلم الليلة" },
        { type: "📸 ذكرى من صندوقنا", link: "memories.html", action: "ذكريات", icon: "📸", text: memories.length ? memories[Math.floor(Math.random() * memories.length)].title : "أول كلمة كتبناها لبعض" }
      ];

      const item = universePicks[Math.floor(Math.random() * universePicks.length)];

      const modal = document.getElementById("surpriseModal");
      const content = document.getElementById("surpriseModalContent");
      if (!modal || !content) return;

      content.innerHTML = `
        <div style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 8px;">
          🎲 زهقانين؟ هات حاجة · ${item.icon} ${item.type}
        </div>
        <h3 style="font-size: 1.3rem; margin-bottom: 14px; color: var(--text-primary); line-height: 1.5; white-space: pre-line;">
          ${item.text}
        </h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 24px;">
          اختارنا لكم هذا الاقتراح لكسر الروتين فوراً والاستمتاع باللحظة!
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <a href="${item.link}" class="btn-primary" style="min-height: 48px; padding: 0 24px; text-decoration: none; display: inline-flex; align-items: center;">
            يلا نجربها سوا →
          </a>
          <button class="btn-secondary" onclick="BetweenUsApp.openBoredomSurprise()" style="min-height: 48px; padding: 0 18px;">
            🎲 هات حاجة تانية
          </button>
        </div>
      `;

      this.openModal("surpriseModal");
    },

    // "سهرة الضحك" (Combination Mode: Joke -> Riddle -> Joke -> Game -> Detective -> Joke -> Couple question)
    openLaughNightSession() {
      const riddles = (window.BetweenUsRiddlesData && window.BetweenUsRiddlesData.riddles) || [];
      const jokes = (window.BetweenUsJokesData && window.BetweenUsJokesData.jokes) || [];
      const topics = (window.BetweenUsData && window.BetweenUsData.topics) || [];
      const detective = riddles.filter(r => r.category === "detective" || r.isDetective);

      const joke1 = jokes[Math.floor(Math.random() * jokes.length)] || { text: "نكتة افتتاحية" };
      const riddle1 = riddles[Math.floor(Math.random() * riddles.length)] || { question: "فزورة ذكاء" };
      const joke2 = jokes[Math.floor(Math.random() * jokes.length)] || { text: "نكتة تانية" };
      const detectiveCase = detective.length ? detective[Math.floor(Math.random() * detective.length)] : riddle1;
      const joke3 = jokes[Math.floor(Math.random() * jokes.length)] || { text: "نكتة ختامية" };
      const coupleTopic = topics.find(t => t.category === "about-us") || (topics[0] || { title: "سؤال قرب ومحبة" });

      const modal = document.getElementById("surpriseModal");
      const content = document.getElementById("surpriseModalContent");
      if (!modal || !content) return;

      content.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span class="hero-evening-badge" style="background: rgba(216, 178, 110, 0.15); color: var(--accent-gold);">
            ✨ برنامج: سهرة الضحك والفرفشة
          </span>
          <button class="btn-icon" data-close-modal style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;">✕</button>
        </div>

        <h3 style="font-size: 1.3rem; margin-bottom: 14px; color: var(--text-primary);">
          سهرة كوميدية متكاملة للاتنين 😂🧩
        </h3>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; text-align: right;">
          <div style="padding: 10px 14px; background: rgba(255, 255, 255, 0.04); border-radius: var(--radius-md); border: 1px solid var(--border-hairline);">
            <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">1. نكتة البداية للابتسامة 😂</div>
            <div style="font-size: 0.95rem; color: var(--text-primary); margin-top: 4px;">${joke1.text}</div>
          </div>

          <div style="padding: 10px 14px; background: rgba(255, 255, 255, 0.04); border-radius: var(--radius-md); border: 1px solid var(--border-hairline);">
            <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">2. فزورة ذكاء وتحدي 🧩</div>
            <div style="font-size: 0.95rem; color: var(--text-primary); margin-top: 4px;">${riddle1.question}</div>
          </div>

          <div style="padding: 10px 14px; background: rgba(255, 255, 255, 0.04); border-radius: var(--radius-md); border: 1px solid var(--border-hairline);">
            <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">3. نكتة مواقف وسرعة بديهة 😂</div>
            <div style="font-size: 0.95rem; color: var(--text-primary); margin-top: 4px;">${joke2.text}</div>
          </div>

          <div style="padding: 10px 14px; background: rgba(255, 255, 255, 0.04); border-radius: var(--radius-md); border: 1px solid var(--border-hairline);">
            <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">4. قضية الليلة وتحقيق الذكاء 🕵️</div>
            <div style="font-size: 0.95rem; color: var(--text-primary); margin-top: 4px;">${detectiveCase.question}</div>
          </div>

          <div style="padding: 10px 14px; background: rgba(255, 255, 255, 0.04); border-radius: var(--radius-md); border: 1px solid var(--border-hairline);">
            <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">5. نكتة مسك الختام 😂</div>
            <div style="font-size: 0.95rem; color: var(--text-primary); margin-top: 4px;">${joke3.text}</div>
          </div>

          <div style="padding: 10px 14px; background: rgba(216, 178, 110, 0.1); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">6. سؤال محبة ودفء للختام ❤️</div>
            <div style="font-size: 0.95rem; color: var(--text-primary); margin-top: 4px;">${coupleTopic.title}</div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <a href="jokes.html" class="btn-primary" style="min-height: 48px; padding: 0 20px; text-decoration: none; display: inline-flex; align-items: center;">
            افتح عالم النكت ←
          </a>
          <a href="riddles.html" class="btn-secondary" style="min-height: 48px; padding: 0 18px; text-decoration: none; display: inline-flex; align-items: center;">
            افتح عالم الفوازير ←
          </a>
        </div>
      `;

      this.openModal("surpriseModal");
    },

    handleSurpriseAction(actionType, id) {
      this.closeModal("surpriseModal");
      if (actionType === "topic") {
        this.openTopicSession(id);
      } else if (actionType === "story") {
        window.location.href = `stories.html?id=${id}`;
      } else if (actionType === "movie") {
        window.location.href = `movies.html?id=${id}`;
      } else if (actionType === "game") {
        window.location.href = `games.html`;
      } else if (actionType === "challenge") {
        window.location.href = `games.html#challenges`;
      } else if (actionType === "riddle") {
        window.location.href = `riddles.html`;
      } else if (actionType === "joke") {
        window.location.href = `jokes.html`;
      }
    },

    // 5. Global Search Engine (Across Topics, Stories, Movies, WYR, Riddles, and Jokes)
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

      // Search Topics
      (data.topics || []).forEach(t => {
        if (t.title.includes(query) || t.description.includes(query) || t.tags.some(tag => tag.includes(query))) {
          matches.push({ type: "موضوع نقاش", title: t.title, link: `topics.html?id=${t.id}`, desc: t.description });
        }
      });

      // Search Riddles
      riddles.forEach(r => {
        if (r.question.includes(query) || r.answer.includes(query) || (r.explanation && r.explanation.includes(query)) || r.tags.some(t => t.includes(query))) {
          matches.push({ type: "فزورة ولغز", title: r.question, link: `riddles.html`, desc: `الحل: ${r.answer}` });
        }
      });

      // Search Jokes
      jokes.forEach(j => {
        if (j.text.includes(query) || j.tags.some(t => t.includes(query))) {
          matches.push({ type: "نكتة وموقف", title: j.text.substring(0, 50) + "...", link: `jokes.html`, desc: j.text });
        }
      });

      // Search Stories
      (data.stories || []).forEach(s => {
        if (s.title.includes(query) || s.intro.includes(query) || s.story.includes(query)) {
          matches.push({ type: "قصة", title: s.title, link: `stories.html?id=${s.id}`, desc: s.intro });
        }
      });

      // Search Movies
      (data.movies || []).forEach(m => {
        if (m.title.includes(query) || m.story.includes(query)) {
          matches.push({ type: "فيلم / مسلسل", title: m.title, link: `movies.html?id=${m.id}`, desc: m.story });
        }
      });

      // Search Would You Rather & This or That
      (data.wouldYouRather || []).forEach(w => {
        if (w.scenarioA.includes(query) || w.scenarioB.includes(query)) {
          matches.push({ type: "لو خيروك", title: `${w.scenarioA} أم ${w.scenarioB}`, link: `games.html`, desc: "لعبة لو خيروك" });
        }
      });

      if (matches.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">لم نجد نتائج مطابقة لـ "${query}". جرب كلمة أخرى مثل: سفر، حب، ذكاء، قهوة...</div>`;
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

    // 6. Add Custom Content Modal
    initCustomContentForm() {
      const form = document.getElementById("addCustomContentForm");
      if (!form) return;

      form.addEventListener("submit", e => {
        e.preventDefault();
        const type = document.getElementById("customType").value;
        const title = document.getElementById("customTitle").value;
        const content = document.getElementById("customText").value;
        const tags = document.getElementById("customTags").value.split(",").map(t => t.trim()).filter(Boolean);

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
        this.showToast("✨ تمت إضافة مشاركتكم الجميلة بنجاح!");
      });
    },

    // 7. Settings Modal
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
          const updated = window.BetweenUsStorage.saveSettings({
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

    // Toast Notification
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

      // Trigger reflow for transition
      requestAnimationFrame(() => toast.classList.add("show"));

      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 260);
      }, duration);
    },

    // Open Topic Session (Delegates to topics.js or redirects)
    openTopicSession(topicId) {
      if (window.BetweenUsTopics && typeof window.BetweenUsTopics.startSession === "function") {
        window.BetweenUsTopics.startSession(topicId);
      } else {
        window.location.href = `topics.html?session=${topicId}`;
      }
    },

    // Riddles Data Accessor & Fetch Engine
    getRiddles(category = "all", query = "") {
      const data = (window.BetweenUsRiddlesData && window.BetweenUsRiddlesData.riddles) || [];
      let list = data;
      if (category && category !== "all") {
        list = list.filter(r => r.category === category);
      }
      if (query) {
        const q = query.trim().toLowerCase();
        list = list.filter(r =>
          r.question.toLowerCase().includes(q) ||
          r.answer.toLowerCase().includes(q) ||
          (r.explanation && r.explanation.toLowerCase().includes(q)) ||
          r.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return list;
    },

    getRiddleById(id) {
      const all = this.getRiddles();
      return all.find(r => r.id === id) || null;
    },

    getDailyRiddle() {
      const all = this.getRiddles();
      if (all.length === 0) return null;
      const now = new Date();
      const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      return all[dateSeed % all.length];
    },

    getRandomRiddle(category = "all") {
      const pool = this.getRiddles(category);
      if (pool.length === 0) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    },

    getDetectiveRiddles() {
      return this.getRiddles().filter(r => r.category === "detective" || r.isDetective);
    },

    getRiddleCategories() {
      return (window.BetweenUsRiddlesData && window.BetweenUsRiddlesData.categories) || [];
    },

    setupEventListeners() {
      // Re-apply settings on storage update
      document.addEventListener("settingsUpdated", () => this.applyThemeAndSettings());
    }
  };

  // Launch on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.BetweenUsApp.init());
  } else {
    window.BetweenUsApp.init();
  }
})();

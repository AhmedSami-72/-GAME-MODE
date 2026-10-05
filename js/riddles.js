/**
 * Between Us ♾️ - Riddles & Puzzles Universe Engine
 * Pure Vanilla JS, Mobile-First, Touch-Optimized (48px targets)
 */

(function () {
  "use strict";

  let currentCategory = "all";
  let searchQuery = "";
  let revealedAnswers = new Set();
  let revealedHints = {}; // { [riddleId]: 1 or 2 }

  // Game Mode State
  let gameState = {
    active: false,
    questions: [],
    currentIndex: 0,
    score: 0,
    selectedOption: null,
    answered: false
  };

  const RiddlesApp = {
    init() {
      this.initDailyRiddle();
      this.initStreakBanner();
      this.initCategoryTabs();
      this.initSearch();
      this.renderRiddlesList();
      this.initDetectiveSection();
      this.setupEventListeners();
    },

    getRiddles() {
      if (window.BetweenUsApp && typeof window.BetweenUsApp.getRiddles === "function") {
        return window.BetweenUsApp.getRiddles();
      }
      return (window.BetweenUsRiddlesData && window.BetweenUsRiddlesData.riddles) || [];
    },

    // 1. Daily Riddle (Deterministic based on date, stable on refresh)
    initDailyRiddle() {
      const container = document.getElementById("dailyRiddleCard");
      if (!container) return;

      const dailyRiddle = (window.BetweenUsApp && typeof window.BetweenUsApp.getDailyRiddle === "function")
        ? window.BetweenUsApp.getDailyRiddle()
        : this.getRiddles()[0];

      if (!dailyRiddle) return;

      const isFav = window.BetweenUsStorage.isFavorite(dailyRiddle.id);
      const isRevealed = revealedAnswers.has(dailyRiddle.id);
      const hintLevel = revealedHints[dailyRiddle.id] || 0;

      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="hero-evening-badge" style="background: rgba(216, 178, 110, 0.15); color: var(--accent-gold); border-color: var(--border-subtle);">
              🧩 فزورة اليوم الحصرية
            </span>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${dailyRiddle.difficulty === 'easy' ? 'سهلة' : (dailyRiddle.difficulty === 'hard' ? 'صعبة' : 'متوسطة')}</span>
          </div>
          <button class="btn-icon" onclick="BetweenUsRiddles.toggleFav('${dailyRiddle.id}')" title="حفظ في المفضلة" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px; font-size: 1.2rem; color: ${isFav ? 'var(--accent-gold)' : 'var(--text-muted)'};">
            ${isFav ? '★' : '☆'}
          </button>
        </div>

        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); line-height: 1.5; margin-bottom: 16px;">
          ${dailyRiddle.question}
        </h3>

        <!-- Hint area -->
        <div id="hint-area-${dailyRiddle.id}" style="margin-bottom: 14px;">
          ${hintLevel >= 1 ? `
            <div class="riddle-hint-box" style="background: rgba(216, 178, 110, 0.1); border: 1px solid var(--border-subtle); color: var(--accent-gold); margin-bottom: 8px;">
              💡 <strong>تلميح:</strong> ${dailyRiddle.hint}
            </div>
          ` : ''}
          ${hintLevel >= 2 && dailyRiddle.hint2 ? `
            <div class="riddle-hint-box" style="background: rgba(212, 122, 136, 0.12); border: 1px solid var(--accent-rose-soft); color: var(--accent-rose); margin-bottom: 8px;">
              💡 <strong>تلميح أقوى:</strong> ${dailyRiddle.hint2}
            </div>
          ` : ''}
        </div>

        <!-- Controls -->
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: ${isRevealed ? '14px' : '0'};">
          ${hintLevel === 0 ? `
            <button class="btn-secondary" onclick="BetweenUsRiddles.showHint('${dailyRiddle.id}', 1)" style="min-height: 48px; padding: 0 16px; font-size: 0.88rem;">
              💡 تلميح
            </button>
          ` : (hintLevel === 1 && dailyRiddle.hint2 ? `
            <button class="btn-secondary" onclick="BetweenUsRiddles.showHint('${dailyRiddle.id}', 2)" style="min-height: 48px; padding: 0 16px; font-size: 0.88rem; color: var(--accent-rose);">
              💡 تلميح أقوى
            </button>
          ` : '')}

          ${!isRevealed ? `
            <button class="btn-primary" onclick="BetweenUsRiddles.revealAnswer('${dailyRiddle.id}')" style="min-height: 48px; padding: 0 20px; font-size: 0.95rem;">
              🔐 اكشف الحل
            </button>
          ` : ''}
        </div>

        <!-- Answer Section (Hidden until clicked) -->
        ${isRevealed ? `
          <div class="riddle-solution-box" style="margin-top: 14px;">
            <div style="font-size: 1.05rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 6px;">
              💡 الحل: ${dailyRiddle.answer}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
              📖 <strong>لماذا؟</strong> ${dailyRiddle.explanation}
            </div>
            <div style="display: flex; gap: 10px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-hairline);">
              <button class="btn-gold" onclick="BetweenUsRiddles.markResult('${dailyRiddle.id}', true)" style="flex: 1; min-height: 48px; font-size: 0.88rem;">
                ✅ حلتها صح! (+1 لسلسلة الفوازير)
              </button>
              <button class="btn-secondary" onclick="BetweenUsRiddles.markResult('${dailyRiddle.id}', false)" style="min-height: 48px; padding: 0 14px; font-size: 0.85rem;">
                ❌ كانت صعبة
              </button>
            </div>
          </div>
        ` : ''}
      `;
    },

    // 2. Streak & Stats Banner
    initStreakBanner() {
      const banner = document.getElementById("riddleStreakBanner");
      if (!banner) return;

      const stats = window.BetweenUsStorage.getRiddleStreak();

      banner.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 2.2rem; filter: drop-shadow(0 0 12px rgba(216, 178, 110, 0.5));">🔥</div>
            <div>
              <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700;">سلسلة الفوازير (Riddle Streak)</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">
                ${stats.currentStreak} فوازير صحيحة متتالية!
              </div>
            </div>
          </div>
          
          <div style="display: flex; gap: 10px; align-items: center;">
            <div style="padding: 8px 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); text-align: center;">
              <span style="display: block; font-size: 0.72rem; color: var(--text-muted);">أعلى سلسلة</span>
              <span style="font-weight: 800; font-size: 1.05rem; color: var(--accent-gold);">🏆 ${stats.bestStreak}</span>
            </div>
            <div style="padding: 8px 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); text-align: center;">
              <span style="display: block; font-size: 0.72rem; color: var(--text-muted);">إجمالي المحلول</span>
              <span style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">🎯 ${stats.totalSolved}</span>
            </div>
          </div>
        </div>
      `;
    },

    // 3. Category Tabs
    initCategoryTabs() {
      const tabsContainer = document.getElementById("riddleCategoryTabs");
      if (!tabsContainer || !window.BetweenUsRiddlesData) return;

      const categories = window.BetweenUsRiddlesData.categories || [];
      const riddles = this.getRiddles();

      tabsContainer.innerHTML = categories.map(cat => {
        const count = cat.id === "all"
          ? riddles.length
          : riddles.filter(r => r.category === cat.id).length;
        
        return `
          <button class="selector-tab ${currentCategory === cat.id ? 'active' : ''}" onclick="BetweenUsRiddles.setCategory('${cat.id}')">
            <span>${cat.icon}</span>
            <span>${cat.name}</span>
            <span style="font-size: 0.75rem; opacity: 0.75; margin-right: 4px;">(${count})</span>
          </button>
        `;
      }).join("");
    },

    setCategory(catId) {
      currentCategory = catId;
      this.initCategoryTabs();
      this.renderRiddlesList();
    },

    // 4. Search
    initSearch() {
      const input = document.getElementById("riddleSearchInput");
      if (!input) return;

      input.addEventListener("input", e => {
        searchQuery = e.target.value.trim().toLowerCase();
        this.renderRiddlesList();
      });
    },

    // 5. Render Riddles Feed (#riddles-list)
    renderRiddlesList() {
      const container = document.getElementById("riddles-list") || document.getElementById("riddlesFeedContainer");
      if (!container) return;

      const riddles = this.getRiddles();
      let filtered = riddles;

      if (currentCategory !== "all") {
        filtered = filtered.filter(r => r.category === currentCategory);
      }

      if (searchQuery) {
        filtered = filtered.filter(r =>
          r.question.toLowerCase().includes(searchQuery) ||
          r.answer.toLowerCase().includes(searchQuery) ||
          (r.explanation && r.explanation.toLowerCase().includes(searchQuery)) ||
          r.tags.some(t => t.toLowerCase().includes(searchQuery))
        );
      }

      const counterEl = document.getElementById("riddlesCountLabel");
      if (counterEl) {
        counterEl.textContent = `عرض ${filtered.length} فزورة ولغز`;
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-hairline);">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
            <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">لم نعثر على فوازير مطابقة</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">جرب تغيير تصنيف البحث أو مسح الكلمات المكتوبة.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(riddle => {
        const isFav = window.BetweenUsStorage.isFavorite(riddle.id);
        const isRevealed = revealedAnswers.has(riddle.id);
        const hintLevel = revealedHints[riddle.id] || 0;

        return `
          <article class="riddle-card" id="card-${riddle.id}">
            <div class="riddle-card-header">
              <div class="riddle-tags-group">
                <span class="topic-meta-tag" style="background: rgba(216, 178, 110, 0.12); color: var(--accent-gold); font-weight: 700;">
                  ${this.getCategoryName(riddle.category)}
                </span>
                <span class="topic-meta-tag">
                  ${riddle.difficulty === 'easy' ? '🧒 سهلة' : (riddle.difficulty === 'hard' ? '🔥 صعبة' : '⚖️ متوسطة')}
                </span>
                <span id="hint-tag-${riddle.id}" class="topic-meta-tag" style="color: var(--accent-rose); display: ${hintLevel > 0 ? 'inline-flex' : 'none'};">
                  💡 استخدمت تلميحاً
                </span>
              </div>

              <div style="display: flex; gap: 6px; align-items: center;">
                <button class="btn-icon" onclick="BetweenUsRiddles.copyRiddle('${riddle.id}')" title="نسخ الفزورة" aria-label="نسخ">
                  📋
                </button>
                <button class="btn-icon" id="fav-btn-${riddle.id}" onclick="BetweenUsRiddles.toggleFav('${riddle.id}')" title="المفضلة" style="color: ${isFav ? 'var(--accent-gold)' : 'var(--text-muted)'};" aria-label="المفضلة">
                  ${isFav ? '★' : '☆'}
                </button>
              </div>
            </div>

            <!-- Riddle Question -->
            <div class="riddle-question-text">
              🧩 ${riddle.question}
            </div>

            <!-- Hints Box -->
            <div id="hint-area-${riddle.id}">
              ${hintLevel >= 1 ? `
                <div class="riddle-hint-box" style="background: rgba(216, 178, 110, 0.12); border: 1px solid var(--border-subtle); color: var(--accent-gold); margin-bottom: 8px;">
                  💡 <strong>تلميح:</strong> ${riddle.hint}
                </div>
              ` : ''}
              ${hintLevel >= 2 && riddle.hint2 ? `
                <div class="riddle-hint-box" style="background: rgba(212, 122, 136, 0.14); border: 1px solid var(--accent-rose-soft); color: var(--accent-rose); margin-bottom: 8px;">
                  💡 <strong>تلميح أقوى:</strong> ${riddle.hint2}
                </div>
              ` : ''}
            </div>

            <!-- Action Controls (Buttons) -->
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <div id="btn-hint-group-${riddle.id}">
                ${hintLevel === 0 ? `
                  <button class="btn-secondary" onclick="BetweenUsRiddles.showHint('${riddle.id}', 1)" style="min-height: 48px; padding: 0 16px; font-size: 0.88rem;">
                    💡 تلميح
                  </button>
                ` : (hintLevel === 1 && riddle.hint2 ? `
                  <button class="btn-secondary" onclick="BetweenUsRiddles.showHint('${riddle.id}', 2)" style="min-height: 48px; padding: 0 16px; font-size: 0.88rem; color: var(--accent-rose);">
                    💡 تلميح أقوى
                  </button>
                ` : '')}
              </div>

              <button id="btn-reveal-${riddle.id}" class="btn-reveal-solution ${isRevealed ? 'is-revealed' : ''}" onclick="BetweenUsRiddles.toggleReveal('${riddle.id}')">
                <span>${isRevealed ? '🔓 الحل ظاهر' : '🔐 اكشف الحل'}</span>
              </button>
            </div>

            <!-- Answer Section (Hidden until clicked with smooth zero-jump transition) -->
            <div id="solution-wrap-${riddle.id}" class="riddle-solution-wrapper ${isRevealed ? 'is-open' : ''}">
              <div class="riddle-solution-inner">
                <div class="riddle-solution-box" style="margin-top: 14px;">
                  <div style="font-size: 1.08rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 6px;">
                    💡 الحل: ${riddle.answer}
                  </div>
                  ${riddle.explanation ? `
                    <div style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
                      📖 <strong>شرح الحل:</strong> ${riddle.explanation}
                    </div>
                  ` : ''}

                  <div style="display: flex; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-hairline); flex-wrap: wrap;">
                    <button class="btn-gold" onclick="BetweenUsRiddles.markResult('${riddle.id}', true)" style="flex: 1; min-height: 48px; font-size: 0.85rem;">
                      ✅ جاوبتها صح (+1 سلسلة)
                    </button>
                    <button class="btn-secondary" onclick="BetweenUsRiddles.markResult('${riddle.id}', false)" style="min-height: 48px; padding: 0 14px; font-size: 0.82rem;">
                      ❌ عرفت الحل خلاص
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        `;
      }).join("");
    },

    getCategoryName(catId) {
      const cats = window.BetweenUsRiddlesData.categories || [];
      const found = cats.find(c => c.id === catId);
      return found ? `${found.icon} ${found.name}` : "فزورة";
    },

    showHint(riddleId, level) {
      revealedHints[riddleId] = level;
      const riddle = this.getRiddles().find(r => r.id === riddleId);
      if (!riddle) return;

      // Update in DOM directly for smooth zero-jump UX
      const hintArea = document.getElementById(`hint-area-${riddleId}`);
      if (hintArea) {
        if (level === 1) {
          hintArea.innerHTML = `
            <div class="riddle-hint-box" style="background: rgba(216, 178, 110, 0.12); border: 1px solid var(--border-subtle); color: var(--accent-gold); margin-bottom: 8px;">
              💡 <strong>تلميح:</strong> ${riddle.hint}
            </div>
          `;
        } else if (level === 2 && riddle.hint2) {
          hintArea.innerHTML += `
            <div class="riddle-hint-box" style="background: rgba(212, 122, 136, 0.14); border: 1px solid var(--accent-rose-soft); color: var(--accent-rose); margin-bottom: 8px;">
              💡 <strong>تلميح أقوى:</strong> ${riddle.hint2}
            </div>
          `;
        }
      }

      // Update hint button
      const btnGroup = document.getElementById(`btn-hint-group-${riddleId}`);
      if (btnGroup) {
        if (level === 1 && riddle.hint2) {
          btnGroup.innerHTML = `
            <button class="btn-secondary" onclick="BetweenUsRiddles.showHint('${riddleId}', 2)" style="min-height: 48px; padding: 0 16px; font-size: 0.88rem; color: var(--accent-rose);">
              💡 تلميح أقوى
            </button>
          `;
        } else {
          btnGroup.innerHTML = '';
        }
      }

      // Show hint tag badge
      const hintTag = document.getElementById(`hint-tag-${riddleId}`);
      if (hintTag) {
        hintTag.style.display = 'inline-flex';
      }
    },

    toggleReveal(riddleId) {
      const wrap = document.getElementById(`solution-wrap-${riddleId}`);
      const btn = document.getElementById(`btn-reveal-${riddleId}`);

      if (revealedAnswers.has(riddleId)) {
        // Hide
        revealedAnswers.delete(riddleId);
        if (wrap) wrap.classList.remove("is-open");
        if (btn) {
          btn.classList.remove("is-revealed");
          btn.innerHTML = `<span>🔐 اكشف الحل</span>`;
        }
      } else {
        // Reveal with smooth transition
        revealedAnswers.add(riddleId);
        if (wrap) wrap.classList.add("is-open");
        if (btn) {
          btn.classList.add("is-revealed");
          btn.innerHTML = `<span>🔓 الحل ظاهر</span>`;
        }
      }
    },

    revealAnswer(riddleId) {
      this.toggleReveal(riddleId);
    },

    hideAnswer(riddleId) {
      this.toggleReveal(riddleId);
    },

    markResult(riddleId, isCorrect) {
      const updated = window.BetweenUsStorage.recordRiddleAnswer(riddleId, isCorrect);
      this.initStreakBanner();
      window.BetweenUsApp.showToast(isCorrect ? `🔥 رائع! سلسلة الفوازير أصبحت: ${updated.currentStreak}` : `نحاول في اللي بعدها! 💪`);
    },

    toggleFav(riddleId) {
      const riddles = this.getRiddles();
      const item = riddles.find(r => r.id === riddleId);
      if (!item) return;

      const isFav = window.BetweenUsStorage.toggleFavorite({
        id: item.id,
        type: "riddle",
        title: item.question.substring(0, 45) + (item.question.length > 45 ? '...' : '')
      });

      const favBtn = document.getElementById(`fav-btn-${riddleId}`);
      if (favBtn) {
        favBtn.style.color = isFav ? "var(--accent-gold)" : "var(--text-muted)";
        favBtn.textContent = isFav ? "★" : "☆";
      }

      window.BetweenUsApp.showToast(isFav ? "★ أُضيفت الفزورة للمفضلة!" : "تمت إزالة الفزورة من المفضلة");
    },

    copyRiddle(riddleId) {
      const riddles = this.getRiddles();
      const item = riddles.find(r => r.id === riddleId);
      if (!item) return;

      const text = `🧩 فزورة من Between Us ♾️:\n"${item.question}"\n\n💡 تلميح: ${item.hint}\n🔐 الحل: ${item.answer}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        window.BetweenUsApp.showToast("📋 تم نسخ الفزورة إلى الحافظة!");
      }
    },

    // 6. Random Riddle Picker
    pickRandomRiddle() {
      const riddles = this.getRiddles();
      if (riddles.length === 0) return;
      const random = riddles[Math.floor(Math.random() * riddles.length)];

      const modal = document.getElementById("randomRiddleModal");
      const content = document.getElementById("randomRiddleModalContent");
      if (!modal || !content) return;

      revealedAnswers.delete(random.id);
      delete revealedHints[random.id];

      content.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700;">🎲 فزورة عشوائية مختارة</span>
          <button class="btn-icon" data-close-modal style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;">✕</button>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; line-height: 1.5;">
          ${random.question}
        </h3>
        
        <div id="modal-hint-box" style="margin-bottom: 14px; display: none; padding: 10px 14px; background: rgba(216, 178, 110, 0.1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.88rem; color: var(--accent-gold);">
          💡 <strong>تلميح:</strong> ${random.hint}
        </div>

        <div id="modal-answer-box" style="margin-bottom: 14px; display: none; padding: 14px; background: var(--bg-surface-elevated); border: 1px solid var(--accent-gold); border-radius: var(--radius-md);">
          <div style="font-size: 1.05rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 6px;">
            💡 الحل: ${random.answer}
          </div>
          <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55;">
            📖 ${random.explanation}
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end;">
          <button class="btn-secondary" onclick="document.getElementById('modal-hint-box').style.display='block';" style="min-height: 48px; padding: 0 16px;">
            💡 تلميح
          </button>
          <button class="btn-primary" onclick="document.getElementById('modal-answer-box').style.display='block';" style="min-height: 48px; padding: 0 18px;">
            🔐 اكشف الحل
          </button>
          <button class="btn-secondary" onclick="BetweenUsRiddles.pickRandomRiddle()" style="min-height: 48px; padding: 0 16px;">
            🎲 فزورة تانية
          </button>
        </div>
      `;

      window.BetweenUsApp.openModal("randomRiddleModal");
    },

    // 7. Detective Case ("قضية الليلة")
    initDetectiveSection() {
      const container = document.getElementById("detectiveCaseContainer");
      if (!container) return;

      const riddles = this.getRiddles();
      const detectiveCases = riddles.filter(r => r.category === "detective" || r.isDetective);
      if (detectiveCases.length === 0) return;

      const caseItem = detectiveCases[0]; // Featured Tonight Case
      const isRevealed = revealedAnswers.has(caseItem.id);

      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div class="hero-evening-badge" style="background: rgba(104, 24, 38, 0.4); color: var(--accent-rose); border-color: rgba(212, 122, 136, 0.3);">
            🕵️ قضية وتحقيق الليلة
          </div>
          <span style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 600;">الملف الجنائي #104</span>
        </div>

        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; line-height: 1.5;">
          ${caseItem.question}
        </h3>

        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
          فكروا في كل كلمة وحجة قالها المشتبه بهم.. مين فيهم قال تفصيلة مستحيلة منطقياً وتثبت كذبه فوراً؟
        </p>

        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button class="btn-secondary" onclick="BetweenUsRiddles.showHint('${caseItem.id}', 1)" style="min-height: 48px; padding: 0 16px; font-size: 0.9rem;">
            💡 تلميح المحقق
          </button>
          ${!isRevealed ? `
            <button class="btn-primary" onclick="BetweenUsRiddles.revealAnswer('${caseItem.id}')" style="min-height: 48px; padding: 0 20px; font-size: 0.95rem;">
              🔎 اكشف الحقيقة
            </button>
          ` : ''}
        </div>

        ${isRevealed ? `
          <div style="margin-top: 14px; padding: 16px; background: rgba(25, 22, 27, 0.95); border: 1px solid var(--accent-gold); border-radius: var(--radius-md); animation: fadeIn 0.3s ease;">
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 6px;">
              🔍 كشف الجاني: ${caseItem.answer}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
              📖 <strong>التحليل الجنائي:</strong> ${caseItem.explanation}
            </div>
          </div>
        ` : ''}
      `;
    },

    // 8. Riddle Game Mode ("🎮 العب الفوازير")
    startGameMode() {
      const riddles = this.getRiddles();
      if (riddles.length === 0) return;

      // Pick 10 random questions with options
      const shuffled = [...riddles].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);

      gameState = {
        active: true,
        questions: selected,
        currentIndex: 0,
        score: 0,
        selectedOption: null,
        answered: false
      };

      this.renderGameStep();
      window.BetweenUsApp.openModal("riddleGameModal");
    },

    renderGameStep() {
      const content = document.getElementById("riddleGameModalContent");
      if (!content) return;

      const q = gameState.questions[gameState.currentIndex];
      const roundNumber = gameState.currentIndex + 1;
      const totalRounds = gameState.questions.length;

      const options = q.options && q.options.length >= 4
        ? q.options
        : [q.answer, "خيار غير صحيح 1", "خيار غير صحيح 2", "خيار غير صحيح 3"];

      content.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <span style="font-size: 0.9rem; font-weight: 700; color: var(--accent-gold);">
            🎮 فزورة ${roundNumber} / ${totalRounds}
          </span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">النقاط: <strong>${gameState.score}</strong></span>
            <button class="btn-icon" data-close-modal style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;">✕</button>
          </div>
        </div>

        <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); line-height: 1.5; margin-bottom: 20px;">
          ${q.question}
        </div>

        <!-- Options A B C D -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          ${options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            let optStyle = "background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); color: var(--text-primary);";
            
            if (gameState.answered) {
              if (idx === (q.correctOptionIndex !== undefined ? q.correctOptionIndex : 0)) {
                optStyle = "background: rgba(46, 125, 50, 0.2); border: 2px solid #4CAF50; color: #81C784; font-weight: 700;";
              } else if (gameState.selectedOption === idx) {
                optStyle = "background: rgba(212, 122, 136, 0.2); border: 2px solid var(--accent-rose); color: var(--accent-rose);";
              }
            }

            return `
              <button class="selector-tab" onclick="BetweenUsRiddles.handleGameSelect(${idx})" ${gameState.answered ? 'disabled' : ''} style="width: 100%; min-height: 48px; justify-content: flex-start; text-align: right; padding: 12px 16px; border-radius: var(--radius-md); font-size: 0.95rem; ${optStyle}">
                <span style="display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: var(--radius-full); background: rgba(255, 255, 255, 0.08); font-weight: 700; margin-left: 10px; flex-shrink: 0;">${letter}</span>
                <span>${opt}</span>
              </button>
            `;
          }).join("")}
        </div>

        <!-- Result / Next Section -->
        ${gameState.answered ? `
          <div style="padding: 14px; background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); margin-bottom: 16px; animation: fadeIn 0.25s ease;">
            <div style="font-size: 1.05rem; font-weight: 800; color: ${gameState.selectedOption === (q.correctOptionIndex !== undefined ? q.correctOptionIndex : 0) ? '#4CAF50' : 'var(--accent-rose)'}; margin-bottom: 4px;">
              ${gameState.selectedOption === (q.correctOptionIndex !== undefined ? q.correctOptionIndex : 0) ? '✅ إجابة صحيحة وممتازة!' : '❌ إجابة غير صحيحة!'}
            </div>
            <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
              💡 <strong>الحل:</strong> ${q.answer}
              ${q.explanation ? `<br>📖 ${q.explanation}` : ''}
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button class="btn-primary" onclick="BetweenUsRiddles.nextGameStep()" style="min-height: 48px; padding: 0 24px; font-size: 0.95rem;">
              ${roundNumber < totalRounds ? 'الفزورة التالية ←' : 'عرض النتيجة النهائية 🏆'}
            </button>
          </div>
        ` : ''}
      `;
    },

    handleGameSelect(optIdx) {
      if (gameState.answered) return;
      const q = gameState.questions[gameState.currentIndex];
      const correctIdx = q.correctOptionIndex !== undefined ? q.correctOptionIndex : 0;
      
      gameState.selectedOption = optIdx;
      gameState.answered = true;

      const isCorrect = optIdx === correctIdx;
      if (isCorrect) {
        gameState.score += 1;
        window.BetweenUsStorage.recordRiddleAnswer(q.id, true);
      } else {
        window.BetweenUsStorage.recordRiddleAnswer(q.id, false);
      }

      this.initStreakBanner();
      this.renderGameStep();
    },

    nextGameStep() {
      if (gameState.currentIndex + 1 < gameState.questions.length) {
        gameState.currentIndex += 1;
        gameState.answered = false;
        gameState.selectedOption = null;
        this.renderGameStep();
      } else {
        this.renderGameSummary();
      }
    },

    renderGameSummary() {
      const content = document.getElementById("riddleGameModalContent");
      if (!content) return;

      const score = gameState.score;
      const total = gameState.questions.length;
      let ratingTitle = "محاولة ممتازة!";
      let ratingDesc = "الفوازير كانت ممتعة، المرة الجاية النتيجة هتكون أقوى وأجمل!";

      if (score >= 9) {
        ratingTitle = "🧠 عباقرة الفوازير والذكاء المطلق!";
        ratingDesc = "ما شاء الله، تركيز وسرعة بديهة خرافية تستحق الاحتفال!";
      } else if (score >= 7) {
        ratingTitle = "✨ ذكاء وتوافق مذهل!";
        ratingDesc = "أداء رائع جداً، معظم الفوازير الصعبة حليتوها ببراعة.";
      }

      content.innerHTML = `
        <div style="text-align: center; padding: 20px 10px;">
          <div style="font-size: 3.5rem; margin-bottom: 10px;">🏆</div>
          <h2 style="font-size: 1.6rem; color: var(--text-primary); margin-bottom: 6px;">نتيجتكم النهائية</h2>
          
          <div style="font-size: 3rem; font-weight: 800; color: var(--accent-gold); margin: 12px 0;">
            ${score} / ${total}
          </div>

          <h3 style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 8px;">${ratingTitle}</h3>
          <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 24px; line-height: 1.6;">
            ${ratingDesc}
          </p>

          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" onclick="BetweenUsRiddles.startGameMode()" style="min-height: 48px; padding: 0 22px;">
              🎮 العب جولة جديدة (10 فوازير)
            </button>
            <button class="btn-secondary" data-close-modal style="min-height: 48px; padding: 0 18px;">
              العودة لقائمة الفوازير
            </button>
          </div>
        </div>
      `;
    },

    setupEventListeners() {
      document.addEventListener("riddleStreakUpdated", () => this.initStreakBanner());
      document.addEventListener("favoritesUpdated", () => {
        this.initDailyRiddle();
        this.renderRiddlesList();
      });
    }
  };

  window.BetweenUsRiddles = RiddlesApp;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => RiddlesApp.init());
  } else {
    RiddlesApp.init();
  }
})();

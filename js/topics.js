/**
 * Between Us ♾️ - Topics & Conversation Session Engine
 */

(function () {
  "use strict";

  window.BetweenUsTopics = {
    activeTopic: null,
    currentQuestionIndex: 0,
    activeCategory: "all",
    activeMood: "all",

    init() {
      this.bindFilters();
      this.renderTopics();
      this.checkUrlParams();
      this.bindSessionControls();
    },

    getAllTopics() {
      const defaultTopics = (window.BetweenUsData && window.BetweenUsData.topics) || [];
      const customTopics = (window.BetweenUsStorage && window.BetweenUsStorage.getCustomContent()) || [];
      
      const formattedCustom = customTopics
        .filter(c => c.type === "topic")
        .map(c => ({
          id: c.id,
          category: "custom",
          mood: "custom",
          title: c.title,
          description: c.content,
          questions: c.content.split("\n").filter(q => q.trim().length > 0),
          tags: c.tags || ["مشاركتنا الخاصة"],
          time: 15,
          isCustom: true
        }));

      return [...formattedCustom, ...defaultTopics];
    },

    bindFilters() {
      // Category filter tabs
      document.querySelectorAll(".category-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          document.querySelectorAll(".category-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          this.activeCategory = tab.getAttribute("data-category") || "all";
          this.renderTopics();
        });
      });

      // Mood filter tabs
      document.querySelectorAll(".mood-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          document.querySelectorAll(".mood-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          this.activeMood = tab.getAttribute("data-mood") || "all";
          this.renderTopics();
        });
      });

      // Search input inside topics page
      const searchInput = document.getElementById("topicsSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", e => {
          this.renderTopics(e.target.value.trim().toLowerCase());
        });
      }
    },

    renderTopics(searchQuery = "") {
      const grid = document.getElementById("topicsGrid");
      if (!grid) return;

      let list = this.getAllTopics();

      // Apply category filter
      if (this.activeCategory !== "all") {
        list = list.filter(t => t.category === this.activeCategory);
      }

      // Apply mood filter
      if (this.activeMood !== "all") {
        list = list.filter(t => t.mood === this.activeMood);
      }

      // Apply search query
      if (searchQuery) {
        list = list.filter(t => 
          t.title.toLowerCase().includes(searchQuery) ||
          t.description.toLowerCase().includes(searchQuery) ||
          (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
        );
      }

      if (list.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 48px 16px; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 12px;">🕯️</div>
            <h4 style="color: var(--text-primary); margin-bottom: 6px;">لا توجد مواضيع في هذا القسم حالياً</h4>
            <p style="font-size: 0.9rem;">جربوا اختيار تصنيف آخر، أو أضيفوا موضوعكم الخاص بالضغط على "+ أضف من عندك".</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = list.map(topic => {
        const isFav = window.BetweenUsStorage.isFavorite(topic.id);
        const qCount = topic.questions ? topic.questions.length : 5;
        const tagText = topic.tags ? topic.tags.slice(0, 2).join(" · ") : "حوار";

        return `
          <div class="topic-card" onclick="BetweenUsTopics.startSession('${topic.id}')">
            <div>
              <div class="topic-meta">
                <span>${tagText}</span>
                <span>${qCount} أسئلة · ${topic.time || 15} دقيقة</span>
              </div>
              <h3 class="topic-title" style="margin-top: 8px;">${topic.title}</h3>
              <p class="topic-desc" style="margin-top: 6px;">${topic.description}</p>
            </div>
            <div class="topic-footer" onclick="event.stopPropagation()" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 14px;">
              <button class="btn-primary" onclick="BetweenUsTopics.startSession('${topic.id}')" style="min-height: 48px; min-width: 48px; padding: 0 18px; font-size: 0.92rem;">
                ابدأ الجلسة ✦
              </button>
              <div class="topic-card-actions" style="display: flex; align-items: center; gap: 10px;">
                <button class="btn-card-action ${isFav ? 'active' : ''}" title="المفضلة" onclick="BetweenUsTopics.toggleFavorite('${topic.id}')" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;">
                  ${isFav ? '❤️' : '♡'}
                </button>
                <button class="btn-card-action" title="نتكلم فيه بعدين" onclick="BetweenUsTopics.bookmarkToTalk('${topic.id}')" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;">
                  📌
                </button>
              </div>
            </div>
          </div>
        `;
      }).join("");
    },

    toggleFavorite(topicId) {
      const topic = this.getAllTopics().find(t => t.id === topicId);
      if (!topic) return;

      const isNowFav = window.BetweenUsStorage.toggleFavorite({
        id: topic.id,
        type: "topic",
        title: topic.title,
        category: topic.category
      });

      this.renderTopics();
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast(isNowFav ? "❤️ أُضيف إلى مفضلتكم" : "تم الحذف من المفضلة");
      }
    },

    bookmarkToTalk(topicId) {
      const topic = this.getAllTopics().find(t => t.id === topicId);
      if (!topic) return;

      window.BetweenUsStorage.addToTalk(topic.title, topic.category);
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("📌 تم الحفظ في قائمة: نتكلم فيه بعدين");
      }
    },

    // Conversation Session Controller
    startSession(topicId) {
      const topic = this.getAllTopics().find(t => t.id === topicId);
      if (!topic) return;

      this.activeTopic = topic;
      this.currentQuestionIndex = 0;

      const modal = document.getElementById("conversationSessionModal");
      if (!modal) {
        window.location.href = `topics.html?session=${topicId}`;
        return;
      }

      modal.classList.add("active");
      this.updateSessionView();
    },

    updateSessionView() {
      if (!this.activeTopic) return;

      const questions = this.activeTopic.questions || [this.activeTopic.title];
      const total = questions.length;
      const current = this.currentQuestionIndex;

      // Progress bar calculation
      const progressPercent = Math.min(100, Math.round(((current + 1) / total) * 100));
      const fillBar = document.getElementById("sessionProgressFill");
      if (fillBar) fillBar.style.width = `${progressPercent}%`;

      // Labels & Text
      const catLabel = document.getElementById("sessionCategoryLabel");
      const stepLabel = document.getElementById("sessionStepLabel");
      const questionText = document.getElementById("sessionQuestionText");

      if (catLabel) catLabel.textContent = this.activeTopic.title;
      if (stepLabel) stepLabel.textContent = `السؤال ${current + 1} من ${total}`;
      if (questionText) questionText.textContent = questions[current];

      // Favorite & Bookmark state
      const favBtn = document.getElementById("sessionFavBtn");
      if (favBtn) {
        const isFav = window.BetweenUsStorage.isFavorite(this.activeTopic.id);
        favBtn.innerHTML = isFav ? "❤️ محفوظ" : "♡ تفضيل";
      }

      // Prev / Next button states
      const prevBtn = document.getElementById("sessionPrevBtn");
      const nextBtn = document.getElementById("sessionNextBtn");

      if (prevBtn) {
        prevBtn.disabled = current === 0;
        prevBtn.style.opacity = current === 0 ? "0.4" : "1";
      }

      if (nextBtn) {
        if (current === total - 1) {
          nextBtn.textContent = "إنهاء الجلسة ✦";
        } else {
          nextBtn.textContent = "السؤال التالي ←";
        }
      }
    },

    nextQuestion() {
      if (!this.activeTopic) return;
      const questions = this.activeTopic.questions || [];
      if (this.currentQuestionIndex < questions.length - 1) {
        this.currentQuestionIndex++;
        this.updateSessionView();
      } else {
        this.finishSession();
      }
    },

    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.updateSessionView();
      }
    },

    selectedRecapMood: "دافئة ومطمئنة",

    setRecapMood(btn, mood) {
      this.selectedRecapMood = mood;
      document.querySelectorAll("#recapMoodSelectors .recap-mood-pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
    },

    saveSessionRecapNotes(sessionId) {
      const textarea = document.getElementById("sessionPersonalNotes");
      const memoryBoxCheck = document.getElementById("saveNoteToMemoryBox");
      const feedback = document.getElementById("recapNotesFeedback");

      const notes = textarea ? textarea.value.trim() : "";
      const shouldSaveToMemories = memoryBoxCheck ? memoryBoxCheck.checked : false;

      if (!notes) {
        if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
          window.BetweenUsApp.showToast("من فضلك اكتبوا خاطرة أو ملاحظة قبل الحفظ");
        }
        return;
      }

      window.BetweenUsStorage.updateSessionNotes(
        sessionId,
        notes,
        this.selectedRecapMood || "دافئة ومطمئنة",
        shouldSaveToMemories
      );

      if (feedback) {
        feedback.textContent = shouldSaveToMemories 
          ? "✓ تم توثيق الملاحظة في سجل الجلسات وأُضيفت لصندوق الذكريات!" 
          : "✓ تم توثيق الملاحظة في سجل الجلسات بنجاح!";
        feedback.style.display = "block";
      }

      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("✨ تم حفظ الخاطرة في سجل ذكرياتكم");
      }
    },

    finishSession() {
      if (!this.activeTopic) return;

      const questions = this.activeTopic.questions || [this.activeTopic.title];

      // Record to history and get session object
      const savedSession = window.BetweenUsStorage.saveSession({
        topicId: this.activeTopic.id,
        topicTitle: this.activeTopic.title,
        category: this.activeTopic.category || "عام",
        questionsCount: questions.length,
        questions: questions
      });

      // Update modal header and progress
      const catLabel = document.getElementById("sessionCategoryLabel");
      const stepLabel = document.getElementById("sessionStepLabel");
      const fillBar = document.getElementById("sessionProgressFill");
      const controls = document.querySelector("#conversationSessionModal .session-controls");

      if (catLabel) catLabel.textContent = "ملخص الجلسة · Session Recap";
      if (stepLabel) stepLabel.style.display = "none";
      if (fillBar) fillBar.style.width = "100%";
      if (controls) controls.style.display = "none";

      const body = document.querySelector("#conversationSessionModal .session-body");
      if (body) {
        body.style.display = "block";
        body.style.textAlign = "right";
        body.style.overflowY = "auto";
        body.style.maxHeight = "calc(100vh - 80px)";
        body.style.padding = "20px 16px 40px";

        body.innerHTML = `
          <div class="session-recap-wrap">
            <div style="text-align: center; margin-bottom: 20px;">
              <div class="session-recap-badge">✦ ملخص الجلسة الحوارية · Session Recap</div>
              <h2 class="session-recap-title">${this.activeTopic.title}</h2>
              <div class="session-recap-meta" style="justify-content: center;">
                <span>📅 ${savedSession.date} · ${savedSession.time}</span>
                <span>·</span>
                <span>🏷️ ${this.activeTopic.category || 'عام'}</span>
                <span>·</span>
                <span>💬 ${questions.length} أسئلة نوقشت</span>
              </div>
            </div>

            <!-- Summary of questions discussed -->
            <div style="margin-bottom: 22px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-gold);">
                  📜 الأسئلة التي خضتموها معاً (${questions.length}):
                </h4>
                <span style="font-size: 0.78rem; color: var(--text-muted);">اكتملت 100%</span>
              </div>
              <div class="session-recap-questions">
                ${questions.map((q, idx) => `
                  <div class="recap-question-item">
                    <span class="recap-check">✓</span>
                    <span><strong>${idx + 1}.</strong> ${q}</span>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- Personal Notes Section -->
            <div class="session-recap-notes-box">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="font-size: 1.2rem;">📝</span>
                <h3 style="font-size: 1.1rem; color: #FFFFFF; font-weight: 700;">خاطرة أو كلمة من قلب الجلسة</h3>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
                وثقوا فكرة اتفقتم عليها، أو كلمة جميلة قالها الشريك، أو شعور حسيتم بيه أثناء النقاش:
              </p>

              <!-- Mood Pills for the Session -->
              <div style="margin-bottom: 16px;">
                <label style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 8px;">طابع الجلسة ومشاعرها:</label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;" id="recapMoodSelectors">
                  <button type="button" class="recap-mood-pill active" onclick="BetweenUsTopics.setRecapMood(this, 'دافئة ومطمئنة')">🥰 دافية ومطمئنة</button>
                  <button type="button" class="recap-mood-pill" onclick="BetweenUsTopics.setRecapMood(this, 'كلها ضحك وفرفشة')">😂 كلها ضحك</button>
                  <button type="button" class="recap-mood-pill" onclick="BetweenUsTopics.setRecapMood(this, 'عميقة وفلسفية')">🧠 عميقة ومفيدة</button>
                  <button type="button" class="recap-mood-pill" onclick="BetweenUsTopics.setRecapMood(this, 'حب ورومانسية')">❤️ قرب ورومانسية</button>
                  <button type="button" class="recap-mood-pill" onclick="BetweenUsTopics.setRecapMood(this, 'بداية وانطلاقة')">✨ انطلاقة جديدة</button>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 14px;">
                <textarea id="sessionPersonalNotes" class="form-textarea" rows="3" placeholder="مثال: اتفقنا نبدأ نجهز لسفرية دهب الشهر الجاي، وموقف طفولة إسراء كان مؤثر ومميز جداً..." style="background: rgba(0, 0, 0, 0.35); border-color: rgba(216, 178, 110, 0.3); font-size: 16px; min-height: 48px;"></textarea>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: var(--text-secondary); cursor: pointer; min-height: 48px;">
                  <input type="checkbox" id="saveNoteToMemoryBox" checked style="accent-color: var(--accent-gold); width: 20px; height: 20px;" />
                  <span>حفظ نسخة أيضاً في 'صندوق الذكريات' 📸</span>
                </label>
                <button type="button" class="btn-primary" onclick="BetweenUsTopics.saveSessionRecapNotes('${savedSession.id}')" style="min-height: 48px; min-width: 48px; padding: 0 20px; font-size: 0.95rem;">
                  حفظ الخاطرة في السجل ✓
                </button>
              </div>

              <div id="recapNotesFeedback" style="display: none; margin-top: 10px; font-size: 0.85rem; color: var(--accent-gold); font-weight: 600; text-align: center;"></div>
            </div>

            <!-- Action buttons -->
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
              <button class="btn-secondary" onclick="BetweenUsStorage.addToTalk('${this.activeTopic.title}', '${this.activeTopic.category || 'موضوع'}'); BetweenUsApp.showToast('📌 تم الحفظ في نتكلم فيه بعدين');" style="min-height: 48px; min-width: 48px; font-size: 0.92rem; padding: 0 20px;">
                📌 حفظ في 'نتكلم فيه بعدين'
              </button>
              <button class="btn-primary" onclick="BetweenUsTopics.closeSession(); window.BetweenUsApp.triggerSurprise();" style="min-height: 48px; min-width: 48px; font-size: 0.92rem; padding: 0 20px;">
                🎲 فتح مفاجأة عشوائية
              </button>
              <button class="btn-secondary" onclick="BetweenUsTopics.closeSession();" style="min-height: 48px; min-width: 48px; font-size: 0.92rem; padding: 0 20px;">
                الرجوع لقائمة المواضيع
              </button>
            </div>
          </div>
        `;
      }
    },

    closeSession() {
      const modal = document.getElementById("conversationSessionModal");
      if (modal) modal.classList.remove("active");
      this.activeTopic = null;
      this.currentQuestionIndex = 0;
      setTimeout(() => {
        // Restore standard session layout for next use
        window.location.reload();
      }, 300);
    },

    bindSessionControls() {
      const nextBtn = document.getElementById("sessionNextBtn");
      const prevBtn = document.getElementById("sessionPrevBtn");
      const closeBtn = document.getElementById("sessionCloseBtn");
      const favBtn = document.getElementById("sessionFavBtn");
      const bookmarkBtn = document.getElementById("sessionBookmarkBtn");

      if (nextBtn) nextBtn.addEventListener("click", () => this.nextQuestion());
      if (prevBtn) prevBtn.addEventListener("click", () => this.prevQuestion());
      if (closeBtn) closeBtn.addEventListener("click", () => this.closeSession());

      if (favBtn) {
        favBtn.addEventListener("click", () => {
          if (!this.activeTopic) return;
          this.toggleFavorite(this.activeTopic.id);
          this.updateSessionView();
        });
      }

      if (bookmarkBtn) {
        bookmarkBtn.addEventListener("click", () => {
          if (!this.activeTopic) return;
          this.bookmarkToTalk(this.activeTopic.id);
        });
      }
    },

    checkUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session") || params.get("id");
      if (sessionId) {
        setTimeout(() => this.startSession(sessionId), 200);
      }
      const categoryParam = params.get("category");
      if (categoryParam) {
        this.activeCategory = categoryParam;
        document.querySelectorAll(".category-tab").forEach(tab => {
          if (tab.getAttribute("data-category") === categoryParam) {
            tab.classList.add("active");
          } else {
            tab.classList.remove("active");
          }
        });
        this.renderTopics();
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.BetweenUsTopics.init());
  } else {
    window.BetweenUsTopics.init();
  }
})();

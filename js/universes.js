/**
 * Between Us ♾️ - Universes Engine
 * Home Management, Household Budget, Parenting, Online Business Lab, 
 * Smart Shopping, What to Cook, Life Dilemmas, Detective Night, and Evening Generator.
 */

(function () {
  "use strict";

  window.BetweenUsUniverses = {
    activeUniverseTab: "home",
    activeChecklistKey: "weeklyGroceries",
    currentDetectiveCaseIndex: 0,
    currentDilemmaIndex: 0,
    currentParentingIndex: 0,

    // State for interactive "Who Does It?" comparison game
    whoDoesItGame: {
      p1Picks: {},
      p2Picks: {},
      revealed: false
    },

    init() {
      this.initTabs();
      this.initHomeChores();
      this.initCleaningSchedule();
      this.initChecklists();
      this.initMustBuyVsCanSkip();
      this.initBudgetCalculator();
      this.initWholesaleVsWasted();
      this.initSmartShopping();
      this.initSavingsChallenges();
      this.initTenThousandScenario();
      this.initParentingBeforeKids();
      this.initParenting();
      this.initFutureChild();
      this.initBusinessLab();
      this.initCookingGenerator();
      this.initLifeDilemmas();
      this.initDetectiveNight();
      this.initLifeRoadmap();
      this.initEveningGenerator();
    },

    getSettings() {
      return (window.BetweenUsStorage && window.BetweenUsStorage.getSettings()) || {
        partner1: "أحمد",
        partner2: "إسراء"
      };
    },

    initTabs() {
      document.querySelectorAll(".universe-nav-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          document.querySelectorAll(".universe-nav-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          const target = tab.getAttribute("data-tab");
          this.switchUniverse(target);
        });
      });

      // Check URL query param e.g. ?universe=budget
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("universe") || params.get("tab");
      if (tabParam) {
        this.switchUniverse(tabParam);
        const activeTabBtn = document.querySelector(`.universe-nav-tab[data-tab="${tabParam}"]`);
        if (activeTabBtn) {
          document.querySelectorAll(".universe-nav-tab").forEach(t => t.classList.remove("active"));
          activeTabBtn.classList.add("active");
        }
      }
    },

    switchUniverse(tabName) {
      document.querySelectorAll(".universe-content-panel").forEach(panel => {
        panel.style.display = "none";
      });
      const targetPanel = document.getElementById("panel-" + tabName);
      if (targetPanel) {
        targetPanel.style.display = "block";
      }
      this.activeUniverseTab = tabName;
    },

    // ==========================================
    // 1. UNIVERSE إدارة البيت ("بيتنا")
    // ==========================================
    initHomeChores() {
      const container = document.getElementById("homeChoresList");
      if (!container || !window.BetweenUsData) return;

      const chores = window.BetweenUsData.homeChores || [];
      const assignments = window.BetweenUsStorage.getHomeChoresAssignments();
      const settings = this.getSettings();
      const isRevealed = this.whoDoesItGame.revealed;

      container.innerHTML = chores.map(chore => {
        const assigned = assignments[chore.id] || "unassigned";
        const p1Choice = this.whoDoesItGame.p1Picks[chore.id] || null;
        const p2Choice = this.whoDoesItGame.p2Picks[chore.id] || null;

        let gameBadge = "";
        if (isRevealed) {
          if (p1Choice && p2Choice) {
            const isMatch = p1Choice === p2Choice;
            gameBadge = isMatch
              ? `<div style="background: rgba(74, 222, 128, 0.15); border: 1px solid rgba(74, 222, 128, 0.4); color: #4ade80; border-radius: var(--radius-sm); padding: 4px 8px; font-size: 0.78rem; font-weight: 700;">💖 متفقين: ${this.formatPickLabel(p1Choice, settings)}</div>`
              : `<div style="background: rgba(226, 125, 96, 0.15); border: 1px solid rgba(226, 125, 96, 0.4); color: var(--accent-rose); border-radius: var(--radius-sm); padding: 4px 8px; font-size: 0.78rem;">☕ ${settings.partner1}: ${this.formatPickLabel(p1Choice, settings)} · ${settings.partner2}: ${this.formatPickLabel(p2Choice, settings)}</div>`;
          }
        }

        return `
          <div class="topic-card" style="padding: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.4rem;">${chore.icon}</span>
                <strong style="font-size: 1.05rem; color: var(--text-primary);">${chore.name}</strong>
              </div>
              <span id="assigneeLabel-${chore.id}" style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">
                ${this.formatAssignee(assigned, settings)}
              </span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">${chore.desc}</p>

            ${gameBadge ? `<div style="margin-bottom: 10px;">${gameBadge}</div>` : ''}

            <!-- 🎮 اللعبة التفاعلية: اختيار كل شريك في سره -->
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: var(--radius-md); padding: 10px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 0.78rem; color: var(--accent-gold); font-weight: 700;">رأي ${settings.partner1}:</span>
                <div style="display: flex; gap: 4px;">
                  <button type="button" class="recap-mood-pill ${p1Choice === 'p1' ? 'active' : ''}" style="font-size: 0.75rem; padding: 2px 8px;" onclick="BetweenUsUniverses.selectWhoDoesItChoice('${chore.id}', 'p1', 'p1')">أنا</button>
                  <button type="button" class="recap-mood-pill ${p1Choice === 'p2' ? 'active' : ''}" style="font-size: 0.75rem; padding: 2px 8px;" onclick="BetweenUsUniverses.selectWhoDoesItChoice('${chore.id}', 'p1', 'p2')">${settings.partner2}</button>
                  <button type="button" class="recap-mood-pill ${p1Choice === 'together' ? 'active' : ''}" style="font-size: 0.75rem; padding: 2px 8px;" onclick="BetweenUsUniverses.selectWhoDoesItChoice('${chore.id}', 'p1', 'together')">سوا</button>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.78rem; color: var(--accent-rose); font-weight: 700;">رأي ${settings.partner2}:</span>
                <div style="display: flex; gap: 4px;">
                  <button type="button" class="recap-mood-pill ${p2Choice === 'p1' ? 'active' : ''}" style="font-size: 0.75rem; padding: 2px 8px;" onclick="BetweenUsUniverses.selectWhoDoesItChoice('${chore.id}', 'p2', 'p1')">${settings.partner1}</button>
                  <button type="button" class="recap-mood-pill ${p2Choice === 'p2' ? 'active' : ''}" style="font-size: 0.75rem; padding: 2px 8px;" onclick="BetweenUsUniverses.selectWhoDoesItChoice('${chore.id}', 'p2', 'p2')">أنا</button>
                  <button type="button" class="recap-mood-pill ${p2Choice === 'together' ? 'active' : ''}" style="font-size: 0.75rem; padding: 2px 8px;" onclick="BetweenUsUniverses.selectWhoDoesItChoice('${chore.id}', 'p2', 'together')">سوا</button>
                </div>
              </div>
            </div>

            <!-- التثبيت النهائي في جدول البيت -->
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">
              <span>تثبيت المسؤولية النهائية:</span>
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="recap-mood-pill ${assigned === 'p1' ? 'active' : ''}" onclick="BetweenUsUniverses.assignChore('${chore.id}', 'p1')">
                ${settings.partner1}
              </button>
              <button class="recap-mood-pill ${assigned === 'p2' ? 'active' : ''}" onclick="BetweenUsUniverses.assignChore('${chore.id}', 'p2')">
                ${settings.partner2}
              </button>
              <button class="recap-mood-pill ${assigned === 'together' ? 'active' : ''}" onclick="BetweenUsUniverses.assignChore('${chore.id}', 'together')">
                معاً سوا 🤝
              </button>
            </div>
          </div>
        `;
      }).join("");
    },

    formatPickLabel(code, settings) {
      if (code === "p1") return settings.partner1;
      if (code === "p2") return settings.partner2;
      if (code === "together") return "شغل مشترك";
      return "لم يُحدد";
    },

    selectWhoDoesItChoice(choreId, voter, pick) {
      if (voter === "p1") {
        this.whoDoesItGame.p1Picks[choreId] = pick;
      } else {
        this.whoDoesItGame.p2Picks[choreId] = pick;
      }
      this.initHomeChores();
    },

    revealWhoDoesItGame() {
      const chores = (window.BetweenUsData && window.BetweenUsData.homeChores) || [];
      const p1 = this.whoDoesItGame.p1Picks;
      const p2 = this.whoDoesItGame.p2Picks;
      const settings = this.getSettings();

      let totalVoted = 0;
      let matches = 0;

      chores.forEach(c => {
        if (p1[c.id] && p2[c.id]) {
          totalVoted++;
          if (p1[c.id] === p2[c.id]) matches++;
        }
      });

      this.whoDoesItGame.revealed = true;
      this.initHomeChores();

      const resBox = document.getElementById("whoDoesItResultBox");
      if (resBox) {
        resBox.style.display = "block";
        const percent = totalVoted > 0 ? Math.round((matches / totalVoted) * 100) : 0;
        let commentary = "";

        if (percent >= 80) {
          commentary = "🎉 توافق أسطوري وانسجام فائق! أنتما متفقان على كل تفصيلة في البيت بدون أي جهد.";
        } else if (percent >= 50) {
          commentary = "💖 تفاهم جميل وواقعي! الأغلبية متفق عليها، والباقي محتاج كوبايتين شاي وقعدة صفا لتوزيعه بحب.";
        } else {
          commentary = "☕ روح المنافسة عالية والضحك مضمون! كل واحد عايز يدبس التاني في الغسيل والمواعين، وزعوها بالتساوي!";
        }

        resBox.innerHTML = `
          <div style="font-size: 1.15rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 6px;">
            نسبة التوافق في مسؤوليات البيت: ${percent}% (${matches} من ${totalVoted} مهام مشتركة)
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">
            ${commentary}
          </p>
        `;
      }

      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("✨ تم كشف الإجابات وحساب التوافق!");
      }
    },

    resetWhoDoesItGame() {
      this.whoDoesItGame = {
        p1Picks: {},
        p2Picks: {},
        revealed: false
      };
      const resBox = document.getElementById("whoDoesItResultBox");
      if (resBox) resBox.style.display = "none";
      this.initHomeChores();
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("🔄 تم تصفير اللعبة، العبوا من جديد!");
      }
    },

    formatAssignee(code, settings) {
      if (code === "p1") return settings.partner1;
      if (code === "p2") return settings.partner2;
      if (code === "together") return "شغل مشترك 🤝";
      return "لم يتم التحديد";
    },

    assignChore(choreId, assignee) {
      window.BetweenUsStorage.saveHomeChoreAssignment(choreId, assignee);
      this.initHomeChores();
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("✓ تم توزيع المسؤولية برضا ومحبة");
      }
    },

    // جدول التنظيف الذكي (Daily / Weekly / Monthly)
    initCleaningSchedule() {
      const container = document.getElementById("cleaningScheduleWrap");
      if (!container || !window.BetweenUsData) return;

      const schedule = (window.BetweenUsData.homeChecklists && window.BetweenUsData.homeChecklists.smartCleaningSchedule) || [];
      const savedState = window.BetweenUsStorage.getChecklistsState()["smartCleaningSchedule"] || {};

      const periods = [
        { key: "يومي", title: "☀️ الروتين اليومي (10 - 15 دقيقة)", icon: "✨" },
        { key: "أسبوعي", title: "🌿 الروتين الأسبوعي الشامل", icon: "🧹" },
        { key: "شهري", title: "💎 الروتين الشهري العميق", icon: "🧽" }
      ];

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 14px;">
          ${periods.map(p => {
            const items = schedule.filter(item => item.period === p.key);
            const doneCount = items.filter(item => !!savedState[item.id]).length;
            return `
              <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-lg); padding: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <strong style="color: var(--accent-gold); font-size: 1rem;">${p.title}</strong>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${doneCount}/${items.length}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  ${items.map(item => {
                    const isChecked = !!savedState[item.id];
                    return `
                      <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: ${isChecked ? 'var(--text-muted)' : 'var(--text-primary)'}; text-decoration: ${isChecked ? 'line-through' : 'none'}; cursor: pointer;">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="BetweenUsUniverses.toggleChecklist('smartCleaningSchedule', '${item.id}')" style="accent-color: var(--accent-gold); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;" />
                        <span>${item.item}</span>
                      </label>
                    `;
                  }).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    },

    // قوائم البيت الذكية مع Tabs
    initChecklists() {
      const container = document.getElementById("checklistsWrap");
      if (!container || !window.BetweenUsData) return;

      const lists = window.BetweenUsData.homeChecklists || {};
      const savedState = window.BetweenUsStorage.getChecklistsState();

      const tabs = [
        { key: "weeklyGroceries", label: "🛒 مشتريات الأسبوع" },
        { key: "homeNeedsList", label: "📋 احتياجات البيت" },
        { key: "kitchenOrganize", label: "🍳 ترتيب المطبخ" },
        { key: "closetOrganize", label: "👕 ترتيب الدولاب" },
        { key: "ramadanPrep", label: "🌙 تجهيزات رمضان" },
        { key: "eidPrep", label: "🎈 تجهيزات العيد" },
        { key: "travelPrep", label: "✈️ تجهيزات السفر" },
        { key: "homeMaintenance", label: "🔧 صيانة البيت" }
      ];

      const activeKey = this.activeChecklistKey || "weeklyGroceries";
      const currentItems = lists[activeKey] || [];
      const currentListState = savedState[activeKey] || {};

      container.innerHTML = `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-lg); padding: 18px;">
          <!-- Checklist Tabs Selector -->
          <div class="pill-selector" style="margin-bottom: 16px; overflow-x: auto; white-space: nowrap; padding-bottom: 4px;">
            ${tabs.map(t => `
              <button class="selector-tab ${activeKey === t.key ? 'active' : ''}" onclick="BetweenUsUniverses.switchChecklistTab('${t.key}')">
                ${t.label}
              </button>
            `).join("")}
          </div>

          <!-- Items Checklist -->
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
            ${currentItems.length ? currentItems.map(item => {
              const isChecked = !!currentListState[item.id];
              return `
                <label style="display: flex; align-items: center; gap: 10px; font-size: 0.92rem; color: ${isChecked ? 'var(--text-muted)' : 'var(--text-primary)'}; text-decoration: ${isChecked ? 'line-through' : 'none'}; cursor: pointer; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
                  <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="BetweenUsUniverses.toggleChecklist('${activeKey}', '${item.id}')" style="accent-color: var(--accent-gold); width: 18px; height: 18px;" />
                  <span>${item.item}</span>
                </label>
              `;
            }).join("") : '<div style="color: var(--text-muted); font-size: 0.9rem;">لا توجد عناصر مسجلة بعد.</div>'}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
            <span>تُحفظ تلقائياً في ذاكرة جهازكم</span>
            <button type="button" onclick="BetweenUsUniverses.resetCurrentChecklist('${activeKey}')" style="color: var(--accent-rose); font-size: 0.8rem; text-decoration: underline;">
              إعادة تعيين القائمة
            </button>
          </div>
        </div>
      `;
    },

    switchChecklistTab(key) {
      this.activeChecklistKey = key;
      this.initChecklists();
    },

    toggleChecklist(listKey, itemId) {
      window.BetweenUsStorage.toggleChecklistItem(listKey, itemId);
      if (listKey === "smartCleaningSchedule") {
        this.initCleaningSchedule();
      } else {
        this.initChecklists();
      }
    },

    resetCurrentChecklist(listKey) {
      const state = window.BetweenUsStorage.getChecklistsState();
      delete state[listKey];
      localStorage.setItem("between_us_checklists", JSON.stringify(state));
      this.initChecklists();
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("✓ تم تصفير القائمة بنجاح");
      }
    },

    // الحاجات اللي لازم نشتريها vs اللي نقدر نستغنى عنها
    initMustBuyVsCanSkip() {
      const container = document.getElementById("mustBuyVsCanSkipWrap");
      if (!container || !window.BetweenUsData) return;

      const data = window.BetweenUsData.mustBuyVsCanSkip || { mustBuy: [], canSkip: [] };

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 16px;">
          <!-- Must Buy -->
          <div style="background: rgba(74, 222, 128, 0.05); border: 1px solid rgba(74, 222, 128, 0.3); border-radius: var(--radius-lg); padding: 18px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="font-size: 1.3rem;">✅</span>
              <h4 style="font-size: 1.1rem; color: #4ade80; margin: 0;">حاجات لازم نشتريها (استثمار حقيقي)</h4>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${data.mustBuy.map(item => `
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: var(--radius-md); padding: 10px 12px;">
                  <strong style="color: var(--text-primary); font-size: 0.92rem; display: block; margin-bottom: 2px;">${item.title}</strong>
                  <span style="color: var(--text-secondary); font-size: 0.82rem; line-height: 1.4;">${item.reason}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Can Skip -->
          <div style="background: rgba(226, 125, 96, 0.05); border: 1px solid rgba(226, 125, 96, 0.3); border-radius: var(--radius-lg); padding: 18px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="font-size: 1.3rem;">❌</span>
              <h4 style="font-size: 1.1rem; color: var(--accent-rose); margin: 0;">حاجات نقدر نستغنى عنها (مضيعة للمال)</h4>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${data.canSkip.map(item => `
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: var(--radius-md); padding: 10px 12px;">
                  <strong style="color: var(--text-primary); font-size: 0.92rem; display: block; margin-bottom: 2px;">${item.title}</strong>
                  <span style="color: var(--text-secondary); font-size: 0.82rem; line-height: 1.4;">${item.reason}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    },

    // ==========================================
    // 2. UNIVERSE الفلوس والميزانية ("نعيش أحسن بأقل")
    // ==========================================
    initBudgetCalculator() {
      const form = document.getElementById("budgetCalculatorForm");
      if (!form) return;

      const current = window.BetweenUsStorage.getBudget();
      document.getElementById("budgetIncome").value = current.income || 20000;
      document.getElementById("budgetFood").value = current.food || 5000;
      document.getElementById("budgetBills").value = current.bills || 2500;
      document.getElementById("budgetTransport").value = current.transport || 1500;
      document.getElementById("budgetEntertainment").value = current.entertainment || 1500;
      document.getElementById("budgetHome").value = current.home || 3000;
      document.getElementById("budgetEmergency").value = current.emergency || 2000;

      this.calculateBudget();

      form.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => this.calculateBudget());
      });
    },

    calculateBudget() {
      const getNum = id => Number(document.getElementById(id)?.value) || 0;

      const income = getNum("budgetIncome");
      const food = getNum("budgetFood");
      const bills = getNum("budgetBills");
      const transport = getNum("budgetTransport");
      const entertainment = getNum("budgetEntertainment");
      const home = getNum("budgetHome");
      const emergency = getNum("budgetEmergency");

      const totalExpenses = food + bills + transport + entertainment + home + emergency;
      const savings = income - totalExpenses;
      const savingsPercent = income > 0 ? Math.round((savings / income) * 100) : 0;

      const totalExpEl = document.getElementById("calcTotalExpenses");
      const savingsEl = document.getElementById("calcSavings");
      const savingsPercentEl = document.getElementById("calcSavingsPercent");
      const adviceEl = document.getElementById("budgetAdviceBox");

      if (totalExpEl) totalExpEl.textContent = totalExpenses.toLocaleString("ar-EG") + " ج.م";
      if (savingsEl) {
        savingsEl.textContent = savings.toLocaleString("ar-EG") + " ج.م";
        savingsEl.style.color = savings >= 0 ? "var(--accent-gold)" : "var(--accent-rose)";
      }
      if (savingsPercentEl) {
        savingsPercentEl.textContent = `${savingsPercent}% من الدخل`;
      }

      // "هل نقدر نوفر أكتر؟" - مقترحات ذكية دقيقة مبنية على الأرقام المدخلة
      if (adviceEl) {
        const tips = [];
        if (savings < 0) {
          tips.push("🚨 عجز مالي: المصروفات تتجاوز الدخل الشهري! يجب فوراً إيقاف الخروجات الخارجية والطبخ المنزلي لضبط الدفاتر.");
        }
        if (income > 0 && (food / income) > 0.30) {
          const excess = Math.round(food - (income * 0.25));
          tips.push(`🛒 بند الأكل يمثل ${Math.round((food / income) * 100)}% من الدخل؛ التسوق الأسبوعي بالجملة والطبخ البيتي يوفر لكم حوالي ${excess.toLocaleString("ar-EG")} ج.م شهرياً.`);
        }
        if (income > 0 && (entertainment / income) > 0.12) {
          tips.push(`☕ بند الترفيه والخروجات مرتفع؛ استبدال خروجتين بسهرة سينما دافئة في البيت يوفر ما لا يقل عن 1,000 ج.م شهرياً.`);
        }
        if (emergency < (income * 0.08)) {
          tips.push(`🛡️ صندوق الطوارئ الشهري قليل نسبياً؛ حاولوا زيادة تخصيصه إلى 10% على الأقل لتأمين أي ظرف صحي أو صيانة مفاجئة.`);
        }
        if (savingsPercent >= 20) {
          tips.push(`🌟 ميزانية ممتازة ومثالية! أنتم تدخرون أكثر من 20%، استمروا في وضع الفائض في استثمار طويل الأجل أو دهب للحماية من التضخم.`);
        } else if (savingsPercent > 0 && savingsPercent < 15) {
          tips.push(`💡 هدف التوفير القادم: محاولة الوصول إلى نسبة 20% تدريجياً عبر ضبط المشتريات اللحظية غير الضرورية.`);
        }

        if (tips.length === 0) {
          tips.push("✓ ميزانية متوازنة ومريحة، خطوة جيدة وممتازة نحو استقراركم المالي المشترك.");
        }

        adviceEl.innerHTML = `
          <strong style="color: var(--accent-gold); font-size: 0.95rem; display: block; margin-bottom: 6px;">💡 هل نقدر نوفر أكتر؟ (اقتراحات مخصصة بناءً على أرقامكم):</strong>
          <ul style="padding-right: 18px; margin: 0; font-size: 0.88rem; color: var(--text-primary); line-height: 1.6;">
            ${tips.map(t => `<li>${t}</li>`).join("")}
          </ul>
        `;
      }

      // Update 50/30/20 Box
      const ruleWrap = document.getElementById("rule503020Wrap");
      if (ruleWrap && income > 0) {
        const needs50 = Math.round(income * 0.50);
        const wants30 = Math.round(income * 0.30);
        const savings20 = Math.round(income * 0.20);
        const actualNeeds = food + bills + transport + home;
        const actualWants = entertainment;

        ruleWrap.innerHTML = `
          <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 8px 12px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; color: var(--text-primary); margin-bottom: 2px;">
              <span>🏠 50% احتياجات أساسية وفواتير:</span>
              <strong style="color: var(--accent-gold);">${needs50.toLocaleString("ar-EG")} ج.م</strong>
            </div>
            <span style="font-size: 0.76rem; color: var(--text-muted);">المصروف الفعلي: ${actualNeeds.toLocaleString("ar-EG")} ج.م (${Math.round((actualNeeds/income)*100)}%)</span>
          </div>
          <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 8px 12px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; color: var(--text-primary); margin-bottom: 2px;">
              <span>☕ 30% رغبات وفسح وترفيه:</span>
              <strong style="color: var(--accent-gold-light);">${wants30.toLocaleString("ar-EG")} ج.م</strong>
            </div>
            <span style="font-size: 0.76rem; color: var(--text-muted);">المصروف الفعلي: ${actualWants.toLocaleString("ar-EG")} ج.م (${Math.round((actualWants/income)*100)}%)</span>
          </div>
          <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 8px 12px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; color: var(--text-primary); margin-bottom: 2px;">
              <span>💰 20% ادخار واستثمار للمستقبل:</span>
              <strong style="color: #4ade80;">${savings20.toLocaleString("ar-EG")} ج.م</strong>
            </div>
            <span style="font-size: 0.76rem; color: var(--text-muted);">الفائض الفعلي الحالي: ${savings.toLocaleString("ar-EG")} ج.م (${savingsPercent}%)</span>
          </div>
        `;
      }

      // Update Emergency Fund Wrap
      const emWrap = document.getElementById("emergencyFundWrap");
      if (emWrap && totalExpenses > 0) {
        const threeMonths = totalExpenses * 3;
        const sixMonths = totalExpenses * 6;
        emWrap.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem;">
            <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 10px 12px;">
              <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">أمان لـ 3 شهور مصروفات كاملة:</span>
              <strong style="font-size: 1.15rem; color: var(--accent-gold);">${threeMonths.toLocaleString("ar-EG")} ج.م</strong>
            </div>
            <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 10px 12px;">
              <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">أمان تام لـ 6 شهور (الراحة النفسية القصوى):</span>
              <strong style="font-size: 1.15rem; color: #4ade80;">${sixMonths.toLocaleString("ar-EG")} ج.م</strong>
            </div>
            <span style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">
              بتخصيص ${emergency.toLocaleString("ar-EG")} ج.م شهرياً، ستصلان لأمان الـ 3 شهور خلال ${Math.ceil(threeMonths / Math.max(emergency, 500))} شهراً إن شاء الله.
            </span>
          </div>
        `;
      }

      // Save to storage
      window.BetweenUsStorage.saveBudget({
        income, food, bills, transport, entertainment, home, emergency, savings
      });
    },

    // الحاجات بالجملة والمشتريات الذكية
    initWholesaleVsWasted() {
      const container = document.getElementById("wholesaleVsWastedWrap");
      if (!container || !window.BetweenUsData) return;

      const data = window.BetweenUsData.wholesaleVsWasted || { buyWholesale: [], moneyWasters: [] };

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 16px;">
          <!-- Wholesale -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-lg); padding: 18px;">
            <h4 style="font-size: 1.1rem; color: var(--accent-gold); margin: 0 0 12px;">📦 نشتريها بالجملة ونوفر كتير</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${data.buyWholesale.map(item => `
                <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 10px 12px;">
                  <strong style="color: var(--text-primary); font-size: 0.92rem; display: block;">${item.item}</strong>
                  <span style="color: var(--text-secondary); font-size: 0.82rem;">${item.tip}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Wasters -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-lg); padding: 18px;">
            <h4 style="font-size: 1.1rem; color: var(--accent-rose); margin: 0 0 12px;">⚠️ حاجات ما تستاهلش فلوس وممكن تضيع المرتب</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${data.moneyWasters.map(item => `
                <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 10px 12px;">
                  <strong style="color: var(--text-primary); font-size: 0.92rem; display: block;">${item.item}</strong>
                  <span style="color: var(--text-secondary); font-size: 0.82rem;">${item.tip}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    },

    // 3. SMART SHOPPING ("نشتري ولا لأ؟")
    initSmartShopping() {
      const container = document.getElementById("smartShoppingWrap");
      if (!container || !window.BetweenUsData) return;

      const criteria = window.BetweenUsData.smartShoppingCriteria || [];

      container.innerHTML = `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px;">
          <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 8px;">🛒 حاسبة قرار الشراء (نشتري ولا لأ؟)</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px;">
            قبل ما تدفعوا في أي جهاز أو لبس أو طلبية أونلاين، جاوبوا على الأسئلة دي بصدق وشوفوا النتيجة:
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${criteria.map(c => `
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; border-bottom: 1px solid var(--border-hairline); padding-bottom: 8px;">
                <span style="font-size: 0.92rem; color: var(--text-primary);">${c.question}</span>
                <div style="display: flex; gap: 6px;">
                  <button type="button" class="recap-mood-pill shop-q-btn" data-weight="${c.weight}" data-val="yes" onclick="BetweenUsUniverses.selectShopAnswer(this, ${c.weight})">نعم ✓</button>
                  <button type="button" class="recap-mood-pill shop-q-btn" data-weight="${c.weight}" data-val="no" onclick="BetweenUsUniverses.selectShopAnswer(this, 0)">لا ✕</button>
                </div>
              </div>
            `).join("")}
          </div>

          <div id="shopDecisionResult" style="text-align: center; padding: 14px; border-radius: var(--radius-md); background: rgba(0, 0, 0, 0.2); font-weight: 700; font-size: 1.1rem; color: var(--accent-gold);">
            جاوبوا على الأسئلة لكشف القرار النهائي...
          </div>
        </div>
      `;
    },

    selectShopAnswer(btn, score) {
      const parent = btn.parentElement;
      parent.querySelectorAll(".shop-q-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("data-selected-score", score);

      let totalScore = 0;
      let answeredCount = 0;
      document.querySelectorAll(".shop-q-btn.active").forEach(b => {
        totalScore += Number(b.getAttribute("data-selected-score") || 0);
        answeredCount++;
      });

      const resBox = document.getElementById("shopDecisionResult");
      if (!resBox) return;

      if (answeredCount < 5) {
        resBox.textContent = `جاوبتم على ${answeredCount} من 5 أسئلة...`;
        return;
      }

      if (totalScore >= 75) {
        resBox.innerHTML = `🟢 BUY 🛒 (اشتروها وأنتما مطمئنان! قرار مستحق ومفيد لحياتكما)`;
        resBox.style.color = "#4ade80";
      } else if (totalScore >= 50) {
        resBox.innerHTML = `🟡 WAIT ⏳ (انتظروا 48 ساعة! لو لسه محتاجينها بعد يومين اشتروها، وإلا وفروها)`;
        resBox.style.color = "var(--accent-gold)";
      } else {
        resBox.innerHTML = `🔴 DON'T BUY ❌ (وفروها فوراً! شراء عاطفي غير ضروري ولن يضيف قيمة حقيقية)`;
        resBox.style.color = "var(--accent-rose)";
      }
    },

    // تحدي أسبوع بدون مصاريف غير ضرورية (No-Spend Week)
    initSavingsChallenges() {
      const container = document.getElementById("savingsChallengesWrap");
      if (!container || !window.BetweenUsData) return;

      const week = (window.BetweenUsData.savingsChallenges && window.BetweenUsData.savingsChallenges.noSpendWeek) || [];
      const savedState = window.BetweenUsStorage.getChecklistsState()["noSpendWeek"] || {};

      container.innerHTML = `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-lg); padding: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">تحدي الأسبوع للتوفير الذكي</div>
              <h3 style="font-size: 1.15rem; color: var(--text-primary); margin: 2px 0;">تحدي أسبوع بدون مصاريف غير ضرورية 🎯</h3>
            </div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">7 أيام لتوفير ملموس</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${week.map(w => {
              const isDone = !!savedState[`day-${w.day}`];
              return `
                <label style="display: flex; align-items: flex-start; gap: 10px; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 10px 12px; cursor: pointer;">
                  <input type="checkbox" ${isDone ? 'checked' : ''} onchange="BetweenUsUniverses.toggleChecklist('noSpendWeek', 'day-${w.day}')" style="accent-color: var(--accent-gold); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;" />
                  <div>
                    <strong style="color: ${isDone ? 'var(--text-muted)' : 'var(--text-primary)'}; font-size: 0.92rem; text-decoration: ${isDone ? 'line-through' : 'none'};">يوم ${w.day}: ${w.title}</strong>
                    <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">${w.task}</div>
                  </div>
                </label>
              `;
            }).join("")}
          </div>
        </div>
      `;
    },

    // سيناريو الـ 10,000 جنيه والنقاش التفاعلي
    initTenThousandScenario() {
      const optionsWrap = document.getElementById("tenThousandOptionsWrap");
      if (!optionsWrap || !window.BetweenUsData) return;

      const disc = (window.BetweenUsData.moneyDiscussions && window.BetweenUsData.moneyDiscussions[0]) || {
        options: ["ندخرهم", "نشتري حاجة للبيت", "نستثمر جزء", "نسافر", "نقسمهم"]
      };

      optionsWrap.innerHTML = disc.options.map((opt, i) => `
        <button type="button" class="btn-secondary ten-k-btn" onclick="BetweenUsUniverses.selectTenThousandOption(this, '${opt}')" style="font-size: 0.88rem; min-height: 40px;">
          ${opt}
        </button>
      `).join("");
    },

    selectTenThousandOption(btn, optionText) {
      document.querySelectorAll(".ten-k-btn").forEach(b => {
        b.style.borderColor = "var(--border-hairline)";
        b.style.color = "var(--text-primary)";
      });
      btn.style.borderColor = "var(--accent-gold)";
      btn.style.color = "var(--accent-gold)";

      const box = document.getElementById("tenThousandReflectionBox");
      if (!box) return;

      box.style.display = "block";
      box.innerHTML = `
        <div style="margin-bottom: 10px;">
          <strong style="color: var(--accent-gold); font-size: 1rem; display: block; margin-bottom: 4px;">
            اخترتم: "${optionText}"
          </strong>
          <p style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.5; margin-bottom: 8px;">
            💬 <strong>ليه اخترتوا كده؟</strong> وإزاي نقدر نرضي رغبة الأمان المالي ورغبة الاستمتاع بالحياة معاً بدون تعارض؟
          </p>
        </div>
        <div class="form-group" style="margin-bottom: 10px;">
          <textarea id="tenThousandNotes" class="form-textarea" rows="2" placeholder="اكتبوا فكرتكم أو اتفاقكم هنا..."></textarea>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button type="button" class="btn-primary" onclick="BetweenUsUniverses.saveTenThousandReflection('${optionText}')" style="font-size: 0.85rem; min-height: 36px;">
            حفظ في سهرتنا ✦
          </button>
        </div>
      `;
    },

    saveTenThousandReflection(optionText) {
      const notes = document.getElementById("tenThousandNotes")?.value || "";
      window.BetweenUsStorage.addToTalk(`لو معانا 10,000 جنيه: اخترنا (${optionText}) - ${notes}`, "مالي");
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("✓ تم حفظ قراركم المالي في سهرة النقاش!");
      }
    },

    // ==========================================
    // 3. UNIVERSE تربية الأولاد ("أطفالنا في المستقبل")
    // ==========================================
    initParentingBeforeKids() {
      const container = document.getElementById("parentingBeforeKidsWrap");
      if (!container || !window.BetweenUsData) return;

      const list = window.BetweenUsData.parentingBeforeKidsDiscussions || [];

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: right;">
          ${list.map((item, idx) => `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong style="color: var(--accent-gold); font-size: 0.95rem;">${idx + 1}. ${item.topic}</strong>
                <button type="button" class="recap-mood-pill" style="font-size: 0.75rem; padding: 2px 8px;" onclick="BetweenUsStorage.addToTalk('${item.topic}: ${item.question}', 'تربية'); BetweenUsApp.showToast('📌 تم الحفظ في نتكلم فيه بعدين');">
                  📌 ناقش الليلة
                </button>
              </div>
              <p style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.5; margin-bottom: 6px;">
                ${item.question}
              </p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); font-style: italic; background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: var(--radius-sm);">
                💡 إضاءة للنقاش: ${item.prompt}
              </div>
            </div>
          `).join("")}
        </div>
      `;
    },

    initParenting() {
      const container = document.getElementById("parentingScenariosWrap");
      if (!container || !window.BetweenUsData) return;

      const scenarios = window.BetweenUsData.parentingScenarios || [];
      if (scenarios.length === 0) return;

      const sc = scenarios[this.currentParentingIndex % scenarios.length];
      const settings = this.getSettings();

      container.innerHTML = `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 22px;">
          <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 6px;">
            موقف تربوي واقعي ${this.currentParentingIndex + 1} من ${scenarios.length}
          </div>
          <h3 style="font-size: 1.25rem; color: var(--text-primary); margin-bottom: 8px;">${sc.title}</h3>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">${sc.context}</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr)); gap: 12px; margin-bottom: 18px;">
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 14px;">
              <strong style="color: var(--accent-gold); font-size: 0.9rem; display: block; margin-bottom: 4px;">وجهة نظر ${settings.partner1}:</strong>
              <p style="font-size: 0.85rem; color: var(--text-primary); line-height: 1.5;">${sc.ahmedPerspective.replace(/أحمد/g, settings.partner1)}</p>
            </div>
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 14px;">
              <strong style="color: var(--accent-rose); font-size: 0.9rem; display: block; margin-bottom: 4px;">وجهة نظر ${settings.partner2}:</strong>
              <p style="font-size: 0.85rem; color: var(--text-primary); line-height: 1.5;">${sc.esraaPerspective.replace(/إسراء/g, settings.partner2)}</p>
            </div>
          </div>

          <h4 style="font-size: 0.95rem; color: var(--accent-gold); margin-bottom: 8px;">نقاط نقاش وبناء التفاهم المشترك:</h4>
          <ul style="padding-right: 20px; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 18px;">
            ${sc.discussionQuestions.map(q => `<li>${q}</li>`).join("")}
          </ul>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn-primary" onclick="BetweenUsUniverses.nextParentingScenario()" style="min-height: 38px; font-size: 0.85rem;">
              الموقف التالي ←
            </button>
          </div>
        </div>
      `;
    },

    nextParentingScenario() {
      const scenarios = window.BetweenUsData.parentingScenarios || [];
      this.currentParentingIndex = (this.currentParentingIndex + 1) % scenarios.length;
      this.initParenting();
    },

    initFutureChild() {
      const container = document.getElementById("futureChildFormWrap");
      if (!container) return;

      const dreams = window.BetweenUsStorage.getFutureChildDreams();

      container.innerHTML = `
        <form onsubmit="BetweenUsUniverses.saveFutureChild(event)" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 22px;">
          <h3 style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 6px;">🧒 طفلنا في المستقبل (صندوق الأحلام)</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
            اكتبوا أمنياتكم وقيمكم لطفلكم القادم، وستُحفظ كوثيقة وذكرى خالدة:
          </p>

          <div class="form-group">
            <label class="form-label">الأسماء المقترحة للبنت والولد</label>
            <input type="text" id="fcNames" class="form-input" value="${dreams.suggestedNames || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">أهم القيم الأخلاقية والدينية اللي عايزين نزرعها فيه</label>
            <input type="text" id="fcValues" class="form-input" value="${dreams.coreValues || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">أول لعبة هنشتريها وأول كتاب هنقرأه له سوا</label>
            <input type="text" id="fcFirsts" class="form-input" value="${dreams.firstBook || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">حاجة مش عايزين طفلنا يعيشها زي ما عشناها زمان</label>
            <textarea id="fcNotRepeat" class="form-textarea" rows="2" required>${dreams.whatNotToRepeat || ''}</textarea>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 14px;">
            <button type="submit" class="btn-primary">
              حفظ في صندوق الذكريات ✦
            </button>
          </div>
        </form>
      `;
    },

    saveFutureChild(e) {
      e.preventDefault();
      const data = {
        suggestedNames: document.getElementById("fcNames").value,
        coreValues: document.getElementById("fcValues").value,
        firstBook: document.getElementById("fcFirsts").value,
        whatNotToRepeat: document.getElementById("fcNotRepeat").value
      };
      window.BetweenUsStorage.saveFutureChildDreams(data);
      window.BetweenUsStorage.addMemory(
        "moment",
        `🧒 وثيقة طفلنا في المستقبل (${data.suggestedNames})`,
        `القيم: ${data.coreValues} · أول كتاب: ${data.firstBook} · وعدنا له: ${data.whatNotToRepeat}`,
        new Date().toLocaleDateString("ar-EG")
      );
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("✓ تم حفظ أحلام طفلكم في صندوق الذكريات بنجاح!");
      }
    },

    // ==========================================
    // 5. UNIVERSE العمل والبيزنس ("نشتغل سوا")
    // ==========================================
    initBusinessLab() {
      const container = document.getElementById("businessLabWrap");
      if (!container || !window.BetweenUsData) return;

      const businessData = window.BetweenUsData.businessByBudget || [];
      const challenge = window.BetweenUsData.sevenDayChallenge || [];

      container.innerHTML = `
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 12px;">💼 أفكار مشاريع حسب رأس المال المتاح</h3>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${businessData.map(group => `
              <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-lg); padding: 18px;">
                <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 8px;">
                  💰 الميزانية: ${group.budgetRange}
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  ${group.ideas.map(idea => `
                    <div style="background: rgba(0, 0, 0, 0.2); border-radius: var(--radius-md); padding: 14px;">
                      <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 4px;">${idea.title}</h4>
                      <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 6px;">${idea.desc}</p>
                      <div style="font-size: 0.82rem; color: var(--accent-gold);"><strong>تقسيم الأدوار بينكم:</strong> ${idea.coupleRole}</div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div style="background: linear-gradient(135deg, rgba(104, 24, 38, 0.3) 0%, rgba(35, 31, 39, 0.85) 100%); border: 1px solid rgba(212, 122, 136, 0.3); border-radius: var(--radius-xl); padding: 22px;">
          <h3 style="font-size: 1.2rem; color: #FFFFFF; margin-bottom: 6px;">🚀 تحدي الـ 7 أيام لإطلاق أول بيزنس مشترك</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
            اختاروا فكرة واحدة ونفذوا خطوة واحدة كل يوم سوا:
          </p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${challenge.map(c => `
              <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(0, 0, 0, 0.25); border-radius: var(--radius-md); padding: 10px 14px;">
                <span style="background: var(--accent-gold); color: #000; font-weight: 700; font-size: 0.75rem; border-radius: var(--radius-sm); padding: 2px 8px; flex-shrink: 0; margin-top: 2px;">يوم ${c.day}</span>
                <div>
                  <strong style="font-size: 0.92rem; color: var(--text-primary);">${c.title}:</strong>
                  <span style="font-size: 0.88rem; color: var(--text-secondary);"> ${c.task}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    },

    // ==========================================
    // 6. UNIVERSE الأكل والطبخ ("نطبخ إيه؟")
    // ==========================================
    initCookingGenerator() {
      const container = document.getElementById("cookingGeneratorWrap");
      if (!container || !window.BetweenUsData) return;

      const recipes = window.BetweenUsData.pantryRecipes || [];

      container.innerHTML = `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px;">
          <h3 style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 6px;">🍳 محتارين تطبخوا إيه النهاردة؟</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px;">
            وجبات بيتوتية دافية وسريعة بأقل ميزانية ومكونات موجودة في كل بيت مصري:
          </p>
          <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
            ${recipes.map(r => `
              <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <strong style="font-size: 1rem; color: var(--accent-gold);">${r.name}</strong>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">⏱️ ${r.time} · ${r.budget}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px;">
                  <strong>المكونات:</strong> ${r.ingredients.join(" · ")}
                </div>
                <div style="font-size: 0.82rem; color: var(--accent-gold-light); font-style: italic;">
                  💡 سر الطعم: ${r.tips}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    },

    // ==========================================
    // 7. UNIVERSE مواقف الحياة الصعبة
    // ==========================================
    initLifeDilemmas() {
      const container = document.getElementById("lifeDilemmasWrap");
      if (!container || !window.BetweenUsData) return;

      const list = window.BetweenUsData.lifeDilemmas || [];
      if (list.length === 0) return;

      const item = list[this.currentDilemmaIndex % list.length];

      container.innerHTML = `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 22px;">
          <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 6px;">
            موقف من واقع الحياة ${this.currentDilemmaIndex + 1} من ${list.length}
          </div>
          <h3 style="font-size: 1.25rem; color: var(--text-primary); margin-bottom: 8px;">${item.title}</h3>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">${item.scenario}</p>

          <h4 style="font-size: 0.92rem; color: var(--text-primary); margin-bottom: 10px;">كل واحد يختار التصرف اللي يراه أصح:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px;">
            ${item.options.map((opt, i) => `
              <button class="topic-card" onclick="this.style.borderColor='var(--accent-gold)'; this.style.background='rgba(216,178,110,0.1)';" style="padding: 12px 14px; text-align: right; font-size: 0.92rem; color: var(--text-primary);">
                ${i + 1}. ${opt}
              </button>
            `).join("")}
          </div>

          <div style="background: rgba(216, 178, 110, 0.08); border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 16px; font-size: 0.9rem; color: var(--accent-gold);">
            💬 <strong>سؤال للنقاش بعد الاختيار:</strong> ${item.prompt}
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn-primary" onclick="BetweenUsUniverses.nextDilemma()" style="min-height: 38px; font-size: 0.85rem;">
              الموقف التالي ←
            </button>
          </div>
        </div>
      `;
    },

    nextDilemma() {
      const list = window.BetweenUsData.lifeDilemmas || [];
      this.currentDilemmaIndex = (this.currentDilemmaIndex + 1) % list.length;
      this.initLifeDilemmas();
    },

    // ==========================================
    // 8. DETECTIVE NIGHT 🕵️ (ألغاز وقضايا تحقيق)
    // ==========================================
    initDetectiveNight() {
      const container = document.getElementById("detectiveNightWrap");
      if (!container || !window.BetweenUsData) return;

      const cases = window.BetweenUsData.detectiveCases || [];
      if (cases.length === 0) return;

      const c = cases[this.currentDetectiveCaseIndex % cases.length];

      container.innerHTML = `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 24px;">
          <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 6px;">
            🕵️ قضية رقم ${this.currentDetectiveCaseIndex + 1} من ${cases.length}
          </div>
          <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 10px;">${c.title}</h3>
          <p style="font-size: 0.98rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 18px;">${c.story}</p>

          <h4 style="font-size: 1rem; color: var(--accent-gold); margin-bottom: 8px;">🔍 الأدلة التي تم جمعها من مسرح الجريمة:</h4>
          <ul style="padding-right: 20px; font-size: 0.9rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 20px;">
            ${c.clues.map(clue => `<li>${clue}</li>`).join("")}
          </ul>

          <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 10px;">المشتبه بهم وأقوالهم:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
            ${c.suspects.map(s => `
              <button class="topic-card" onclick="BetweenUsUniverses.selectSuspect('${s.id}')" style="padding: 12px 16px; text-align: right;">
                <div style="font-weight: 700; color: var(--accent-gold); font-size: 0.95rem;">[${s.id}] ${s.name}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">${s.claim}</div>
              </button>
            `).join("")}
          </div>

          <div id="detectiveSolutionReveal" style="display: none; background: rgba(104, 24, 38, 0.4); border: 1px solid var(--accent-rose); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px; animation: fadeIn 0.3s ease;">
            <h4 style="font-size: 1.05rem; color: #FFFFFF; margin-bottom: 6px;">كشف الحقيقة والحل:</h4>
            <p style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 8px;">${c.solution}</p>
            <div style="font-size: 0.85rem; color: var(--accent-gold); font-style: italic;">${c.discussion}</div>
          </div>

          <div style="display: flex; gap: 10px; justify-content: space-between; flex-wrap: wrap;">
            <button class="btn-primary" onclick="BetweenUsUniverses.revealDetectiveSolution()">
              🔓 اكشف هوية المجرم والحقيقة
            </button>
            <button class="btn-secondary" onclick="BetweenUsUniverses.nextDetectiveCase()">
              القضية التالية ←
            </button>
          </div>
        </div>
      `;
    },

    selectSuspect(id) {
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast(`اخترتم المشتبه به [${id}].. افتحوا زر الحل للتأكد!`);
      }
    },

    revealDetectiveSolution() {
      const box = document.getElementById("detectiveSolutionReveal");
      if (box) box.style.display = "block";
    },

    nextDetectiveCase() {
      const cases = window.BetweenUsData.detectiveCases || [];
      this.currentDetectiveCaseIndex = (this.currentDetectiveCaseIndex + 1) % cases.length;
      this.initDetectiveNight();
    },

    // ==========================================
    // 9. UNIVERSE نبني حياتنا (Life Roadmap)
    // ==========================================
    initLifeRoadmap() {
      const container = document.getElementById("lifeRoadmapWrap");
      if (!container || !window.BetweenUsData) return;

      const roadmap = window.BetweenUsData.lifeRoadmap || [];
      const progress = window.BetweenUsStorage.getRoadmapProgress();

      container.innerHTML = roadmap.map(r => `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">${r.icon}</span>
              <strong style="font-size: 1.1rem; color: var(--text-primary);">${r.title}</strong>
            </div>
            <span style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">المرحلة ${r.phase}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px; margin: 12px 0;">
            ${r.milestones.map((m, idx) => {
              const key = `rm-${r.phase}-${idx}`;
              const checked = !!progress[key];
              return `
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: ${checked ? 'var(--text-muted)' : 'var(--text-primary)'}; text-decoration: ${checked ? 'line-through' : 'none'}; cursor: pointer;">
                  <input type="checkbox" ${checked ? 'checked' : ''} onchange="BetweenUsUniverses.toggleRoadmap('${key}')" style="accent-color: var(--accent-gold); width: 16px; height: 16px;" />
                  <span>${m}</span>
                </label>
              `;
            }).join("")}
          </div>

          <div style="background: rgba(0, 0, 0, 0.2); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 0.85rem; color: var(--accent-gold);">
            💬 <strong>سؤال المرحلة:</strong> ${r.question}
          </div>
        </div>
      `).join("");
    },

    toggleRoadmap(key) {
      window.BetweenUsStorage.toggleRoadmapMilestone(key);
      this.initLifeRoadmap();
    },

    // ==========================================
    // 10. ⭐ 🎲 "اعمل لنا سهرة" (Full Evening Generator)
    // ==========================================
    initEveningGenerator() {
      const triggers = document.querySelectorAll(".btn-evening-generator-trigger");
      triggers.forEach(btn => {
        btn.addEventListener("click", () => this.openEveningGeneratorModal());
      });
    },

    openEveningGeneratorModal() {
      const modal = document.getElementById("eveningGeneratorModal");
      if (!modal) return;
      this.renderEveningOptions();
      modal.classList.add("active");
    },

    renderEveningOptions() {
      const content = document.getElementById("eveningModalContent");
      if (!content) return;

      content.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 2.2rem; margin-bottom: 6px;">🎲</div>
          <h2 style="font-size: 1.55rem; color: var(--text-primary); margin-bottom: 6px;">اعمل لنا سهرة كاملة</h2>
          <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto;">
            حددوا الوقت والمزاج، وسنقوم ببناء برنامج سهرة متكاملة خطوة بخطوة من الحوار إلى اللعب والذكريات.
          </p>
        </div>

        <div style="margin-bottom: 18px;">
          <label style="font-size: 0.88rem; font-weight: 700; color: var(--accent-gold); display: block; margin-bottom: 8px;">1. قدامكم وقت قد إيه؟</label>
          <div class="pill-selector" id="eveningTimeSelector">
            <button type="button" class="recap-mood-pill active" onclick="BetweenUsUniverses.selectEveningPill(this)">⚡ 5 دقائق سريعة</button>
            <button type="button" class="recap-mood-pill" onclick="BetweenUsUniverses.selectEveningPill(this)">☕ 15 دقيقة</button>
            <button type="button" class="recap-mood-pill" onclick="BetweenUsUniverses.selectEveningPill(this)">🌙 30 دقيقة</button>
            <button type="button" class="recap-mood-pill" onclick="BetweenUsUniverses.selectEveningPill(this)">🍷 ساعة كاملة</button>
            <button type="button" class="recap-mood-pill" onclick="BetweenUsUniverses.selectEveningPill(this)">✨ الليلة طويلة وفاضيين</button>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <label style="font-size: 0.88rem; font-weight: 700; color: var(--accent-gold); display: block; margin-bottom: 8px;">2. مزاجكم إيه الليلة؟</label>
          <div class="pill-selector" id="eveningMoodSelector">
            <button type="button" class="recap-mood-pill active" onclick="BetweenUsUniverses.selectEveningPill(this)">❤️ هادي ورومانسي</button>
            <button type="button" class="recap-mood-pill" onclick="BetweenUsUniverses.selectEveningPill(this)">😂 ضحك وفرفشة</button>
            <button type="button" class="recap-mood-pill" onclick="BetweenUsUniverses.selectEveningPill(this)">🧠 عميق ونقاشي</button>
            <button type="button" class="recap-mood-pill" onclick="BetweenUsUniverses.selectEveningPill(this)">🎮 لعب ومنافسة</button>
            <button type="button" class="recap-mood-pill" onclick="BetweenUsUniverses.selectEveningPill(this)">🏡 نخطط لمستقبلنا</button>
            <button type="button" class="recap-mood-pill" onclick="BetweenUsUniverses.selectEveningPill(this)">🎬 سهرة فيلم</button>
          </div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn-primary" onclick="BetweenUsUniverses.generateEveningPlan()" style="min-height: 48px; padding: 0 24px; font-size: 1rem;">
            ✦ جهز لنا السهرة دلوقتي
          </button>
        </div>
      `;
    },

    selectEveningPill(btn) {
      btn.parentElement.querySelectorAll(".recap-mood-pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
    },

    generateEveningPlan() {
      const content = document.getElementById("eveningModalContent");
      if (!content || !window.BetweenUsData) return;

      const data = window.BetweenUsData;
      const topic = data.topics ? data.topics[Math.floor(Math.random() * data.topics.length)] : null;
      const story = data.stories ? data.stories[Math.floor(Math.random() * data.stories.length)] : null;
      const challenge = data.challenges ? data.challenges[Math.floor(Math.random() * data.challenges.length)] : null;
      const dilemma = data.lifeDilemmas ? data.lifeDilemmas[Math.floor(Math.random() * data.lifeDilemmas.length)] : null;

      content.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700;">برنامج سهرتكم المتكامل ♾️</div>
          <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-top: 4px;">رحلة سهرة الليلة</h2>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
          <!-- Step 1: Conversation -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700;">1. 💬 موضوع نبدأ بيه الكلام</span>
              <a href="topics.html?id=${topic?.id}" class="section-link">فتح الجلسة ←</a>
            </div>
            <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 4px;">${topic?.title || 'موضوع الليلة'}</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${topic?.description || ''}</p>
          </div>

          <!-- Step 2: Story or Mystery -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.8rem; color: var(--accent-rose); font-weight: 700;">2. 📖 قصة ونقاش ملهم</span>
              <a href="stories.html?id=${story?.id}" class="section-link">قراءة القصة ←</a>
            </div>
            <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 4px;">${story?.title || 'قصة الليلة'}</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${story?.intro || ''}</p>
          </div>

          <!-- Step 3: Game / Challenge -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 4px;">3. 🎯 تحدي اللحظة العفوية</div>
            <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 4px;">${challenge?.title || 'تحدي اللحظة'}</h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${challenge?.action || ''}</p>
          </div>

          <!-- Step 4: Real Life Dilemma -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-size: 0.8rem; color: var(--accent-gold-light); font-weight: 700; margin-bottom: 4px;">4. 🧠 نقاش موقف واقعي</div>
            <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 4px;">${dilemma?.title || 'موقف من الحياة'}</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${dilemma?.scenario || ''}</p>
          </div>

          <!-- Step 5: Memory Recording -->
          <div style="background: linear-gradient(135deg, rgba(104, 24, 38, 0.25) 0%, rgba(35, 31, 39, 0.8) 100%); border: 1px solid rgba(212, 122, 136, 0.3); border-radius: var(--radius-md); padding: 14px; text-align: center;">
            <span style="font-size: 0.8rem; color: #FFFFFF; font-weight: 700;">5. ❤️ مسك الختام: كلمة نخلدها</span>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 6px 0 10px;">
              قبل ما تقفلوا السهرة، اكتبوا جملة واحدة في 'صندوق الذكريات' توثقوا بيها جمال قعدتكم الليلة.
            </p>
            <a href="memories.html" class="btn-primary" style="display: inline-flex; min-height: 38px; padding: 0 16px; font-size: 0.85rem;">
              فتح صندوق الذكريات 📸
            </a>
          </div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn-secondary" onclick="BetweenUsUniverses.renderEveningOptions()">
            🔄 اختيار مواصفات تانية
          </button>
          <button class="btn-primary" onclick="BetweenUsApp.closeModal('eveningGeneratorModal')">
            يلا نبدأ سهرتنا ✦
          </button>
        </div>
      `;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.BetweenUsUniverses.init());
  } else {
    window.BetweenUsUniverses.init();
  }
})();

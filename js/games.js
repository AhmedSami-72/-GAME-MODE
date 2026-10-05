/**
 * Between Us ♾️ - Games Engine (5 Interactive Couple Games)
 */

(function () {
  "use strict";

  window.BetweenUsGames = {
    currentThisOrThatIndex: 0,
    currentWyrIndex: 0,
    currentGuessMeIndex: 0,
    whoKnowsScoreP1: 0,
    whoKnowsScoreP2: 0,
    currentWhoKnowsIndex: 0,

    init() {
      this.initThisOrThat();
      this.initWouldYouRather();
      this.initGuessMe();
      this.initWhoKnowsWho();
      this.initChallenges();
      this.initWhoAmongUs();
      this.initPrioritiesRanking();
      this.initStoryChain();
      this.initTimeTravel();
    },

    getSettings() {
      return (window.BetweenUsStorage && window.BetweenUsStorage.getSettings()) || {
        partner1: "أحمد",
        partner2: "إسراء"
      };
    },

    // 1. GAME 1: THIS OR THAT (ده ولا ده)
    initThisOrThat() {
      const container = document.getElementById("thisOrThatGame");
      if (!container) return;
      this.renderThisOrThat();
    },

    renderThisOrThat() {
      const container = document.getElementById("thisOrThatGame");
      if (!container || !window.BetweenUsData) return;

      const pairs = window.BetweenUsData.thisOrThat || [];
      if (pairs.length === 0) return;

      const pair = pairs[this.currentThisOrThatIndex % pairs.length];
      const settings = this.getSettings();

      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 600;">زوج ${this.currentThisOrThatIndex + 1} من ${pairs.length} · ${pair.category || 'عام'}</span>
          <h3 style="font-size: 1.3rem; margin-top: 6px; color: var(--text-primary);">اختاروا: ده ولا ده؟</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">اضغطوا على اختيار كل واحد عشان نشوف هل هتتفقوا ولا تختلفوا:</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
          <div id="totOptionA" onclick="BetweenUsGames.selectThisOrThat('A')" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 22px 14px; text-align: center; cursor: pointer; transition: all 0.2s;">
            <div style="font-size: 1.6rem; margin-bottom: 8px;">🅰️</div>
            <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${pair.optionA}</div>
          </div>
          <div id="totOptionB" onclick="BetweenUsGames.selectThisOrThat('B')" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 22px 14px; text-align: center; cursor: pointer; transition: all 0.2s;">
            <div style="font-size: 1.6rem; margin-bottom: 8px;">🅱️</div>
            <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${pair.optionB}</div>
          </div>
        </div>

        <div id="totFeedback" style="text-align: center; min-height: 48px; margin-bottom: 16px; font-weight: 600; color: var(--accent-gold);"></div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn-primary" onclick="BetweenUsGames.nextThisOrThat()">
            المقارنة التالية ←
          </button>
          <button class="btn-secondary" onclick="BetweenUsGames.randomThisOrThat()">
            🎲 زوج عشوائي
          </button>
        </div>
      `;
    },

    selectThisOrThat(choice) {
      const fb = document.getElementById("totFeedback");
      const settings = this.getSettings();
      if (!fb) return;

      const compliments = [
        "💖 ذوقكم متقارب جداً وجميل!",
        "☕ اختلاف لذيذ وممتع، احكوا لبعض سبب الاختيار ده!",
        "✨ اختيار عظيم يستاهل نقاش في البلكونة!",
        "🎯 الصراحة والوضوح سر التوافق بينكم!"
      ];
      const randomComp = compliments[Math.floor(Math.random() * compliments.length)];
      fb.innerHTML = `<span>اختيار ${choice === 'A' ? 'الخيار الأول' : 'الخيار الثاني'}</span> · ${randomComp}`;

      const cardA = document.getElementById("totOptionA");
      const cardB = document.getElementById("totOptionB");
      if (choice === 'A') {
        if (cardA) cardA.style.borderColor = "var(--accent-gold)";
        if (cardB) cardB.style.opacity = "0.6";
      } else {
        if (cardB) cardB.style.borderColor = "var(--accent-gold)";
        if (cardA) cardA.style.opacity = "0.6";
      }
    },

    nextThisOrThat() {
      const pairs = window.BetweenUsData.thisOrThat || [];
      this.currentThisOrThatIndex = (this.currentThisOrThatIndex + 1) % pairs.length;
      this.renderThisOrThat();
    },

    randomThisOrThat() {
      const pairs = window.BetweenUsData.thisOrThat || [];
      this.currentThisOrThatIndex = Math.floor(Math.random() * pairs.length);
      this.renderThisOrThat();
    },

    // 2. GAME 2: WOULD YOU RATHER (لو خيروك)
    initWouldYouRather() {
      const container = document.getElementById("wouldYouRatherGame");
      if (!container) return;
      this.renderWouldYouRather();
    },

    renderWouldYouRather() {
      const container = document.getElementById("wouldYouRatherGame");
      if (!container || !window.BetweenUsData) return;

      const list = window.BetweenUsData.wouldYouRather || [];
      if (list.length === 0) return;

      const item = list[this.currentWyrIndex % list.length];

      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 600;">سؤال ${this.currentWyrIndex + 1} من ${list.length}</span>
          <h3 style="font-size: 1.3rem; margin-top: 6px; color: var(--text-primary);">لو خيروكم بين مصيرين...</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">اضغط على خيارك واكتشف نسبة اختيار الكوبلز التانيين:</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
          <button id="wyrBtnA" class="wyr-choice-btn" onclick="BetweenUsGames.voteWyr('A')" style="text-align: right; background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-lg); padding: 18px 20px; color: var(--text-primary); font-size: 1rem; font-weight: 600; transition: all 0.2s; position: relative; overflow: hidden;">
            <div id="wyrBarA" style="position: absolute; top: 0; bottom: 0; right: 0; width: 0%; background: rgba(216, 178, 110, 0.15); transition: width 0.5s; z-index: 0;"></div>
            <div style="position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center;">
              <span>${item.scenarioA}</span>
              <span id="wyrPercentA" style="display: none; font-size: 0.9rem; color: var(--accent-gold); font-weight: 700;">64%</span>
            </div>
          </button>

          <div style="text-align: center; font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">— أَم —</div>

          <button id="wyrBtnB" class="wyr-choice-btn" onclick="BetweenUsGames.voteWyr('B')" style="text-align: right; background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-lg); padding: 18px 20px; color: var(--text-primary); font-size: 1rem; font-weight: 600; transition: all 0.2s; position: relative; overflow: hidden;">
            <div id="wyrBarB" style="position: absolute; top: 0; bottom: 0; right: 0; width: 0%; background: rgba(212, 122, 136, 0.15); transition: width 0.5s; z-index: 0;"></div>
            <div style="position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center;">
              <span>${item.scenarioB}</span>
              <span id="wyrPercentB" style="display: none; font-size: 0.9rem; color: var(--accent-rose); font-weight: 700;">36%</span>
            </div>
          </button>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn-primary" onclick="BetweenUsGames.nextWyr()">
            السؤال التالي ←
          </button>
        </div>
      `;
    },

    voteWyr(choice) {
      const barA = document.getElementById("wyrBarA");
      const barB = document.getElementById("wyrBarB");
      const pA = document.getElementById("wyrPercentA");
      const pB = document.getElementById("wyrPercentB");

      const percentA = Math.floor(Math.random() * 35) + 40; // 40% - 75%
      const percentB = 100 - percentA;

      if (barA) barA.style.width = `${percentA}%`;
      if (barB) barB.style.width = `${percentB}%`;
      if (pA) {
        pA.textContent = `${percentA}%`;
        pA.style.display = "inline";
      }
      if (pB) {
        pB.textContent = `${percentB}%`;
        pB.style.display = "inline";
      }

      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("احكوا لبعض سبب اختياركم!");
      }
    },

    nextWyr() {
      const list = window.BetweenUsData.wouldYouRather || [];
      this.currentWyrIndex = (this.currentWyrIndex + 1) % list.length;
      this.renderWouldYouRather();
    },

    // 3. GAME 3: GUESS ME (خمّن اختياري)
    initGuessMe() {
      const container = document.getElementById("guessMeGame");
      if (!container) return;
      this.renderGuessMe();
    },

    renderGuessMe() {
      const container = document.getElementById("guessMeGame");
      if (!container || !window.BetweenUsData) return;

      const list = window.BetweenUsData.guessMe || [];
      if (list.length === 0) return;

      const item = list[this.currentGuessMeIndex % list.length];
      const settings = this.getSettings();

      // Alternate turn between partner 1 and partner 2
      const isP1Turn = this.currentGuessMeIndex % 2 === 0;
      const targetName = isP1Turn ? settings.partner1 : settings.partner2;
      const guesserName = isP1Turn ? settings.partner2 : settings.partner1;

      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 600; margin-bottom: 4px;">
            دور التخمين · سؤال ${this.currentGuessMeIndex + 1}
          </div>
          <h3 style="font-size: 1.25rem; color: var(--text-primary); margin-bottom: 6px;">
            ${item.prompt.replace("أحمد / إسراء", targetName)}
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">
            يا ${guesserName}، خمّن/ي إيه أكتر حاجة ${targetName} هيختارها:
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          ${item.options.map((opt, i) => `
            <button class="guess-opt-btn" onclick="BetweenUsGames.revealGuess(${i}, '${targetName}')" style="text-align: right; background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 14px 18px; color: var(--text-primary); font-size: 0.95rem; font-weight: 500; transition: all 0.2s;">
              ${opt}
            </button>
          `).join("")}
        </div>

        <div id="guessResultMsg" style="text-align: center; font-size: 0.92rem; font-weight: 600; color: var(--accent-gold); min-height: 30px; margin-bottom: 14px;"></div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn-primary" onclick="BetweenUsGames.nextGuessMe()">
            سؤال التخمين التالي ←
          </button>
        </div>
      `;
    },

    revealGuess(index, targetName) {
      const msg = document.getElementById("guessResultMsg");
      if (!msg) return;

      msg.innerHTML = `✨ يا ${targetName}، هل التخمين ده صح ولا فاجأك؟ احكوا لبعض الإجابة الحقيقية!`;
      document.querySelectorAll(".guess-opt-btn").forEach((btn, i) => {
        if (i === index) {
          btn.style.borderColor = "var(--accent-gold)";
          btn.style.background = "rgba(216, 178, 110, 0.12)";
        }
      });
    },

    nextGuessMe() {
      const list = window.BetweenUsData.guessMe || [];
      this.currentGuessMeIndex = (this.currentGuessMeIndex + 1) % list.length;
      this.renderGuessMe();
    },

    // 4. GAME 4: WHO KNOWS WHO BETTER? (مين يعرف التاني أكتر؟)
    initWhoKnowsWho() {
      const container = document.getElementById("whoKnowsWhoGame");
      if (!container) return;
      this.renderWhoKnowsWho();
    },

    renderWhoKnowsWho() {
      const container = document.getElementById("whoKnowsWhoGame");
      if (!container || !window.BetweenUsData) return;

      const questions = window.BetweenUsData.whoKnowsWho || [];
      if (questions.length === 0) return;

      const settings = this.getSettings();
      const current = questions[this.currentWhoKnowsIndex % questions.length];

      container.innerHTML = `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.85rem; color: var(--text-muted);">
            <span>سؤال ${this.currentWhoKnowsIndex + 1} من ${questions.length}</span>
            <span style="color: var(--accent-gold); font-weight: 700;">
              النتيجة: ${settings.partner1} (${this.whoKnowsScoreP1}) · ${settings.partner2} (${this.whoKnowsScoreP2})
            </span>
          </div>

          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); text-align: center; margin: 18px 0;">
            "${current.question}"
          </h3>

          <p style="font-size: 0.88rem; color: var(--text-secondary); text-align: center; margin-bottom: 20px;">
            كل واحد يجاوب بصوت عالي.. مين فيكم جاوب إجابة مظبوطة؟
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button class="btn-secondary" onclick="BetweenUsGames.addPoint(1)" style="justify-content: center;">
              نقطة لـ ${settings.partner1} 🌟
            </button>
            <button class="btn-secondary" onclick="BetweenUsGames.addPoint(2)" style="justify-content: center;">
              نقطة لـ ${settings.partner2} 🌟
            </button>
          </div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn-primary" onclick="BetweenUsGames.nextWhoKnows()">
            السؤال التالي ←
          </button>
          <button class="btn-secondary" onclick="BetweenUsGames.resetWhoKnowsScore()">
            إعادة تصفير النتيجة
          </button>
        </div>
      `;
    },

    addPoint(partnerNum) {
      if (partnerNum === 1) this.whoKnowsScoreP1++;
      if (partnerNum === 2) this.whoKnowsScoreP2++;
      this.renderWhoKnowsWho();
      if (window.BetweenUsApp && window.BetweenUsApp.showToast) {
        window.BetweenUsApp.showToast("🌟 أُضيفت النقطة بنجاح!");
      }
    },

    resetWhoKnowsScore() {
      this.whoKnowsScoreP1 = 0;
      this.whoKnowsScoreP2 = 0;
      this.currentWhoKnowsIndex = 0;
      this.renderWhoKnowsWho();
    },

    nextWhoKnows() {
      const questions = window.BetweenUsData.whoKnowsWho || [];
      this.currentWhoKnowsIndex = (this.currentWhoKnowsIndex + 1) % questions.length;
      this.renderWhoKnowsWho();
    },

    // 5. GAME 5: RANDOM CHALLENGES (تحديات عفوية)
    initChallenges() {
      const container = document.getElementById("challengesGame");
      if (!container) return;
      this.drawRandomChallenge();
    },

    drawRandomChallenge() {
      const container = document.getElementById("challengesGame");
      if (!container || !window.BetweenUsData) return;

      const list = window.BetweenUsData.challenges || [];
      if (list.length === 0) return;

      const challenge = list[Math.floor(Math.random() * list.length)];

      container.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(104, 24, 38, 0.35) 0%, rgba(35, 31, 39, 0.85) 100%); border: 1px solid rgba(212, 122, 136, 0.3); border-radius: var(--radius-xl); padding: 26px 20px; text-align: center; margin-bottom: 20px;">
          <div style="font-size: 2.2rem; margin-bottom: 10px;">🎯</div>
          <span style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700;">تحدي اللحظة العفوية</span>
          <h3 style="font-size: 1.4rem; color: var(--text-primary); margin: 8px 0 12px;">
            ${challenge.title}
          </h3>
          <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.65; max-width: 500px; margin: 0 auto 20px;">
            ${challenge.action}
          </p>
          <button class="btn-primary" onclick="BetweenUsApp.showToast('✨ تم تنفيذ التحدي بنجاح، أحسنتم!'); BetweenUsGames.drawRandomChallenge();" style="min-height: 44px; padding: 0 20px; font-size: 0.92rem;">
            نفذنا التحدي! هات اللي بعده ✦
          </button>
        </div>
      `;
    },

    // 6. GAME 6: WHO AMONG US ("مين فينا؟")
    currentWhoAmongIndex: 0,
    initWhoAmongUs() {
      const container = document.getElementById("whoAmongUsGame");
      if (!container) return;
      this.renderWhoAmongUs();
    },

    renderWhoAmongUs() {
      const container = document.getElementById("whoAmongUsGame");
      if (!container || !window.BetweenUsData) return;

      const list = window.BetweenUsData.whoAmongUs || [];
      if (list.length === 0) return;

      const q = list[this.currentWhoAmongIndex % list.length];
      const settings = this.getSettings();

      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700;">سؤال ${this.currentWhoAmongIndex + 1} من ${list.length}</span>
          <h3 style="font-size: 1.35rem; color: var(--text-primary); margin: 8px 0 12px;">"${q}"</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">كل واحد يشاور في نفس اللحظة.. يا ترى هتتفقوا على نفس الشخص؟</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
          <button class="topic-card" onclick="BetweenUsGames.selectWhoAmong('${settings.partner1}')" style="padding: 20px 14px; text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 6px;">🙋‍♂️</div>
            <strong style="font-size: 1.1rem; color: var(--text-primary);">${settings.partner1}</strong>
          </button>
          <button class="topic-card" onclick="BetweenUsGames.selectWhoAmong('${settings.partner2}')" style="padding: 20px 14px; text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 6px;">🙋‍♀️</div>
            <strong style="font-size: 1.1rem; color: var(--text-primary);">${settings.partner2}</strong>
          </button>
        </div>

        <div id="whoAmongFeedback" style="text-align: center; font-size: 0.95rem; font-weight: 700; color: var(--accent-gold); min-height: 32px; margin-bottom: 14px;"></div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn-primary" onclick="BetweenUsGames.nextWhoAmong()">
            السؤال التالي ←
          </button>
        </div>
      `;
    },

    selectWhoAmong(name) {
      const fb = document.getElementById("whoAmongFeedback");
      if (!fb) return;
      fb.innerHTML = `✨ اخترتم: <strong>${name}</strong>! احكوا موقف يثبت الاختيار ده!`;
    },

    nextWhoAmong() {
      const list = window.BetweenUsData.whoAmongUs || [];
      this.currentWhoAmongIndex = (this.currentWhoAmongIndex + 1) % list.length;
      this.renderWhoAmongUs();
    },

    // 7. GAME 7: PRIORITIES RANKING ("رتبهم" + Compatibility Score)
    userRankings: [],
    initPrioritiesRanking() {
      const container = document.getElementById("prioritiesRankingGame");
      if (!container || !window.BetweenUsData) return;

      const items = window.BetweenUsData.prioritiesList || [];
      this.userRankings = [...items];

      this.renderPriorities();
    },

    renderPriorities() {
      const container = document.getElementById("prioritiesRankingGame");
      if (!container) return;

      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 18px;">
          <h3 style="font-size: 1.25rem; color: var(--text-primary); margin-bottom: 6px;">رتبوا أولويات الحياة (اختبار التوافق)</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">
            رتبوا العناصر الـ 6 دي حسب الأهمية في نظركم بالضغط على الأسهم:
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
          ${this.userRankings.map((p, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: var(--radius-md); padding: 12px 16px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.1rem; font-weight: 800; color: var(--accent-gold); width: 20px;">${idx + 1}.</span>
                <span style="font-size: 1.2rem;">${p.icon}</span>
                <span style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary);">${p.label}</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <button type="button" class="btn-card-action" onclick="BetweenUsGames.movePriority(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
                <button type="button" class="btn-card-action" onclick="BetweenUsGames.movePriority(${idx}, 1)" ${idx === this.userRankings.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
              </div>
            </div>
          `).join("")}
        </div>

        <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 16px;">
          <button class="btn-primary" onclick="BetweenUsGames.calculateCompatibility()">
            احسب نسبة التوافق واعرض النتيجة ✦
          </button>
        </div>

        <div id="compatResultBox" style="display: none; background: rgba(216, 178, 110, 0.1); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 18px; text-align: center;"></div>
      `;
    },

    movePriority(index, dir) {
      const targetIndex = index + dir;
      if (targetIndex < 0 || targetIndex >= this.userRankings.length) return;
      const temp = this.userRankings[index];
      this.userRankings[index] = this.userRankings[targetIndex];
      this.userRankings[targetIndex] = temp;
      this.renderPriorities();
    },

    calculateCompatibility() {
      const box = document.getElementById("compatResultBox");
      if (!box) return;

      const randomScore = Math.floor(Math.random() * 15) + 85; // 85% to 99%
      box.style.display = "block";
      box.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 4px;">🤝</div>
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 6px;">
          نسبة التوافق في الأولويات: ${randomScore}%
        </div>
        <p style="font-size: 0.92rem; color: var(--text-primary); line-height: 1.6; max-width: 500px; margin: 0 auto;">
          الترتيب يعكس وضوح الرؤية المشتركة؛ والأهم من التطابق هو أن يفهم كل منكما دوافع الطرف الآخر وراء ترتيب أولوياته!
        </p>
      `;
    },

    // 8. GAME 8: STORY CHAIN ("اكمل القصة")
    initStoryChain() {
      const container = document.getElementById("storyChainGame");
      if (!container || !window.BetweenUsData) return;

      const starters = window.BetweenUsData.storyStarters || [];
      const starter = starters[Math.floor(Math.random() * starters.length)];
      const settings = this.getSettings();

      container.innerHTML = `
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 22px;">
          <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 6px;">
            📖 حكاية بنألفها سوا خطوة بخطوة
          </div>
          <h3 style="font-size: 1.2rem; color: #FFFFFF; margin-bottom: 12px;">البداية من الموقع:</h3>
          <div style="font-size: 1.05rem; font-weight: 600; color: var(--accent-gold); line-height: 1.6; margin-bottom: 20px; padding: 14px; background: rgba(0, 0, 0, 0.25); border-radius: var(--radius-md);">
            "${starter}"
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            <div style="padding: 12px 14px; background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-md);">
              <strong style="color: var(--accent-gold);">1. دور ${settings.partner1}:</strong>
              <span style="font-size: 0.9rem; color: var(--text-secondary);"> كمل الجملة بحدث مفاجئ غير متوقع...</span>
            </div>
            <div style="padding: 12px 14px; background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-md);">
              <strong style="color: var(--accent-rose);">2. دور ${settings.partner2}:</strong>
              <span style="font-size: 0.9rem; color: var(--text-secondary);"> احكي رد فعلكم وقراركم المجنون...</span>
            </div>
          </div>

          <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn-primary" onclick="BetweenUsGames.initStoryChain()">
              🎲 بداية قصة جديدة
            </button>
          </div>
        </div>
      `;
    },

    // 9. GAME 9: TIME TRAVEL ("لو رجعنا بالزمن")
    initTimeTravel() {
      const container = document.getElementById("timeTravelGame");
      if (!container) return;

      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="font-size: 1.3rem; color: var(--text-primary); margin-bottom: 6px;">⏳ آلة الزمن: لو رجعنا بالزمن</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">اختاروا مسافة الرجوع وشوفوا السؤال الحواري:</p>
          <div class="pill-selector" style="justify-content: center; margin-top: 12px;">
            <button class="recap-mood-pill active" onclick="BetweenUsGames.setTimeTravelYears(this, 5)">5 سنين ورا</button>
            <button class="recap-mood-pill" onclick="BetweenUsGames.setTimeTravelYears(this, 10)">10 سنين ورا</button>
            <button class="recap-mood-pill" onclick="BetweenUsGames.setTimeTravelYears(this, 20)">20 سنة (أيام الطفولة)</button>
          </div>
        </div>

        <div id="timeTravelQuestionCard" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 22px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 6px;">🕰️</div>
          <h4 style="font-size: 1.2rem; color: var(--accent-gold); margin-bottom: 10px;" id="ttPromptTitle">لو رجعت 5 سنين بالزمن...</h4>
          <p style="font-size: 0.98rem; color: var(--text-primary); line-height: 1.6;" id="ttPromptText">
            إيه النصيحة الواحدة اللي هتقولها لنفسك بخصوص اختياراتك في الحياة؟ وهل كنت هتتخيل إننا هنكون سوا النهاردة؟
          </p>
        </div>
      `;
    },

    setTimeTravelYears(btn, years) {
      btn.parentElement.querySelectorAll(".recap-mood-pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");

      const title = document.getElementById("ttPromptTitle");
      const text = document.getElementById("ttPromptText");
      if (!title || !text) return;

      if (years === 5) {
        title.textContent = "لو رجعت 5 سنين بالزمن...";
        text.textContent = "إيه النصيحة الواحدة اللي هتقولها لنفسك بخصوص اختياراتك في الحياة؟ وهل كنت هتتخيل إننا هنكون سوا النهاردة؟";
      } else if (years === 10) {
        title.textContent = "لو رجعت 10 سنين بالزمن...";
        text.textContent = "إيه أكبر هم أو خوف كان مسيطر على عقلك وقتها واكتشفت دلوقتي إنه كان تافه ومستاهلش القلق ده كله؟";
      } else {
        title.textContent = "لو رجعت 20 سنة بالزمن (أيام الطفولة)...";
        text.textContent = "لو شوفت نفسك وأنت طفل بتلعب في الشارع أو البيت، إيه الجملة اللي هتحضنه وتقولهاله عشان يطمن على مستقبله؟";
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.BetweenUsGames.init());
  } else {
    window.BetweenUsGames.init();
  }
})();

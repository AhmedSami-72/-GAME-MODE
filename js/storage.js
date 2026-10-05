/**
 * Between Us ♾️ - Storage Manager (LocalStorage)
 * Robust, client-side, zero-dependency data store.
 */

(function () {
  const STORAGE_KEYS = {
    SETTINGS: "between_us_settings",
    FAVORITES: "between_us_favorites",
    TO_TALK: "between_us_to_talk",
    MEMORIES: "between_us_memories",
    TIMELINE: "between_us_timeline",
    SESSIONS: "between_us_sessions",
    CUSTOM: "between_us_custom_content",
    HOME_CHORES: "between_us_home_chores",
    CHECKLISTS: "between_us_checklists",
    BUDGET: "between_us_budget",
    FUTURE_CHILD: "between_us_future_child",
    ROADMAP: "between_us_roadmap",
    RIDDLE_STREAK: "between_us_riddle_streak",
    JOKE_RATINGS: "between_us_joke_ratings",
    JOKE_BATTLE: "between_us_joke_battle"
  };

  const DEFAULT_SETTINGS = {
    partner1: "أحمد",
    partner2: "إسراء",
    theme: "dark",
    motion: true
  };

  function safeGet(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.error("Storage read error:", e);
      return defaultVal;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Storage write error:", e);
      return false;
    }
  }

  window.BetweenUsStorage = {
    // Settings
    getSettings() {
      return Object.assign({}, DEFAULT_SETTINGS, safeGet(STORAGE_KEYS.SETTINGS, {}));
    },

    saveSettings(newSettings) {
      const current = this.getSettings();
      const updated = Object.assign({}, current, newSettings);
      safeSet(STORAGE_KEYS.SETTINGS, updated);
      document.dispatchEvent(new CustomEvent("settingsUpdated", { detail: updated }));
      return updated;
    },

    // Favorites
    getFavorites() {
      return safeGet(STORAGE_KEYS.FAVORITES, []);
    },

    isFavorite(id) {
      const favs = this.getFavorites();
      return favs.some(item => item.id === id);
    },

    toggleFavorite(item) {
      let favs = this.getFavorites();
      const exists = favs.find(f => f.id === item.id);
      if (exists) {
        favs = favs.filter(f => f.id !== item.id);
      } else {
        favs.unshift({
          id: item.id,
          type: item.type || "topic",
          title: item.title || item.question || item.scenario || "عنصر محفوظ",
          category: item.category || "عام",
          dateSaved: new Date().toLocaleDateString("ar-EG")
        });
      }
      safeSet(STORAGE_KEYS.FAVORITES, favs);
      document.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: favs }));
      return !exists;
    },

    removeFavorite(id) {
      let favs = this.getFavorites();
      favs = favs.filter(f => f.id !== id);
      safeSet(STORAGE_KEYS.FAVORITES, favs);
      document.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: favs }));
    },

    // To Talk About Later (نتكلم فيه بعدين)
    getToTalk() {
      return safeGet(STORAGE_KEYS.TO_TALK, [
        {
          id: "tt-init-1",
          title: "شكل بيتنا وطاقتنا بعد 5 سنين",
          category: "مستقبل",
          dateAdded: "منذ البداية",
          done: false
        },
        {
          id: "tt-init-2",
          title: "هل ممكن نعيش أو نسافر سنة كاملة برا بلدنا؟",
          category: "سفر وحياة",
          dateAdded: "منذ البداية",
          done: false
        },
        {
          id: "tt-init-3",
          title: "أكتر موقف غير نظرتنا لبعض وللحياة",
          category: "عن بعض",
          dateAdded: "منذ البداية",
          done: false
        }
      ]);
    },

    addToTalk(title, category = "عام") {
      const list = this.getToTalk();
      const newItem = {
        id: "tt-" + Date.now(),
        title: title.trim(),
        category: category,
        dateAdded: new Date().toLocaleDateString("ar-EG"),
        done: false
      };
      list.unshift(newItem);
      safeSet(STORAGE_KEYS.TO_TALK, list);
      document.dispatchEvent(new CustomEvent("toTalkUpdated", { detail: list }));
      return newItem;
    },

    toggleToTalkDone(id) {
      const list = this.getToTalk();
      const item = list.find(t => t.id === id);
      if (item) {
        item.done = !item.done;
        safeSet(STORAGE_KEYS.TO_TALK, list);
        document.dispatchEvent(new CustomEvent("toTalkUpdated", { detail: list }));
      }
      return item;
    },

    removeToTalk(id) {
      let list = this.getToTalk();
      list = list.filter(t => t.id !== id);
      safeSet(STORAGE_KEYS.TO_TALK, list);
      document.dispatchEvent(new CustomEvent("toTalkUpdated", { detail: list }));
    },

    // Memory Box (صندوق الذكريات)
    getMemories() {
      return safeGet(STORAGE_KEYS.MEMORIES, [
        {
          id: "mem-init-1",
          type: "first",
          title: "أول كلمة كتبناها لبعض",
          text: "الشعور الغريب بالارتياح والابتسامة اللي ظهرت بدون استئذان أول ما رسالة البداية وصلت.",
          date: "في بداية الرحلة",
          author: "معاً"
        },
        {
          id: "mem-init-2",
          type: "photo",
          title: "الصورة العفوية الأولى",
          text: "الضحكة الحقيقية اللي مكنش فيها أي تصنع وسط زحمة الناس في الكافيه.",
          date: "ذكرى خاصة",
          author: "أحمد & إسراء"
        }
      ]);
    },

    addMemory(type, title, text, date, author) {
      const list = this.getMemories();
      const settings = this.getSettings();
      const newMem = {
        id: "mem-" + Date.now(),
        type: type || "moment",
        title: title.trim(),
        text: text.trim(),
        date: date || new Date().toLocaleDateString("ar-EG"),
        author: author || `${settings.partner1} & ${settings.partner2}`
      };
      list.unshift(newMem);
      safeSet(STORAGE_KEYS.MEMORIES, list);
      document.dispatchEvent(new CustomEvent("memoriesUpdated", { detail: list }));
      return newMem;
    },

    deleteMemory(id) {
      let list = this.getMemories();
      list = list.filter(m => m.id !== id);
      safeSet(STORAGE_KEYS.MEMORIES, list);
      document.dispatchEvent(new CustomEvent("memoriesUpdated", { detail: list }));
    },

    // Timeline
    getTimeline() {
      const stored = safeGet(STORAGE_KEYS.TIMELINE, null);
      if (stored && Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
      return window.BetweenUsData && window.BetweenUsData.defaultTimeline
        ? window.BetweenUsData.defaultTimeline
        : [];
    },

    addTimelineMilestone(title, date, desc, icon = "✨") {
      const list = this.getTimeline().slice();
      const newMilestone = {
        id: "tl-" + Date.now(),
        title: title.trim(),
        date: date || new Date().toLocaleDateString("ar-EG"),
        desc: desc.trim(),
        icon: icon
      };
      list.push(newMilestone);
      safeSet(STORAGE_KEYS.TIMELINE, list);
      document.dispatchEvent(new CustomEvent("timelineUpdated", { detail: list }));
      return newMilestone;
    },

    // Session History
    getSessions() {
      return safeGet(STORAGE_KEYS.SESSIONS, []);
    },

    saveSession(sessionData) {
      const list = this.getSessions();
      const newSession = Object.assign(
        {
          id: "sess-" + Date.now(),
          date: new Date().toLocaleDateString("ar-EG"),
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
          notes: sessionData.notes || "",
          mood: sessionData.mood || "دافئة ومطمئنة",
          questions: sessionData.questions || []
        },
        sessionData
      );
      list.unshift(newSession);
      safeSet(STORAGE_KEYS.SESSIONS, list);
      document.dispatchEvent(new CustomEvent("sessionsUpdated", { detail: list }));
      return newSession;
    },

    updateSessionNotes(sessionId, notes, mood, saveToMemoryBox = false) {
      const list = this.getSessions();
      const session = list.find(s => s.id === sessionId);
      if (session) {
        if (notes !== undefined) session.notes = notes.trim();
        if (mood) session.mood = mood;
        safeSet(STORAGE_KEYS.SESSIONS, list);
        document.dispatchEvent(new CustomEvent("sessionsUpdated", { detail: list }));

        if (saveToMemoryBox && session.notes) {
          const settings = this.getSettings();
          this.addMemory(
            "moment",
            `خاطرة من جلسة: ${session.topicTitle}`,
            session.notes,
            session.date,
            `${settings.partner1} & ${settings.partner2}`
          );
        }
      }
      return session;
    },

    // Custom Content (أضف من عندك)
    getCustomContent() {
      return safeGet(STORAGE_KEYS.CUSTOM, []);
    },

    addCustomContent(item) {
      const list = this.getCustomContent();
      const newItem = Object.assign(
        {
          id: "custom-" + Date.now(),
          dateAdded: new Date().toLocaleDateString("ar-EG")
        },
        item
      );
      list.unshift(newItem);
      safeSet(STORAGE_KEYS.CUSTOM, list);
      document.dispatchEvent(new CustomEvent("customContentUpdated", { detail: list }));
      return newItem;
    },

    deleteCustomContent(id) {
      let list = this.getCustomContent();
      list = list.filter(c => c.id !== id);
      safeSet(STORAGE_KEYS.CUSTOM, list);
      document.dispatchEvent(new CustomEvent("customContentUpdated", { detail: list }));
    },

    // Home Chores ("مين يعملها؟")
    getHomeChoresAssignments() {
      return safeGet(STORAGE_KEYS.HOME_CHORES, {});
    },

    saveHomeChoreAssignment(choreId, assignee) {
      const current = this.getHomeChoresAssignments();
      current[choreId] = assignee;
      safeSet(STORAGE_KEYS.HOME_CHORES, current);
      document.dispatchEvent(new CustomEvent("choresUpdated", { detail: current }));
      return current;
    },

    // Checklists State
    getChecklistsState() {
      return safeGet(STORAGE_KEYS.CHECKLISTS, {});
    },

    toggleChecklistItem(listName, itemId) {
      const current = this.getChecklistsState();
      const listState = current[listName] || {};
      listState[itemId] = !listState[itemId];
      current[listName] = listState;
      safeSet(STORAGE_KEYS.CHECKLISTS, current);
      return listState[itemId];
    },

    // Household Budget ("ميزانية البيت")
    getBudget() {
      return safeGet(STORAGE_KEYS.BUDGET, {
        income: 20000,
        food: 5000,
        bills: 2500,
        transport: 1500,
        entertainment: 1500,
        home: 3000,
        emergency: 2000
      });
    },

    saveBudget(budgetData) {
      safeSet(STORAGE_KEYS.BUDGET, budgetData);
      document.dispatchEvent(new CustomEvent("budgetUpdated", { detail: budgetData }));
      return budgetData;
    },

    // Future Child Dreams ("طفلنا في المستقبل")
    getFutureChildDreams() {
      return safeGet(STORAGE_KEYS.FUTURE_CHILD, {
        suggestedNames: "آدم / مريم",
        coreValues: "الصدق، الرحمة، عزة النفس، وبر الوالدين",
        firstToy: "دبدوب صوف دافي ومكعبات خشبية",
        firstBook: "قصص الأنبياء المصورة وسيرة الحبيب ﷺ",
        firstTrip: "شاطئ هادي في مطروح أو دهب",
        whatNotToRepeat: "المقارنة بأولاد الناس أو الضغط الزائد في الدراسة"
      });
    },

    saveFutureChildDreams(data) {
      safeSet(STORAGE_KEYS.FUTURE_CHILD, data);
      document.dispatchEvent(new CustomEvent("futureChildUpdated", { detail: data }));
      return data;
    },

    // Life Roadmap Progress ("نبني حياتنا")
    getRoadmapProgress() {
      return safeGet(STORAGE_KEYS.ROADMAP, {});
    },

    toggleRoadmapMilestone(milestoneKey) {
      const current = this.getRoadmapProgress();
      current[milestoneKey] = !current[milestoneKey];
      safeSet(STORAGE_KEYS.ROADMAP, current);
      return current[milestoneKey];
    },

    // Riddle Streaks & Progress ("سلسلة الفوازير")
    getRiddleStreak() {
      return safeGet(STORAGE_KEYS.RIDDLE_STREAK, {
        currentStreak: 0,
        bestStreak: 0,
        totalSolved: 0,
        solvedIds: []
      });
    },

    recordRiddleAnswer(riddleId, isCorrect) {
      const stats = this.getRiddleStreak();
      if (isCorrect) {
        stats.currentStreak += 1;
        if (stats.currentStreak > stats.bestStreak) {
          stats.bestStreak = stats.currentStreak;
        }
        if (!stats.solvedIds.includes(riddleId)) {
          stats.solvedIds.push(riddleId);
          stats.totalSolved += 1;
        }
      } else {
        stats.currentStreak = 0;
      }
      safeSet(STORAGE_KEYS.RIDDLE_STREAK, stats);
      document.dispatchEvent(new CustomEvent("riddleStreakUpdated", { detail: stats }));
      return stats;
    },

    // Joke Ratings ("تقييم النكت")
    getJokeRatings() {
      return safeGet(STORAGE_KEYS.JOKE_RATINGS, {});
    },

    setJokeRating(jokeId, rating) {
      const current = this.getJokeRatings();
      current[jokeId] = rating;
      safeSet(STORAGE_KEYS.JOKE_RATINGS, current);
      document.dispatchEvent(new CustomEvent("jokeRatingsUpdated", { detail: current }));
      return current;
    },

    // Joke Battle ("مين هيضحك الأول؟")
    getJokeBattle() {
      return safeGet(STORAGE_KEYS.JOKE_BATTLE, {
        p1LaughedFirst: 0,
        p2LaughedFirst: 0,
        totalRounds: 0,
        history: []
      });
    },

    recordJokeBattle(loserKey, loserName, jokeText) {
      const current = this.getJokeBattle();
      current.totalRounds += 1;
      if (loserKey === "p1") {
        current.p1LaughedFirst += 1;
      } else if (loserKey === "p2") {
        current.p2LaughedFirst += 1;
      }
      current.history.unshift({
        date: new Date().toLocaleDateString("ar-EG"),
        time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        loserKey,
        loserName,
        jokeSnippet: (jokeText || "").substring(0, 60) + "..."
      });
      safeSet(STORAGE_KEYS.JOKE_BATTLE, current);
      document.dispatchEvent(new CustomEvent("jokeBattleUpdated", { detail: current }));
      return current;
    },

    // Export Data as JSON file
    exportAllData() {
      const bundle = {
        appName: "Between Us ♾️",
        exportDate: new Date().toISOString(),
        settings: this.getSettings(),
        favorites: this.getFavorites(),
        toTalk: this.getToTalk(),
        memories: this.getMemories(),
        timeline: this.getTimeline(),
        sessions: this.getSessions(),
        customContent: this.getCustomContent(),
        homeChores: this.getHomeChoresAssignments(),
        checklists: this.getChecklistsState(),
        budget: this.getBudget(),
        futureChild: this.getFutureChildDreams(),
        roadmap: this.getRoadmapProgress(),
        riddleStreak: this.getRiddleStreak(),
        jokeRatings: this.getJokeRatings(),
        jokeBattle: this.getJokeBattle()
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Between_Us_Backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    },

    // Import Data
    importData(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.settings) safeSet(STORAGE_KEYS.SETTINGS, parsed.settings);
        if (parsed.favorites) safeSet(STORAGE_KEYS.FAVORITES, parsed.favorites);
        if (parsed.toTalk) safeSet(STORAGE_KEYS.TO_TALK, parsed.toTalk);
        if (parsed.memories) safeSet(STORAGE_KEYS.MEMORIES, parsed.memories);
        if (parsed.timeline) safeSet(STORAGE_KEYS.TIMELINE, parsed.timeline);
        if (parsed.sessions) safeSet(STORAGE_KEYS.SESSIONS, parsed.sessions);
        if (parsed.customContent) safeSet(STORAGE_KEYS.CUSTOM, parsed.customContent);
        if (parsed.homeChores) safeSet(STORAGE_KEYS.HOME_CHORES, parsed.homeChores);
        if (parsed.checklists) safeSet(STORAGE_KEYS.CHECKLISTS, parsed.checklists);
        if (parsed.budget) safeSet(STORAGE_KEYS.BUDGET, parsed.budget);
        if (parsed.futureChild) safeSet(STORAGE_KEYS.FUTURE_CHILD, parsed.futureChild);
        if (parsed.roadmap) safeSet(STORAGE_KEYS.ROADMAP, parsed.roadmap);
        if (parsed.riddleStreak) safeSet(STORAGE_KEYS.RIDDLE_STREAK, parsed.riddleStreak);
        if (parsed.jokeRatings) safeSet(STORAGE_KEYS.JOKE_RATINGS, parsed.jokeRatings);
        if (parsed.jokeBattle) safeSet(STORAGE_KEYS.JOKE_BATTLE, parsed.jokeBattle);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    // Reset All Data
    resetAll() {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    }
  };
})();

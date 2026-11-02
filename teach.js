(function () {
  "use strict";

  var E = window.CrrtEngine, C = window.CrrtTeachContent;
  var SOURCES = C.SOURCES, CASES = C.CASES, QUIZ = C.QUIZ, MAP = C.MAP;
  var byId = function (id) { return document.getElementById(id); };
  var VIEWS = ["tool", "cases", "quiz", "map"];
  var LETTERS = ["A", "B", "C", "D"];
  var fmt = E.fmt;

  function patchOf(item, scenario) { return Object.assign({}, item.base, scenario.patch); }
  function runScenario(item, scenario) {
    var r = E.calc(Object.assign({}, E.DEFAULTS, patchOf(item, scenario)));
    return { r: r, list: E.checks(r) };
  }
  function sourceLinks(keys) {
    return keys.map(function (k) { return '<a href="' + SOURCES[k].url + '" target="_blank" rel="noopener">' + SOURCES[k].label + "</a>"; }).join("、");
  }
  function list(items) { return "<ul>" + items.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }

  function scenarioRow(item, scenario, index) {
    var res = runScenario(item, scenario), r = res.r;
    var worst = res.list.some(function (x) { return x.lv === "crit"; }) ? "crit" : res.list.some(function (x) { return x.lv === "warn"; }) ? "warn" : "ok";
    var label = { crit: "必須處理", warn: "注意", ok: "OK" }[worst];
    var ffCls = r.ff === null ? "" : r.ff > 25 ? " crit" : r.ff > 20 ? " warn" : "";
    return "<tr>" +
      '<th scope="row">' + scenario.label + "</th>" +
      '<td class="n">' + fmt(r.eff) + "</td>" +
      '<td class="n">' + fmt(r.actual, 1) + "</td>" +
      '<td class="n">' + (r.effDose !== null ? fmt(r.effDose, 1) : "–") + "</td>" +
      '<td class="n' + ffCls + '">' + (r.ff !== null ? fmt(r.ff, 1) + "%" : "–") + "</td>" +
      '<td class="n">' + fmt(r.nufKg, 2) + "</td>" +
      '<td><span class="sc-lv sc-' + worst + '">' + label + "</span></td>" +
      '<td><button type="button" class="link-button" data-load-case="' + item.id + '" data-load-scenario="' + index + '">載入</button></td></tr>';
  }

  function renderCases() {
    byId("caseList").innerHTML = CASES.map(function (item, index) {
      return '<article class="case-card" id="case-' + item.id + '">' +
        '<header><span class="case-number num">' + (index + 1) + '</span><div><span class="case-tag">' + item.tag + "</span><h3>" + item.title + "</h3></div></header>" +
        "<p>" + item.stem + "</p>" +
        '<ul class="case-facts">' + item.facts.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>" +
        '<p class="case-question"><strong>想一想：</strong>' + item.question + "</p>" +
        '<div class="table-scroll"><table class="scenario-table"><thead><tr><th scope="col">情境</th><th scope="col">Effluent<br>mL/hr</th><th scope="col">實際劑量</th><th scope="col">校正劑量</th><th scope="col">FF</th><th scope="col">Net UF<br>mL/kg/hr</th><th scope="col">工具檢核</th><th scope="col"><span class="vh">載入到計算工具</span></th></tr></thead><tbody>' +
        item.scenarios.map(function (s, i) { return scenarioRow(item, s, i); }).join("") + "</tbody></table></div>" +
        '<details class="case-answer"><summary>看判讀與處置思路</summary>' +
        "<h4>判讀</h4>" + list(item.read) +
        "<h4>處置思路</h4>" + list(item.plan) +
        '<p class="case-pitfall"><strong>常見陷阱：</strong>' + item.pitfall + "</p>" +
        '<p class="source-line">依據：' + sourceLinks(item.src) + "</p></details></article>";
    }).join("");
  }

  function loadCase(id, idx) {
    var item = CASES.filter(function (c) { return c.id === id; })[0], scenario = item.scenarios[idx];
    window.CrrtApp.loadDemo(patchOf(item, scenario), item.title + "（" + scenario.label + "）");
    showView("tool");
  }

  var quizState = { filter: "全部", answers: {} };

  function renderQuiz() {
    var visible = QUIZ.map(function (item, index) { return { item: item, index: index }; }).filter(function (x) {
      if (quizState.filter === "全部") return true;
      if (quizState.filter === "答錯") return quizState.answers[x.index] !== undefined && quizState.answers[x.index] !== x.item.answer;
      return x.item.level === quizState.filter;
    });
    var answered = 0, correct = 0;
    QUIZ.forEach(function (item, i) {
      if (quizState.answers[i] !== undefined) { answered++; if (quizState.answers[i] === item.answer) correct++; }
    });
    byId("quizScore").textContent = "已答 " + answered + "／" + QUIZ.length + "，答對 " + correct;
    byId("quizFilter").querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.filter === quizState.filter)); });
    byId("quizList").innerHTML = visible.length ? visible.map(function (x) {
      var item = x.item, chosen = quizState.answers[x.index], done = chosen !== undefined;
      var options = item.options.map(function (o, i) {
        var state = !done ? "" : i === item.answer ? " is-correct" : i === chosen ? " is-wrong" : "";
        return '<button type="button" class="quiz-option' + state + '" data-question="' + x.index + '" data-option="' + i + '"' + (done ? " disabled" : "") + "><span>" + LETTERS[i] + "</span><span>" + o + "</span></button>";
      }).join("");
      var feedback = done ? '<div class="quiz-feedback ' + (chosen === item.answer ? "right" : "wrong") + '" role="status"><strong>' + (chosen === item.answer ? "答對" : "答錯，正解 " + LETTERS[item.answer]) + "</strong>：" + item.why + (item.src.length ? '<span class="source-line">依據：' + sourceLinks(item.src) + "</span>" : "") + "</div>" : "";
      return '<article class="quiz-card"><p class="quiz-stem"><span class="quiz-level lv-' + item.level + '">' + item.level + "</span><strong>" + (x.index + 1) + ".</strong> " + item.stem + '</p><div class="quiz-options">' + options + "</div>" + feedback + "</article>";
    }).join("") : '<p class="view-intro">目前沒有答錯的題目。</p>';
  }

  function renderMap() {
    var half = Math.ceil(MAP.branches.length / 2);
    function leaf(l) {
      var idx = l.c ? CASES.map(function (c) { return c.id; }).indexOf(l.c) : -1;
      return '<li class="mm-leaf">' + l.t + (idx >= 0 ? ' <button type="button" class="mm-case" data-goto-case="' + l.c + '">病例 ' + (idx + 1) + "</button>" : "") + "</li>";
    }
    function branch(entry, i) {
      return '<details class="mm-branch" data-branch="' + i + '" open style="--branch:' + entry.color + '"><summary class="mm-node">' + entry.title + "</summary><ul>" + entry.leaves.map(leaf).join("") + "</ul></details>";
    }
    byId("mapBody").innerHTML = '<svg class="mm-lines" aria-hidden="true"></svg>' +
      '<div class="mm-side mm-left">' + MAP.branches.slice(0, half).map(function (b, i) { return branch(b, i); }).join("") + "</div>" +
      '<div class="mm-center"><strong>' + MAP.center[0] + "</strong><span>" + MAP.center[1] + "</span></div>" +
      '<div class="mm-side mm-right">' + MAP.branches.slice(half).map(function (b, i) { return branch(b, i + half); }).join("") + "</div>";
    byId("mapBody").querySelectorAll("details").forEach(function (d) { d.addEventListener("toggle", drawMap); });
  }

  function drawMap() {
    var box = byId("mapBody"), svg = box.querySelector(".mm-lines");
    if (!svg || box.offsetParent === null || getComputedStyle(svg).display === "none") return;
    var origin = box.getBoundingClientRect();
    svg.setAttribute("width", origin.width);
    svg.setAttribute("height", origin.height);
    function rect(el) {
      var r = el.getBoundingClientRect();
      return { left: r.left - origin.left, right: r.right - origin.left, y: r.top - origin.top + r.height / 2 };
    }
    function curve(x1, y1, x2, y2, color, width) {
      var mid = (x1 + x2) / 2;
      return '<path d="M' + x1 + " " + y1 + "C" + mid + " " + y1 + " " + mid + " " + y2 + " " + x2 + " " + y2 + '" fill="none" style="stroke:' + color + '" stroke-width="' + width + '" stroke-linecap="round"/>';
    }
    var center = rect(box.querySelector(".mm-center")), paths = "";
    box.querySelectorAll(".mm-branch").forEach(function (node) {
      var color = MAP.branches[Number(node.dataset.branch)].color;
      var title = rect(node.querySelector(".mm-node"));
      var left = node.parentElement.classList.contains("mm-left");
      paths += left ? curve(center.left, center.y, title.right, title.y, color, 2.5) : curve(center.right, center.y, title.left, title.y, color, 2.5);
      if (!node.open) return;
      node.querySelectorAll(".mm-leaf").forEach(function (l) {
        var t = rect(l);
        paths += left ? curve(title.left, title.y, t.right, t.y, color, 1.25) : curve(title.right, title.y, t.left, t.y, color, 1.25);
      });
    });
    svg.innerHTML = paths;
  }

  function renderSources() {
    byId("sourceList").innerHTML = Object.keys(SOURCES).map(function (k) {
      return '<li><a href="' + SOURCES[k].url + '" target="_blank" rel="noopener">' + SOURCES[k].cite + "</a></li>";
    }).join("");
  }

  function showView(view, updateHash) {
    VIEWS.forEach(function (name) {
      byId("view-" + name).hidden = name !== view;
      var tab = byId("tab-" + name);
      tab.classList.toggle("active", name === view);
      if (name === view) tab.setAttribute("aria-current", "page"); else tab.removeAttribute("aria-current");
    });
    document.body.setAttribute("data-view", view);
    if (updateHash !== false) history.replaceState(null, "", view === "tool" ? location.pathname + location.search : "#" + view);
    window.scrollTo(0, 0);
    if (view === "map") drawMap();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("button") : null;
    if (!t) return;
    var d = t.dataset;
    if (d.view) showView(d.view);
    if (d.loadCase) loadCase(d.loadCase, Number(d.loadScenario));
    if (d.question) { quizState.answers[Number(d.question)] = Number(d.option); renderQuiz(); }
    if (d.filter) { quizState.filter = d.filter; renderQuiz(); }
    if (d.mapAll) {
      byId("mapBody").querySelectorAll("details").forEach(function (n) { n.open = d.mapAll === "open"; });
      drawMap();
    }
    if (d.gotoCase) {
      showView("cases");
      var card = byId("case-" + d.gotoCase);
      card.scrollIntoView({ block: "start" });
    }
  });
  byId("quizReset").addEventListener("click", function () { quizState.answers = {}; quizState.filter = "全部"; renderQuiz(); });
  window.addEventListener("resize", drawMap);
  window.addEventListener("hashchange", function () {
    var v = location.hash.slice(1);
    showView(VIEWS.indexOf(v) >= 0 ? v : "tool", false);
  });

  renderCases();
  renderQuiz();
  renderMap();
  renderSources();
  var initial = location.hash.slice(1);
  showView(VIEWS.indexOf(initial) >= 0 ? initial : "tool", false);
})();

document.addEventListener("DOMContentLoaded", () => {

    const iframe = document.getElementById("frame1");

    const yearButtons = document.querySelectorAll(".year-btn");
    const groupButtons = document.querySelectorAll(".year-group");

    const anosIniciais = document.getElementById("anosIniciais");
    const anosFinais = document.getElementById("anosFinais");

    // =========================
    // CONFIG
    // =========================
    const DEFAULT_YEAR = "6";

    let currentYear = null;
    let currentGroup = null;
    let isInternalUpdate = false;

    // =========================
    // GROUP FROM YEAR
    // =========================
    function getGroupFromYear(year) {
        return Number(year) <= 5 ? "iniciais" : "finais";
    }

    // =========================
    // ACTIVE YEAR
    // =========================
    function setActiveYear(year) {
        currentYear = year;

        yearButtons.forEach(btn => {
            btn.classList.toggle("is-active", btn.dataset.year === year);
        });
    }

    // =========================
    // ACTIVE GROUP
    // =========================
    function setActiveGroup(group) {
        currentGroup = group;

        const isIniciais = group === "iniciais";

        anosIniciais.classList.toggle("hidden", !isIniciais);
        anosFinais.classList.toggle("hidden", isIniciais);

        groupButtons.forEach(btn => {
            btn.classList.toggle("is-active", btn.dataset.target === group);
        });
    }

    // =========================
    // LOAD YEAR (SOURCE OF TRUTH)
    // =========================
    function loadYear(year) {

        const url = `pages/anos_escolares/ano${year}.html`;

        isInternalUpdate = true;

        iframe.src = url;

        setActiveYear(year);

        const group = getGroupFromYear(year);
        setActiveGroup(group);

        localStorage.setItem("selectedYear", year);
        localStorage.setItem("selectedGroup", group);

        setTimeout(() => {
            isInternalUpdate = false;
        }, 50);
    }

    // =========================
    // CLICK YEARS
    // =========================
    yearButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            loadYear(btn.dataset.year);
        });
    });

    // =========================
    // CLICK GROUPS
    // =========================
    groupButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            const group = btn.dataset.target;

            const defaultYear = group === "iniciais" ? "1" : "6";

            loadYear(defaultYear);
        });
    });

    // =========================
    // INIT
    // =========================
    function init() {

        const savedYear = localStorage.getItem("selectedYear") || DEFAULT_YEAR;

        loadYear(savedYear);
    }

    // =========================
    // SYNC iframe → UI (SAFE)
    // =========================
    iframe.addEventListener("load", () => {

        if (isInternalUpdate) return;

        const match = iframe.src.match(/ano(\d+)/);

        if (!match) return;

        const year = match[1];

        if (year !== currentYear) {
            loadYear(year);
        }
    });

    init();
});
document.addEventListener("DOMContentLoaded", function () {



    const topSlides =
        document.querySelectorAll(".slide");

    let topSlideIndex = 0;

    let topSlideTimer = null;


    function showTopSlide(index) {

        topSlides.forEach(function (slide) {
            slide.classList.remove("active");
        });

        if (topSlides[index]) {
            topSlides[index].classList.add("active");
        }
    }


    function nextTopSlide() {

        if (topSlides.length <= 1) {
            return;
        }

        topSlideIndex++;

        if (
            topSlideIndex >=
            topSlides.length
        ) {
            topSlideIndex = 0;
        }

        showTopSlide(topSlideIndex);
    }


    function startTopSlider() {

        clearInterval(topSlideTimer);

        if (topSlides.length > 1) {

            topSlideTimer =
                setInterval(
                    nextTopSlide,
                    4000
                );

        }
    }


    if (topSlides.length > 0) {

        showTopSlide(0);

        startTopSlider();
    }



    function setupBookSlider(slider) {

        const track =
            slider.querySelector(
                ".book-track"
            );

        if (!track) {
            return;
        }


        const cards =
            Array.from(
                track.querySelectorAll(
                    ".book-card"
                )
            );


        const prevButton =
            slider.querySelector(
                ".slider-prev"
            );


        const nextButton =
            slider.querySelector(
                ".slider-next"
            );


        const dotsContainer =
            slider.querySelector(
                ".slider-dots"
            );


        if (
            cards.length === 0 ||
            !dotsContainer
        ) {
            return;
        }


        let currentIndex = 0;

        let autoSlide = null;



        function getVisibleCount() {

            const width =
                window.innerWidth;


            if (width <= 600) {
                return 1;
            }


            if (width <= 900) {
                return 2;
            }


            if (width <= 1100) {
                return 3;
            }


            return 4;
        }


        function getMaxIndex() {

            const visible =
                getVisibleCount();


            return Math.max(
                0,
                cards.length - visible
            );
        }




        function getGap() {

            if (
                window.innerWidth <= 600
            ) {
                return 15;
            }

            return 30;
        }



        function createDots() {

            dotsContainer.innerHTML = "";

            const maxIndex =
                getMaxIndex();




            if (maxIndex === 0) {

                const dot =
                    document.createElement(
                        "button"
                    );

                dot.type = "button";

                dot.className =
                    "slider-dot active";

                dot.setAttribute(
                    "aria-label",
                    "اسلاید فعلی"
                );

                dotsContainer.appendChild(
                    dot
                );

                return;
            }


            for (
                let i = 0;
                i <= maxIndex;
                i++
            ) {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.type = "button";

                dot.className =
                    "slider-dot";


                dot.setAttribute(
                    "aria-label",
                    `رفتن به اسلاید ${i + 1}`
                );


                dot.addEventListener(
                    "click",
                    function () {

                        currentIndex = i;

                        updateSlider();

                        restartAutoSlide();

                    }
                );


                dotsContainer.appendChild(
                    dot
                );
            }
        }


        function updateDots() {

            const dots =
                dotsContainer.querySelectorAll(
                    ".slider-dot"
                );


            dots.forEach(
                function (dot, index) {

                    dot.classList.toggle(
                        "active",
                        index === currentIndex
                    );

                }
            );
        }




        function updateSlider() {

            const visible =
                getVisibleCount();


            const maxIndex =
                getMaxIndex();


            if (
                currentIndex >
                maxIndex
            ) {
                currentIndex = 0;
            }


            if (
                currentIndex < 0
            ) {
                currentIndex =
                    maxIndex;
            }


            const gap =
                getGap();




            const sliderWidth =
                slider.clientWidth;




            const horizontalPadding =
                window.innerWidth <= 600
                    ? 136
                    : 96;



            const availableWidth =
                sliderWidth -
                horizontalPadding;



            const cardWidth =
                (
                    availableWidth -
                    gap * (visible - 1)
                ) / visible;


            cards.forEach(
                function (card) {

                    card.style.flex =
                        `0 0 ${cardWidth}px`;

                    card.style.width =
                        `${cardWidth}px`;

                    card.style.minWidth =
                        `${cardWidth}px`;

                }
            );



            const move =
                (
                    cardWidth +
                    gap
                ) * currentIndex;


            track.style.transform =
                `translateX(-${move}px)`;


            updateDots();
        }


        function nextBook() {

            const maxIndex =
                getMaxIndex();


            if (maxIndex === 0) {
                return;
            }


            currentIndex++;


            if (
                currentIndex >
                maxIndex
            ) {
                currentIndex = 0;
            }


            updateSlider();
        }




        function previousBook() {

            const maxIndex =
                getMaxIndex();


            if (maxIndex === 0) {
                return;
            }


            currentIndex--;


            if (
                currentIndex < 0
            ) {
                currentIndex =
                    maxIndex;
            }


            updateSlider();
        }




        function restartAutoSlide() {

            clearInterval(autoSlide);


            if (
                getMaxIndex() === 0
            ) {
                return;
            }


            autoSlide =
                setInterval(
                    function () {

                        nextBook();

                    },
                    4000
                );
        }




        if (prevButton) {

            prevButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    previousBook();

                    restartAutoSlide();

                }
            );
        }




        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    nextBook();

                    restartAutoSlide();

                }
            );
        }




        slider.addEventListener(
            "mouseenter",
            function () {

                clearInterval(
                    autoSlide
                );

            }
        );


        slider.addEventListener(
            "mouseleave",
            function () {

                restartAutoSlide();

            }
        );




        let resizeTimer = null;


        window.addEventListener(
            "resize",
            function () {

                clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    setTimeout(
                        function () {

                            createDots();

                            updateSlider();

                            restartAutoSlide();

                        },
                        150
                    );

            }
        );




        createDots();

        updateSlider();

        restartAutoSlide();

        /* برای اینکه جستجو بتواند اسلایدر را روی کارت مورد نظر ببرد */
        slider.blGoToCard = function (card) {
            const idx = cards.indexOf(card);
            if (idx === -1) return;
            currentIndex = Math.min(idx, getMaxIndex());
            updateSlider();
            restartAutoSlide();
        };
    }




    document
        .querySelectorAll(
            ".book-slider"
        )
        .forEach(
            function (slider) {

                setupBookSlider(
                    slider
                );

            }
        );




    function setupJmagSlider(slider) {

        const track =
            slider.querySelector(
                ".jmag-track"
            );


        if (!track) {
            return;
        }


        const cards =
            Array.from(
                track.querySelectorAll(
                    ".jmag-card"
                )
            );


        const prevButton =
            slider.querySelector(
                ".slider-prev"
            );


        const nextButton =
            slider.querySelector(
                ".slider-next"
            );


        const dotsContainer =
            slider.querySelector(
                ".slider-dots"
            );


        if (
            cards.length === 0 ||
            !dotsContainer
        ) {
            return;
        }


        let currentIndex = 0;

        let autoSlide = null;




        function getVisibleCount() {

            const width =
                window.innerWidth;


            if (width <= 600) {
                return 1;
            }


            if (width <= 900) {
                return 2;
            }


            if (width <= 1100) {
                return 3;
            }


            return 4;
        }




        function getMaxIndex() {

            return Math.max(
                0,
                cards.length -
                getVisibleCount()
            );
        }




        function getGap() {

            return window.innerWidth <= 600
                ? 15
                : 30;
        }




        function createDots() {

            dotsContainer.innerHTML = "";

            const maxIndex =
                getMaxIndex();


            if (maxIndex === 0) {

                const dot =
                    document.createElement(
                        "button"
                    );

                dot.type = "button";

                dot.className =
                    "slider-dot active";

                dotsContainer.appendChild(
                    dot
                );

                return;
            }


            for (
                let i = 0;
                i <= maxIndex;
                i++
            ) {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.type = "button";

                dot.className =
                    "slider-dot";


                dot.setAttribute(
                    "aria-label",
                    `رفتن به اسلاید ${i + 1}`
                );


                dot.addEventListener(
                    "click",
                    function () {

                        currentIndex = i;

                        updateSlider();

                        restartAutoSlide();

                    }
                );


                dotsContainer.appendChild(
                    dot
                );
            }
        }




        function updateDots() {

            const dots =
                dotsContainer.querySelectorAll(
                    ".slider-dot"
                );


            dots.forEach(
                function (dot, index) {

                    dot.classList.toggle(
                        "active",
                        index === currentIndex
                    );

                }
            );
        }





        function updateSlider() {

            const visible =
                getVisibleCount();


            const maxIndex =
                getMaxIndex();


            if (
                currentIndex >
                maxIndex
            ) {
                currentIndex = 0;
            }


            if (
                currentIndex < 0
            ) {
                currentIndex =
                    maxIndex;
            }


            const gap =
                getGap();


            const sliderWidth =
                slider.clientWidth;


            const horizontalPadding =
                window.innerWidth <= 600
                    ? 84
                    : 96;


            const availableWidth =
                sliderWidth -
                horizontalPadding;


            const cardWidth =
                (
                    availableWidth -
                    gap * (visible - 1)
                ) / visible;


            cards.forEach(
                function (card) {

                    card.style.flex =
                        `0 0 ${cardWidth}px`;

                    card.style.width =
                        `${cardWidth}px`;

                    card.style.minWidth =
                        `${cardWidth}px`;

                }
            );


            const move =
                (
                    cardWidth +
                    gap
                ) * currentIndex;


            track.style.transform =
                `translateX(-${move}px)`;


            updateDots();
        }



        function nextJmag() {

            const maxIndex =
                getMaxIndex();


            if (maxIndex === 0) {
                return;
            }


            currentIndex++;


            if (
                currentIndex >
                maxIndex
            ) {
                currentIndex = 0;
            }


            updateSlider();
        }




        function previousJmag() {

            const maxIndex =
                getMaxIndex();


            if (maxIndex === 0) {
                return;
            }


            currentIndex--;


            if (
                currentIndex < 0
            ) {
                currentIndex =
                    maxIndex;
            }


            updateSlider();
        }




        function restartAutoSlide() {

            clearInterval(autoSlide);


            if (
                getMaxIndex() === 0
            ) {
                return;
            }


            autoSlide =
                setInterval(
                    function () {

                        nextJmag();

                    },
                    4000
                );
        }




        if (prevButton) {

            prevButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    previousJmag();

                    restartAutoSlide();

                }
            );
        }


        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    nextJmag();

                    restartAutoSlide();

                }
            );
        }




        slider.addEventListener(
            "mouseenter",
            function () {

                clearInterval(
                    autoSlide
                );

            }
        );


        slider.addEventListener(
            "mouseleave",
            function () {

                restartAutoSlide();

            }
        );



        let resizeTimer = null;


        window.addEventListener(
            "resize",
            function () {

                clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    setTimeout(
                        function () {

                            createDots();

                            updateSlider();

                            restartAutoSlide();

                        },
                        150
                    );

            }
        );




        createDots();

        updateSlider();

        restartAutoSlide();

        /* برای اینکه جستجو بتواند اسلایدر جی‌مگ را روی کارت مورد نظر ببرد */
        slider.blGoToCard = function (card) {
            const idx = cards.indexOf(card);
            if (idx === -1) return;
            currentIndex = Math.min(idx, getMaxIndex());
            updateSlider();
            restartAutoSlide();
        };
    }


    document
        .querySelectorAll(
            ".jmag-slider"
        )
        .forEach(
            function (slider) {

                setupJmagSlider(
                    slider
                );

            }
        );



    const searchBox =
        document.getElementById(
            "searchBox"
        );

    /* جستجو فقط کتاب های اصلی فروشگاه را بررسی می کند و نتیجه را به همان کارت می رساند. */
    if (searchBox) {
        const searchWrap = searchBox.closest(".search");
        const searchResults = document.createElement("div");
        searchResults.className = "bl-search-results";
        searchResults.style.display = "none";
        if (searchWrap) {
            searchWrap.appendChild(searchResults);
        }

        function normalizeSearchText(text) {
            return String(text || "")
                .replace(/[يى]/g, "ی")
                .replace(/ك/g, "ک")
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();
        }

        function getMainBookCards() {
            /* هم کارت‌های اصلی کتاب و هم کارت‌های بخش جی‌مگ در جستجو بررسی می‌شوند */
            return Array.from(document.querySelectorAll(".books .book-slider .book-card, .books .jmag-slider .jmag-card"));
        }

        function getCardData(card) {
            const title = card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "";
            const publisher = card.querySelector(".publisher") ? card.querySelector(".publisher").textContent.trim() : "";
            const info = Array.from(card.querySelectorAll(".book-info p, .jmag-description")).map(function (p) {
                return p.textContent.trim();
            }).join(" ");
            const image = card.querySelector("img") ? card.querySelector("img").src : "";
            return { title, publisher, info, image };
        }

        function recordRecentBook(card) {
            const data = getCardData(card);
            if (!data.title) return;
            let recents = [];
            try { recents = JSON.parse(localStorage.getItem("bookland_recent_views") || "[]"); } catch (e) { recents = []; }
            recents = recents.filter(function (item) { return item.title !== data.title; });
            recents.unshift(data);
            localStorage.setItem("bookland_recent_views", JSON.stringify(recents.slice(0, 4)));
            renderRecentBooks();
        }

        function scrollToBook(card) {
            if (!card) return;

            /* اگر کارت داخل یک اسلایدر باشد، اول اسلایدر روی همان کارت تنظیم می‌شود
               تا هنگام اسکرول، کتاب واقعاً دیده شود نه اینکه پشت اسلاید دیگری پنهان بماند */
            const slider = card.closest(".book-slider, .jmag-slider");
            if (slider && typeof slider.blGoToCard === "function") {
                slider.blGoToCard(card);
            }

            setTimeout(function () {
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                card.classList.remove("bl-search-highlight");
                void card.offsetWidth;
                card.classList.add("bl-search-highlight");
                setTimeout(function () { card.classList.remove("bl-search-highlight"); }, 1900);
            }, slider ? 150 : 0);

            recordRecentBook(card);
        }

        function renderSearchResults(value) {
            const query = normalizeSearchText(value);
            searchResults.innerHTML = "";
            if (!query) {
                searchResults.style.display = "none";
                return [];
            }

            const cards = getMainBookCards();
            const matches = cards.filter(function (card) {
                const d = getCardData(card);
                const haystack = normalizeSearchText(d.title + " " + d.publisher + " " + d.info);
                return haystack.includes(query);
            });

            if (!matches.length) {
                searchResults.innerHTML = '<div class="bl-search-no-result">کتابی با این مشخصات پیدا نشد.</div>';
                searchResults.style.display = "block";
                return matches;
            }

            matches.slice(0, 8).forEach(function (card) {
                const d = getCardData(card);
                const button = document.createElement("button");
                button.type = "button";
                button.className = "bl-search-result";
                button.innerHTML =
                    (d.image ? '<img src="' + d.image.replace(/"/g, '&quot;') + '" alt="">' : "") +
                    '<span class="bl-search-result-text"><strong>' + d.title + '</strong><span>' + (d.publisher || d.info) + '</span></span>';
                button.addEventListener("click", function () {
                    searchResults.style.display = "none";
                    searchBox.value = d.title;
                    scrollToBook(card);
                });
                searchResults.appendChild(button);
            });
            searchResults.style.display = "block";
            return matches;
        }

        searchBox.addEventListener("input", function () {
            renderSearchResults(this.value);
        });

        searchBox.addEventListener("keydown", function (event) {
            if (event.key !== "Enter") return;
            const matches = renderSearchResults(this.value);
            if (matches.length) {
                event.preventDefault();
                searchResults.style.display = "none";
                scrollToBook(matches[0]);
            }
        });

        document.addEventListener("click", function (event) {
            if (searchWrap && !searchWrap.contains(event.target)) {
                searchResults.style.display = "none";
            }
        });

        window.BookLandRecordRecent = recordRecentBook;

        function renderRecentBooks() {
            const container = document.getElementById("recentContainer");
            if (!container) return;
            let recents = [];
            try { recents = JSON.parse(localStorage.getItem("bookland_recent_views") || "[]"); } catch (e) { recents = []; }
            if (!recents.length) {
                container.innerHTML = '<div class="bl-search-no-result" style="grid-column:1/-1">هنوز کتابی در بازدیدهای اخیر ثبت نشده است.</div>';
                return;
            }
            container.innerHTML = recents.map(function (item) {
                return '<div class="recent-card bl-dynamic-recent" data-recent-title="' + item.title.replace(/"/g, '&quot;') + '">' +
                    (item.image ? '<img src="' + item.image.replace(/"/g, '&quot;') + '" alt="">' : '') +
                    '<h3>' + item.title + '</h3>' +
                    '<p>' + (item.publisher || '') + '</p>' +
                    '<button type="button" class="recent-open-btn">مشاهده</button></div>';
            }).join("");
            container.querySelectorAll(".recent-open-btn").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    const card = this.closest(".recent-card");
                    const title = card ? card.getAttribute("data-recent-title") : "";
                    const target = getMainBookCards().find(function (item) {
                        return normalizeSearchText(item.querySelector("h3")?.textContent) === normalizeSearchText(title);
                    });
                    if (target) scrollToBook(target);
                });
            });
        }
        window.BookLandRenderRecent = renderRecentBooks;
        renderRecentBooks();
    }



    const newsButton =
        document.querySelector(
            ".newsletter button"
        );


    const newsInput =
        document.querySelector(
            ".newsletter input"
        );


    if (
        newsButton &&
        newsInput
    ) {

        newsButton.addEventListener(
            "click",
            function () {

                const email =
                    newsInput.value.trim();


                if (email === "") {

                    alert(
                        "ایمیل خود را وارد کنید."
                    );

                    newsInput.focus();

                    return;
                }




                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    alert(
                        "لطفاً یک ایمیل معتبر وارد کنید."
                    );

                    newsInput.focus();

                    return;
                }


                alert(
                    "عضویت با موفقیت انجام شد."
                );


                newsInput.value = "";
            }
        );
    }


    document
        .querySelectorAll(
            ".top-menu a"
        )
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const href =
                            this.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            href === "#" ||
                            !href.startsWith("#")
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                href
                            );


                        if (target) {

                            event.preventDefault();


                            target.scrollIntoView({
                                behavior:
                                    "smooth"
                            });

                        }
                    }
                );
            }
        );



    const topButton =
        document.createElement(
            "button"
        );


    topButton.type = "button";

    topButton.innerHTML = "↑";

    topButton.setAttribute(
        "aria-label",
        "رفتن به بالای صفحه"
    );


    Object.assign(
        topButton.style,
        {
            position: "fixed",
            bottom: "25px",
            left: "25px",

            width: "50px",
            height: "50px",

            border: "none",
            borderRadius: "50%",

            background: "#2563eb",
            color: "#fff",

            cursor: "pointer",

            display: "none",

            alignItems: "center",
            justifyContent: "center",

            fontSize: "22px",

            boxShadow:
                "0 5px 15px rgba(0,0,0,.2)",

            zIndex: "9999"
        }
    );


    document.body.appendChild(
        topButton
    );


    window.addEventListener(
        "scroll",
        function () {

            if (
                window.scrollY > 300
            ) {

                topButton.style.display =
                    "flex";

            } else {

                topButton.style.display =
                    "none";

            }
        }
    );


    topButton.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );




    const animatedItems =
        document.querySelectorAll(
            ".newsletter, .recent-card"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.style.opacity =
                                    "1";

                                entry.target.style.transform =
                                    "translateY(0)";

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: .15
                }
            );


        animatedItems.forEach(
            function (item) {

                item.style.opacity = "0";

                item.style.transform =
                    "translateY(30px)";

                item.style.transition =
                    "opacity .7s ease, transform .7s ease";

                observer.observe(item);

            }
        );
    }

});









/* ********************************************************************************************************** */



/* ===== BookLand | حساب کاربری و سبد خرید ===== */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------- ابزارها ---------- */

    var FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

    function toFa(value) {
        return String(value).replace(/\d/g, function (d) {
            return FA[d];
        });
    }

    function toEn(value) {
        return String(value)
            .replace(/[۰-۹]/g, function (d) {
                return "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
            })
            .replace(/[٠-٩]/g, function (d) {
                return "٠١٢٣٤٥٦٧٨٩".indexOf(d);
            });
    }

    function parsePrice(text) {
        var digits = toEn(text).replace(/[^\d]/g, "");
        return digits ? parseInt(digits, 10) : 0;
    }

    function formatPrice(number) {
        return toFa(number.toLocaleString("en-US")).replace(/,/g, "٬") + " تومان";
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function readStore(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function writeStore(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) { }
    }


    /* ---------- وضعیت ---------- */

    var USERS_KEY = "bookland_users";
    var CURRENT_KEY = "bookland_current_user";

    
    var users = readStore(USERS_KEY, []);
    if (!Array.isArray(users)) {
        users = [];
    }
    var currentUserId = readStore(CURRENT_KEY, null);

    function makeUserId() {
        return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function currentUser() {
        if (!currentUserId) return null;
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === currentUserId) return users[i];
        }
        return null;
    }

    function cartKey() {
        return "bookland_cart_" + (currentUserId || "guest");
    }

    var cart = readStore(cartKey(), []);

    function saveCart() {
        writeStore(cartKey(), cart);
    }


    /* ---------- ساخت باکس ها ---------- */

    var markup =
        '<div class="bl-modal" id="blAuthModal">' +
        '  <div class="bl-backdrop" data-close></div>' +
        '  <div class="bl-box" role="dialog" aria-modal="true" aria-labelledby="blAuthTitle">' +
        '    <button class="bl-close" data-close aria-label="بستن"><i class="fa-solid fa-xmark"></i></button>' +
        '    <h2 class="bl-title" id="blAuthTitle">حساب کاربری</h2>' +
        '    <p class="bl-subtitle">با یک حساب، سبد خرید و مشخصات شما ذخیره می‌ماند.</p>' +
        '    <div class="bl-tabs">' +
        '      <button class="bl-tab active" type="button" data-tab="register">ثبت نام</button>' +
        '      <button class="bl-tab" type="button" data-tab="login">ورود</button>' +
        '    </div>' +
        '    <div class="bl-msg" id="blAuthMsg"></div>' +
        '    <form id="blRegisterForm" novalidate>' +
        '      <div class="bl-field"><label for="blRegName">نام و نام خانوادگی</label>' +
        '        <input id="blRegName" type="text" placeholder="مثلاً سارا احمدی" /></div>' +
        '      <div class="bl-field"><label for="blRegPhone">شماره تماس</label>' +
        '        <input id="blRegPhone" type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" /></div>' +
        '      <div class="bl-field"><label for="blRegEmail">ایمیل</label>' +
        '        <input id="blRegEmail" type="email" placeholder="name@example.com" /></div>' +
        '      <div class="bl-field"><label for="blRegPass">رمز عبور</label>' +
        '        <input id="blRegPass" type="password" placeholder="حداقل ۴ کاراکتر" /></div>' +
        '      <button class="bl-submit" type="submit">ساخت حساب</button>' +
        '    </form>' +
        '    <form id="blLoginForm" class="bl-hidden" novalidate>' +
        '      <div class="bl-field"><label for="blLogEmail">ایمیل</label>' +
        '        <input id="blLogEmail" type="email" placeholder="name@example.com" /></div>' +
        '      <div class="bl-field"><label for="blLogPass">رمز عبور</label>' +
        '        <input id="blLogPass" type="password" placeholder="رمز عبور" /></div>' +
        '      <button class="bl-submit" type="submit">ورود به حساب</button>' +
        '    </form>' +
        '  </div>' +
        '</div>' +

        '<div class="bl-modal" id="blAccountModal">' +
        '  <div class="bl-backdrop" data-close></div>' +
        '  <div class="bl-box" role="dialog" aria-modal="true">' +
        '    <button class="bl-close" data-close aria-label="بستن"><i class="fa-solid fa-xmark"></i></button>' +
        '    <h2 class="bl-title">حساب من</h2>' +
        '    <p class="bl-subtitle">مشخصات ثبت‌شده شما در BookLand.</p>' +
        '    <div id="blAccountBody"></div>' +
        '    <button class="bl-logout" type="button" id="blLogoutBtn">خروج از حساب</button>' +
        '  </div>' +
        '</div>' +

        '<div class="bl-modal" id="blCartModal">' +
        '  <div class="bl-backdrop" data-close></div>' +
        '  <div class="bl-box wide" role="dialog" aria-modal="true">' +
        '    <button class="bl-close" data-close aria-label="بستن"><i class="fa-solid fa-xmark"></i></button>' +
        '    <h2 class="bl-title">سبد خرید</h2>' +
        '    <p class="bl-subtitle" id="blCartSub"></p>' +
        '    <div class="bl-cart-list" id="blCartList"></div>' +
        '    <div id="blCartFooter"></div>' +
        '  </div>' +
        '</div>' +

        '<div class="bl-toast" id="blToast"></div>';

    var holder = document.createElement("div");
    holder.innerHTML = markup;

    while (holder.firstChild) {
        document.body.appendChild(holder.firstChild);
    }

    var authModal = document.getElementById("blAuthModal");
    var accountModal = document.getElementById("blAccountModal");
    var cartModal = document.getElementById("blCartModal");
    var toastEl = document.getElementById("blToast");
    var authMsg = document.getElementById("blAuthMsg");


    /* ---------- باز و بسته کردن ---------- */

    function openModal(modal) {
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal(modal) {
        modal.classList.remove("open");
        document.body.style.overflow = "";
    }

    document.addEventListener("click", function (event) {
        if (event.target.hasAttribute && event.target.hasAttribute("data-close")) {
            closeModal(event.target.closest(".bl-modal"));
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            [authModal, accountModal, cartModal].forEach(function (modal) {
                if (modal.classList.contains("open")) {
                    closeModal(modal);
                }
            });
        }
    });

    var toastTimer = null;

    function toast(text, type) {
        toastEl.textContent = text;
        toastEl.className = "bl-toast show" + (type ? " " + type : "");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toastEl.classList.remove("show");
        }, 2600);
    }

    function showAuthMsg(text, type) {
        authMsg.textContent = text;
        authMsg.className = "bl-msg show " + (type || "info");
    }

    function clearAuthMsg() {
        authMsg.className = "bl-msg";
    }


    /* ---------- دکمه های هدر ---------- */

    var topIcons = document.querySelector(".top-icons");
    var cartBox = document.querySelector(".cart-box");

    var userBox = document.createElement("div");
    userBox.className = "icon-box login-box";
    userBox.setAttribute("role", "button");
    userBox.setAttribute("tabindex", "0");

    if (topIcons) {
        topIcons.insertBefore(userBox, topIcons.firstChild);
    }

    var badge = document.createElement("span");
    badge.className = "bl-badge";

    if (cartBox) {
        cartBox.appendChild(badge);
        cartBox.setAttribute("role", "button");
        cartBox.setAttribute("tabindex", "0");

        cartBox.addEventListener("click", function () {
            renderCart();
            openModal(cartModal);
        });
    }

    function openAuth(tab, message) {
        switchTab(tab || "login");

        if (message) {
            showAuthMsg(message, "info");
        } else {
            clearAuthMsg();
        }

        openModal(authModal);
    }

    userBox.addEventListener("click", function () {
        if (currentUser()) {
            renderAccount();
            openModal(accountModal);
        } else {
            openAuth("register");
        }
    });

    function renderUserBox() {
        var user = currentUser();

        if (user) {
            userBox.innerHTML =
                '<i class="fa-solid fa-user"></i><span>' +
                escapeHtml(user.name.split(" ")[0]) +
                "</span>";
            userBox.title = "حساب من";
        } else {
            userBox.innerHTML =
                '<i class="fa-solid fa-right-to-bracket"></i><span>ورود / ثبت نام</span>';
            userBox.title = "ورود یا ثبت نام";
        }
    }


    /* ---------- تب ها و فرم ها ---------- */

    var registerForm = document.getElementById("blRegisterForm");
    var loginForm = document.getElementById("blLoginForm");

    function switchTab(name) {
        document.querySelectorAll(".bl-tab").forEach(function (tab) {
            tab.classList.toggle("active", tab.dataset.tab === name);
        });

        registerForm.classList.toggle("bl-hidden", name !== "register");
        loginForm.classList.toggle("bl-hidden", name !== "login");
    }

    document.querySelectorAll(".bl-tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
            clearAuthMsg();
            switchTab(tab.dataset.tab);
        });
    });

    function validEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validPhone(value) {
        var digits = toEn(value).replace(/[^\d]/g, "");
        return digits.length >= 10 && digits.length <= 13;
    }

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var name = document.getElementById("blRegName").value.trim();
        var phone = toEn(document.getElementById("blRegPhone").value.trim());
        var email = document.getElementById("blRegEmail").value.trim().toLowerCase();
        var pass = document.getElementById("blRegPass").value;

        if (name.length < 3) {
            return showAuthMsg("نام و نام خانوادگی را کامل وارد کنید.", "error");
        }

        if (!validPhone(phone)) {
            return showAuthMsg("شماره تماس معتبر نیست؛ مثلاً ۰۹۱۲۳۴۵۶۷۸۹.", "error");
        }

        if (!validEmail(email)) {
            return showAuthMsg("ایمیل معتبر نیست.", "error");
        }

        if (pass.length < 4) {
            return showAuthMsg("رمز عبور باید حداقل ۴ کاراکتر باشد.", "error");
        }

        var newUser = {
            id: makeUserId(),
            name: name,
            phone: phone,
            email: email,
            password: pass,
            joined: new Date().toISOString()
        };

        users.push(newUser);
        writeStore(USERS_KEY, users);

        registerForm.reset();

        signIn(newUser.id, "حساب شما ساخته شد. خوش آمدید!");
    });

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var email = document.getElementById("blLogEmail").value.trim().toLowerCase();
        var pass = document.getElementById("blLogPass").value;

        var accountsWithEmail = users.filter(function (u) {
            return u.email === email;
        });

        if (!accountsWithEmail.length) {
            return showAuthMsg("حسابی با این ایمیل پیدا نشد.", "error");
        }

        var match = accountsWithEmail.find(function (u) {
            return u.password === pass;
        });

        if (!match) {
            return showAuthMsg("رمز عبور درست نیست.", "error");
        }

        loginForm.reset();

        signIn(match.id, "خوش آمدید، " + match.name + "!");
    });

    function signIn(userId, message) {
        var guestCart = cart.slice();

        currentUserId = userId;
        writeStore(CURRENT_KEY, userId);

        cart = readStore(cartKey(), []);

        /* اقلامی که قبل از ورود انتخاب شده بود به سبد کاربر اضافه می شود */
        guestCart.forEach(function (item) {
            var found = findItem(item.id);

            if (found) {
                found.qty += item.qty;
            } else {
                cart.push(item);
            }
        });

        saveCart();
        writeStore("bookland_cart_guest", []);

        clearAuthMsg();
        closeModal(authModal);

        renderUserBox();
        renderBadge();
        toast(message, "ok");
    }

    document.getElementById("blLogoutBtn").addEventListener("click", function () {
        currentUserId = null;
        writeStore(CURRENT_KEY, null);

        cart = readStore(cartKey(), []);

        closeModal(accountModal);

        renderUserBox();
        renderBadge();
        toast("از حساب خارج شدید.");
    });

    function renderAccount() {
        var user = currentUser();

        if (!user) {
            return;
        }

        var orders = readStore("bookland_orders_" + user.id, []);

        document.getElementById("blAccountBody").innerHTML =
            '<div class="bl-user-row"><i class="fa-solid fa-user"></i>' +
            "<div><span>نام</span>" + escapeHtml(user.name) + "</div></div>" +

            '<div class="bl-user-row"><i class="fa-solid fa-phone"></i>' +
            "<div><span>شماره تماس</span>" + toFa(user.phone) + "</div></div>" +

            '<div class="bl-user-row"><i class="fa-solid fa-envelope"></i>' +
            "<div><span>ایمیل</span>" + escapeHtml(user.email) + "</div></div>" +

            '<div class="bl-user-row"><i class="fa-solid fa-bag-shopping"></i>' +
            "<div><span>خریدهای ثبت‌شده</span>" + toFa(orders.length) + " سفارش</div></div>";
    }


    /* ---------- سبد خرید ---------- */

    function findItem(id) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === id) {
                return cart[i];
            }
        }
        return null;
    }

    function cartCount() {
        return cart.reduce(function (sum, item) {
            return sum + item.qty;
        }, 0);
    }

    function cartTotal() {
        return cart.reduce(function (sum, item) {
            return sum + item.price * item.qty;
        }, 0);
    }

    function renderBadge() {
        var count = cartCount();

        badge.textContent = toFa(count);
        badge.classList.toggle("show", count > 0);
    }

    function addToCart(card) {
        var titleEl = card.querySelector("h3");
        var priceEl = card.querySelector(".price");
        var pubEl = card.querySelector(".publisher");
        var imgEl = card.querySelector("img");

        if (!titleEl || !priceEl) {
            return;
        }

        var title = titleEl.textContent.trim();
        var id = title.replace(/\s+/g, "-");
        var found = findItem(id);

        if (found) {
            found.qty += 1;
        } else {
            cart.push({
                id: id,
                title: title,
                publisher: pubEl ? pubEl.textContent.trim() : "",
                price: parsePrice(priceEl.textContent),
                image: imgEl ? imgEl.getAttribute("src") : "",
                qty: 1
            });
        }

        saveCart();
        renderBadge();

        if (cartModal.classList.contains("open")) {
            renderCart();
        }

        toast("«" + title + "» به سبد خرید اضافه شد.", "ok");
    }

    document.addEventListener("click", function (event) {
        var button = event.target.closest(".cart-btn");

        if (!button) {
            return;
        }

        var card = button.closest(".book-card");

        if (card) {
            event.preventDefault();
            addToCart(card);
        }
    });

    function changeQty(id, step) {
        var item = findItem(id);

        if (!item) {
            return;
        }

        item.qty += step;

        if (item.qty < 1) {
            removeItem(id);
            return;
        }

        saveCart();
        renderBadge();
        renderCart();
    }

    function removeItem(id) {
        cart = cart.filter(function (item) {
            return item.id !== id;
        });

        saveCart();
        renderBadge();
        renderCart();
        toast("کتاب از سبد حذف شد.");
    }

    function renderCart() {
        var list = document.getElementById("blCartList");
        var footer = document.getElementById("blCartFooter");
        var sub = document.getElementById("blCartSub");

        if (cart.length === 0) {
            sub.textContent = "هنوز کتابی انتخاب نکرده‌اید.";

            list.innerHTML =
                '<div class="bl-empty"><i class="fa-solid fa-cart-shopping"></i>' +
                "<p>سبد خرید شما خالی است. با دکمه سبد روی هر کتاب، آن را به سبد اضافه کنید.</p></div>";

            footer.innerHTML = "";

            return;
        }

        sub.textContent =
            toFa(cart.length) + " عنوان، مجموعاً " + toFa(cartCount()) + " جلد کتاب";

        list.innerHTML = cart.map(function (item) {
            return (
                '<div class="bl-cart-item">' +
                (item.image ? '<img src="' + escapeHtml(item.image) + '" alt="" />' : "") +
                '<div class="bl-cart-info">' +
                "<h4>" + escapeHtml(item.title) + "</h4>" +
                '<p class="bl-pub">' + escapeHtml(item.publisher) + "</p>" +
                '<p class="bl-unit">' + formatPrice(item.price * item.qty) + "</p>" +
                '<div class="bl-qty">' +
                '<button type="button" data-minus="' + item.id + '" aria-label="کاهش">' +
                '<i class="fa-solid fa-minus"></i></button>' +
                '<span class="bl-count">' + toFa(item.qty) + "</span>" +
                '<button type="button" data-plus="' + item.id + '" aria-label="افزایش">' +
                '<i class="fa-solid fa-plus"></i></button>' +
                '<button class="bl-remove" type="button" data-remove="' + item.id + '">حذف</button>' +
                "</div></div></div>"
            );
        }).join("");

        footer.innerHTML =
            '<div class="bl-cart-footer">' +
            '<div class="bl-total-row"><span>تعداد کل</span><span>' +
            toFa(cartCount()) + " جلد</span></div>" +
            '<div class="bl-total-row final"><span>مبلغ قابل پرداخت</span><b>' +
            formatPrice(cartTotal()) + "</b></div>" +
            '<button class="bl-submit" type="button" id="blCheckout">ثبت خرید</button>' +
            "</div>";

        document.getElementById("blCheckout").addEventListener("click", checkout);
    }

    document.getElementById("blCartList").addEventListener("click", function (event) {
        var minus = event.target.closest("[data-minus]");
        var plus = event.target.closest("[data-plus]");
        var remove = event.target.closest("[data-remove]");

        if (minus) {
            changeQty(minus.dataset.minus, -1);
        } else if (plus) {
            changeQty(plus.dataset.plus, 1);
        } else if (remove) {
            removeItem(remove.dataset.remove);
        }
    });

    function checkout() {
        if (cart.length === 0) {
            return;
        }

        var user = currentUser();

        if (!user) {
            closeModal(cartModal);
            openAuth("login", "برای ثبت خرید ابتدا وارد حساب خود شوید یا ثبت نام کنید. سبد شما نگه داشته می‌شود.");
            return;
        }

        var ordersKey = "bookland_orders_" + user.id;
        var orders = readStore(ordersKey, []);

        var order = {
            code: "BL-" + Date.now().toString().slice(-6),
            date: new Date().toISOString(),
            customer: {
                name: user.name,
                phone: user.phone,
                email: user.email
            },
            items: cart.slice(),
            count: cartCount(),
            total: cartTotal()
        };

        orders.push(order);
        writeStore(ordersKey, orders);

        cart = [];
        saveCart();

        renderBadge();
        renderCart();

        toast("خرید ثبت شد. کد پیگیری: " + order.code, "ok");
    }


    /* ---------- شروع ---------- */

    renderUserBox();
    renderBadge();
});


/* ===== BookLand | قابلیت های تکمیلی، کاملاً مستقل از حساب و سبد ===== */
document.addEventListener("DOMContentLoaded", function () {
    function escapeHtml(text) {
        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getSectionBookCards(sectionHeader) {
        const booksSection = sectionHeader && sectionHeader.nextElementSibling;
        if (!booksSection) return [];
        return Array.from(booksSection.querySelectorAll(".book-slider .book-card"));
    }

    function getAuthor(card) {
        const rows = Array.from(card.querySelectorAll(".book-info p"));
        for (const row of rows) {
            const txt = row.textContent.trim();
            if (txt.indexOf("نویسنده:") !== -1) return txt.replace("نویسنده:", "").trim();
        }
        return "";
    }

    function getPublisher(card) {
        const el = card.querySelector(".publisher");
        if (el) return el.textContent.trim();
        const rows = Array.from(card.querySelectorAll(".book-info p"));
        for (const row of rows) {
            const txt = row.textContent.trim();
            if (txt.indexOf("ناشر:") !== -1) return txt.replace("ناشر:", "").trim();
        }
        return "";
    }

    function createSectionModal() {
        let modal = document.getElementById("blSectionListModal");
        if (modal) return modal;
        modal = document.createElement("div");
        modal.id = "blSectionListModal";
        modal.className = "bl-section-modal";
        modal.innerHTML = '<div class="bl-section-dialog"><button type="button" class="bl-dialog-close" aria-label="بستن"><i class="fa-solid fa-xmark"></i></button><h2 id="blSectionListTitle"></h2><div id="blSectionListBody"></div></div>';
        document.body.appendChild(modal);
        modal.addEventListener("click", function (e) {
            if (e.target === modal || e.target.closest(".bl-dialog-close")) modal.classList.remove("open");
        });
        return modal;
    }

    function openSectionList(sectionHeader) {
        const modal = createSectionModal();
        const titleEl = sectionHeader.querySelector("h2");
        const title = titleEl ? titleEl.textContent.trim() : "کتاب ها";
        const cards = getSectionBookCards(sectionHeader);
        const body = modal.querySelector("#blSectionListBody");
        modal.querySelector("#blSectionListTitle").textContent = "همه کتاب های «" + title + "»";
        body.innerHTML = "";
        cards.forEach(function (card) {
            const titleText = card.querySelector("h3")?.textContent.trim() || "کتاب";
            const author = getAuthor(card);
            const publisher = getPublisher(card);
            const img = card.querySelector("img")?.getAttribute("src") || "";
            const row = document.createElement("button");
            row.type = "button";
            row.className = "bl-list-book";
            row.innerHTML = (img ? '<img src="' + escapeHtml(img) + '" alt="">' : "") +
                '<span><h4>' + escapeHtml(titleText) + '</h4>' +
                '<p>ناشر: ' + escapeHtml(publisher || "---") + '</p>' +
                '<p>نویسنده: ' + escapeHtml(author || "---") + '</p></span>';
            row.addEventListener("click", function () {
                modal.classList.remove("open");
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                card.classList.add("bl-search-highlight");
                setTimeout(function () { card.classList.remove("bl-search-highlight"); }, 1800);
            });
            body.appendChild(row);
        });
        if (!cards.length) body.innerHTML = '<div class="bl-search-no-result">در این بخش کتابی پیدا نشد.</div>';
        modal.classList.add("open");
    }

    document.querySelectorAll(".section-view-all").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            openSectionList(button.closest(".section-header"));
        });
    });

    // فروشگاه: پنل کشویی با تمام کتاب های اصلی.
    function createStorePanel() {
        let wrap = document.getElementById("blStorePanelWrap");
        if (wrap) return wrap;
        wrap = document.createElement("div");
        wrap.id = "blStorePanelWrap";
        wrap.className = "bl-store-panel-wrap";
        wrap.innerHTML = '<div class="bl-store-panel"><button type="button" class="bl-dialog-close bl-store-close" aria-label="بستن"><i class="fa-solid fa-xmark"></i></button><h2>فروشگاه</h2><div class="bl-store-grid" id="blStoreGrid"></div></div>';
        document.body.appendChild(wrap);
        wrap.addEventListener("click", function (e) {
            if (e.target === wrap || e.target.closest(".bl-store-close")) wrap.classList.remove("open");
        });
        return wrap;
    }

    function openStore() {
        const wrap = createStorePanel();
        const grid = wrap.querySelector("#blStoreGrid");
        const cards = Array.from(document.querySelectorAll(".books .book-slider .book-card"));
        grid.innerHTML = cards.map(function (card, index) {
            const title = card.querySelector("h3")?.textContent.trim() || "کتاب";
            const author = getAuthor(card);
            const publisher = getPublisher(card);
            const img = card.querySelector("img")?.getAttribute("src") || "";
            return '<button type="button" class="bl-store-item" data-store-index="' + index + '">' +
                (img ? '<img src="' + escapeHtml(img) + '" alt="">' : "") +
                '<span><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(publisher || author || "---") + '</span></span></button>';
        }).join("");
        grid.querySelectorAll(".bl-store-item").forEach(function (item) {
            item.addEventListener("click", function () {
                const idx = Number(this.getAttribute("data-store-index"));
                wrap.classList.remove("open");
                if (cards[idx]) cards[idx].scrollIntoView({ behavior: "smooth", block: "center" });
            });
        });
        wrap.classList.add("open");
    }

    document.querySelectorAll(".menu-right a").forEach(function (link) {
        const text = link.textContent.replace(/\s+/g, " ").trim();
        link.addEventListener("click", function (event) {
            if (text.indexOf("فروشگاه") !== -1) {
                event.preventDefault();
                openStore();
            } else if (text === "خانه") {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (text.indexOf("مجله BookLand") !== -1) {
                event.preventDefault();
                const target = document.getElementById("jmag-section-header");
                if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // جی مگ: نمایش ادامه متن بدون دست زدن به اسلایدر اصلی.
    const extras = [
        "در این مقاله، فضای داستان با تمرکز بر رازها و نشانه های پنهان پیش می رود و خواننده کم کم با انگیزه شخصیت ها و اتفاقات گذشته آشنا می شود. روایت تلاش می کند تعلیق را حفظ کند و هر بخش اطلاعات تازه ای در اختیار مخاطب قرار دهد.",
        "این مطلب نگاهی گسترده تر به زندگی و آثار امانوئل بوو دارد و بخشی از مسیر فکری و ادبی او را مرور می کند. در ادامه، ویژگی های برجسته آثار و زمینه ای که نوشته های او در آن شکل گرفته نیز بررسی می شود.",
        "در ادامه این مطلب، چند مفهوم مهم درباره نگاه انسان به زندگی، آرامش و خودشناسی توضیح داده می شود. متن تلاش می کند این موضوعات را با مثال های ساده تر به تجربه روزمره نزدیک کند و تصویر کامل تری از ایده اصلی ارائه دهد.",
        "این نوشته موضوع آزادی اندیشه و مدارا با تفاوت های فکری را از زاویه ای گسترده تر دنبال می کند. در بخش های بعدی، نمونه ها و نکاتی درباره اهمیت گفت وگو و پذیرفتن دیدگاه های متفاوت مطرح می شود.",
        "در بخش تکمیلی این مطلب، مفهوم انتظار و گذر زمان با جزئیات بیشتری بررسی می شود و ارتباط آن با تصمیم های انسانی و تجربه های روزمره توضیح داده خواهد شد. این ادامه، فضای اصلی مقاله را کامل تر می کند.",
        "در ادامه، داستان از زاویه اخلاق و پیامدهای یک آزمایش غیرعادی بررسی می شود و پرسش هایی درباره مسئولیت، علم و ماهیت انسان مطرح می شود. این بخش برای کامل شدن تصویر کلی موضوع نوشته شده است."
    ];
    document.querySelectorAll(".jmag-more").forEach(function (link, index) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const card = link.closest(".jmag-card");
            if (!card) return;
            let extra = card.querySelector(".bl-jmag-extra");
            if (!extra) {
                extra = document.createElement("p");
                extra.className = "bl-jmag-extra";
                extra.textContent = extras[index] || extras[0];
                link.before(extra);
            }
            extra.classList.toggle("open");
            const icon = link.querySelector("i");
            if (icon) icon.style.transform = extra.classList.contains("open") ? "rotate(-90deg)" : "";
        });
    });

    // هر بار که کتابی به سبد اضافه شود، آن کتاب نیز در بازدیدهای اخیر ثبت می شود.
    document.addEventListener("click", function (event) {
        const cartBtn = event.target.closest(".cart-btn");
        if (!cartBtn) return;
        const card = cartBtn.closest(".book-card");
        if (!card || typeof window.BookLandRecordRecent !== "function") return;
        setTimeout(function () { window.BookLandRecordRecent(card); }, 0);
    });
});

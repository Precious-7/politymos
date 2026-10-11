// ========= Global State =========
window.selectedPlan = "";

// ========= Helpers =========
function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ========= Main =========
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ main.js loaded");

    // ----- Navigation buttons -----
    document.getElementById("hero-book-pickup")
        ?.addEventListener("click", () => scrollToSection("#contact"));

    document.getElementById("hero-our-services")
        ?.addEventListener("click", () => scrollToSection("#services"));

    document.getElementById("nav-book-pickup")
        ?.addEventListener("click", () => scrollToSection("#contact"));

    // ----- Hero Carousel -----
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll("#carousel-dots .dot");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const track = document.getElementById("hero-carousel-track");

    if (slides.length > 0) {
        let currentIndex = 0;
        let timer = null;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                const isActive = i === index;
                slide.classList.toggle("opacity-100", isActive);
                slide.classList.toggle("z-10", isActive);
                slide.classList.toggle("opacity-0", !isActive);
                slide.classList.toggle("z-0", !isActive);
            });

            dots.forEach((dot, i) => {
                const isActive = i === index;
                if (isActive) {
                    dot.className = "dot active w-6 h-2.5 rounded-full bg-amber-400 transition-all duration-300 cursor-pointer";
                } else {
                    dot.className = "dot w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white transition-all duration-300 cursor-pointer";
                }
            });

            currentIndex = index;
        }

        function nextSlide() {
            showSlide((currentIndex + 1) % slides.length);
        }

        function prevSlide() {
            showSlide((currentIndex - 1 + slides.length) % slides.length);
        }

        function startAutoPlay() {
            stopAutoPlay();
            timer = setInterval(nextSlide, 4500);
        }

        function stopAutoPlay() {
            if (timer) clearInterval(timer);
        }

        nextBtn?.addEventListener("click", () => {
            nextSlide();
            startAutoPlay();
        });

        prevBtn?.addEventListener("click", () => {
            prevSlide();
            startAutoPlay();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                showSlide(i);
                startAutoPlay();
            });
        });

        track?.addEventListener("mouseenter", stopAutoPlay);
        track?.addEventListener("mouseleave", startAutoPlay);

        // Touch swipe support for mobile
        let startX = 0;
        track?.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            stopAutoPlay();
        }, { passive: true });

        track?.addEventListener("touchend", (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoPlay();
        }, { passive: true });

        startAutoPlay();
    }

    // ----- Subscription Modal -----
    const modal = document.getElementById("subscription-modal");
    const closeBtn = document.getElementById("close-modal");

    function openModal() {
        modal?.classList.remove("hidden");
    }

    function closeModal() {
        modal?.classList.add("hidden");
    }

    document.getElementById("btn-get-quote")
        ?.addEventListener("click", openModal);

    closeBtn?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // ----- PDF Viewer Modal -----
    const pdfModal = document.getElementById("pdf-viewer-modal");

    window.openPdfModal = function () {
        pdfModal?.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    };

    window.closePdfModal = function () {
        pdfModal?.classList.add("hidden");
        document.body.style.overflow = "";
    };

    pdfModal?.addEventListener("click", (e) => {
        if (e.target === pdfModal) window.closePdfModal();
    });

    // ----- Pricing Section Tab Switching -----
    window.switchPriceTab = function (tabId) {
        // Sync mobile dropdown if present
        const mobileSelect = document.getElementById("mobile-price-category-select");
        if (mobileSelect && mobileSelect.value !== tabId) {
            mobileSelect.value = tabId;
        }

        // Deactivate all tab buttons
        document.querySelectorAll(".price-tab-btn").forEach((btn) => {
            if (btn.id === "tab-btn-all") {
                btn.className = "price-tab-btn px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer bg-black text-amber-400 hover:bg-gray-800 border-2 border-black inline-flex items-center gap-1.5";
            } else {
                btn.className = "price-tab-btn px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer bg-white text-gray-700 hover:bg-amber-50 border-2 border-gray-200 hover:border-amber-400 inline-flex items-center gap-1.5";
            }
        });

        if (tabId === "all") {
            // Show all tab contents stacked together
            document.querySelectorAll(".price-tab-content").forEach((el) => {
                el.classList.remove("hidden");
                el.classList.add("block");
            });
            const allBtn = document.getElementById("tab-btn-all");
            if (allBtn) {
                allBtn.className = "price-tab-btn active px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer bg-amber-500 text-black shadow-md border-2 border-amber-500 inline-flex items-center gap-1.5";
            }
            return;
        }

        // Hide all tab contents
        document.querySelectorAll(".price-tab-content").forEach((el) => {
            el.classList.add("hidden");
            el.classList.remove("block");
        });

        // Show selected tab content
        const targetContent = document.getElementById(`price-tab-${tabId}`);
        if (targetContent) {
            targetContent.classList.remove("hidden");
            targetContent.classList.add("block");
        }

        // Activate selected tab button
        const targetBtn = document.getElementById(`tab-btn-${tabId}`);
        if (targetBtn) {
            targetBtn.className = "price-tab-btn active px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer bg-amber-500 text-black shadow-md border-2 border-amber-500 inline-flex items-center gap-1.5";
        }
    };

    // ----- Plan selection -----
    window.selectPlan = (plan) => {
        window.selectedPlan = plan;

        document.getElementById("weekly-plan").checked = plan === "weekly";
        document.getElementById("monthly-plan").checked = plan === "monthly";

        document.querySelectorAll(".plan-card").forEach((el) => {
            const active = el.id === `plan-${plan}`;
            el.classList.toggle("border-amber-500", active);
            el.classList.toggle("bg-amber-50", active);
        });
    };

    document.getElementById("plan-weekly")
        ?.addEventListener("click", () => window.selectPlan("weekly"));

    document.getElementById("plan-monthly")
        ?.addEventListener("click", () => window.selectPlan("monthly"));

    // ----- Helper: Form Submit Loading Spinner -----
    function setButtonLoading(btn, isLoading, loadingText = "Submitting...") {
        if (!btn) return;
        if (isLoading) {
            btn.dataset.originalHtml = btn.innerHTML;
            btn.disabled = true;
            btn.classList.add("opacity-80", "cursor-not-allowed");
            btn.innerHTML = `
                <span class="inline-flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ${loadingText}
                </span>
            `;
        } else {
            btn.disabled = false;
            btn.classList.remove("opacity-80", "cursor-not-allowed");
            if (btn.dataset.originalHtml) {
                btn.innerHTML = btn.dataset.originalHtml;
            }
        }
    }

    // ----- Inquiry Form -----
    const inquiryForm = document.getElementById("inquiry-form");

    inquiryForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = inquiryForm.querySelector('button[type="submit"]');

        const payload = {
            name: document.getElementById("name")?.value.trim(),
            phone: document.getElementById("phone")?.value.trim(),
            email: document.getElementById("email")?.value.trim(),
            service: document.getElementById("service")?.value.trim(),
            instructions: document.getElementById("special-instructions")?.value.trim(),
        };

        if (!payload.name || !payload.phone) {
            alert("Please fill Name and Phone.");
            return;
        }

        setButtonLoading(submitBtn, true, "Sending Inquiry...");

        try {
            const res = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Inquiry failed");

            // Trigger Google Ads conversion event
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', { 'send_to': 'AW-17962094946/RMpFCPnEjYUcEOKi__RC' });
            }

            inquiryForm.style.display = "none";
            document.getElementById("form-success")?.classList.remove("hidden");

            setTimeout(() => {
                inquiryForm.reset();
                inquiryForm.style.display = "block";
                document.getElementById("form-success")?.classList.add("hidden");
                setButtonLoading(submitBtn, false);
            }, 3000);

        } catch (err) {
            console.error("❌ Inquiry error:", err);
            alert("Inquiry submit failed.");
            setButtonLoading(submitBtn, false);
        }
    });

    // ----- Quote Form -----
    const quoteForm = document.getElementById("subscription-form");

    quoteForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = quoteForm.querySelector('button[type="submit"]');

        if (!window.selectedPlan) {
            alert("Please select Weekly or Monthly plan.");
            return;
        }

        const payload = {
            name: document.getElementById("sub-name")?.value.trim(),
            phone: document.getElementById("sub-phone")?.value.trim(),
            email: document.getElementById("sub-email")?.value.trim(),
            plan: window.selectedPlan,
        };

        if (!payload.name || !payload.phone || !payload.email) {
            alert("Please fill all fields.");
            return;
        }

        setButtonLoading(submitBtn, true, "Submitting Request...");

        try {
            const res = await fetch("/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Quote failed");

            // Trigger Google Ads conversion event
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', { 'send_to': 'AW-17962094946/RMpFCPnEjYUcEOKi__RC' });
            }

            quoteForm.style.display = "none";
            document.getElementById("subscription-success")?.classList.remove("hidden");

            setTimeout(() => {
                document.getElementById("subscription-success")?.classList.add("hidden");
                quoteForm.reset();
                quoteForm.style.display = "block";
                window.selectedPlan = "";
                setButtonLoading(submitBtn, false);
                closeModal();
            }, 2500);

        } catch (err) {
            console.error("❌ Quote error:", err);
            alert("Quote submit failed.");
            setButtonLoading(submitBtn, false);
        }
    });
});

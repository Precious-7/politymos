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

    // ----- Modal -----
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

    // ----- Inquiry Form -----
    const inquiryForm = document.getElementById("inquiry-form");

    inquiryForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

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
            }, 3000);

        } catch (err) {
            console.error("❌ Inquiry error:", err);
            alert("Inquiry submit failed.");
        }
    });

    // ----- Quote Form -----
    const quoteForm = document.getElementById("subscription-form");

    quoteForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

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
                closeModal();
            }, 2500);

        } catch (err) {
            console.error("❌ Quote error:", err);
            alert("Quote submit failed.");
        }
    });
});

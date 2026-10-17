// ==========================================================================
// YIL DÖNÜMÜ DAVETİYESİ - APP LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. FLOATING GOLDEN DUST & SPARKLES CANVAS
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class StarParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.2 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = -Math.random() * 0.5 - 0.2; // floats slowly upward
            this.opacity = Math.random() * 0.7 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseVal = Math.random() * Math.PI;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulseVal += this.pulseSpeed;
            this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.pulseVal));

            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.currentOpacity;
            ctx.fillStyle = '#dfb256';
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#dfb256';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new StarParticle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ----------------------------------------------------------------------
    // 1.5. PSYCHOLOGY CASE FILE PUZZLE CONTROLLER
    // ----------------------------------------------------------------------
    const puzzleScreen = document.getElementById('puzzleScreen');
    const puzzleProgressFill = document.getElementById('puzzleProgressFill');
    const puzzleStepText = document.getElementById('puzzleStepText');
    const puzzleSuccessBanner = document.getElementById('puzzleSuccessBanner');
    const btnUnlockEnvelope = document.getElementById('btnUnlockEnvelope');

    const steps = [
        { q: document.getElementById('pQuestion1'), fb: document.getElementById('feedback1'), stepText: 'Aşama 1 / 3: Nörobiyolojik Test', pct: '33.33%' },
        { q: document.getElementById('pQuestion2'), fb: document.getElementById('feedback2'), stepText: 'Aşama 2 / 3: Bilişsel & Davranışsal Test', pct: '66.66%' },
        { q: document.getElementById('pQuestion3'), fb: document.getElementById('feedback3'), stepText: 'Aşama 3 / 3: Nihai Tedavi Reçetesi', pct: '100%' }
    ];

    let currentStep = 0;

    steps.forEach((stepObj, index) => {
        if (!stepObj.q) return;
        const options = stepObj.q.querySelectorAll('.btn-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const isCorrect = opt.dataset.correct === 'true';

                if (isCorrect) {
                    opt.classList.add('correct');
                    if (stepObj.fb) {
                        stepObj.fb.style.color = '#2ed573';
                        stepObj.fb.textContent = '✓ Doğru teşhis sayın psikoloğum!';
                    }

                    setTimeout(() => {
                        stepObj.q.classList.remove('active');
                        currentStep++;

                        if (currentStep < steps.length) {
                            steps[currentStep].q.classList.add('active');
                            puzzleProgressFill.style.width = steps[currentStep].pct;
                            puzzleStepText.textContent = steps[currentStep].stepText;
                        } else {
                            // All questions finished!
                            puzzleProgressFill.style.width = '100%';
                            puzzleStepText.textContent = 'Tamamlandı: %100 Bilişsel Uyum!';
                            puzzleSuccessBanner.classList.add('active');
                            if (window.romanticConfetti) {
                                window.romanticConfetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 100);
                            }
                        }
                    }, 800);
                } else {
                    opt.classList.add('wrong');
                    if (stepObj.fb) {
                        stepObj.fb.style.color = '#ff4d6d';
                        stepObj.fb.textContent = opt.dataset.msg || 'Yanlış teşhis, tekrar deneyiniz!';
                    }
                    setTimeout(() => {
                        opt.classList.remove('wrong');
                    }, 1000);
                }
            });
        });
    });

    if (btnUnlockEnvelope) {
        btnUnlockEnvelope.addEventListener('click', () => {
            puzzleScreen.classList.add('hidden');
        });
    }
    const envelopeScreen = document.getElementById('envelopeScreen');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
    let isEnvelopeOpen = false;

    function openEnvelope() {
        if (isEnvelopeOpen) return;
        isEnvelopeOpen = true;

        // Visual feedback
        envelopeWrapper.style.transform = 'scale(0.92) rotate(-2deg)';
        envelopeWrapper.style.transition = 'transform 0.4s ease';

        setTimeout(() => {
            envelopeWrapper.style.transform = 'scale(1.2) translateY(-60px)';
            envelopeWrapper.style.opacity = '0';
        }, 300);

        setTimeout(() => {
            envelopeScreen.classList.add('hidden');
            startSlideshow();

            // Try starting ambient romantic audio on user interaction
            try {
                if (window.romanticAudio) {
                    window.romanticAudio.start();
                    const audioBtn = document.getElementById('audioToggleBtn');
                    audioBtn.classList.add('active');
                }
            } catch (e) {
                console.log('Audio autoplay prevented or error:', e);
            }
        }, 750);
    }

    envelopeWrapper.addEventListener('click', openEnvelope);
    openEnvelopeBtn.addEventListener('click', openEnvelope);

    // ----------------------------------------------------------------------
    // 3. AUDIO CONTROLS
    // ----------------------------------------------------------------------
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioToggleIconWrap = document.getElementById('audioToggleIconWrap');
    audioToggleBtn.addEventListener('click', () => {
        if (!window.romanticAudio) return;
        const isPlaying = window.romanticAudio.toggle();
        if (isPlaying) {
            audioToggleBtn.classList.add('active');
            if (audioToggleIconWrap) audioToggleIconWrap.innerHTML = '<i data-lucide="volume-2"></i>';
        } else {
            audioToggleBtn.classList.remove('active');
            if (audioToggleIconWrap) audioToggleIconWrap.innerHTML = '<i data-lucide="volume-x"></i>';
        }
        lucide.createIcons();
    });

    // ----------------------------------------------------------------------
    // 4. COUNTDOWN CLOCK TO 25 EKİM
    // ----------------------------------------------------------------------
    function initCountdown() {
        const daysEl = document.getElementById('countDays');
        const hoursEl = document.getElementById('countHours');
        const minutesEl = document.getElementById('countMinutes');
        const secondsEl = document.getElementById('countSeconds');

        if (!daysEl) return;

        // Target Date: 25 Ekim 09:00
        const now = new Date();
        let targetYear = now.getFullYear();
        // Month is 0-indexed: 9 is October
        let targetDate = new Date(targetYear, 9, 25, 9, 0, 0);

        if (now > targetDate) {
            // Target next year's 25 Ekim
            targetDate = new Date(targetYear + 1, 9, 25, 9, 0, 0);
        }

        function update() {
            const current = new Date();
            const diff = targetDate - current;

            if (diff <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            daysEl.textContent = d < 10 ? '0' + d : d;
            hoursEl.textContent = h < 10 ? '0' + h : h;
            minutesEl.textContent = m < 10 ? '0' + m : m;
            secondsEl.textContent = s < 10 ? '0' + s : s;
        }

        update();
        setInterval(update, 1000);
    }
    initCountdown();

    // ----------------------------------------------------------------------
    // 5. SLIDESHOW / STORY PRESENTATION ENGINE
    // ----------------------------------------------------------------------
    const slides = Array.from(document.querySelectorAll('.slide-item'));
    const totalSlides = slides.length;
    let currentSlide = 0;
    let slideTimer = null;
    let progressTimer = null;
    const slideDuration = 7000; // 7 seconds per slide
    let progressStartTime = 0;
    let elapsedTime = 0;
    let isPaused = false;

    const progressContainer = document.getElementById('storyProgressBars');
    const slideIndicator = document.getElementById('slideIndicator');
    const autoPlayToggleBtn = document.getElementById('autoPlayToggleBtn');
    const autoPlayIcon = document.getElementById('autoPlayIcon');
    const autoPlayText = document.getElementById('autoPlayText');
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');

    // Build Progress Bars
    progressContainer.innerHTML = '';
    slides.forEach((_, idx) => {
        const bar = document.createElement('div');
        bar.className = 'story-progress-bar';
        bar.dataset.index = idx;
        const fill = document.createElement('div');
        fill.className = 'story-progress-fill';
        bar.appendChild(fill);
        bar.addEventListener('click', () => {
            goToSlide(idx);
        });
        progressContainer.appendChild(bar);
    });

    const progressBars = Array.from(document.querySelectorAll('.story-progress-bar'));

    function updateSlideUI() {
        // Update slides
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update progress bars
        progressBars.forEach((bar, idx) => {
            const fill = bar.querySelector('.story-progress-fill');
            if (idx < currentSlide) {
                bar.classList.add('completed');
                fill.style.width = '100%';
            } else if (idx === currentSlide) {
                bar.classList.remove('completed');
                fill.style.width = '0%';
            } else {
                bar.classList.remove('completed');
                fill.style.width = '0%';
            }
        });

        slideIndicator.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }

    function resetProgressAnimation() {
        cancelAnimationFrame(progressTimer);
        elapsedTime = 0;
        progressStartTime = performance.now();

        function step(now) {
            if (!isPaused) {
                elapsedTime = now - progressStartTime;
                const pct = Math.min((elapsedTime / slideDuration) * 100, 100);
                const currentBarFill = progressBars[currentSlide]?.querySelector('.story-progress-fill');
                if (currentBarFill) {
                    currentBarFill.style.width = `${pct}%`;
                }

                if (elapsedTime >= slideDuration) {
                    nextSlide();
                    return;
                }
            } else {
                progressStartTime = now - elapsedTime;
            }
            progressTimer = requestAnimationFrame(step);
        }

        progressTimer = requestAnimationFrame(step);
    }

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;
        updateSlideUI();
        resetProgressAnimation();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlideshow() {
        goToSlide(0);
    }

    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            autoPlayIcon.setAttribute('data-lucide', 'play');
            autoPlayText.textContent = 'Oynat';
        } else {
            autoPlayIcon.setAttribute('data-lucide', 'pause');
            autoPlayText.textContent = 'Duraklat';
        }
        lucide.createIcons();
    }

    prevSlideBtn.addEventListener('click', prevSlide);
    nextSlideBtn.addEventListener('click', nextSlide);
    autoPlayToggleBtn.addEventListener('click', togglePause);

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Touch / Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    document.getElementById('sliderView').addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.getElementById('sliderView').addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 40;
        if (touchEndX < touchStartX - threshold) {
            nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            prevSlide();
        }
    }

    // ----------------------------------------------------------------------
    // 6. VIEW SWITCHER: SLIDER vs TIMELINE
    // ----------------------------------------------------------------------
    const viewToggleBtn = document.getElementById('viewToggleBtn');
    const viewToggleIconWrap = document.getElementById('viewToggleIconWrap');
    const viewToggleText = document.getElementById('viewToggleText');
    const sliderView = document.getElementById('sliderView');
    const timelineView = document.getElementById('timelineView');
    const timelineAcceptBtn = document.getElementById('timelineAcceptBtn');

    let currentMode = 'slider';

    function setViewMode(mode) {
        currentMode = mode;
        if (mode === 'timeline') {
            isPaused = true;
            sliderView.classList.add('hidden');
            timelineView.classList.add('active');
            if (viewToggleText) viewToggleText.textContent = 'Slayt Gösterisi';
            if (viewToggleIconWrap) viewToggleIconWrap.innerHTML = '<i data-lucide="presentation"></i>';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            isPaused = false;
            sliderView.classList.remove('hidden');
            timelineView.classList.remove('active');
            if (viewToggleText) viewToggleText.textContent = 'Tüm Programı Gör';
            if (viewToggleIconWrap) viewToggleIconWrap.innerHTML = '<i data-lucide="calendar"></i>';
            resetProgressAnimation();
        }
        lucide.createIcons();
    }

    viewToggleBtn.addEventListener('click', () => {
        setViewMode(currentMode === 'slider' ? 'timeline' : 'slider');
    });

    if (timelineAcceptBtn) {
        timelineAcceptBtn.addEventListener('click', () => {
            setViewMode('slider');
        });
    }

    // ----------------------------------------------------------------------
    // 7. LOVE POPUP & CONFETTI CELEBRATION
    // ----------------------------------------------------------------------
    const btnAcceptYes = document.getElementById('btnAcceptYes');
    const btnAcceptAlways = document.getElementById('btnAcceptAlways');
    const lovePopup = document.getElementById('lovePopup');
    const popupCloseBtn = document.getElementById('popupCloseBtn');
    const popupOkBtn = document.getElementById('popupOkBtn');

    function triggerCelebration() {
        if (window.romanticConfetti) {
            // Burst from both corners and center
            window.romanticConfetti.burst(window.innerWidth * 0.5, window.innerHeight * 0.4, 150);
            setTimeout(() => {
                window.romanticConfetti.burst(window.innerWidth * 0.2, window.innerHeight * 0.6, 90);
                window.romanticConfetti.burst(window.innerWidth * 0.8, window.innerHeight * 0.6, 90);
            }, 300);
        }
        lovePopup.classList.add('active');
    }

    if (btnAcceptYes) btnAcceptYes.addEventListener('click', triggerCelebration);
    if (btnAcceptAlways) btnAcceptAlways.addEventListener('click', triggerCelebration);

    function closePopup() {
        lovePopup.classList.remove('active');
    }

    popupCloseBtn.addEventListener('click', closePopup);
    popupOkBtn.addEventListener('click', closePopup);
    lovePopup.addEventListener('click', (e) => {
        if (e.target === lovePopup) closePopup();
    });
});

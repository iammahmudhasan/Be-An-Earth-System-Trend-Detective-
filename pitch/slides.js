/**
 * Project Orion Space — Presentation Deck Controller
 * Pure Vanilla JS with Chart.js Integration & Web Audio API
 */

class OrionDeck {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.dotsContainer = document.getElementById('slide-dots');
    this.currentSlideIndex = 0;
    this.totalSlides = this.slides.length;
    this.deckFrame = document.getElementById('deck-frame');
    this.soundEnabled = true;
    this.chartInstance = null;
    this.audioCtx = null;

    this.init();
  }

  init() {
    this.setupViewportScaling();
    this.buildDots();
    this.setupEventListeners();
    this.showSlide(0);
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  setupViewportScaling() {
    const scaleDeck = () => {
      if (!this.deckFrame) return;
      const targetW = 1920;
      const targetH = 1080;
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      const scale = Math.min(winW / targetW, winH / targetH);
      this.deckFrame.style.transform = `scale(${scale})`;
    };

    window.addEventListener('resize', scaleDeck);
    scaleDeck();
  }

  buildDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `slide-dot ${i === 0 ? 'active' : ''}`;
      dot.title = `Slide ${i + 1}`;
      dot.addEventListener('click', () => {
        this.goToSlide(i);
      });
      this.dotsContainer.appendChild(dot);
    }
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll('.slide-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlideIndex);
    });
  }

  showSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;

    this.slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev');
      if (i === index) {
        slide.classList.add('active');
      } else if (i < index) {
        slide.classList.add('prev');
      }
    });

    this.currentSlideIndex = index;
    this.updateDots();
    this.updateSlideCounter();

    // Trigger Slide specific activations
    if (this.currentSlideIndex === 3) {
      this.renderSlide4Chart();
    }

    this.playChime();
  }

  nextSlide() {
    if (this.currentSlideIndex < this.totalSlides - 1) {
      this.showSlide(this.currentSlideIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.showSlide(this.currentSlideIndex - 1);
    }
  }

  goToSlide(index) {
    this.showSlide(index);
  }

  updateSlideCounter() {
    const counter = document.getElementById('slide-counter');
    if (counter) {
      const curr = String(this.currentSlideIndex + 1).padStart(2, '0');
      const total = String(this.totalSlides).padStart(2, '0');
      counter.textContent = `${curr} / ${total}`;
    }
  }

  updateClock() {
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toTimeString().split(' ')[0] + ' UTC+6';
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  playChime() {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      // Subtle crisp UI ping
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {
      // Ignore audio failure if restricted
    }
  }

  renderSlide4Chart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Annual Mean'];
    // Decadal warming trends (°C/decade)
    const trends = [0.12, 0.08, -0.04, 0.02, 0.05, 0.01, 0.03, 0.02, 0.15, 0.457, 0.28, 0.14, 0.03];
    const backgroundColors = trends.map((val, idx) => {
      if (idx === 9) return '#ef4444'; // October Spike (Alert Red)
      if (idx === 12) return '#71717a'; // Annual flat (Muted Zinc)
      return '#27272a';
    });
    const borderColors = trends.map((val, idx) => {
      if (idx === 9) return '#ffffff';
      if (idx === 12) return '#a1a1aa';
      return '#3f3f46';
    });

    const ctx = canvas.getContext('2d');
    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Theil-Sen Trend Slope (°C / Decade)',
          data: trends,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 900,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#09090b',
            titleColor: '#ffffff',
            bodyColor: '#a1a1aa',
            borderColor: '#27272a',
            borderWidth: 1,
            titleFont: { family: 'JetBrains Mono', size: 12 },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 12,
            callbacks: {
              label: (context) => {
                const val = context.parsed.y;
                if (context.dataIndex === 9) {
                  return ` +${val}°C / decade (p=0.0070, 91.2% stations)`;
                }
                return ` ${val > 0 ? '+' : ''}${val}°C / decade`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: '#18181b',
              drawBorder: false
            },
            ticks: {
              color: (ctx) => (ctx.index === 9 ? '#ffffff' : '#71717a'),
              font: {
                family: 'JetBrains Mono',
                size: 11,
                weight: (ctx) => (ctx.index === 9 ? 'bold' : 'normal')
              }
            }
          },
          y: {
            min: -0.1,
            max: 0.55,
            grid: {
              color: '#18181b',
              drawBorder: false
            },
            ticks: {
              color: '#71717a',
              font: {
                family: 'JetBrains Mono',
                size: 11
              },
              callback: (val) => `${val > 0 ? '+' : ''}${val}°C`
            }
          }
        }
      }
    });
  }

  setupEventListeners() {
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Avoid firing if focusing an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          this.prevSlide();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides - 1);
          break;
      }
    });

    // UI Buttons
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const fsBtn = document.getElementById('btn-fs');
    const soundBtn = document.getElementById('btn-sound');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
    if (fsBtn) fsBtn.addEventListener('click', () => this.toggleFullscreen());
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        soundBtn.classList.toggle('on', this.soundEnabled);
        soundBtn.textContent = this.soundEnabled ? 'AUDIO: ON' : 'AUDIO: MUTED';
      });
    }
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.orionDeck = new OrionDeck();
});

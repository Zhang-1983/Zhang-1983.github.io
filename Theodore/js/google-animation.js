class GoogleAnimation {
  constructor() {
    this.container = document.getElementById('google-animation-container');
    this.canvas = document.getElementById('particles-canvas');
    this.title = document.querySelector('.animation-title');
    this.subtitle = document.querySelector('.animation-subtitle');
    this.btn = document.querySelector('.animation-btn');
    this.ctx = this.canvas.getContext('2d');
    this.meteorParticles = [];
    this.starParticles = [];
    this.animationSteps = [];
    this.isAnimationComplete = false;
  }

  init() {
    this.setupCanvas();
    this.startAnimationSequence();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  startAnimationSequence() {
    // 阶段1: 黑屏→星空背景
    setTimeout(() => {
      this.container.style.animation = 'fadeInBackground 1000ms linear forwards';
      this.createStarfield();
    }, 0);

    // 阶段2: 流星雨效果
    setTimeout(() => {
      this.startMeteorShower();
    }, 300);

    // 阶段3: 欢迎文字显示
    setTimeout(() => {
      const welcomeText = document.querySelector('.welcome-text');
      welcomeText.style.opacity = '1';
    }, 800);

    // 阶段4: 文字排版级联滑入
    setTimeout(() => {
      this.showText();
    }, 1500);

    // 阶段4: 整体呼吸 & 定格
    setTimeout(() => {
      this.finalAnimation();
    }, 1800);

    // 动画完成后移除容器
    setTimeout(() => {
      this.container.style.animation = 'containerFadeOut 800ms ease-in forwards';
      this.isAnimationComplete = true;
      // 触发动画完成事件
      const event = new Event('animationComplete');
      document.dispatchEvent(event);
    }, 2500);
  }

  createStarfield() {
    // 创建星空背景
    for (let i = 0; i < 500; i++) {
      this.starParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.5,
        alpha: Math.random() * 0.8 + 0.2,
        flickerSpeed: Math.random() * 0.03 + 0.01
      });
    }
    this.animateStarfield();
  }

  animateStarfield() {
    if (this.isAnimationComplete) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 更新和绘制星星
    this.starParticles.forEach(star => {
      star.alpha += star.flickerSpeed;
      if (star.alpha > 1 || star.alpha < 0.2) {
        star.flickerSpeed *= -1;
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animateStarfield());
  }

  startMeteorShower() {
    // 随机生成流星雨
    const createMeteor = () => {
      if (this.isAnimationComplete) return;

      const x = Math.random() * this.canvas.width;
        const y = -50;
        const length = 60 + Math.random() * 100;
        const speed = 6 + Math.random() * 8;
        const size = 1.5 + Math.random() * 2;
        const color = `rgba(255, ${200 + Math.random() * 55}, ${100 + Math.random() * 155}, 1)`;

      this.meteorParticles.push({
        x, y,
        length,
        speed,
        size,
        color,
        trailLength: 15,
        trailOpacity: 0.8
      });

      setTimeout(createMeteor, 10 + Math.random() * 50);
    };

    createMeteor();
    this.animateMeteors();
  }

  animateMeteors() {
    if (this.isAnimationComplete) return;

    // 更新和绘制流星
    this.meteorParticles.forEach((meteor, index) => {
      // 移动流星
      meteor.x += meteor.speed * 0.5;
      meteor.y += meteor.speed;

      // 绘制流星轨迹
      for (let i = 0; i < meteor.trailLength; i++) {
        const trailX = meteor.x - (meteor.speed * 0.5) * i;
        const trailY = meteor.y - meteor.speed * i;
        const opacity = meteor.trailOpacity * (1 - i / meteor.trailLength);

        this.ctx.beginPath();
        this.ctx.moveTo(trailX, trailY);
        this.ctx.lineTo(trailX + meteor.size, trailY);
        this.ctx.strokeStyle = meteor.color.replace('1)', `${opacity})`);
        this.ctx.lineWidth = meteor.size;
        this.ctx.stroke();
      }

      // 移除超出画布的流星
      if (meteor.y > this.canvas.height + 50) {
        this.meteorParticles.splice(index, 1);
      }
    });

    requestAnimationFrame(() => this.animateMeteors());
  }



  showText() {
    // 标题动画
    this.title.style.animation = 'textSlideUp 200ms ease-out forwards';

    // 副标题动画
    setTimeout(() => {
      this.subtitle.style.animation = 'textTypewriter 500ms linear forwards';
    }, 60);

    // 按钮动画
    setTimeout(() => {
      this.btn.style.animation = 'btnPopIn 300ms ease-out forwards';
    }, 160);
  }

  finalAnimation() {
    // 整体呼吸效果
    const elements = [this.title, this.subtitle, this.btn];
    elements.forEach(el => {
      el.style.transition = 'transform 500ms ease-in-out, box-shadow 500ms ease-in-out';
    });

    // 上浮动效
    setTimeout(() => {
      elements.forEach(el => {
        el.style.transform = 'translateY(-6px)';
      });

      // 阴影变化
      this.btn.style.boxShadow = '0 12px 20px rgba(66, 133, 244, 0.3)';
    }, 100);

    // 恢复
    setTimeout(() => {
      elements.forEach(el => {
        el.style.transform = 'translateY(0)';
      });

      this.btn.style.boxShadow = '0 8px 15px rgba(66, 133, 244, 0.2)';
    }, 350);
  }
}

// 初始化动画
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否在浏览器环境中
  if (typeof window !== 'undefined') {
    const animation = new GoogleAnimation();
    animation.init();
  }
});
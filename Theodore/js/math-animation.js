class MathAnimation {
  constructor() {
    this.container = document.getElementById('math-animation-container');
    this.canvas = document.getElementById('math-canvas');
    this.title = document.querySelector('.math-title');
    this.subtitle = document.querySelector('.math-subtitle');
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.animationDuration = 5000; // 动画持续时间(ms)
    this.startTime = null;
  }

  init() {
    this.setupCanvas();
    this.createNodes();
    this.startAnimation();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.nodes = [];
      this.connections = [];
      this.createNodes();
    });
  }

  createNodes() {
    const nodeCount = 50;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.7;

    // 创建围绕中心点的节点
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = maxRadius * (0.5 + Math.random() * 0.5);
      
      this.nodes.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: 2 + Math.random() * 3,
        color: this.getRandomColor(),
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        pulse: Math.random() * Math.PI * 2 // 用于脉冲动画
      });
    }

    // 创建连接
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const distance = this.getDistance(this.nodes[i], this.nodes[j]);
        if (distance < 150) {
          this.connections.push({
            node1: i,
            node2: j,
            thickness: 0.5 + (150 - distance) / 300,
            color: this.getGradientColor(this.nodes[i].color, this.nodes[j].color)
          });
        }
      }
    }
  }

  getDistance(node1, node2) {
    return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
  }

  getRandomColor() {
    const colors = [
      'rgba(58, 134, 255, 1)',     // 蓝色
      'rgba(131, 56, 236, 1)',     // 紫色
      'rgba(255, 0, 110, 1)',      // 粉色
      'rgba(34, 211, 238, 1)',     // 青色
      'rgba(16, 185, 129, 1)',     // 绿色
      'rgba(245, 158, 11, 1)',     // 橙色
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getGradientColor(color1, color2) {
    // 简单的颜色混合
    const c1 = this.rgbaToObject(color1);
    const c2 = this.rgbaToObject(color2);
    return `rgba(${Math.round((c1.r + c2.r) / 2)}, ${Math.round((c1.g + c2.g) / 2)}, ${Math.round((c1.b + c2.b) / 2)}, 0.5)`;
  }

  rgbaToObject(rgbaString) {
    const rgbaMatch = rgbaString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)$/);
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
    };
  }

  startAnimation(timestamp) {
    if (!this.startTime) this.startTime = timestamp;
    const progress = Math.min((timestamp - this.startTime) / this.animationDuration, 1);
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 更新节点位置和脉冲效果
    this.nodes.forEach(node => {
      node.x += node.speedX;
      node.y += node.speedY;
      node.pulse += 0.03;
      
      // 边界检查
      if (node.x < 0 || node.x > this.canvas.width) node.speedX *= -1;
      if (node.y < 0 || node.y > this.canvas.height) node.speedY *= -1;
    });
    
    // 绘制连接
    this.connections.forEach(conn => {
      const node1 = this.nodes[conn.node1];
      const node2 = this.nodes[conn.node2];
      const distance = this.getDistance(node1, node2);
      const opacity = 0.5 * (1 - distance / 150);
      
      this.ctx.beginPath();
      this.ctx.moveTo(node1.x, node1.y);
      this.ctx.lineTo(node2.x, node2.y);
      this.ctx.strokeStyle = conn.color.replace('0.5)', `${opacity})`);
      this.ctx.lineWidth = conn.thickness;
      this.ctx.stroke();
    });
    
    // 绘制节点
    this.nodes.forEach(node => {
      const pulseFactor = Math.sin(node.pulse) * 0.5 + 0.5;
      const size = node.size + pulseFactor * 2;
      
      // 绘制节点外圈
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, size * 1.5, 0, Math.PI * 2);
      this.ctx.fillStyle = node.color.replace('1)', '0.2)');
      this.ctx.fill();
      
      // 绘制节点
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = node.color;
      this.ctx.fill();
    });
    
    // 显示文字
    if (progress > 0.2) {
      this.title.style.opacity = Math.min((progress - 0.2) * 5, 1);
      this.title.style.transform = `translateY(${20 - Math.min((progress - 0.2) * 100, 20)}px)`;
    }
    
    if (progress > 0.4) {
      this.subtitle.style.opacity = Math.min((progress - 0.4) * 5, 1);
      this.subtitle.style.transform = `translateY(${20 - Math.min((progress - 0.4) * 100, 20)}px)`;
    }
    
    // 动画结束
    if (progress === 1) {
      this.container.style.opacity = 0;
      setTimeout(() => {
        this.container.style.display = 'none';
      }, 1000);
      return;
    }
    
    requestAnimationFrame(timestamp => this.startAnimation(timestamp));
  }
}

// 初始化动画
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window !== 'undefined') {
    // 检查是否是首页
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    
    // 检查动画是否已经播放过
    const animationPlayed = sessionStorage.getItem('animationPlayed');
    
    if (isHomePage) {
      if (!animationPlayed) {
        // 首次访问首页，播放动画
        const container = document.getElementById('math-animation-container');
        if (container) {
          const animation = new MathAnimation();
          animation.init();
          // 标记动画已播放
          sessionStorage.setItem('animationPlayed', 'true');
        }
      } else {
        // 非首次访问首页，直接隐藏动画容器
        const container = document.getElementById('math-animation-container');
        if (container) {
          container.style.display = 'none';
        }
      }
    }
  }
});
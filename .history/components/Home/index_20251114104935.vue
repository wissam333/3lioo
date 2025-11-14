<template>
  <div class="homepage">
    <!-- Hero Section with Cyber Vibe -->
    <section class="hero">
      <div class="cyber-grid"></div>
      <div class="scan-line"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="badge">
              <span class="pulse-dot"></span>
              SECURITY ANALYST
            </div>
            <h1 class="hero-title">
              <span class="cyber-text">Protecting Digital</span>
              <br />
              <span class="glitch-text" data-text="Frontiers">Frontiers</span>
            </h1>
            <p class="hero-description">
              Cybersecurity specialist focused on threat intelligence,
              penetration testing, and building resilient systems. Writing about
              security research and defense strategies.
            </p>
            <div class="hero-actions">
              <NuxtLink to="/blog" class="btn btn-primary">
                <span class="btn-icon">⟫</span>
                Read Blog
              </NuxtLink>
            </div>
          </div>
          <div class="hero-visual">
            <div class="security-terminal">
              <div class="terminal-header">
                <div class="terminal-controls">
                  <span class="control red"></span>
                  <span class="control yellow"></span>
                  <span class="control green"></span>
                </div>
                <span class="terminal-title">security@portfolio:~</span>
              </div>
              <div class="terminal-body">
                <div class="terminal-line">
                  <span class="prompt">$</span> whoami
                </div>
                <div class="terminal-line output">
                  Security Researcher | Penetration Tester
                </div>
                <div class="terminal-line">
                  <span class="prompt">$</span> cat skills.txt
                </div>
                <div class="terminal-line output">
                  PenTesting • Threat Analysis • Network Security
                </div>
                <div class="terminal-line">
                  <span class="prompt">$</span> <span class="cursor">|</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Security Services -->
    <section class="services">
      <div class="container">
        <div class="section-header">
          <h2>Security Specializations</h2>
          <p>Comprehensive cybersecurity services and expertise</p>
        </div>
        <div class="services-grid">
          <div
            class="service-card"
            v-for="service in services"
            :key="service.title"
          >
            <div class="service-icon" :style="{ color: service.color }">
              {{ service.icon }}
            </div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <ul class="service-tags">
              <li v-for="tag in service.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Security Research -->
    <section class="security-research">
      <div class="container">
        <div class="section-header">
          <h2>Latest Security Research</h2>
          <p>
            In-depth analysis of vulnerabilities, threats, and defense
            strategies
          </p>
        </div>
        <div class="research-grid">
          <article
            v-for="post in securityPosts"
            :key="post._path"
            class="research-card"
            :class="`threat-level-${post.threatLevel || 'info'}`"
          >
            <div class="research-header">
              <div class="threat-badge" :class="post.threatLevel || 'info'">
                {{ getThreatLevelText(post.threatLevel) }}
              </div>
              <div class="research-date">{{ formatDate(post.date) }}</div>
            </div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>
            <div class="research-meta">
              <span class="category">{{ post.category || "Security" }}</span>
              <span class="read-time">{{ post.readTime || "8 min read" }}</span>
            </div>
            <NuxtLink :to="post._path" class="research-link">
              Analyze Threat ⟫
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- Security Tools -->
    <section class="security-tools">
      <div class="container">
        <div class="section-header">
          <h2>Security Tools & Technologies</h2>
          <p>Industry-standard tools for comprehensive security assessment</p>
        </div>
        <div class="tools-grid">
          <div
            class="tool-category"
            v-for="category in toolCategories"
            :key="category.name"
          >
            <h3>{{ category.name }}</h3>
            <div class="tools-list">
              <span v-for="tool in category.tools" :key="tool" class="tool-tag">
                {{ tool }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-security">
      <div class="container">
        <div class="cta-content">
          <div class="encrypted-message">
            <div class="encryption-header">
              <span class="encryption-icon">🔒</span>
              SECURE CHANNEL ESTABLISHED
            </div>
            <h2>Ready to Secure Your Systems?</h2>
            <p>
              Let's discuss your security needs and build a robust defense
              strategy
            </p>
            <div class="cta-actions">
              <a href="mailto:security@example.com" class="btn btn-primary">
                <span class="btn-icon">✉</span>
                Encrypted Contact
              </a>
              <NuxtLink to="/services" class="btn btn-secondary">
                Security Audit
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Fetch security-focused posts
const { data: securityPosts } = await useAsyncData("security-posts", () => {
  return queryContent("/blog").sort({ date: -1 }).limit(3).find();
});

// Security services
const services = [
  {
    icon: "🔍",
    title: "Penetration Testing",
    description:
      "Comprehensive security assessments to identify vulnerabilities before attackers do.",
    tags: ["Web App Testing", "Network Pentesting", "API Security"],
    color: "#ff6b6b",
  },
  {
    icon: "🛡️",
    title: "Threat Intelligence",
    description:
      "Proactive monitoring and analysis of emerging threats and attack vectors.",
    tags: ["OSINT", "Malware Analysis", "Threat Hunting"],
    color: "#4ecdc4",
  },
  {
    icon: "🔐",
    title: "Incident Response",
    description:
      "Rapid response and recovery from security incidents and breaches.",
    tags: ["DFIR", "Forensics", "Containment"],
    color: "#45b7d1",
  },
  {
    icon: "⚡",
    title: "Security Architecture",
    description:
      "Designing and implementing secure systems and infrastructure.",
    tags: ["Cloud Security", "Zero Trust", "Hardening"],
    color: "#96ceb4",
  },
];

// Security tools
const toolCategories = [
  {
    name: "Penetration Testing",
    tools: ["Metasploit", "Burp Suite", "Nmap", "Wireshark", "John the Ripper"],
  },
  {
    name: "Vulnerability Assessment",
    tools: ["Nessus", "OpenVAS", "Nexpose", "Qualys"],
  },
  {
    name: "Forensics & IR",
    tools: ["Autopsy", "Volatility", "SIFT", "GRR"],
  },
  {
    name: "OSINT",
    tools: ["Maltego", "theHarvester", "Shodan", "Recon-ng"],
  },
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getThreatLevelText = (level) => {
  const levels = {
    low: "LOW RISK",
    medium: "MEDIUM RISK",
    high: "HIGH RISK",
    critical: "CRITICAL",
    info: "RESEARCH",
  };
  return levels[level] || "RESEARCH";
};

// SEO Meta for cybersecurity
useSeoMeta({
  title: "Cybersecurity Specialist - Threat Research & Defense Strategies",
  description:
    "Security researcher and penetration tester focused on vulnerability analysis, threat intelligence, and building secure systems. Latest security research and insights.",
  ogImage: "/cyber-og.jpg",
});
</script>

<style scoped>
.homepage {
  background: #0a0a0a;
  color: #e0e0e0;
  min-height: 100vh;
}

/* Hero Section */
.hero {
  position: relative;
  padding: 120px 0 80px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

.cyber-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 100, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 100, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: scan 3s linear infinite;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 2;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 30px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #ff4444;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
}

.cyber-text {
  background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glitch-text {
  position: relative;
  color: #fff;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  animation: glitch-1 0.5s infinite;
  color: #ff0080;
  z-index: -1;
}

.glitch-text::after {
  animation: glitch-2 0.5s infinite;
  color: #00ffff;
  z-index: -2;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #b0b0b0;
  margin-bottom: 40px;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 60px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #0080ff 0%, #00ffff 100%);
  color: #000;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 128, 255, 0.3);
}

.btn-secondary {
  background: transparent;
  color: #00ffff;
  border: 1px solid #00ffff;
}

.btn-secondary:hover {
  background: rgba(0, 255, 255, 0.1);
}

/* Security Terminal */
.security-terminal {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.terminal-header {
  background: #2d2d2d;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #333;
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control.red {
  background: #ff5f56;
}
.control.yellow {
  background: #ffbd2e;
}
.control.green {
  background: #27ca3f;
}

.terminal-title {
  color: #888;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
}

.terminal-body {
  padding: 24px;
  font-family: "Courier New", monospace;
  line-height: 1.6;
}

.terminal-line {
  margin-bottom: 8px;
  color: #00ff00;
}

.prompt {
  color: #00ffff;
  margin-right: 8px;
}

.output {
  color: #e0e0e0;
}

.cursor {
  animation: blink 1s infinite;
}

/* Services Section */
.services {
  padding: 100px 0;
  background: #111;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #00ffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-header p {
  color: #888;
  font-size: 1.1rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.service-card {
  background: #1a1a1a;
  padding: 40px 30px;
  border-radius: 8px;
  border: 1px solid #333;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  transition: left 0.5s ease;
}

.service-card:hover::before {
  left: 100%;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: #00ffff;
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.1);
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.service-card h3 {
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: #fff;
}

.service-card p {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 20px;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
}

.service-tags li {
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

/* Security Research */
.security-research {
  padding: 100px 0;
  background: #0a0a0a;
}

.research-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.research-card {
  background: #1a1a1a;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #333;
  transition: all 0.3s ease;
  position: relative;
}

.research-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.research-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.threat-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.threat-badge.info {
  background: rgba(0, 100, 255, 0.2);
  color: #0080ff;
  border: 1px solid #0080ff;
}

.threat-badge.low {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid #00ff00;
}

.threat-badge.medium {
  background: rgba(255, 255, 0, 0.2);
  color: #ffff00;
  border: 1px solid #ffff00;
}

.threat-badge.high {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
  border: 1px solid #ffa500;
}

.threat-badge.critical {
  background: rgba(255, 0, 0, 0.2);
  color: #ff0000;
  border: 1px solid #ff0000;
}

.research-date {
  color: #666;
  font-size: 0.9rem;
}

.research-card h3 {
  font-size: 1.3rem;
  margin-bottom: 16px;
  color: #fff;
}

.research-card p {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 20px;
}

.research-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
}

.research-link {
  color: #00ffff;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.research-link:hover {
  color: #0080ff;
}

/* Security Tools */
.security-tools {
  padding: 100px 0;
  background: #111;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.tool-category h3 {
  color: #00ffff;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.tools-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tool-tag {
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

/* CTA Section */
.cta-security {
  padding: 100px 0;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  text-align: center;
}

.encrypted-message {
  max-width: 600px;
  margin: 0 auto;
}

.encryption-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 30px;
}

.cta-security h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #fff;
}

.cta-security p {
  color: #b0b0b0;
  font-size: 1.1rem;
  margin-bottom: 40px;
}

/* Animations */
@keyframes gridMove {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(50px);
  }
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

@keyframes glitch-1 {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

@keyframes glitch-2 {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(2px, 2px);
  }
  40% {
    transform: translate(2px, -2px);
  }
  60% {
    transform: translate(-2px, 2px);
  }
  80% {
    transform: translate(-2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .services-grid,
  .research-grid,
  .tools-grid {
    grid-template-columns: 1fr;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>

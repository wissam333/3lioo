<template>
  <div>
    <div
      v-if="!data.show"
      class="cyber-loader"
      :class="{ 'loader-visible': !data.show }"
    >
      <!-- Animated Cyber Grid Background -->
      <div class="cyber-grid-bg"></div>
      <div class="scan-line"></div>

      <!-- Main Loader Content -->
      <div class="loader-content">
        <!-- Terminal-style loader -->
        <!-- <div class="security-terminal-loader">
          <div class="terminal-header">
            <div class="terminal-controls">
              <span class="control red"></span>
              <span class="control yellow"></span>
              <span class="control green"></span>
            </div>
            <span class="terminal-title">system@boot:~</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-line">
              <span class="prompt">$</span> initializing_security_protocols
            </div>
            <div class="terminal-line output">
              <span class="success-text">✓</span> Loading threat intelligence
              database
            </div>
            <div class="terminal-line">
              <span class="prompt">$</span> decrypting_content
            </div>
            <div class="terminal-line output">
              <span class="success-text">✓</span> Establishing secure connection
            </div>
            <div class="terminal-line">
              <span class="prompt">$</span> verify_integrity --progress
            </div>
            <div class="terminal-line">
              <div class="progress-container">
                <div
                  class="progress-bar"
                  :style="{ width: data.percent + '%' }"
                ></div>
                <div class="progress-text">{{ data.percent }}%</div>
              </div>
            </div>
            <div class="terminal-line">
              <span class="prompt">$</span>
              <span class="typing-text">{{ currentCommand }}</span>
              <span class="cursor">|</span>
            </div>
          </div>
        </div> -->

        <!-- Cyber Spinner -->
        <div class="cyber-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-core">
            <div class="spinner-dot"></div>
          </div>
        </div>

        <div class="terminal-line">
          <div class="progress-container">
            <div
              class="progress-bar"
              :style="{ width: data.percent + '%' }"
            ></div>
            <div class="progress-text">{{ data.percent }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  throttle: {
    type: Number,
    default: 200,
  },
  duration: {
    type: Number,
    default: 2000,
  },
  height: {
    type: Number,
    default: 3,
  },
});

// Reactive data
const data = reactive({
  percent: 0,
  show: false,
  canSucceed: true,
});

// Loader state
const currentStatus = ref(0);
const currentCommand = ref("boot_sequence --start");
const commands = [
  "boot_sequence --start",
  "load_threat_db --encrypted",
  "decrypt_content --aes256",
  "verify_integrity --full",
  "establish_secure_channel",
  "render_secure_ui",
];

// Local variables
let _timer = null;
let _throttle = null;
let _cut;
let _statusInterval = null;
let _commandInterval = null;

// Functions
const clear = () => {
  _timer && clearInterval(_timer);
  _throttle && clearTimeout(_throttle);
  _statusInterval && clearInterval(_statusInterval);
  _commandInterval && clearInterval(_commandInterval);
  _timer = null;
  _statusInterval = null;
  _commandInterval = null;
};

const start = () => {
  clear();
  data.percent = 0;
  data.canSucceed = true;
  currentStatus.value = 0;
  currentCommand.value = commands[0];

  // Start status rotation
  _statusInterval = setInterval(() => {
    currentStatus.value = (currentStatus.value + 1) % 4;
  }, 800);

  // Start command rotation
  let commandIndex = 0;
  _commandInterval = setInterval(() => {
    commandIndex = (commandIndex + 1) % commands.length;
    currentCommand.value = commands[commandIndex];
  }, 1200);

  if (props.throttle) {
    _throttle = setTimeout(startTimer, props.throttle);
  } else {
    startTimer();
  }
};

const set = (num) => {
  data.show = true;
  data.canSucceed = true;
  data.percent = Math.min(100, Math.max(0, Math.floor(num)));
};

const increase = (num) => {
  data.percent = Math.min(100, Math.floor(data.percent + num));
};

const decrease = (num) => {
  data.percent = Math.max(0, Math.floor(data.percent - num));
};

const pause = () => clearInterval(_timer);
const resume = () => startTimer();

const finish = () => {
  data.percent = 100;
  // Brief pause at 100% to show completion
  setTimeout(hide, 300);
};

const hide = () => {
  clear();
  setTimeout(() => {
    data.show = false;
    setTimeout(() => {
      data.percent = 0;
      currentStatus.value = 0;
      currentCommand.value = commands[0];
    }, 400);
  }, 500);
};

const startTimer = () => {
  data.show = true;
  _cut = 10000 / Math.floor(props.duration);
  _timer = setInterval(() => {
    increase(_cut);
  }, 100);
};

// Hooks
const nuxtApp = useNuxtApp();

nuxtApp.hook("page:start", start);
nuxtApp.hook("page:finish", finish);

onBeforeUnmount(() => clear);
</script>

<style scoped>
.cyber-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}

.cyber-loader.loader-visible {
  opacity: 1;
  visibility: visible;
}

.cyber-grid-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(0, 100, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 100, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 15s linear infinite;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: scan 2s linear infinite;
}

.loader-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  width: 90%;
}

/* Security Terminal Loader */
.security-terminal-loader {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
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
  text-align: left;
}

.terminal-line {
  margin-bottom: 12px;
  color: #00ff00;
  font-size: 0.9rem;
}

.prompt {
  color: #00ffff;
  margin-right: 8px;
}

.output {
  color: #e0e0e0;
  margin-left: 20px;
}

.success-text {
  color: #00ff00;
  margin-right: 8px;
}

.typing-text {
  color: #00ff00;
}

.cursor {
  animation: blink 1s infinite;
  color: #00ffff;
}

/* Progress Bar */
.progress-container {
  position: relative;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  height: 20px;
  margin: 10px 0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #0080ff, #00ffff);
  transition: width 0.3s ease;
  position: relative;
}

.progress-bar::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

/* Cyber Spinner */
.cyber-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 20px auto;
}

.spinner-ring {
  position: absolute;
  border: 2px solid transparent;
  border-top: 2px solid #00ffff;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.spinner-ring:nth-child(1) {
  width: 80px;
  height: 80px;
  animation-duration: 2s;
}

.spinner-ring:nth-child(2) {
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  animation-duration: 1.5s;
  animation-direction: reverse;
  border-top-color: #0080ff;
}

.spinner-ring:nth-child(3) {
  width: 40px;
  height: 40px;
  top: 20px;
  left: 20px;
  animation-duration: 1s;
  border-top-color: #ff0080;
}

.spinner-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.spinner-dot {
  width: 4px;
  height: 4px;
  background: #00ffff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1.5s ease-in-out infinite;
}

/* Status Messages */
.status-messages {
  margin: 20px 0;
}

.status-item {
  color: #888;
  margin: 8px 0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.status-item.active {
  color: #00ffff;
  opacity: 1;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.status-icon {
  margin-right: 8px;
  color: #00ff00;
}

/* Encryption Badge */
.encryption-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 4px;
  padding: 12px 20px;
  margin-top: 20px;
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-text {
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.badge-text div:first-child {
  color: #00ff00;
}

.badge-subtext {
  color: #888;
  font-size: 0.7rem;
  font-weight: normal;
  margin-top: 2px;
}

/* Animations */
@keyframes gridMove {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(40px);
  }
}

@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100vh);
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .security-terminal-loader {
    margin-bottom: 20px;
  }

  .terminal-body {
    padding: 16px;
  }

  .terminal-line {
    font-size: 0.8rem;
  }

  .cyber-spinner {
    width: 60px;
    height: 60px;
  }

  .spinner-ring:nth-child(1) {
    width: 60px;
    height: 60px;
  }

  .spinner-ring:nth-child(2) {
    width: 45px;
    height: 45px;
    top: 7.5px;
    left: 7.5px;
  }

  .spinner-ring:nth-child(3) {
    width: 30px;
    height: 30px;
    top: 15px;
    left: 15px;
  }
}
</style>

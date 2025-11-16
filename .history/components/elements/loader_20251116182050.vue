<template>
  <div>
    <div
      v-if="data.show"
      class="cyber-loader"
      :class="{ 'loader-visible': data.show }"
    >
      <!-- Main Loader Content -->
      <div class="loader-content">
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
  background: linear-gradient(135deg, #f5f5f5 0%, #cacaca 50%, #939393 100%);
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

.loader-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  width: 90%;
}

/* Progress Bar */
.progress-container {
  position: relative;
  background: #aeaeae;
  border: 1px solid #858585;
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
</style>

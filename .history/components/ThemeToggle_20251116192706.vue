<template>
  <button
    @click="toggleTheme"
    class="theme-toggle"
    :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
    :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
  >
    <span class="theme-toggle-icon">
      <span class="sun" :class="{ active: theme === 'light' }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="m12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <span class="moon" :class="{ active: theme === 'dark' }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </span>
    <span class="theme-toggle-text">
      {{ theme === 'light' ? 'Dark' : 'Light' }}
    </span>
  </button>
</template>

<script setup>
const { theme, toggleTheme } = useTheme()
</script>

<style scoped lang="scss">
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 2rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: var(--bg-tertiary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px var(--shadow);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--accent-primary);
  }
}

.theme-toggle-icon {
  position: relative;
  width: 16px;
  height: 16px;

  .sun,
  .moon {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.5;
    transition: all 0.3s ease;
    
    &.active {
      opacity: 1;
    }
  }

  .moon {
    opacity: 0;
    
    &.active {
      opacity: 1;
    }
  }
}

.theme-toggle-text {
  @media (max-width: 768px) {
    display: none;
  }
}
</style>
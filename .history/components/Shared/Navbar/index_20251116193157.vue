<template lang="">
  <!-- Add theme toggle in header/navigation -->
  <header class="site-header">
    <div class="container">
      <div class="header-content">
        <NuxtLink to="/" class="logo">Security Blog</NuxtLink>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
<script></script>
<style lang="">
/* Site Header */
.site-header {
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  z-index: 1000;
  transition: all 0.3s ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;

  &:hover {
    color: var(--accent-secondary);
  }
}
</style>

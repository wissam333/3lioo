<template>
    <div>
        <div class="top" :class="{
            en: $i18n.locale === 'en',
        }">
            <header class="d-flex justify-content-between" :class="locale === 'ar' ? 'ar-flex' : ''">
                <SharedNavbarMobileNav v-if="mobile"></SharedNavbarMobileNav>
                <SharedNavbarPcNav v-if="!mobile"></SharedNavbarPcNav>
            </header>
        </div>
    </div>
</template>

<script setup>
const { locale } = useI18n();
let mobile = ref(false);
let lastScrollY = ref(0);
let isNavbarVisible = ref(true);

// Function to check screen size for mobile view
const checkWindowSize = () => {
    mobile.value = window.matchMedia("(max-width: 1250px)").matches;
};

// Function to handle scroll effect
const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (
        currentScrollY < 150 ||
        window.matchMedia("(max-width: 1250px)").matches
    ) {
        isNavbarVisible.value = true; // Always show in first 150px
    } else if (currentScrollY > lastScrollY.value) {
        isNavbarVisible.value = false; // Hide on scroll down
    } else {
        isNavbarVisible.value = true; // Show on scroll up
    }

    lastScrollY.value = currentScrollY;
};
if (process.client) {
    onBeforeMount(() => {
        checkWindowSize();
    });
    onMounted(() => {
        window.addEventListener("resize", checkWindowSize);
        window.addEventListener("scroll", handleScroll);
    });
    onUnmounted(() => {
        window.removeEventListener("resize", checkWindowSize);
        window.removeEventListener("scroll", handleScroll);
    });
}
</script>

<style lang="scss" scoped>
.router-link-active.router-link-exact-active {
    transition: all 0.3s ease-in-out;
}

.top {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1002;
    height: 135px;
    transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;

    @media (max-width: 991px) {
        height: 80px;
        border-bottom: 2px solid transparent;
    }

    &.hidden {
        transform: translateY(-100%);
        opacity: 0;
    }

    &.visible {
        transform: translateY(0);
        opacity: 1;
    }

    header {
        width: 100vw;
        height: 135px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        background-color: #00000038;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        background-size: cover;
        background-repeat: no-repeat;

        @media (max-width: 1250px) {
            background-color: #00000038;
            flex-direction: row;
            padding: 0px 20px;
            align-items: center;
        }

        @media (max-width: 991px) {
            height: 80px;
            padding: 10px;
        }
    }
}

.top {
    &.en {
        .navCollapsed {
            transform: translateX(-100%);

            &.open {
                transform: translateX(-20%);
            }

            .container {
                padding-right: 0;
                padding-left: 20%;
            }
        }
    }
}

.logo {
    display: flex;
    align-items: center;
    width: 160px;
    padding: 10px;
    background: transparent;
    position: absolute;
    top: 0;
    right: 40px;
    cursor: pointer;

    &.ar {
        left: 40px;
        right: auto;
    }

    @media (max-width: 1250px) {
        width: 200px;
    }

    @media (max-width: 991px) {
        width: 120px;
        padding: 10px 0px;
    }

    img {
        width: 100%;
        height: 100%;
    }
}
</style>
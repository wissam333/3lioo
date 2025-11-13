<template>
    <div class="d-flex flex-column align-items-start w-100">
        <!-- Pc -->
        <div class="d-flex justify-content-start align-items-center w-100 px-10">
            <div style="width: 230px">
                <nuxt-link to="/" class="logo" :class="$i18n.locale === 'ar' ? 'ar' : ''">
                    <NuxtImg src="/Asset 1.png" alt="Logo Image" loading="lazy" />
                </nuxt-link>
            </div>
            <div class="d-flex justify-content-start align-items-end overflow-hidden px-6 links pb-2">
                <div class="w-100">
                    <div class="d-flex justify-content-between align-items-center">
                        <ul class="d-flex flex-wrap mt-4">
                            <li v-for="menu in useMenus().value.slice(0, 6)" :key="menu?.id"
                                class="menu-item" v-show="menu.isActive">
                                <div class="paste-button">
                                    <div v-if="menu.type == 'Drop Down Menu'">
                                        <div class="button d-flex align-items-center"
                                            :class="locale === 'ar' ? 'ar-flex' : ''">
                                            {{ locale === "ar" ? menu.name : menu.englishName }}
                                            
                                                <Icon size="20px" :class="locale === 'ar' ? 'ms-2' : 'ms-2'"  name="material-symbols:arrow-drop-down-rounded" />
                                        </div>
                                        <div class="dropdown-content" :class="locale === 'ar' ? 'ar' : ''">
                                            <nuxt-link v-for="child in menu.children" :key="child.id"
                                                :to="`${child.pageUrl}`" class="dropdown-item">
                                                {{ locale === "ar" ? child.name : child.englishName }}
                                            </nuxt-link>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <nuxt-link class="button" :to="menu.pageUrl">
                                            {{ locale === "ar" ? menu.name : menu.englishName }}
                                        </nuxt-link>
                                    </div>
                                </div>
                            </li>
                            <li class="lang-toggle" :class="$i18n.locale === 'en' ? 'en' : ''">
                                <ElementsLanguageToggle :color="`#fff`"></ElementsLanguageToggle>
                            </li>
                        </ul>
                        <div v-if="Socials" class="d-flex justify-content-start align-items-start flex-column">
                            <!-- social -->
                            <div class="social-icons" :class="locale === 'ar' ? 'ar' : ''">
                                <a :href="Socials?.items[0]?.pageUrl" v-if="Socials?.items[0]?.isActive" target="_blank"
                                    class="Social-item mx-2" style="">
                                    <Icon name="bi:instagram" size="25px" color="#ffffff" />
                                </a>

                                <a :href="Socials?.items[1]?.pageUrl" v-if="Socials?.items[1]?.isActive" target="_blank"
                                    class="Social-item mx-2" style="">
                                    <!-- <NuxtImg src="/Icons1/Asset 5.png" loading="lazy" alt="Social Icon" /> -->
                                    <Icon name="ri:facebook-fill" size="25px" color="#ffffff" />
                                    
                                </a>
                                
                                <a :href="Socials?.items[2]?.pageUrl" v-if="Socials?.items[2]?.isActive" target="_blank"
                                class="Social-item mx-2" style="">
                                <Icon name="ri:twitter-x-fill" size="25px" color="#ffffff" />
                            </a>
                            
                            <a :href="Socials?.items[3]?.pageUrl" v-if="Socials?.items[3]?.isActive" target="_blank"
                            class="Social-item mx-2" style="">
                            <Icon name="qlementine-icons:youtube-16" size="25px" color="#ffffff" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <nav class="d-flex justify-content-between" id="navbar">
                        <ul class="d-flex flex-column">
                            <div class="d-flex flex-wrap">
                                <li v-for="menu in useMenus().value.slice(6)" :key="menu?.id"
                                    class="menu-item" v-show="menu.isActive">
                                    <div class="paste-button">
                                        <div v-if="menu.type == 'Drop Down Menu'">
                                            <div class="button d-flex align-items-center"
                                                :class="locale === 'ar' ? 'ar-flex' : ''">
                                                {{ locale === "ar" ? menu.name : menu.englishName }}
                                                
                                                    <Icon :class="locale === 'ar' ? 'ms-2' : 'ms-2'" size="20px"  name="material-symbols:arrow-drop-down-rounded" />
                                            </div>
                                            <div class="dropdown-content" :class="locale === 'ar' ? 'ar' : ''">
                                                <nuxt-link v-for="child in menu.children" :key="child.id"
                                                    :to="`${child.pageUrl}`" class="dropdown-item">
                                                    {{ locale === "ar" ? child.name : child.englishName }}
                                                </nuxt-link>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <nuxt-link class="button mb-2" :to="menu.pageUrl">
                                                {{ locale === "ar" ? menu.name : menu.englishName }}
                                            </nuxt-link>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { watchEffect } from "vue";

const { locale } = useI18n();
const { $awn } = useNuxtApp();

const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
};

// Toggle dropdown visibility
const toggleDropdown = () => {
    useIsDropdownOpen().value = !useIsDropdownOpen().value;
};


const {
  public: { api, apiBase },
} = useRuntimeConfig();
const Socials = ref(null)
const SocialMenusURL = `${api.GetMenuDetail}?categoryId=2`;
const {data} = useFetch(SocialMenusURL, {
    baseURL: apiBase,
})
watchEffect(() => {
    if(process.client) {
        if(data.value) {
            Socials.value = data.value
            useMenusSocial().value = data.value
        }
    }
})


// search
</script>
<style lang="scss" scoped>

@use "@/assets/scss/theme/variables.scss" as *;

.router-link-active.router-link-exact-active {
    color: $main !important;

    &::after {
        content: "";
        display: block;
        /* Makes the pseudo-element visible */
        height: 2px;
        width: 14px;
        background-color: #802d4b;
        /* Changed from 'color' to 'background-color' */
        position: absolute;
        bottom: 0;
        /* Positions the line at the bottom */
        left: 0;
    }
}

nav {
    width: 100%;
    display: flex;
    align-items: center;
    color: $main;
    // padding: 10px;
    padding-top: 0px;
    transition: all 0.5s linear;

    ul {
        width: 100vw;
        margin: 0;
        margin-top: 5px;
        align-items: flex-start;
        color: #fff;
        display: flex;
        padding: 0px 20px;

        li {
            font-size: 15px;
            margin: 0 4px;
            padding: 0px 10px;

            // font-weight: bold;
            a {
                padding: 2px;
            }

            @media (max-width: 1650px) {
                padding: 0px 5px;
                font-size: 15px;
                margin: 0 3px;
            }

            @media (max-width: 1450px) {
                padding: 0px 3px;
                font-size: 14px;
                margin: 0 3px;
            }

            .paste-button {
                position: relative;
                display: block;
            }

            .button {
                color: #fff;
                cursor: pointer;
            }

            .dropdown-content {
                overflow: hidden;
                height: 0px;
                font-size: 14px;
                position: absolute;
                z-index: 1;
                min-width: 250px;
                box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
                transition: all 0.5s ease-in;
            }

            .dropdown-content a {
                color: #fff;
                padding: 8px 10px;
                text-decoration: none;
                opacity: 0;
                display: block;
                transition: 0.1s;

                &:not(:last-child) {
                    border-bottom: 1px solid $second;
                }
            }

            .dropdown-content a:hover {
                background: linear-gradient(to left, $main, $second, $main);
                color: #fff !important;
            }

            .dropdown-content a:focus {
                background-color: #212121;
                color: #fff;
            }

            .paste-button:hover .dropdown-content {
                height: auto;
                background: rgba(158, 153, 153, 0.8);
                backdrop-filter: blur(5px);
                padding: 5px 0px;
                margin-top: 15px;

                a {
                    opacity: 1;
                }
            }
        }
    }
}

.logo {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    background: transparent;

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

.nav-links {
    position: absolute;
    top: 40px;
    right: 35px;
    left: auto;
    display: flex;

    &.ar-flex {
        top: 40px;
        left: 35px;
        right: auto;
        // .socials {
        //   margin: 0px;
        // }
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        &.ar {
            justify-content: flex-start;
        }
    }

    // .socials {
    //   display: flex;
    //   justify-content: flex-start;
    //   align-items: center;
    //   margin: 0px 10px 5px 10px;
    //   &.ar {
    //     justify-content: flex-end;
    //   }
    //   .socials-img {
    //     width: 30px;
    //     margin: 5px;
    //     img {
    //       width: 100%;
    //     }
    //   }
    // }
}

.buttons {
    display: flex;
    align-items: center;
    text-wrap: nowrap;
    padding: 10px 20px 5px 22px;

    svg {
        color: #fff;
        width: 20px;
        height: 20px;
        font-size: 20px;
    }
}

.social-icons {
    display: flex;
    align-items: center;
    padding: 0px 20px 10px 22px;

    .Social-item {

        svg,
        img {
            width: 20px;
            height: 20px;
            object-fit: contain;
            font-size: 20px;
            color: #fff;
            transition: all 0.5s ease-in;
        }
    }
}

// .lang-toggle {
//   &.en {
//     margin-bottom: 10px;
//   }
// }
.cat-links {
    padding-top: 30px !important;

    li {
        font-size: 14px !important;

        @media (max-width: 1650px) {
            padding: 5px;
            font-size: 13px !important;
            margin: 0 3px;
        }

        @media (max-width: 1450px) {
            padding: 0px;
            font-size: 12px !important;
            margin: 0;
        }
    }
}

.dropdown-content-products {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 15px;
    overflow: hidden;
    height: 0px;
    font-size: 16px;
    position: absolute;
    z-index: 1;
    min-width: 200px;
    // border: 2px solid transparent;
    border-radius: 15px 15px 15px 15px;
    transition: all 0.5s ease-in;

    a {
        color: $main;
        padding: 5px !important;
        text-decoration: none;
        opacity: 0;
        display: block;
        transition: 0.1s;
    }

    a:hover {
        background-color: $main;
        color: #fff !important;
    }

    a:focus {
        background-color: #212121;
        color: $main;
    }

    #top:hover {
        border-radius: 8px;
    }

    button {
        border-radius: 8px;
    }
}

.paste-button:hover .dropdown-content-products {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    height: auto;
    border: 2px solid $main;
    background-color: #212121;
    padding: 15px;
    margin-top: 20px;

    a {
        opacity: 1;
    }
}

.cat-thumb {
    width: 60px;
    height: 50px;
    object-fit: cover;
    margin: 5px;
}

.dropdown-item:focus,
.dropdown-item:hover {
    color: #fff !important;
    background-color: $main;

    a {
        color: #fff !important;
    }
}

.dropdown-menu.show {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    height: auto;
    border: 2px solid $second;
    background-color: #000000ea;
    backdrop-filter: blur(5px);
    min-width: 200px;
    top: 30px;
    inset-inline-start: 85px;
    border-radius: 0;
    padding: 4px 0px;

    .dropdown-item {
        font-size: 14px;
        padding: 5px 10px;

        &:first-child {
            border-bottom: 1px solid $second;
        }

        &:hover {
            background: linear-gradient(to left, $main, $second, $main);
            color: #fff !important;
        }
    }
}

.ar {
    .dropdown-menu.show {
        text-align: right;
    }
}

.cartbox {
    position: absolute;
    top: -6px;
    right: 7px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(45deg, $main, $second, $main);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 16px;

    @media (max-width: 1250px) {
        width: 20px;
        height: 20px;
        top: 5px;
        font-size: 14px;
        right: 17px;
    }
}

.search-content {
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 35px;
    }

    .input {
        max-width: 190px;
        height: 100%;
        outline: none;
        font-size: 14px;
        font-weight: 500;
        background-color: #53535f;
        caret-color: #f7f7f8;
        color: #fff;
        padding: 7px 10px;
        border: 2px solid transparent;
        border-top-left-radius: 7px;
        border-bottom-left-radius: 7px;
        margin-right: 1px;
        transition: all 0.2s ease;

        &.ar {
            text-align: right;
        }
    }

    .input::placeholder {
        color: #fff;
    }

    .input:hover {
        border: 2px solid rgba(255, 255, 255, 0.16);
    }

    .input:focus {
        border: 2px solid $main;
        background-color: #0e0e10;
    }

    .search__btn {
        border: none;
        cursor: pointer;
        background-color: $main;
        border-top-right-radius: 7px;
        border-bottom-right-radius: 7px;
        height: 100%;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .search__btn:hover {
        background-color: #1e87b9;
    }
}

.paste-button {
    @media (min-width: 1250px) {
        padding: 8px 0px;
    }
}

.links {
    ul {
        margin-inline-start: 0px;
        padding: 0;
    }

    a {
        color: #fff;
        transition: all 0.5s ease-in;
        cursor: pointer;

        &:hover {
            color: $main;
        }
    }

    li {
        font-size: 18px;
        margin: 0 4px;
        padding: 0px 10px;

        // font-weight: bold;
        a {
            padding: 2px;
        }

        @media (max-width: 1650px) {
            padding: 0px 5px;
            font-size: 15px;
            margin: 0 3px;
        }

        @media (max-width: 1450px) {
            padding: 0px 3px;
            font-size: 14px;
            margin: 0 3px;
        }

        .paste-button {
            position: relative;
            display: block;
            padding: 0;
        }

        .button {
            color: #fff;
            cursor: pointer;
        }

        .dropdown-content {
            overflow: hidden;
            height: 0px;
            font-size: 18px;
            position: absolute;
            z-index: 1;
            min-width: 250px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            transition: all 0.5s ease-in;
        }

        .dropdown-content a {
            color: #fff;
            padding: 8px 10px;
            text-decoration: none;
            opacity: 0;
            display: block;
            transition: 0.1s;

            &:not(:last-child) {
                border-bottom: 1px solid $second;
            }
        }

        .dropdown-content a:hover {
            background: linear-gradient(to left, $main, $second, $main);
            color: #fff !important;
        }

        .dropdown-content a:focus {
            background-color: #212121;
            color: #fff;
        }

        .paste-button:hover .dropdown-content {
            height: auto;
            border: 2px solid $second;
            background: rgb(0 0 0 / 80%);
            backdrop-filter: blur(5px);
            padding: 5px 0px;
            margin-top: 15px;

            a {
                opacity: 1;
            }
        }
    }
}

.paste-button {
    a {
        color: #fff;
        cursor: pointer;
        position: relative; // Needed for absolute positioning of pseudo-element
        text-decoration: none;
        transition: color 0.5s ease-in;

        &::after {
            content: "";
            display: block;
            position: absolute;
            height: 2px;
            background-color: $main;
            width: 0;
            bottom: 0px; // More reasonable distance from text
            right: 0;
            transition: all 0.5s ease-in;
        }

        &:hover {
            color: $main;

            &::after {
                height: 2px;
                width: 100%;
            }
        }
    }
}
</style>
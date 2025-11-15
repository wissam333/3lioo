import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import __nuxt_component_1 from './index2.mjs';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ref, computed, unref, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import MarkdownIt from 'markdown-it';
import { _ as _export_sfc, c as useRoute, a as useSeoMeta, u as useHead } from './server.mjs';
import '@iconify/utils/lib/css/icon';
import '@iconify/vue';
import './asyncData.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@primevue/core/base/style';
import '@primeuix/styles/tooltip';
import '@primeuix/styles/ripple';
import '@primeuix/styled';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'ipx';
import 'node:path';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'devalue';
import '@primeuix/utils';
import '@primeuix/styles/base';
import '@primeuix/utils/object';
import '@primeuix/utils/dom';
import '@primeuix/utils/eventbus';

const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.slug;
    const post = ref(null);
    const mostWatched = ref([]);
    const relatedPosts = ref([]);
    const headings = ref([]);
    const activeHeading = ref("");
    ref(null);
    const authorData = ref(null);
    const md = new MarkdownIt({ html: true, linkify: true });
    const renderedMarkdown = computed(() => {
      if (!post.value) return "";
      const raw = post.value.body ?? post.value.content ?? "";
      return md.render(raw);
    });
    const getThreatLevelIcon = (level) => {
      const icons = {
        info: "fas fa-info-circle",
        low: "fas fa-shield-alt",
        medium: "fas fa-exclamation-triangle",
        high: "fas fa-radiation-alt",
        critical: "fas fa-skull-crossbones"
      };
      return icons[level] || icons.info;
    };
    const getThreatLevelLabel = (level) => {
      const labels = {
        info: "Information",
        low: "Low Threat",
        medium: "Medium Threat",
        high: "High Threat",
        critical: "Critical Threat"
      };
      return labels[level] || labels.info;
    };
    const getCategoryLabel = (category) => {
      const categories = {
        security: "Security",
        "threat-intel": "Threat Intelligence",
        vulnerability: "Vulnerability Analysis",
        "incident-response": "Incident Response",
        compliance: "Compliance",
        tools: "Tools & Techniques"
      };
      return categories[category] || category;
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    useSeoMeta({
      title: () => {
        var _a;
        return ((_a = post.value) == null ? void 0 : _a.title) || "Article";
      },
      description: () => {
        var _a;
        return ((_a = post.value) == null ? void 0 : _a.excerpt) || "";
      },
      ogTitle: () => {
        var _a;
        return ((_a = post.value) == null ? void 0 : _a.title) || "";
      },
      ogDescription: () => {
        var _a;
        return ((_a = post.value) == null ? void 0 : _a.excerpt) || "";
      },
      ogImage: () => {
        var _a;
        return ((_a = post.value) == null ? void 0 : _a.image1) || "";
      },
      ogUrl: () => "",
      twitterCard: "summary_large_image"
    });
    useHead({
      script: [
        {
          type: "application/ld+json",
          innerHTML: computed(() => {
            if (!post.value) return {};
            return {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.value.title,
              description: post.value.excerpt,
              image: post.value.image1 ? [post.value.image1] : [],
              datePublished: post.value.date,
              author: {
                "@type": "Person",
                name: post.value.author
              }
            };
          })
        }
      ]
    });
    const truncateTitle = (title, maxLength = 70) => {
      if (!title) return "";
      if (title.length <= maxLength) return title;
      const truncated = title.substr(0, maxLength);
      const lastSpace = truncated.lastIndexOf(" ");
      if (lastSpace > maxLength * 0.7) {
        return truncated.substr(0, lastSpace) + "...";
      }
      return truncated + "...";
    };
    const getThreatLevelShortLabel = (level) => {
      const labels = {
        info: "Info",
        low: "Low",
        medium: "Med",
        high: "High",
        critical: "Crit"
      };
      return labels[level] || "Info";
    };
    const getTrendClass = (index) => {
      const trends = [
        "trend-up",
        "trend-stable",
        "trend-down",
        "trend-up",
        "trend-stable"
      ];
      return trends[index] || "trend-stable";
    };
    const getTrendIcon = (index) => {
      const icons = {
        "trend-up": "fa-arrow-up",
        "trend-down": "fa-arrow-down",
        "trend-stable": "fa-minus"
      };
      return icons[getTrendClass(index)] || "fa-minus";
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_nuxt_link = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      const _component_Swiper = Swiper;
      const _component_SwiperSlide = SwiperSlide;
      if (unref(post)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "article-page" }, _attrs))} data-v-1d291f98><aside class="sidebar" data-v-1d291f98>`);
        if (unref(headings).length > 0) {
          _push(`<div class="toc-sidebar" data-v-1d291f98><h3 class="sidebar-title" data-v-1d291f98><i class="fas fa-list" data-v-1d291f98></i> ${ssrInterpolate(_ctx.$i18n.locale === "ar" ? "محتويات المقال" : "Table of Contents")}</h3><nav class="toc-nav" data-v-1d291f98><ul data-v-1d291f98><!--[-->`);
          ssrRenderList(unref(headings), (heading, index) => {
            _push(`<li class="${ssrRenderClass(`toc-level-${heading.level}`)}" data-v-1d291f98><a${ssrRenderAttr("href", `#${heading.id}`)} class="${ssrRenderClass({ active: unref(activeHeading) === heading.id })}" data-v-1d291f98>${ssrInterpolate(heading.text)}</a></li>`);
          });
          _push(`<!--]--></ul></nav></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="most-viewed-sidebar" data-v-1d291f98><h3 class="sidebar-title" data-v-1d291f98><i class="fas fa-chart-line" data-v-1d291f98></i> ${ssrInterpolate(_ctx.$i18n.locale === "ar" ? "الأكثر مشاهدة" : "Most Viewed")}</h3><div class="sidebar-list" data-v-1d291f98><!--[-->`);
        ssrRenderList(unref(mostWatched), (item, index) => {
          _push(`<div class="sidebar-item" data-v-1d291f98>`);
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: `/blog/${item.slug}`,
            class: "sidebar-link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="item-rank" data-v-1d291f98${_scopeId}><span class="rank-number" data-v-1d291f98${_scopeId}>${ssrInterpolate(index + 1)}</span><div class="${ssrRenderClass([getTrendClass(index), "rank-trend"])}" data-v-1d291f98${_scopeId}><i class="${ssrRenderClass([getTrendIcon(index), "fas"])}" data-v-1d291f98${_scopeId}></i></div></div><div class="sidebar-content" data-v-1d291f98${_scopeId}><h4 class="title"${ssrRenderAttr("title", item.title)} data-v-1d291f98${_scopeId}>${ssrInterpolate(truncateTitle(item.title))}</h4><div class="sidebar-meta" data-v-1d291f98${_scopeId}><div class="meta-left" data-v-1d291f98${_scopeId}><span class="sidebar-date" data-v-1d291f98${_scopeId}><i class="far fa-calendar" data-v-1d291f98${_scopeId}></i> ${ssrInterpolate(formatDate(item.date))}</span><span class="read-time" data-v-1d291f98${_scopeId}><i class="far fa-clock" data-v-1d291f98${_scopeId}></i> ${ssrInterpolate(item.readTime || "2 min read")}</span></div><span class="${ssrRenderClass([`threat-${item.threatLevel}`, "threat-level"])}"${ssrRenderAttr("title", getThreatLevelLabel(item.threatLevel))} data-v-1d291f98${_scopeId}>${ssrInterpolate(getThreatLevelShortLabel(item.threatLevel))}</span></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "item-rank" }, [
                    createVNode("span", { class: "rank-number" }, toDisplayString(index + 1), 1),
                    createVNode("div", {
                      class: ["rank-trend", getTrendClass(index)]
                    }, [
                      createVNode("i", {
                        class: ["fas", getTrendIcon(index)]
                      }, null, 2)
                    ], 2)
                  ]),
                  createVNode("div", { class: "sidebar-content" }, [
                    createVNode("h4", {
                      class: "title",
                      title: item.title
                    }, toDisplayString(truncateTitle(item.title)), 9, ["title"]),
                    createVNode("div", { class: "sidebar-meta" }, [
                      createVNode("div", { class: "meta-left" }, [
                        createVNode("span", { class: "sidebar-date" }, [
                          createVNode("i", { class: "far fa-calendar" }),
                          createTextVNode(" " + toDisplayString(formatDate(item.date)), 1)
                        ]),
                        createVNode("span", { class: "read-time" }, [
                          createVNode("i", { class: "far fa-clock" }),
                          createTextVNode(" " + toDisplayString(item.readTime || "2 min read"), 1)
                        ])
                      ]),
                      createVNode("span", {
                        class: ["threat-level", `threat-${item.threatLevel}`],
                        title: getThreatLevelLabel(item.threatLevel)
                      }, toDisplayString(getThreatLevelShortLabel(item.threatLevel)), 11, ["title"])
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div></div></aside><main class="content" data-v-1d291f98><nav class="breadcrumb" aria-label="Breadcrumb" data-v-1d291f98><ol data-v-1d291f98><li data-v-1d291f98>`);
        _push(ssrRenderComponent(_component_nuxt_link, { to: "/" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.$t("Home"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.$t("Home")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li aria-hidden="true" data-v-1d291f98>/</li><li data-v-1d291f98>`);
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: `/category/${unref(post).category}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(getCategoryLabel(unref(post).category))}`);
            } else {
              return [
                createTextVNode(toDisplayString(getCategoryLabel(unref(post).category)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li aria-hidden="true" data-v-1d291f98>/</li><li data-v-1d291f98><span aria-current="page" data-v-1d291f98>${ssrInterpolate(unref(post).title)}</span></li></ol></nav><header class="article-header" data-v-1d291f98><div class="${ssrRenderClass([`threat-${unref(post).threatLevel}`, "threat-badge"])}" data-v-1d291f98><i class="${ssrRenderClass(getThreatLevelIcon(unref(post).threatLevel))}" data-v-1d291f98></i> ${ssrInterpolate(getThreatLevelLabel(unref(post).threatLevel))}</div><h1 class="article-title" data-v-1d291f98>${ssrInterpolate(unref(post).title)}</h1><div class="article-meta" data-v-1d291f98><div class="meta-left" data-v-1d291f98><div class="author-info" data-v-1d291f98>`);
        if ((_a = unref(authorData)) == null ? void 0 : _a.avatar) {
          _push(`<img${ssrRenderAttr("src", unref(authorData).avatar)}${ssrRenderAttr("alt", unref(post).author)} class="author-avatar" data-v-1d291f98>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="author-details" data-v-1d291f98><p class="article-author" data-v-1d291f98>${ssrInterpolate(unref(post).author)}</p>`);
        if ((_b = unref(authorData)) == null ? void 0 : _b.role) {
          _push(`<p class="author-role" data-v-1d291f98>${ssrInterpolate(unref(authorData).role)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="meta-details" data-v-1d291f98><p class="article-date" data-v-1d291f98><i class="far fa-calendar-alt" data-v-1d291f98></i> ${ssrInterpolate(formatDate(unref(post).date))}</p>`);
        if (unref(post).updated) {
          _push(`<p class="article-updated" data-v-1d291f98><i class="far fa-edit" data-v-1d291f98></i> Updated ${ssrInterpolate(formatDate(unref(post).updated))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="article-reading-time" data-v-1d291f98><i class="far fa-clock" data-v-1d291f98></i> ${ssrInterpolate(unref(post).readTime)}</p></div></div><div class="share-section" data-v-1d291f98><span data-v-1d291f98>${ssrInterpolate(_ctx.$i18n.locale === "ar" ? "مشاركة" : "Share")}:</span><div class="share-buttons" data-v-1d291f98><button class="share-btn facebook"${ssrRenderAttr(
          "aria-label",
          _ctx.$i18n.locale === "ar" ? "مشاركة على فيسبوك" : "Share on Facebook"
        )} data-v-1d291f98>`);
        _push(ssrRenderComponent(_component_Icon, { name: "mdi:facebook" }, null, _parent));
        _push(`</button><button class="share-btn twitter"${ssrRenderAttr(
          "aria-label",
          _ctx.$i18n.locale === "ar" ? "مشاركة على تويتر" : "Share on Twitter"
        )} data-v-1d291f98>`);
        _push(ssrRenderComponent(_component_Icon, { name: "mdi:twitter" }, null, _parent));
        _push(`</button><button class="share-btn linkedin"${ssrRenderAttr(
          "aria-label",
          _ctx.$i18n.locale === "ar" ? "مشاركة على لينكد إن" : "Share on LinkedIn"
        )} data-v-1d291f98>`);
        _push(ssrRenderComponent(_component_Icon, { name: "mdi:linkedin" }, null, _parent));
        _push(`</button><button class="share-btn whatsapp"${ssrRenderAttr(
          "aria-label",
          _ctx.$i18n.locale === "ar" ? "مشاركة على واتساب" : "Share on WhatsApp"
        )} data-v-1d291f98>`);
        _push(ssrRenderComponent(_component_Icon, { name: "mdi:whatsapp" }, null, _parent));
        _push(`</button><button class="share-btn link"${ssrRenderAttr("aria-label", _ctx.$i18n.locale === "ar" ? "نسخ الرابط" : "Copy link")} data-v-1d291f98>`);
        _push(ssrRenderComponent(_component_Icon, { name: "mdi:link" }, null, _parent));
        _push(`</button></div></div></div>`);
        if (unref(post).excerpt) {
          _push(`<div class="article-excerpt" data-v-1d291f98><p data-v-1d291f98>${ssrInterpolate(unref(post).excerpt)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</header>`);
        if ((_c = unref(post).featuredImage) == null ? void 0 : _c.url) {
          _push(`<div class="featured-image" data-v-1d291f98><img${ssrRenderAttr("src", unref(post).featuredImage.url)}${ssrRenderAttr("alt", unref(post).featuredImage.alt || unref(post).title)} class="main-article-image" loading="lazy" data-v-1d291f98>`);
          if (unref(post).featuredImage.caption) {
            _push(`<figcaption class="image-caption" data-v-1d291f98>${ssrInterpolate(unref(post).featuredImage.caption)}</figcaption>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(post).gallery && unref(post).gallery.length > 0) {
          _push(`<div class="gallery" data-v-1d291f98>`);
          _push(ssrRenderComponent(_component_Swiper, {
            modules: ["SwiperNavigation" in _ctx ? _ctx.SwiperNavigation : unref(Navigation), "SwiperPagination" in _ctx ? _ctx.SwiperPagination : unref(Pagination), "SwiperAutoplay" in _ctx ? _ctx.SwiperAutoplay : unref(Autoplay)],
            "slides-per-view": 1,
            "space-between": 20,
            pagination: { clickable: true },
            navigation: true,
            autoplay: { delay: 5e3, disableOnInteraction: false },
            loop: unref(post).gallery.length > 1,
            class: "gallery-swiper"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<!--[-->`);
                ssrRenderList(unref(post).gallery, (img, idx) => {
                  _push2(ssrRenderComponent(_component_SwiperSlide, { key: idx }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="swiper-image-container" data-v-1d291f98${_scopeId2}><img${ssrRenderAttr("src", img.image)}${ssrRenderAttr("alt", img.alt || unref(post).title)} class="gallery-image" loading="lazy" data-v-1d291f98${_scopeId2}>`);
                        if (img.caption) {
                          _push3(`<figcaption class="image-caption" data-v-1d291f98${_scopeId2}>${ssrInterpolate(img.caption)}</figcaption>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "swiper-image-container" }, [
                            createVNode("img", {
                              src: img.image,
                              alt: img.alt || unref(post).title,
                              class: "gallery-image",
                              loading: "lazy"
                            }, null, 8, ["src", "alt"]),
                            img.caption ? (openBlock(), createBlock("figcaption", {
                              key: 0,
                              class: "image-caption"
                            }, toDisplayString(img.caption), 1)) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              } else {
                return [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(post).gallery, (img, idx) => {
                    return openBlock(), createBlock(_component_SwiperSlide, { key: idx }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "swiper-image-container" }, [
                          createVNode("img", {
                            src: img.image,
                            alt: img.alt || unref(post).title,
                            class: "gallery-image",
                            loading: "lazy"
                          }, null, 8, ["src", "alt"]),
                          img.caption ? (openBlock(), createBlock("figcaption", {
                            key: 0,
                            class: "image-caption"
                          }, toDisplayString(img.caption), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<article class="article-body" data-v-1d291f98><div data-v-1d291f98>${unref(renderedMarkdown) ?? ""}</div></article>`);
        if (unref(post).tags && unref(post).tags.length) {
          _push(`<div class="article-tags" data-v-1d291f98><span class="tags-label" data-v-1d291f98><i class="fas fa-tags" data-v-1d291f98></i> ${ssrInterpolate(_ctx.$i18n.locale === "ar" ? "الكلمات المفتاحية" : "Tags")}: </span><div class="tags-list" data-v-1d291f98><!--[-->`);
          ssrRenderList(unref(post).tags, (tag) => {
            _push(ssrRenderComponent(_component_nuxt_link, {
              key: tag,
              to: `/tags/${tag}`,
              class: "tag"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(tag)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(tag), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(authorData)) {
          _push(`<div class="author-bio" data-v-1d291f98><div class="author-header" data-v-1d291f98>`);
          if (unref(authorData).avatar) {
            _push(`<img${ssrRenderAttr("src", unref(authorData).avatar)}${ssrRenderAttr("alt", unref(authorData).name)} class="author-bio-avatar" data-v-1d291f98>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="author-bio-info" data-v-1d291f98><h3 data-v-1d291f98>About ${ssrInterpolate(unref(authorData).name)}</h3>`);
          if (unref(authorData).role) {
            _push(`<p class="author-bio-role" data-v-1d291f98>${ssrInterpolate(unref(authorData).role)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="author-bio-text" data-v-1d291f98>${ssrInterpolate(unref(authorData).bio)}</p>`);
          if (unref(authorData).social) {
            _push(`<div class="author-social" data-v-1d291f98>`);
            if (unref(authorData).social.twitter) {
              _push(`<a${ssrRenderAttr("href", unref(authorData).social.twitter)} target="_blank" rel="noopener" data-v-1d291f98><i class="fab fa-twitter" data-v-1d291f98></i></a>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(authorData).social.linkedin) {
              _push(`<a${ssrRenderAttr("href", unref(authorData).social.linkedin)} target="_blank" rel="noopener" data-v-1d291f98><i class="fab fa-linkedin-in" data-v-1d291f98></i></a>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(authorData).social.github) {
              _push(`<a${ssrRenderAttr("href", unref(authorData).social.github)} target="_blank" rel="noopener" data-v-1d291f98><i class="fab fa-github" data-v-1d291f98></i></a>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(authorData).social.website) {
              _push(`<a${ssrRenderAttr("href", unref(authorData).social.website)} target="_blank" rel="noopener" data-v-1d291f98><i class="fas fa-globe" data-v-1d291f98></i></a>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_d = unref(post).attachments) == null ? void 0 : _d.length) {
          _push(`<section class="attachments" data-v-1d291f98><h2 class="section-title" data-v-1d291f98><i class="fas fa-paperclip" data-v-1d291f98></i> ${ssrInterpolate(_ctx.$t("Attachments"))}</h2><div class="attachments-grid" data-v-1d291f98><!--[-->`);
          ssrRenderList(unref(post).attachments, (att) => {
            _push(`<div class="attachment-card" data-v-1d291f98><a${ssrRenderAttr("href", att.file)} target="_blank" class="attachment-link" rel="noopener" data-v-1d291f98><div class="attachment-icon" data-v-1d291f98><i class="fas fa-download" data-v-1d291f98></i></div><div class="attachment-info" data-v-1d291f98><span class="attachment-name" data-v-1d291f98>${ssrInterpolate(att.name)}</span>`);
            if (att.description) {
              _push(`<span class="attachment-description" data-v-1d291f98>${ssrInterpolate(att.description)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></a></div>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(relatedPosts).length) {
          _push(`<section class="related-articles" data-v-1d291f98><h2 class="section-title" data-v-1d291f98><i class="fas fa-newspaper" data-v-1d291f98></i> ${ssrInterpolate(_ctx.$i18n.locale === "ar" ? "مقالات ذات صلة" : "Related Articles")}</h2><div class="related-grid" data-v-1d291f98><!--[-->`);
          ssrRenderList(unref(relatedPosts), (article) => {
            _push(`<article class="related-card" data-v-1d291f98>`);
            _push(ssrRenderComponent(_component_nuxt_link, {
              to: `/blog/${article.slug}`,
              class: "related-link"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2, _c2, _d2;
                if (_push2) {
                  _push2(`<div class="related-image" data-v-1d291f98${_scopeId}><img${ssrRenderAttr("src", ((_a2 = article.featuredImage) == null ? void 0 : _a2.url) || "/images/placeholder.jpg")}${ssrRenderAttr("alt", ((_b2 = article.featuredImage) == null ? void 0 : _b2.alt) || article.title)} loading="lazy" data-v-1d291f98${_scopeId}><div class="${ssrRenderClass([`threat-${article.threatLevel}`, "threat-badge-small"])}" data-v-1d291f98${_scopeId}>${ssrInterpolate(getThreatLevelLabel(article.threatLevel))}</div></div><div class="related-content" data-v-1d291f98${_scopeId}><h3 class="related-title" data-v-1d291f98${_scopeId}>${ssrInterpolate(article.title)}</h3><p class="related-excerpt" data-v-1d291f98${_scopeId}>${ssrInterpolate(article.excerpt)}</p><div class="related-meta" data-v-1d291f98${_scopeId}><span class="related-date" data-v-1d291f98${_scopeId}>${ssrInterpolate(formatDate(article.date))}</span><span class="related-read-time" data-v-1d291f98${_scopeId}>${ssrInterpolate(article.readTime)}</span></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "related-image" }, [
                      createVNode("img", {
                        src: ((_c2 = article.featuredImage) == null ? void 0 : _c2.url) || "/images/placeholder.jpg",
                        alt: ((_d2 = article.featuredImage) == null ? void 0 : _d2.alt) || article.title,
                        loading: "lazy"
                      }, null, 8, ["src", "alt"]),
                      createVNode("div", {
                        class: ["threat-badge-small", `threat-${article.threatLevel}`]
                      }, toDisplayString(getThreatLevelLabel(article.threatLevel)), 3)
                    ]),
                    createVNode("div", { class: "related-content" }, [
                      createVNode("h3", { class: "related-title" }, toDisplayString(article.title), 1),
                      createVNode("p", { class: "related-excerpt" }, toDisplayString(article.excerpt), 1),
                      createVNode("div", { class: "related-meta" }, [
                        createVNode("span", { class: "related-date" }, toDisplayString(formatDate(article.date)), 1),
                        createVNode("span", { class: "related-read-time" }, toDisplayString(article.readTime), 1)
                      ])
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</article>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</main></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1d291f98"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_.vue.mjs.map

import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { useSSRContext, withAsyncContext, ref, computed, mergeProps, unref, withCtx, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { u as useFetch } from './fetch.mjs';
import { _ as _export_sfc, a as useSeoMeta } from './server.mjs';
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
import './asyncData.mjs';
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
import '@iconify/vue';

const postsPerPage = 6;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    let currentPage = 1;
    const { data: allPosts } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/posts", "$ns2Xa_1kks")), __temp = await __temp, __restore(), __temp);
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const selectedThreatLevel = ref("");
    const sortBy = ref("date-desc");
    const categories = computed(() => {
      if (!allPosts.value) return [];
      return [
        ...new Set(allPosts.value.map((p) => p.category || "Security"))
      ].sort();
    });
    const filteredPosts = computed(() => {
      if (!allPosts.value) return [];
      let filtered = allPosts.value;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (p) => {
            var _a, _b, _c, _d;
            return ((_a = p.title) == null ? void 0 : _a.toLowerCase().includes(q)) || ((_b = p.description) == null ? void 0 : _b.toLowerCase().includes(q)) || ((_c = p.body) == null ? void 0 : _c.toLowerCase().includes(q)) || ((_d = p.tags) == null ? void 0 : _d.some((tag) => tag.toLowerCase().includes(q)));
          }
        );
      }
      if (selectedCategory.value) {
        filtered = filtered.filter(
          (p) => (p.category || "Security") === selectedCategory.value
        );
      }
      if (selectedThreatLevel.value) {
        filtered = filtered.filter(
          (p) => p.threatLevel === selectedThreatLevel.value
        );
      }
      switch (sortBy.value) {
        case "date-asc":
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case "title":
          filtered.sort((a, b) => {
            var _a;
            return (_a = a.title) == null ? void 0 : _a.localeCompare(b.title);
          });
          break;
        case "date-desc":
        default:
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      return filtered.slice(0, postsPerPage * currentPage);
    });
    const hasActiveFilters = computed(
      () => searchQuery.value || selectedCategory.value || selectedThreatLevel.value
    );
    const showLoadMore = computed(
      () => {
        var _a;
        return filteredPosts.value.length < (((_a = allPosts.value) == null ? void 0 : _a.length) || 0);
      }
    );
    const formatDate = (d) => new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    const getThreatLevelText = (level) => ({
      low: "LOW RISK",
      medium: "MEDIUM RISK",
      high: "HIGH RISK",
      critical: "CRITICAL",
      info: "RESEARCH"
    })[level] || "RESEARCH";
    useSeoMeta({
      title: "Security Research Archive - Threat Intelligence & Analysis",
      description: "Comprehensive collection of security research, vulnerability analysis, threat intelligence, and defense strategies from cybersecurity experts."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "blog-page" }, _attrs))} data-v-786edba2><section class="blog-hero" data-v-786edba2><div class="cyber-grid" data-v-786edba2></div><div class="scan-line" data-v-786edba2></div><div class="container" data-v-786edba2><div class="blog-hero-content" data-v-786edba2><div class="badge" data-v-786edba2><span class="pulse-dot" data-v-786edba2></span> SECURITY RESEARCH </div><h1 class="blog-title" data-v-786edba2><span class="cyber-text" data-v-786edba2>Threat Intelligence</span><br data-v-786edba2><span class="glitch-text" data-text="Archive" data-v-786edba2>Archive</span></h1><p class="blog-subtitle" data-v-786edba2> Comprehensive analysis of vulnerabilities, exploits, and defense strategies </p></div></div></section><section class="blog-filters" data-v-786edba2><div class="container" data-v-786edba2><div class="filters-grid" data-v-786edba2><div class="search-box" data-v-786edba2><div class="search-icon" data-v-786edba2>🔍</div><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search security research..." class="search-input" aria-label="Search posts" data-v-786edba2></div><div class="filter-group" data-v-786edba2><select class="filter-select" aria-label="Select category" data-v-786edba2><option value="" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCategory)) ? ssrLooseContain(unref(selectedCategory), "") : ssrLooseEqual(unref(selectedCategory), "")) ? " selected" : ""}>All Categories</option><!--[-->`);
      ssrRenderList(unref(categories), (category) => {
        _push(`<option${ssrRenderAttr("value", category)} data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCategory)) ? ssrLooseContain(unref(selectedCategory), category) : ssrLooseEqual(unref(selectedCategory), category)) ? " selected" : ""}>${ssrInterpolate(category)}</option>`);
      });
      _push(`<!--]--></select></div><div class="filter-group" data-v-786edba2><select class="filter-select" aria-label="Select threat level" data-v-786edba2><option value="" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(selectedThreatLevel)) ? ssrLooseContain(unref(selectedThreatLevel), "") : ssrLooseEqual(unref(selectedThreatLevel), "")) ? " selected" : ""}>All Threat Levels</option><option value="info" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(selectedThreatLevel)) ? ssrLooseContain(unref(selectedThreatLevel), "info") : ssrLooseEqual(unref(selectedThreatLevel), "info")) ? " selected" : ""}>Research</option><option value="low" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(selectedThreatLevel)) ? ssrLooseContain(unref(selectedThreatLevel), "low") : ssrLooseEqual(unref(selectedThreatLevel), "low")) ? " selected" : ""}>Low Risk</option><option value="medium" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(selectedThreatLevel)) ? ssrLooseContain(unref(selectedThreatLevel), "medium") : ssrLooseEqual(unref(selectedThreatLevel), "medium")) ? " selected" : ""}>Medium Risk</option><option value="high" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(selectedThreatLevel)) ? ssrLooseContain(unref(selectedThreatLevel), "high") : ssrLooseEqual(unref(selectedThreatLevel), "high")) ? " selected" : ""}>High Risk</option><option value="critical" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(selectedThreatLevel)) ? ssrLooseContain(unref(selectedThreatLevel), "critical") : ssrLooseEqual(unref(selectedThreatLevel), "critical")) ? " selected" : ""}>Critical</option></select></div><div class="filter-group" data-v-786edba2><select class="filter-select" aria-label="Sort posts" data-v-786edba2><option value="date-desc" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "date-desc") : ssrLooseEqual(unref(sortBy), "date-desc")) ? " selected" : ""}>Newest First</option><option value="date-asc" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "date-asc") : ssrLooseEqual(unref(sortBy), "date-asc")) ? " selected" : ""}>Oldest First</option><option value="title" data-v-786edba2${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "title") : ssrLooseEqual(unref(sortBy), "title")) ? " selected" : ""}>Title A-Z</option></select></div></div>`);
      if (unref(hasActiveFilters)) {
        _push(`<div class="active-filters" data-v-786edba2><span class="active-filters-label" data-v-786edba2>Active Filters:</span>`);
        if (unref(searchQuery)) {
          _push(`<span class="filter-tag" data-v-786edba2> Search: &quot;${ssrInterpolate(unref(searchQuery))}&quot; <button class="filter-remove" aria-label="Remove search filter" data-v-786edba2> × </button></span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(selectedCategory)) {
          _push(`<span class="filter-tag" data-v-786edba2> Category: ${ssrInterpolate(unref(selectedCategory))} <button class="filter-remove" aria-label="Remove category filter" data-v-786edba2> × </button></span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(selectedThreatLevel)) {
          _push(`<span class="filter-tag" data-v-786edba2> Threat: ${ssrInterpolate(getThreatLevelText(unref(selectedThreatLevel)))} <button class="filter-remove" aria-label="Remove threat filter" data-v-786edba2> × </button></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="clear-all" aria-label="Clear all filters" data-v-786edba2> Clear All </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="blog-posts" data-v-786edba2><div class="container" data-v-786edba2>`);
      if (unref(filteredPosts).length === 0) {
        _push(`<div class="no-results" data-v-786edba2><div class="no-results-icon" data-v-786edba2>🔍</div><h3 data-v-786edba2>No security research found</h3><p data-v-786edba2>Try adjusting your search criteria or filters</p><button class="btn btn-primary" aria-label="Show all posts" data-v-786edba2> Show All Research </button></div>`);
      } else {
        _push(`<div class="posts-grid" data-v-786edba2><!--[-->`);
        ssrRenderList(unref(filteredPosts), (post) => {
          _push(`<article class="${ssrRenderClass([`threat-level-${post.threatLevel || "info"}`, "post-card"])}" data-v-786edba2><div class="post-header" data-v-786edba2><div class="${ssrRenderClass([post.threatLevel || "info", "threat-badge"])}" data-v-786edba2>${ssrInterpolate(getThreatLevelText(post.threatLevel))}</div><div class="post-date" data-v-786edba2>${ssrInterpolate(formatDate(post.date))}</div></div><h2 class="post-title" data-v-786edba2>${ssrInterpolate(post.title)}</h2><p class="post-description" data-v-786edba2>${ssrInterpolate(post.description)}</p><div class="post-meta" data-v-786edba2><span class="category" data-v-786edba2>${ssrInterpolate(post.category || "Security")}</span><span class="read-time" data-v-786edba2>${ssrInterpolate(post.readTime || "5 min read")}</span></div><div class="post-tags" data-v-786edba2><!--[-->`);
          ssrRenderList(post.tags, (tag) => {
            _push(`<span class="post-tag" data-v-786edba2>${ssrInterpolate(tag)}</span>`);
          });
          _push(`<!--]--></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: post._path,
            class: "post-link",
            "aria-label": "Read full post"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Analyze Threat ⟫ `);
              } else {
                return [
                  createTextVNode(" Analyze Threat ⟫ ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</article>`);
        });
        _push(`<!--]--></div>`);
      }
      if (unref(showLoadMore)) {
        _push(`<div class="load-more" data-v-786edba2><button class="btn btn-secondary" aria-label="Load more posts" data-v-786edba2> Load More Research </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-786edba2"]]);

export { index as default };
//# sourceMappingURL=index.vue2.mjs.map

import { _ as __nuxt_component_0$1 } from './nuxt-link.mjs';
import { withAsyncContext, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useAsyncData } from './asyncData.mjs';
import { _ as _export_sfc, a as useSeoMeta, u as useHead } from './server.mjs';
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
import '@iconify/vue';

const _sfc_main$1 = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: securityPosts } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("security-posts", () => {
      return queryContent("/blog").sort({ date: -1 }).limit(3).find();
    })), __temp = await __temp, __restore(), __temp);
    const services = [
      {
        icon: "🔍",
        title: "Penetration Testing",
        description: "Comprehensive security assessments to identify vulnerabilities before attackers do.",
        tags: ["Web App Testing", "Network Pentesting", "API Security"],
        color: "#ff6b6b"
      },
      {
        icon: "🛡️",
        title: "Threat Intelligence",
        description: "Proactive monitoring and analysis of emerging threats and attack vectors.",
        tags: ["OSINT", "Malware Analysis", "Threat Hunting"],
        color: "#4ecdc4"
      },
      {
        icon: "🔐",
        title: "Incident Response",
        description: "Rapid response and recovery from security incidents and breaches.",
        tags: ["DFIR", "Forensics", "Containment"],
        color: "#45b7d1"
      },
      {
        icon: "⚡",
        title: "Security Architecture",
        description: "Designing and implementing secure systems and infrastructure.",
        tags: ["Cloud Security", "Zero Trust", "Hardening"],
        color: "#96ceb4"
      }
    ];
    const toolCategories = [
      {
        name: "Penetration Testing",
        tools: ["Metasploit", "Burp Suite", "Nmap", "Wireshark", "John the Ripper"]
      },
      {
        name: "Vulnerability Assessment",
        tools: ["Nessus", "OpenVAS", "Nexpose", "Qualys"]
      },
      {
        name: "Forensics & IR",
        tools: ["Autopsy", "Volatility", "SIFT", "GRR"]
      },
      {
        name: "OSINT",
        tools: ["Maltego", "theHarvester", "Shodan", "Recon-ng"]
      }
    ];
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };
    const getThreatLevelText = (level) => {
      const levels = {
        low: "LOW RISK",
        medium: "MEDIUM RISK",
        high: "HIGH RISK",
        critical: "CRITICAL",
        info: "RESEARCH"
      };
      return levels[level] || "RESEARCH";
    };
    useSeoMeta({
      title: "Cybersecurity Specialist - Threat Research & Defense Strategies",
      description: "Security researcher and penetration tester focused on vulnerability analysis, threat intelligence, and building secure systems. Latest security research and insights.",
      ogImage: "/cyber-og.jpg"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "homepage" }, _attrs))} data-v-a06dc85d><section class="hero" data-v-a06dc85d><div class="cyber-grid" data-v-a06dc85d></div><div class="scan-line" data-v-a06dc85d></div><div class="container" data-v-a06dc85d><div class="hero-content" data-v-a06dc85d><div class="hero-text" data-v-a06dc85d><div class="badge" data-v-a06dc85d><span class="pulse-dot" data-v-a06dc85d></span> SECURITY ANALYST </div><h1 class="hero-title" data-v-a06dc85d><span class="cyber-text" data-v-a06dc85d>Protecting Digital</span><br data-v-a06dc85d><span class="glitch-text" data-text="Frontiers" data-v-a06dc85d>Frontiers</span></h1><p class="hero-description" data-v-a06dc85d> Cybersecurity specialist focused on threat intelligence, penetration testing, and building resilient systems. Writing about security research and defense strategies. </p><div class="hero-actions" data-v-a06dc85d>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/blog",
        class: "btn btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="btn-icon" data-v-a06dc85d${_scopeId}>⟫</span> Read Blog `);
          } else {
            return [
              createVNode("span", { class: "btn-icon" }, "⟫"),
              createTextVNode(" Read Blog ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="hero-visual" data-v-a06dc85d><div class="security-terminal" data-v-a06dc85d><div class="terminal-header" data-v-a06dc85d><div class="terminal-controls" data-v-a06dc85d><span class="control red" data-v-a06dc85d></span><span class="control yellow" data-v-a06dc85d></span><span class="control green" data-v-a06dc85d></span></div><span class="terminal-title" data-v-a06dc85d>security@portfolio:~</span></div><div class="terminal-body" data-v-a06dc85d><div class="terminal-line" data-v-a06dc85d><span class="prompt" data-v-a06dc85d>$</span> whoami </div><div class="terminal-line output" data-v-a06dc85d> Security Researcher | Penetration Tester </div><div class="terminal-line" data-v-a06dc85d><span class="prompt" data-v-a06dc85d>$</span> cat skills.txt </div><div class="terminal-line output" data-v-a06dc85d> PenTesting • Threat Analysis • Network Security </div><div class="terminal-line" data-v-a06dc85d><span class="prompt" data-v-a06dc85d>$</span> <span class="cursor" data-v-a06dc85d>|</span></div></div></div></div></div></div></section><section class="services" data-v-a06dc85d><div class="container" data-v-a06dc85d><div class="section-header" data-v-a06dc85d><h2 data-v-a06dc85d>Security Specializations</h2><p data-v-a06dc85d>Comprehensive cybersecurity services and expertise</p></div><div class="services-grid" data-v-a06dc85d><!--[-->`);
      ssrRenderList(services, (service) => {
        _push(`<div class="service-card" data-v-a06dc85d><div class="service-icon" style="${ssrRenderStyle({ color: service.color })}" data-v-a06dc85d>${ssrInterpolate(service.icon)}</div><h3 data-v-a06dc85d>${ssrInterpolate(service.title)}</h3><p data-v-a06dc85d>${ssrInterpolate(service.description)}</p><ul class="service-tags" data-v-a06dc85d><!--[-->`);
        ssrRenderList(service.tags, (tag) => {
          _push(`<li data-v-a06dc85d>${ssrInterpolate(tag)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      });
      _push(`<!--]--></div></div></section><section class="security-research" data-v-a06dc85d><div class="container" data-v-a06dc85d><div class="section-header" data-v-a06dc85d><h2 data-v-a06dc85d>Latest Security Research</h2><p data-v-a06dc85d> In-depth analysis of vulnerabilities, threats, and defense strategies </p></div><div class="research-grid" data-v-a06dc85d><!--[-->`);
      ssrRenderList(unref(securityPosts), (post) => {
        _push(`<article class="${ssrRenderClass([`threat-level-${post.threatLevel || "info"}`, "research-card"])}" data-v-a06dc85d><div class="research-header" data-v-a06dc85d><div class="${ssrRenderClass([post.threatLevel || "info", "threat-badge"])}" data-v-a06dc85d>${ssrInterpolate(getThreatLevelText(post.threatLevel))}</div><div class="research-date" data-v-a06dc85d>${ssrInterpolate(formatDate(post.date))}</div></div><h3 data-v-a06dc85d>${ssrInterpolate(post.title)}</h3><p data-v-a06dc85d>${ssrInterpolate(post.description)}</p><div class="research-meta" data-v-a06dc85d><span class="category" data-v-a06dc85d>${ssrInterpolate(post.category || "Security")}</span><span class="read-time" data-v-a06dc85d>${ssrInterpolate(post.readTime || "8 min read")}</span></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: post._path,
          class: "research-link"
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
      _push(`<!--]--></div></div></section><section class="security-tools" data-v-a06dc85d><div class="container" data-v-a06dc85d><div class="section-header" data-v-a06dc85d><h2 data-v-a06dc85d>Security Tools &amp; Technologies</h2><p data-v-a06dc85d>Industry-standard tools for comprehensive security assessment</p></div><div class="tools-grid" data-v-a06dc85d><!--[-->`);
      ssrRenderList(toolCategories, (category) => {
        _push(`<div class="tool-category" data-v-a06dc85d><h3 data-v-a06dc85d>${ssrInterpolate(category.name)}</h3><div class="tools-list" data-v-a06dc85d><!--[-->`);
        ssrRenderList(category.tools, (tool) => {
          _push(`<span class="tool-tag" data-v-a06dc85d>${ssrInterpolate(tool)}</span>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div></div></section><section class="cta-security" data-v-a06dc85d><div class="container" data-v-a06dc85d><div class="cta-content" data-v-a06dc85d><div class="encrypted-message" data-v-a06dc85d><div class="encryption-header" data-v-a06dc85d><span class="encryption-icon" data-v-a06dc85d>🔒</span> SECURE CHANNEL ESTABLISHED </div><h2 data-v-a06dc85d>Ready to Secure Your Systems?</h2><p data-v-a06dc85d> Let&#39;s discuss your security needs and build a robust defense strategy </p><div class="cta-actions" data-v-a06dc85d><a href="mailto:security@example.com" class="btn btn-primary" data-v-a06dc85d><span class="btn-icon" data-v-a06dc85d>✉</span> Encrypted Contact </a></div></div></div></div></section></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Home/index.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-a06dc85d"]]);

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      script: [
        { src: "https://identity.netlify.com/v1/netlify-identity-widget.js" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Home = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_Home, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue.mjs.map

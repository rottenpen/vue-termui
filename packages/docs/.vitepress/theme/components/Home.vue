<script setup lang="ts">
// import SponsorsGroup from './SponsorsGroup.vue'
</script>

<template>
  <section id="hero">
    <picture>
      <source media="(min-width:960px)" srcset="/logo-big.svg" />
      <img class="hero-logo" src="/logo.svg" alt="Vue TermUI logo" />
    </picture>
    <h1 class="tagline">
      The
      <span class="accent">Modern</span>
      <br />Terminal UI Framework
    </h1>
    <p class="description">
      Build Terminal UIs like you have never built them before.
    </p>

    <p class="actions">
      <a class="get-started" href="/guide/introduction.html">
        Get Started
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
        >
          <path
            d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"
          />
        </svg>
      </a>
      <a class="setup" href="/guide/quick-start.html">Install</a>
    </p>
  </section>

  <section id="highlights" class="vt-box-container">
    <div class="vt-box">
      <h2>Modern Tooling</h2>
      <p>
        Use modern Web tooling to enhance your developer experience. HMR,
        bundling, devtools, ... We got you covered! Instant feedback
        without restarting your application.
      </p>
    </div>
    <div class="vt-box">
      <h2>Vue.js Based</h2>
      <p>
        Vue TermUI is based on Vue.js which means you get to build your
        terminal application using Vue components. The declarative approach
        makes things so much easier and enjoyable!
      </p>
    </div>
    <div class="vt-box">
      <h2>Beginner friendly</h2>
      <p>
        The Terminal is not the easiest platform to develop on... That's
        why we abstract all of the complicated terminal stuff like ansi
        escape codes and input sequences.
      </p>
    </div>
  </section>

  <!-- <section id="sponsors">
    <h2>Platinum Sponsors</h2>
    <SponsorsGroup tier="platinum" placement="landing" />
    <h2>Gold Sponsors</h2>
    <SponsorsGroup tier="gold" placement="landing" />
  </section> -->
</template>

<style scoped>
section {
  padding: 42px 32px;
}

#hero {
  padding: 96px 32px;
  text-align: center;
}

#hero .hero-logo {
  max-width: 100%;
  width: 256px;
  margin: 1rem auto;
}

.tagline {
  font-size: 76px;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -1.5px;
  max-width: 960px;
  margin: 0px auto;
}

html:not(.dark) .accent,
.dark .tagline {
  background: -webkit-linear-gradient(
    315deg,
    var(--vt-c-brand) 25%,
    var(--vt-c-brand-secondary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  max-width: 960px;
  line-height: 1.5;
  color: var(--vt-c-text-2);
  transition: color 0.5s;
  font-size: 22px;
  margin: 24px auto 40px;
}

.actions a {
  font-size: 16px;
  display: inline-block;
  background-color: var(--vt-c-bg-mute);
  padding: 8px 18px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
}

.actions .get-started {
  margin-right: 18px;
  background-color: var(--vt-c-brand);
  color: #fff;
}

.dark .actions .get-started {
  color: var(--vt-c-indigo);
}

.actions .icon {
  display: inline;
  position: relative;
  top: -1px;
  margin-left: 2px;
  fill: currentColor;
  transition: transform 0.2s;
}

.actions .get-started:hover {
  transition-duration: 0.2s;
}

.actions .get-started:hover .icon {
  transform: translateX(2px);
}

.actions .setup {
  color: var(--vt-c-text-code);
}

.actions .setup:hover {
  background-color: var(--vt-c-gray-light-4);
  transition-duration: 0.2s;
}

.dark .actions .setup:hover {
  background-color: var(--vt-c-gray-dark-3);
}

.actions .get-started:hover {
  background-color: var(--vt-c-brand-dark);
  transition-duration: 0.2s;
}
.dark .actions .get-started:hover {
  background-color: var(--vt-c-brand-light);
}

#highlights {
  max-width: 960px;
  margin: 0px auto;
  color: var(--vt-c-text-2);
}

#highlights h2 {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -0.4px;
  color: var(--vt-c-text-1);
  transition: color 0.5s;
  margin-bottom: 0.75em;
}

#highlights p {
  font-weight: 400;
  font-size: 15px;
}

#highlights .vt-box {
  background-color: transparent;
}

#sponsors {
  max-width: 900px;
  margin: 0px auto;
}

#sponsors h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 1em;
}

#sponsors .sponsor-container {
  margin-bottom: 3em;
}

@media (max-width: 960px) {
  .tagline {
    font-size: 64px;
    letter-spacing: -0.5px;
  }
  #hero .hero-logo {
    width: 148px;
  }
  .description {
    font-size: 18px;
    margin-bottom: 48px;
  }
}

@media (max-width: 768px) {
  .tagline {
    font-size: 48px;
    letter-spacing: -0.5px;
  }
}

@media (max-width: 576px) {
  #hero {
    padding: 64px 32px;
  }
  #hero .hero-logo {
    width: 96px;
  }
  .description {
    font-size: 16px;
    margin: 18px 0 30px;
  }
  #special-sponsor img {
    display: block;
    margin: 2px auto 1px;
  }
  #highlights h3 {
    margin-bottom: 0.6em;
  }
  #highlights .vt-box {
    padding: 20px 36px;
  }
  .actions a {
    margin: 0.5em 0;
  }
}

@media (max-width: 370px) {
  .tagline {
    font-size: 36px;
  }
}
</style>

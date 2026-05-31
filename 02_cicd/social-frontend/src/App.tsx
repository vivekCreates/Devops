import './App.css'
const stats = [
  { value: '10M+', label: 'Monthly active users' },
  { value: '180+', label: 'Countries connected' },
  { value: '2.4B', label: 'Moments shared daily' },
  { value: '99.99%', label: 'Uptime for creators' },
]

const features = [
  {
    icon: '🎥',
    title: 'Short videos that convert',
    description:
      'Publish beautiful reels, stories, and livestreams that keep your audience engaged in every swipe.',
  },
  {
    icon: '💬',
    title: 'Meaningful conversations',
    description:
      'Group chats, comments, and community rooms built for creators, brands, and close friends.',
  },
  {
    icon: '🛍️',
    title: 'Monetize in one tap',
    description:
      'Launch digital products, memberships, and affiliate links with seamless checkout experiences.',
  },
  {
    icon: '🔐',
    title: 'Safety by design',
    description:
      'Advanced privacy settings, moderation tools, and intelligent filters protect every community.',
  },
]

const steps = [
  {
    title: 'Create your profile',
    description:
      'Customize your identity with themes, highlights, and links in less than two minutes.',
  },
  {
    title: 'Share what matters',
    description:
      'Post moments, launch threads, and schedule stories with AI-assisted captions and tags.',
  },
  {
    title: 'Grow with insights',
    description:
      'Use real-time analytics to understand reach, retention, and conversion across your content.',
  },
]

const testimonials = [
  {
    quote:
      'Pulse helped us build a real community around our brand. Engagement increased by 3x in just six weeks.',
    name: 'Ariana Patel',
    role: 'Marketing Lead, Nova Studio',
  },
  {
    quote:
      'I moved my audience in one weekend. The onboarding flow is smooth and my content looks incredible.',
    name: 'Liam Brooks',
    role: 'Content Creator',
  },
  {
    quote:
      'Our support team loves the moderation tools. We can scale safely without losing the human touch.',
    name: 'Mina Okafor',
    role: 'Community Manager, Clarity Labs',
  },
]

function App() {

  return (
    <div className="page-shell">
      <header className="top-nav">
        <a href="#" className="brand" aria-label="Pulse home page">
          <span className="brand-mark">P</span>
          Pulse
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#testimonials">Reviews</a>
          <a href="#About us">About </a>
        </nav>

        <div className="nav-actions">
          <a href="#" className="btn btn-ghost">
            Log in
          </a>
          <a href="#" className="btn btn-primary">
            Get started
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">The social platform for modern communities</p>
            <h1>Share moments. Build connection World wide.</h1>
            <p className="hero-subtitle">
              Pulse brings messaging, content, and creator commerce into one
              elegant experience designed for people who want meaningful online
              interactions.
            </p>

            <div className="hero-actions">
              <a href="#" className="btn btn-primary btn-large">
                Start for free
              </a>
              <a href="#" className="btn btn-ghost btn-large">
                Watch demo
              </a>
            </div>

            <ul className="social-proof" aria-label="Social proof highlights">
              <li>⭐ 4.9/5 app store rating</li>
              <li>🚀 120K+ creators onboarded</li>
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="phone-frame">
              <div className="phone-top-bar">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>

              <article className="post-card">
                <p className="post-user">@travelwithhana</p>
                <h3>Sunset reels from Bali 🌅</h3>
                <p className="post-caption">
                  “A 24-hour challenge with my community and 8 hidden beaches.”
                </p>
                <div className="post-meta">
                  <span>❤ 18.3K</span>
                  <span>💬 1.2K</span>
                  <span>↗ Share</span>
                </div>
              </article>

              <article className="mini-card">
                <p className="mini-title">Live Room</p>
                <p>Design founders Q&A starts in 08:29</p>
              </article>
            </div>

            <div className="floating floating-one">
              <p>+8.2K</p>
              <span>New followers this week</span>
            </div>
            <div className="floating floating-two">
              <p>94%</p>
              <span>Audience retention</span>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="Platform stats">
          {stats.map((item) => (
            <article key={item.label} className="stat-card">
              <h2>{item.value}</h2>
              <p>{item.label}</p>
            </article>
          ))}
        </section>

        <section id="features" className="section">
          <div className="section-heading">
            <p className="eyebrow">Everything you need</p>
            <h2>Built to make social experiences feel human again</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="section">
          <div className="section-heading">
            <p className="eyebrow">Simple by default</p>
            <h2>Start in minutes and scale without friction</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <article key={step.title} className="step-card">
                <span className="step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonials" className="section">
          <div className="section-heading">
            <p className="eyebrow">Loved by teams and creators</p>
            <h2>Real stories from real communities</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name} className="testimonial-card">
                <p>“{testimonial.quote}”</p>
                <footer>
                  <cite>{testimonial.name}</cite>
                  <span>{testimonial.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="cta-banner">
          <h2>Ready to launch your next social experience?</h2>
          <p>
            Join thousands of creators and brands already building authentic
            communities on Pulse.
          </p>
          <a href="#" className="btn btn-primary btn-large">
            Create your free account
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Pulse. Crafted for better connections.</p>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}

export default App

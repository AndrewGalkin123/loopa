import type { Metadata } from "next";
import { ArrowRight, AtSign, BookOpen, Check, GitBranch, Layers, Mail, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/Link";
import { ALGORITHMS } from "@/algorithms/registry";
import { AiFab } from "@/components/AiFab";
import { hasTranslation, pick } from "@/i18n/config";
import { getLocale, getTranslator } from "@/i18n/server";
import { ABOUT } from "../texts/about";
import "./about.css";

export async function generateMetadata(): Promise<Metadata> {
  return { title: pick(ABOUT, await getLocale()).metaTitle };
}

export default async function AboutPage() {
  const { t, locale } = await getTranslator();
  const text = pick(ABOUT, locale);
  return (
    <div className="page-about">
      <main>
        {!hasTranslation(ABOUT, locale) && <p className="untranslated">{t("untranslated")}</p>}
        {/* HERO */}
        <section className="about-hero">
          <div className="crumbs">
            <Link href="/algorithms">algorithms</Link>
            <span className="sep">/</span>
            <span className="here">about</span>
          </div>
          <h1>{text.title}</h1>
          <p className="lede">{text.lede}</p>
        </section>

        {/* 01 STORY */}
        <section className="block">
          <div className="marker">01 / Story</div>
          <h2>{text.story.title}</h2>
          <div className="story-grid">
            <div className="prose">
              {text.story.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <aside className="story-aside">
              <div className="aside-card">
                <div className="aside-item">
                  <div className="k">{text.story.author}</div>
                  <div className="v">Andrew Halkin</div>
                </div>
                <div className="aside-item">
                  <div className="k">{text.story.kind}</div>
                  <div className="v">{text.story.kindValue}</div>
                </div>
                <div className="aside-item">
                  <div className="k">{text.story.year}</div>
                  <div className="v accent">2026</div>
                </div>
                <div className="aside-item">
                  <div className="k">{text.story.count}</div>
                  <div className="v">
                    {ALGORITHMS.length} · {text.story.growing}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* 02 MISSION */}
        <section className="block">
          <div className="marker">02 / Mission</div>
          <h2>{text.mission.title}</h2>
          <div className="principles">
            <div className="principle">
              <div className="icon">
                <Layers size={18} />
              </div>
              <div className="pn">
                <span className="accent">A</span> / depth
              </div>
              <h3>{text.mission.principles[0].title}</h3>
              <p>{text.mission.principles[0].text}</p>
            </div>
            <div className="principle">
              <div className="icon">
                <ShieldCheck size={18} />
              </div>
              <div className="pn">
                <span className="accent">B</span> / honesty
              </div>
              <h3>{text.mission.principles[1].title}</h3>
              <p>{text.mission.principles[1].text}</p>
            </div>
            <div className="principle">
              <div className="icon">
                <BookOpen size={18} />
              </div>
              <div className="pn">
                <span className="accent">C</span> / open
              </div>
              <h3>{text.mission.principles[2].title}</h3>
              <p>{text.mission.principles[2].text}</p>
            </div>
          </div>
        </section>

        {/* 03 BUILT WITH */}
        <section className="block">
          <div className="marker">03 / Built With</div>
          <h2>{text.stack.title}</h2>
          <p className="stack-intro">{text.stack.intro}</p>
          <div className="stack-table">
            <div className="stack-row">
              <div className="label">frontend</div>
              <div className="tech">
                <span className="hl">Next.js 15</span> <span className="dot">·</span> <b>TypeScript</b>{" "}
                <span className="dot">·</span> SCSS Modules
              </div>
            </div>
            <div className="stack-row">
              <div className="label">visualization</div>
              <div className="tech">
                <span className="hl-cyan">D3.js</span> <span className="dot">·</span> Framer Motion
              </div>
            </div>
            <div className="stack-row">
              <div className="label">backend</div>
              <div className="tech">
                <b>Node.js</b> <span className="dot">·</span> PostgreSQL <span className="dot">·</span> Prisma
              </div>
            </div>
            <div className="stack-row">
              <div className="label">ai</div>
              <div className="tech">
                <span className="hl-mag">Anthropic Claude API</span>
              </div>
            </div>
            <div className="stack-row">
              <div className="label">hosting</div>
              <div className="tech">
                <b>Vercel</b> <span className="dot">·</span> Cloudflare
              </div>
            </div>
          </div>
        </section>

        {/* 04 STATUS */}
        <section className="block">
          <div className="marker">04 / Status</div>
          <h2>{text.status.title}</h2>
          <div className="status-grid">
            <div className="status-col done">
              <div className="col-label">{text.status.done}</div>
              <div className="status-list">
                {text.status.doneItems.map((item, i) => (
                  <div className="status-item" key={i}>
                    <Check className="mk" size={18} /> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="status-col next">
              <div className="col-label">{text.status.next}</div>
              <div className="status-list">
                {text.status.nextItems.map((item, i) => (
                  <div className="status-item" key={i}>
                    <span className="mk">—</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 05 CONNECT (contacts are placeholders) */}
        <section className="block">
          <div className="marker">05 / Connect</div>
          <h2>{text.connect.title}</h2>
          <p className="connect-text">{text.connect.text}</p>
          <div className="links-row">
            <a className="link-card" href="mailto:andrew@loopa.cz">
              <div className="icon">
                <Mail size={18} />
              </div>
              <div>
                <div className="k">email</div>
                <div className="v">
                  <span className="uline">andrew@loopa.cz</span>
                </div>
              </div>
            </a>
            <a className="link-card" href="#">
              <div className="icon">
                <AtSign size={18} />
              </div>
              <div>
                <div className="k">twitter</div>
                <div className="v">
                  <span className="uline">@loopa</span>
                </div>
              </div>
            </a>
            <a className="link-card" href="#">
              <div className="icon">
                <GitBranch size={18} />
              </div>
              <div>
                <div className="k">github</div>
                <div className="v">
                  <span className="uline">github.com/loopa</span>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final">
          <h2>{text.final.title}</h2>
          <div className="ctas">
            <Link href="/algorithms" className="btn btn-primary btn-lg">
              {text.final.algorithms} <ArrowRight size={16} />
            </Link>
            <Link href="/compare" className="btn btn-secondary btn-lg">
              {text.final.compare}
            </Link>
          </div>
          <div className="signoff">
            <span className="c">{"//"}</span> {text.final.signoff}
          </div>
        </section>
      </main>

      <AiFab label={text.ask} ariaLabel={text.askAria} />
    </div>
  );
}

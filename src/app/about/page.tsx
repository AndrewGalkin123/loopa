import type { Metadata } from "next";
import { ArrowRight, AtSign, BookOpen, Check, GitBranch, Layers, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AiFab } from "@/components/AiFab";
import "./about.css";

export const metadata: Metadata = {
  title: "Proč Loopa? — About",
};

export default function AboutPage() {
  return (
    <div className="page-about">
      <main>
        {/* HERO */}
        <section className="about-hero">
          <div className="crumbs">
            <Link href="/algorithms">algorithms</Link>
            <span className="sep">/</span>
            <span className="here">about</span>
          </div>
          <h1>Proč Loopa?</h1>
          <p className="lede">
            Algoritmy jsou srdcem programování. Skoro nikdo je ale nevysvětluje <em>pořádně.</em>
          </p>
        </section>

        {/* 01 STORY */}
        <section className="block">
          <div className="marker">01 / Story</div>
          <h2>
            Začalo to <em>frustrací.</em>
          </h2>
          <div className="story-grid">
            <div className="prose">
              <p>
                Jsem student programování. Když jsem se poprvé setkal s&nbsp;algoritmy na&nbsp;přednáškách, většina
                z&nbsp;nich mi přišla jako šum. Bubble sort? Dijkstra? Gradient descent? Slyšel jsem ta slova, viděl
                pseudokód, ale <strong>opravdu rozumět</strong> tomu, co se uvnitř děje — to byl jiný level.
              </p>
              <p>
                Existují skvělé zdroje. <em>3Blue1Brown</em> dělá kouzla s&nbsp;matematikou. <em>Visualgo</em> má
                solidní vizualizace. <em>Brilliant</em> je dobře designovaný. Ale nic z&nbsp;toho mi nestačilo. Chtěl
                jsem nástroj, kde si můžu <strong>pohrát</strong> s&nbsp;algoritmem — měnit data, srovnávat, ptát se.
              </p>
              <p>Tak jsem si ho začal stavět sám. Loopa je výsledek.</p>
            </div>
            <aside className="story-aside">
              <div className="aside-card">
                <div className="aside-item">
                  <div className="k">autor</div>
                  <div className="v">Andrew Halkin</div>
                </div>
                <div className="aside-item">
                  <div className="k">typ</div>
                  <div className="v">Bakalářská práce</div>
                </div>
                <div className="aside-item">
                  <div className="k">rok</div>
                  <div className="v accent">2026</div>
                </div>
                <div className="aside-item">
                  <div className="k">algoritmů</div>
                  <div className="v">9 · a&nbsp;roste</div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* 02 MISSION */}
        <section className="block">
          <div className="marker">02 / Mission</div>
          <h2>
            Tři pravidla, <em>žádné výjimky.</em>
          </h2>
          <div className="principles">
            <div className="principle">
              <div className="icon">
                <Layers size={18} />
              </div>
              <div className="pn">
                <span className="accent">A</span> / depth
              </div>
              <h3>
                Hloubka před <em>šířkou</em>
              </h3>
              <p>
                Devět algoritmů vysvětlených pořádně je víc než padesát s&nbsp;třemi řádky textu. Každý má teorii,
                vizualizaci, kód, složitost a&nbsp;kontext.
              </p>
            </div>
            <div className="principle">
              <div className="icon">
                <ShieldCheck size={18} />
              </div>
              <div className="pn">
                <span className="accent">B</span> / honesty
              </div>
              <h3>
                Bez <em>gamifikace</em>
              </h3>
              <p>
                Žádné odznáčky, série, virtuální měna, dopamin-hits. Jen znalosti, vizualizace a&nbsp;čas
                na&nbsp;přemýšlení. Učení nemusí být zábavné — musí být srozumitelné.
              </p>
            </div>
            <div className="principle">
              <div className="icon">
                <BookOpen size={18} />
              </div>
              <div className="pn">
                <span className="accent">C</span> / open
              </div>
              <h3>
                Zdarma <em>navždy</em>
              </h3>
              <p>
                Základ je zdarma a&nbsp;vždy bude. Pro pokročilé funkce existuje Pro tier, ale 95&nbsp;% obsahu je
                dostupné komukoliv bez registrace.
              </p>
            </div>
          </div>
        </section>

        {/* 03 BUILT WITH */}
        <section className="block">
          <div className="marker">03 / Built With</div>
          <h2>
            Postaveno na&nbsp;<em>solidních základech</em>
          </h2>
          <p className="stack-intro">
            Loopa běží na&nbsp;moderním stacku. Žádné magické black boxy — všechno je <em>standardní</em>,
            otestované, otevřené.
          </p>
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
          <h2>
            Co je <em>hotové</em> a&nbsp;co <em>přijde</em>
          </h2>
          <div className="status-grid">
            <div className="status-col done">
              <div className="col-label">hotovo</div>
              <div className="status-list">
                <div className="status-item">
                  <Check className="mk" size={18} /> 9 algoritmů s&nbsp;plnou teorií
                </div>
                <div className="status-item">
                  <Check className="mk" size={18} /> Režim porovnání
                </div>
                <div className="status-item">
                  <Check className="mk" size={18} /> AI asistent
                </div>
                <div className="status-item">
                  <Check className="mk" size={18} /> Česká a&nbsp;anglická verze
                </div>
              </div>
            </div>
            <div className="status-col next">
              <div className="col-label">na cestě</div>
              <div className="status-list">
                <div className="status-item">
                  <span className="mk">—</span> Cvičení s&nbsp;kontrolou
                </div>
                <div className="status-item">
                  <span className="mk">—</span> Mobilní aplikace
                </div>
                <div className="status-item">
                  <span className="mk">—</span> Učitelský režim
                </div>
                <div className="status-item">
                  <span className="mk">—</span> Více algoritmů
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 CONNECT (contacts are placeholders) */}
        <section className="block">
          <div className="marker">05 / Connect</div>
          <h2>
            Máte <em>otázku?</em>
          </h2>
          <p className="connect-text">Našli jste chybu? Máte návrh? Chcete spolupracovat? Ozvěte se.</p>
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
          <h2>
            Připraveni <em>začít?</em>
          </h2>
          <div className="ctas">
            <Link href="/algorithms" className="btn btn-primary btn-lg">
              Procházet algoritmy <ArrowRight size={16} />
            </Link>
            <Link href="/compare" className="btn btn-secondary btn-lg">
              Otevřít porovnání
            </Link>
          </div>
          <div className="signoff">
            <span className="c">{"//"}</span> Loopa · bakalářská práce 2026 · Andrew Halkin
          </div>
        </section>
      </main>

      <AiFab label="Zeptej se" ariaLabel="Máte otázku?" />
    </div>
  );
}

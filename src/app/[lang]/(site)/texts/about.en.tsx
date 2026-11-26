import type { AboutTexts } from "./about";

/* The About page in English (translated from about.cs.tsx). */
export const ABOUT_EN: AboutTexts = {
  metaTitle: "Why Loopa? — About",
  title: "Why Loopa?",
  lede: (
    <>
      Algorithms are the heart of programming. Yet hardly anyone explains them <em>properly.</em>
    </>
  ),
  story: {
    title: (
      <>
        It started with <em>frustration.</em>
      </>
    ),
    paragraphs: [
      <>
        I am a programming student. When I first met algorithms in lectures, most of them felt like noise. Bubble sort?
        Dijkstra? Gradient descent? I heard the words, saw the pseudocode, but <strong>really understanding</strong>{" "}
        what goes on inside — that was another level.
      </>,
      <>
        There are great resources. <em>3Blue1Brown</em> works magic with maths. <em>Visualgo</em> has solid
        visualizations. <em>Brilliant</em> is well designed. But none of it was enough for me. I wanted a tool where I
        can <strong>play</strong> with an algorithm — change the data, compare, ask.
      </>,
      <>So I started building it myself. Loopa is the result.</>,
    ],
    author: "author",
    kind: "type",
    kindValue: "Bachelor thesis",
    year: "year",
    count: "algorithms",
    growing: "and growing",
  },
  mission: {
    title: (
      <>
        Three rules, <em>no exceptions.</em>
      </>
    ),
    principles: [
      {
        title: (
          <>
            Depth before <em>breadth</em>
          </>
        ),
        text: (
          <>
            Nine algorithms explained properly are worth more than fifty with three lines of text. Each has theory, a
            visualization, code, complexity and context.
          </>
        ),
      },
      {
        title: (
          <>
            No <em>gamification</em>
          </>
        ),
        text: (
          <>
            No badges, streaks, virtual currency, dopamine hits. Just knowledge, visualization and time to think.
            Learning does not have to be fun — it has to be clear.
          </>
        ),
      },
      {
        title: (
          <>
            Free <em>forever</em>
          </>
        ),
        text: (
          <>
            The basics are free and always will be. There is a Pro tier for advanced features, but 95&nbsp;% of the
            content is open to anyone without registration.
          </>
        ),
      },
    ],
  },
  stack: {
    title: (
      <>
        Built on <em>solid foundations</em>
      </>
    ),
    intro: (
      <>
        Loopa runs on a modern stack. No magic black boxes — everything is <em>standard</em>, tested, open.
      </>
    ),
  },
  status: {
    title: (
      <>
        What is <em>done</em> and what is <em>coming</em>
      </>
    ),
    done: "done",
    doneItems: [<>9 algorithms with full theory</>, <>Comparison mode</>, <>AI assistant</>, <>Czech and English version</>],
    next: "on the way",
    nextItems: [<>Exercises with checking</>, <>Mobile app</>, <>Teacher mode</>, <>More algorithms</>],
  },
  connect: {
    title: (
      <>
        Have a <em>question?</em>
      </>
    ),
    text: "Found a bug? Have an idea? Want to work together? Get in touch.",
  },
  final: {
    title: (
      <>
        Ready to <em>start?</em>
      </>
    ),
    algorithms: "Browse algorithms",
    compare: "Open the comparison",
    signoff: "Loopa · bachelor thesis 2026 · Andrew Halkin",
  },
  ask: "Ask",
  askAria: "Have a question?",
};

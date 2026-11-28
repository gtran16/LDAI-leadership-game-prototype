/* Canned AI replies for the smoke test. Each reply matches the JSON shape its prompt's OUTPUT spec asks for.
   Matched on each prompt's unique opening line, so generic words like "scenario" never collide. */

const delta = (team, boss, business, wellbeing) => ({ team, boss, business, wellbeing });
const reasons = { team: 'Remi saw the plan before it started.', boss: 'Noor heard about the risk early.', business: 'The Northfield work kept moving.', wellbeing: 'You did not take on the work yourself.' };

const P2A = {
  brief: [
    'Noor asked you to set up a dedicated support group for Northfield Health, a new customer with 40 clinics.',
    'Your team already answers every chat within two hours, and Remi handles most of the hard calendar problems.',
    'Remi usually takes this kind of work because they know the product best, but they are already full this week.'
  ],
  questions: [
    { to: 'Noor, your boss', q: 'How soon does Northfield need this?', a: 'They start in about five weeks. I told leadership we would be ready, so I need a plan from you by Thursday.' },
    { to: 'Remi, senior specialist', q: 'What is on your plate this week?', a: 'I have three calendar bugs open with engineering. I can help, but something else would have to wait.' },
    { to: 'Jan, specialist', q: 'Could the saved replies help here?', a: 'Some of them would work for Northfield. I started looking at it, but I have not finished yet.' },
    { to: 'Ravi, specialist', q: 'How are the phone calls going?', a: 'They are busy but steady. I said yes to two follow-ups this week that I have not done yet.' }
  ],
  hidden_fact: { who: 'Ravi', fact: 'Ravi has agreed to more follow-ups than they can finish.', tell: 'Ravi mentions two follow-ups that are not done yet.' },
  send: { to: 'Noor, your boss', prompt: 'You have decided. How do you share it with Noor? Write the first words you say or send.' },
  key_points: ['Noor promised Northfield support in five weeks.', 'Remi is the expert but is already full.', 'The team is at full capacity.', 'Protect the launch or protect the team.'],
  since_last: null,
  memo: { from: 'Noor, Director of Customer Experience', subject: 'Northfield Health support' }
};

function option(slot, text) {
  return {
    slot, text,
    delta: delta(1, 0, 0, -1),
    reasons,
    counters: ['visibility'],
    outcome: 'The plan started on time. Remi shared one fix with Jan. Noor asked for a short update next week.',
    story: 'You sat down with Remi and wrote the first three steps on a sticky note.',
    protected_and_paid: 'You protected the launch. Your evenings paid for it.',
    carries: 'Remi agreed to teach Jan one calendar fix.',
    tradeoff: { protects: 'The Northfield launch date.', costs: 'Remi has less time for bugs.', who_pays: 'Remi and the engineering team.' },
    opening_to: 'Remi, senior specialist',
    openings: [
      { text: 'Remi, I want to ask you to lead the Northfield setup. It means two bugs wait a week. Does that work for you?', verdict: 'strong', why: 'It names the cost and asks.', pitfall_shift: null, note: '' },
      { text: 'Remi, you are on Northfield starting today.', verdict: 'pitfall', why: 'It announces instead of asking.', pitfall_shift: delta(-1, 0, 0, 0), note: 'Remi went quiet for the rest of the day.' }
    ],
    you_take_on_work: false
  };
}

const P2B = {
  options: [
    option('go', 'Say yes to Noor and ask Remi to lead the setup, so two bugs wait a week.'),
    option('ask', 'Ask Noor for one more week, so the team can finish current work first.'),
    option('grow', 'Ask Jan to lead the setup with Remi as a coach, so Jan learns the product.'),
    option('carry', 'Build the setup yourself in the evenings, so the team keeps its current work.'),
    option('trade', 'Offer Noor a smaller first version, so the team can still meet the two-hour goal.')
  ],
  peer_advice: {
    plan: { question: 'Who on your team could grow from this?', start: 'I would start by asking' },
    tradeoff: { question: 'What waits if you say yes?', start: 'If we take this on, then' },
    opening: { question: 'What does this person need to hear first?', start: 'I want to be honest that' }
  }
};

const check = (status, evidence) => ({ status, evidence, note: '' });
const P3 = {
  checks: { protects: check('named', 'the launch'), cost: check('named', 'two bugs wait'), who_pays: check('partly', 'Remi'), skill_check: check('named', 'Does that work for you?') },
  tradeoff_gap: { gap: false, note: 'The cost named matches the cost that came true.' },
  hidden_fact: { status: 'not_reachable', evidence: '' },
  events: [{ event: 'visibility given', evidence: 'I will tell Noor today' }],
  unknowns: ['Whether engineering can wait a week for the bugs.'],
  style: 'go',
  missing_from_task: [],
  shifts: { team: { delta: 1, reason: 'Remi was asked first.' }, boss: { delta: 0, reason: 'Noor got the plan on time.' }, business: { delta: 0, reason: 'The bugs waited a week.' }, wellbeing: { delta: -1, reason: 'You covered one call yourself.' } },
  you_take_on_work: false,
  you_step_away: false,
  plan_opening_match: { match: 'yes', note: 'The opening starts the plan.' }
};

const P4 = {
  reasons: ['Remi saw that you asked before assigning the work.', 'Noor heard the plan before Thursday.', 'The bugs waited a week, but the launch work started.', 'You covered one call yourself, so your week was longer.'],
  story_entry: 'You asked Remi to lead the Northfield setup and told Noor the same day.\n\nRemi wrote the first checklist, and two bugs waited a week. Engineering asked about them on Friday.',
  plan_line: 'Your plan named who leads the setup, but it left the two waiting bugs without an owner. Another way: ask Jan to lead with Remi as coach, which would have slowed the start.',
  tradeoff_line: 'Your tradeoff named the launch and the cost, but not who handles the engineering questions. Another way: name Remi as the one who pays, and say what you take off their list.',
  delivery_line: 'Your first words said what you decided and asked Remi if it worked for them. Another way: ask Remi what would make the week workable, which takes longer.'
};

const P7 = {
  note_header: '*This check-in was written by AI from your six decisions in the game. It can misread what you meant or miss context, so treat it as one reading. Your own judgment, and real work with real people, decide what you take from it.*',
  worked: 'You asked Remi and Jan before assigning work in two decisions, and both times the work started on time.',
  work_on: 'You often left the person who pays without a plan for support, which will matter more with a larger team.',
  keep: 'You told Noor about risks before they asked.',
  spend: 'You spent your own wellbeing in the second decision and went back for it in the fourth.',
  add: 'Say who carries the cost and what help they get, in the same sentence.',
  watching: [
    { who: 'Noor, your boss', cared: 'A smooth Northfield launch.', saw: 'You raised the timeline risk early.' },
    { who: 'Your team', cared: 'A fair split of work.', saw: 'You asked Remi before assigning the setup.' },
    { who: 'Teo, your peer', cared: 'Fast help for big customers.', saw: 'You offered a smaller first version.' }
  ],
  grow: [{ skill: 'tradeoff', why: 'In decisions 2 and 4, try naming who pays and how you will support them.' }],
  calibration: 'You called yourself ready with support, and the check-in says the same.',
  story: 'In the weeks after the check-in, Noor asked you to join the Northfield planning call. You brought Jan with you. Remi asked to teach the next calendar fix to the whole team.'
};

const P8 = { protects: { status: 'named', evidence: 'the customer fix' }, cost: { status: 'partly', evidence: 'the report waits' }, who_pays: { status: 'missing', evidence: '' }, delivery: { status: 'partly', evidence: 'I would fix the customer issue first' } };

const ROUTES = [
  [/You are the scenario builder for a leadership decision game/, P2A],
  [/You are the decision builder for a leadership decision game/, P2B],
  [/You read one answer from a player and report what it did/, P3],
  [/You write what the player reads after a decision/, P4],
  [/You are writing the end-of-level readiness check-in/, P7],
  [/You read one short written answer from a player of a leadership decision game/, P8]
];

module.exports = { ROUTES };

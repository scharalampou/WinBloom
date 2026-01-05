
export type ExampleWin = {
  user: string;
  win: string;
  flowers: number;
};

const wittyUsers: string[] = [
  "A fellow gardener",
  "A blooming soul",
  "A persistent sprout",
  "A happy plant parent",
  "A dewdrop collector",
  "A sunshine seeker",
  "A growth enthusiast",
  "A quiet achiever",
  "A patient bloomer",
  "A cultivator of joy",
];

const wins: string[] = [
  "Successfully assembled IKEA furniture without leftover screws.",
  "Remembered to water all the plants before they staged a protest.",
  "Parallel parked on a busy street in one go. Nailed it.",
  "Found a forgotten $5 bill in a jacket pocket.",
  "Woke up 2 minutes before my alarm, feeling strangely powerful.",
  "Ate a vegetable that wasn't a potato fry.",
  "Held a door open for someone and got a 'thank you'.",
  "Resisted the urge to buy something I didn't need online.",
  "My code compiled on the first try.",
  "Finally unsubscribed from a dozen promotional emails.",
  "Made it through a meeting that could have been an email.",
  "Chose to take the stairs instead of the elevator.",
  "My favorite song came on the radio right as I started the car.",
  "Managed to not kill my sourdough starter this week.",
  "Fixed a household item with a YouTube tutorial.",
  "Had a perfectly ripe avocado.",
  "Put on 'real' pants today, not just sweatpants.",
  "Finished a tube of chapstick without losing it.",
  "Didn't hit snooze this morning. A modern miracle.",
  "My pet did something hilarious and I caught it on camera."
];

export const exampleWins: ExampleWin[] = wins.map((win) => ({
  win,
  user: wittyUsers[Math.floor(Math.random() * wittyUsers.length)],
  flowers: Math.floor(Math.random() * 50) + 1, // Random number of flowers from 1 to 50
}));

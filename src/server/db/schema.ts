import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  boolean,
  pgTable,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { INITIAL_RATING } from "~/lib/eloCalculator";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `picklejar_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const players = createTable(
  "player",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    screenName: varchar("screenName", { length: 255 }).notNull(),
    realName: varchar("realName", { length: 255 }),
    hideRealName: boolean("hideRealName"),
    skillLevel: varchar("skillLevel", { length: 50 }),
    paddleBrand: varchar("paddleBrand", { length: 100 }),
    paddlePreference: varchar("paddlePreference", { length: 100 }),
    plays: varchar("plays", { length: 50 }),
    homeCourt: jsonb("homeCourt"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (player) => ({
    userIdIdx: index("player_userId_idx").on(player.userId),
    screenNameIdx: index("player_screenName_idx").on(player.screenName),
  }),
);

export const playersRelations = relations(players, ({ one }) => ({
  user: one(users, {
    fields: [players.userId],
    references: [users.id],
  }),
}));

export const matches = createTable(
  "match",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    gameType: varchar("gameType", { length: 50 }).notNull(),
    date: timestamp("date", { withTimezone: true }).notNull(),
    time: varchar("time", { length: 10 }),
    location: jsonb("location").notNull(),
    outcome: varchar("outcome", { length: 10 }).notNull(),
    scores: jsonb("scores").notNull(),
    participants: jsonb("participants").notNull(),
    verified: boolean("verified").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (match) => ({
    dateIdx: index("match_date_idx").on(match.date),
  }),
);

export const locations = createTable(
  "location",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull().unique(),
    createdBy: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (location) => ({
    nameIdx: index("location_name_idx").on(location.name),
  }),
);

export const locationsRelations = relations(locations, ({ one }) => ({
  creator: one(users, {
    fields: [locations.createdBy],
    references: [users.id],
  }),
}));

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const playerStats = createTable(
  "playerStats",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    playerId: varchar("playerId", { length: 255 })
      .notNull()
      .references(() => players.id),
    totalMatches: integer("totalMatches")
      .notNull()
      .$default(
        () =>
          sql`(SELECT COUNT(*) FROM matches WHERE ${players.id} = ANY(matches.participants))`,
      ),
    wins: integer("wins")
      .notNull()
      .default(0)
      .$default(
        () => sql<number>`(
        SELECT COUNT(*) FROM matches 
        WHERE ${players.id} = ANY(matches.participants)
          AND (
            (matches.participants[1] = ${players.id} OR matches.participants[2] = ${players.id}) AND matches.outcome = 'home'
            OR
            (matches.participants[3] = ${players.id} OR matches.participants[4] = ${players.id}) AND matches.outcome = 'away'
          )
      )`,
      ),
    losses: integer("losses")
      .notNull()
      .default(0)
      .$default(
        () => sql<number>`(
        SELECT COUNT(*) FROM matches 
        WHERE ${players.id} = ANY(matches.participants)
          AND (
            (matches.participants[1] = ${players.id} OR matches.participants[2] = ${players.id}) AND matches.outcome = 'away'
            OR
            (matches.participants[3] = ${players.id} OR matches.participants[4] = ${players.id}) AND matches.outcome = 'home'
          )
      )`,
      ),
    eloRating: integer("eloRating").notNull().default(INITIAL_RATING),
    totalPoints: integer("totalPoints").notNull().default(0),
    lastUpdated: timestamp("lastUpdated", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (playerStat) => ({
    playerIdIdx: index("playerStats_playerId_idx").on(playerStat.playerId),
  }),
);

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  player: one(players, {
    fields: [playerStats.playerId],
    references: [players.id],
  }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// export const posts = createTable(
//   "post",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }),
//     createdById: varchar("createdById", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: timestamp("created_at", { withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt", { withTimezone: true }),
//   },
//   (example) => ({
//     createdByIdIdx: index("createdById_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   }),
// );

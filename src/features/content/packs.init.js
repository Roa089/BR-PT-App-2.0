// src/features/content/packs.init.js
import { registerPack } from "./content.registry.js";

import { packSmalltalk } from "../../packs/pack_01_smalltalk.js";
import { packTravel } from "../../packs/pack_02_travel.js";
import { packFood } from "../../packs/pack_03_food.js";
import { packWork } from "../../packs/pack_04_work.js";
import { packHealth } from "../../packs/pack_05_health.js";
import { packDebate } from "../../packs/pack_06_debate_c2.js";

import { packFamily } from "../../packs/pack_07_family.js";
import { packFeelings } from "../../packs/pack_08_feelings.js";
import { packConflict } from "../../packs/pack_09_conflict.js";
import { packAuthorities } from "../../packs/pack_10_authorities.js";
import { packFinance } from "../../packs/pack_11_finance.js";
import { packTech } from "../../packs/pack_12_tech.js";
import { packNewsOpinion } from "../../packs/pack_13_news_opinion.js";
import { packCulture } from "../../packs/pack_14_culture.js";
import { packFriendsDating } from "../../packs/pack_15_friends_dating.js";
import { packHousing } from "../../packs/pack_16_housing.js";
import { packEmergencies } from "../../packs/pack_17_emergencies.js";
import { packHumorIdioms } from "../../packs/pack_18_humor_idioms.js";
import { packNegotiation } from "../../packs/pack_19_negotiation.js";
import { packPresenting } from "../../packs/pack_20_presenting.js";

const ALL_PACKS = [
  packSmalltalk,
  packTravel,
  packFood,
  packWork,
  packHealth,
  packDebate,
  packFamily,
  packFeelings,
  packConflict,
  packAuthorities,
  packFinance,
  packTech,
  packNewsOpinion,
  packCulture,
  packFriendsDating,
  packHousing,
  packEmergencies,
  packHumorIdioms,
  packNegotiation,
  packPresenting
];

export function initPacks() {
  ALL_PACKS.forEach((p) => {
    try {
      if (p) registerPack(p);
    } catch (e) {
      console.warn("[Packs] register failed:", p?.key, e);
    }
  });
}
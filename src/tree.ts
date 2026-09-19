import { ContributionWeek, calculateStreak } from "./github";
import { WeatherCondition } from "./weather";

export const BLOCK_PIXELS = 16;
export const PIXEL_SCALE = 3.0;
export const BLOCK_SIZE = BLOCK_PIXELS * PIXEL_SCALE; // 48px
export const MAX_FLOWERS = 4;
export const MAX_APPLES = 4;
export const MAX_GOLDEN_APPLES = 4;

export type TreeType =
  | "oak"
  | "sakura"
  | "spruce"
  | "birch"
  | "jungle"
  | "dark_oak"
  | "acacia"
  | "mangrove"
  | "crimson"
  | "warped";

export interface LeafBlockPos {
  gridX: number; // relative to trunk (-2, -1, 0, 1, 2)
  gridY: number; // -3 (top peak), -2, -1, 0 (bottom tier)
  x: number;
  y: number;
  size: number;
  commitCount: number;
  commitLevel: number; // 0 (dry/dormant), 1 (light), 2 (medium), 3 (lush), 4 (max emerald)
  weekIndex: number;
}

export interface FlowerPos {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "poppy" | "dandelion" | "tulip" | "sakura";
  side: "left" | "right";
}

export interface ApplePos {
  x: number;
  y: number;
  size: number;
  gridX: number;
}

export interface GoldenApplePos {
  x: number;
  y: number;
  size: number;
  side: "left" | "right";
}

export type OreType = "diamond" | "emerald" | "gold" | "redstone" | "lapis" | "netherite";

export interface OreBlockPos {
  x: number;
  y: number;
  type: OreType;
}

export type PetType = "wolf" | "fox" | "cat" | "parrot";

export interface PetPos {
  x: number;
  y: number;
  type: PetType;
  state: "sitting" | "sleeping" | "standing";
}

export type FarmerMood = "sad" | "dancing" | "watering";

export interface FarmerPos {
  x: number;
  y: number;
  mood: FarmerMood;
}

export interface CampfirePos {
  x: number;
  y: number;
}

export type ChestType = "wood" | "iron" | "gold" | "diamond" | "ender";

export interface ChestPos {
  x: number;
  y: number;
  type: ChestType;
}

export type SeasonalEvent = "halloween" | "holiday" | "fireworks" | "none";

export interface HolidayGiftPos {
  x: number;
  y: number;
  size: number;
  boxColor: string;
  ribbonColor: string;
}

export interface JackOLanternPos {
  x: number;
  y: number;
}

export interface BeePos {
  x: number;
  y: number;
}

export interface BeehivePos {
  x: number;
  y: number;
  side: "left" | "right";
}

export interface SignpostPos {
  x: number;
  y: number;
  streak: number;
}

export type TreeGrowthMode = "auto" | "standard" | "expanded";

export interface TreeLayout {
  width: number;
  height: number;
  groundY: number;
  trunkX: number;
  treeType: TreeType;
  trunkBlocks: { x: number; y: number; size: number }[];
  leafBlocks: LeafBlockPos[];
  flowers: FlowerPos[];
  apples: ApplePos[];
  goldenApples: GoldenApplePos[];
  oreBlocks: OreBlockPos[];
  bee?: BeePos;
  beehive?: BeehivePos;
  signpost?: SignpostPos;
  pet?: PetPos;
  farmer?: FarmerPos;
  campfire?: CampfirePos;
  chest?: ChestPos;
  seasonalEvent?: SeasonalEvent;
  holidayGifts?: HolidayGiftPos[];
  jackOLantern?: JackOLanternPos;
  totalCommits: number;
  openPRs: number;
  mergedPRs: number;
  assignedPRs: number;
  currentStreak: number;
  weather: WeatherCondition;
  isOwner?: boolean;
  isContributor?: boolean;
  growthStage?: "standard" | "expanded";
  isExpanded?: boolean;
}

export const STANDARD_CANOPY_SLOTS: { gridX: number; gridY: number }[] = [
  // Tier 0 (Bottom tier)
  { gridX: -2, gridY: 0 },
  { gridX: -1, gridY: 0 },
  { gridX: 0, gridY: 0 },
  { gridX: 1, gridY: 0 },
  { gridX: 2, gridY: 0 },
  // Tier -1 (Lower mid)
  { gridX: -2, gridY: -1 },
  { gridX: -1, gridY: -1 },
  { gridX: 0, gridY: -1 },
  { gridX: 1, gridY: -1 },
  { gridX: 2, gridY: -1 },
  // Tier -2 (Upper mid)
  { gridX: -1, gridY: -2 },
  { gridX: 0, gridY: -2 },
  { gridX: 1, gridY: -2 },
  // Tier -3 (Top peak)
  { gridX: 0, gridY: -3 },
];

export const EXPANDED_CANOPY_SLOTS: { gridX: number; gridY: number }[] = [
  // Tier 0 (Bottom tier) - 5 blocks
  { gridX: -2, gridY: 0 },
  { gridX: -1, gridY: 0 },
  { gridX: 0, gridY: 0 },
  { gridX: 1, gridY: 0 },
  { gridX: 2, gridY: 0 },
  // Tier -1 (Lower mid) - 7 blocks (expanded outwards)
  { gridX: -3, gridY: -1 },
  { gridX: -2, gridY: -1 },
  { gridX: -1, gridY: -1 },
  { gridX: 0, gridY: -1 },
  { gridX: 1, gridY: -1 },
  { gridX: 2, gridY: -1 },
  { gridX: 3, gridY: -1 },
  // Tier -2 (Upper mid) - 5 blocks (widened canopy)
  { gridX: -2, gridY: -2 },
  { gridX: -1, gridY: -2 },
  { gridX: 0, gridY: -2 },
  { gridX: 1, gridY: -2 },
  { gridX: 2, gridY: -2 },
  // Tier -3 (High crown) - 3 blocks (broad upper crown)
  { gridX: -1, gridY: -3 },
  { gridX: 0, gridY: -3 },
  { gridX: 1, gridY: -3 },
  // Tier -4 (Apex peak crown) - 1 block (taller majestic apex)
  { gridX: 0, gridY: -4 },
];

export const CANOPY_SLOTS = STANDARD_CANOPY_SLOTS;

/**
 * Maps commit counts to GitHub contribution intensity level (0 to 4)
 */
export function getCommitLevel(commits: number): number {
  if (commits <= 0) return 0;
  if (commits <= 4) return 1;
  if (commits <= 14) return 2;
  if (commits <= 29) return 3;
  return 4;
}

export function buildTreeLayout(
  weeks: ContributionWeek[],
  totalCommitsArg?: number,
  opts: {
    width?: number;
    height?: number;
    weather?: WeatherCondition;
    treeType?: TreeType;
    growth?: TreeGrowthMode;
    showSignpost?: boolean;
    showBee?: boolean;
    isOwner?: boolean;
    isContributor?: boolean;
    pet?: "auto" | "wolf" | "fox" | "cat" | "parrot" | "none";
    showFarmer?: boolean | "auto";
    farmerMood?: "auto" | "sad" | "dancing" | "watering";
    showCampfire?: boolean | "auto";
    showChest?: boolean | "auto";
    event?: "auto" | "halloween" | "holiday" | "fireworks" | "none";
    currentDate?: Date;
    streak?: number;
    openPRs?: number;
    mergedPRs?: number;
    assignedPRs?: number;
  } = {}
): TreeLayout {
  const width = opts.width ?? 920;
  const height = opts.height ?? 460;
  const weather = opts.weather ?? { type: "sunny", description: "Clear sky" };
  const treeType = opts.treeType ?? "oak";
  const bs = BLOCK_SIZE; // 48px

  let computedCommits = 0;
  let computedOpenPRs = 0;
  let computedMergedPRs = 0;
  let computedAssignedPRs = 0;

  for (const w of weeks) {
    computedCommits += w.total || 0;
    computedOpenPRs += w.openPRs || 0;
    computedMergedPRs += w.mergedPRs || 0;
    computedAssignedPRs += w.assignedPRs || 0;
  }

  const totalCommits = totalCommitsArg !== undefined ? totalCommitsArg : computedCommits;
  const totalOpenPRs = opts.openPRs !== undefined ? opts.openPRs : computedOpenPRs;
  const totalMergedPRs = opts.mergedPRs !== undefined ? opts.mergedPRs : computedMergedPRs;
  const totalAssignedPRs = opts.assignedPRs !== undefined ? opts.assignedPRs : computedAssignedPRs;
  const currentStreak = opts.streak !== undefined ? opts.streak : calculateStreak(weeks);

  // Determine Growth & Canopy Fullness
  const rawGrowth = opts.growth ?? "auto";
  const recent14Weeks = weeks.slice(-14);
  const activeWeeksCount = recent14Weeks.filter((w) => (w?.total || 0) > 0).length;
  
  // Baseline greenness level derived from overall developer activity
  const baselineLevel =
    totalCommits >= 300 ? 3 : totalCommits >= 100 ? 2 : totalCommits >= 25 ? 1 : 0;

  // Leaves are considered full if activity spans consistently across weeks or commit milestones are met
  const isLeavesFull =
    rawGrowth === "expanded" ||
    (rawGrowth === "auto" &&
      (totalCommits >= 50 || currentStreak >= 14 || (recent14Weeks.length >= 14 && activeWeeksCount >= 10)));

  const growthStage: "standard" | "expanded" = isLeavesFull ? "expanded" : "standard";
  const isExpanded = growthStage === "expanded";

  // Height and Canopy Slots based on growth stage
  const trunkHeightBlocks = isExpanded ? 4 : 3; // Gains 1 log height when leaves are full!
  const canopySlots = isExpanded ? EXPANDED_CANOPY_SLOTS : STANDARD_CANOPY_SLOTS;

  const groundY = height - 55; // Ground surface with ample headroom
  const trunkX = Math.floor((width - bs) / 2); // Centered trunk
  const canopyBottomY = groundY - trunkHeightBlocks * bs;
  const trunkStartY = canopyBottomY;

  // 1. Trunk (3 or 4 stacked log blocks directly on grass)
  const trunkBlocks: { x: number; y: number; size: number }[] = [];
  for (let i = 0; i < trunkHeightBlocks; i++) {
    trunkBlocks.push({
      x: trunkX,
      y: trunkStartY + i * bs,
      size: bs,
    });
  }

  // 2. Canopy Leaf Blocks (14 standard or 21 expanded blocks with commit-driven green levels)
  const paddedWeeks: ContributionWeek[] = [...weeks];
  while (paddedWeeks.length < canopySlots.length) {
    paddedWeeks.unshift({
      days: [],
      total: 0,
      openPRs: 0,
      mergedPRs: 0,
      assignedPRs: 0,
    });
  }
  const recentWeeks = paddedWeeks.slice(-canopySlots.length);

  const leafBlocks: LeafBlockPos[] = canopySlots.map((slot, idx) => {
    const x = trunkX + slot.gridX * bs;
    const y = canopyBottomY + slot.gridY * bs;

    const week = recentWeeks[idx];
    const rawCommitCount = week ? week.total : 0;
    const commitLevel = getCommitLevel(rawCommitCount);

    return {
      gridX: slot.gridX,
      gridY: slot.gridY,
      x,
      y,
      size: bs,
      commitCount: rawCommitCount,
      commitLevel,
      weekIndex: idx,
    };
  });

  // 3. Red Apples 🍎 for Merged PRs: Hanging under canopy leaves (Max 4)
  const apples: ApplePos[] = [];
  if (totalMergedPRs > 0) {
    const appleSlots = [
      { gridX: -1, offsetX: 10 },
      { gridX: 1, offsetX: 20 },
      { gridX: -2, offsetX: 14 },
      { gridX: 2, offsetX: 14 },
    ];

    const count = Math.min(totalMergedPRs, MAX_APPLES);
    for (let a = 0; a < count; a++) {
      const slot = appleSlots[a];
      const targetBlock =
        leafBlocks.find((b) => b.gridY === 0 && b.gridX === slot.gridX) || leafBlocks[0];
      apples.push({
        x: targetBlock.x + slot.offsetX,
        y: targetBlock.y + bs - 2,
        size: 20,
        gridX: slot.gridX,
      });
    }
  }

  // 5. Underground Ore Blocks 💎 (Embedded in dirt layer: all at groundY + 24 with uniform, balanced spacing)
  const oreBlocks: OreBlockPos[] = [];
  const leftOreStart = Math.max(24, Math.round(trunkX * 0.18));
  const leftOreEnd = Math.max(leftOreStart + 60, trunkX - 32);
  const leftOreSpan = leftOreEnd - leftOreStart;

  const rightOreStart = trunkX + bs + 32;
  const rightOreEnd = Math.min(width - 24, rightOreStart + leftOreSpan);
  const rightOreSpan = rightOreEnd - rightOreStart;
  
  if (opts.isOwner === true) {
    oreBlocks.push({ x: leftOreStart, y: groundY + 24, type: "netherite" });
  }
  if (currentStreak >= 7 || totalCommits >= 50) {
    oreBlocks.push({ x: Math.round(leftOreStart + 0.50 * leftOreSpan), y: groundY + 24, type: "gold" });
  }
  if (totalCommits >= 25 || totalMergedPRs >= 1) {
    oreBlocks.push({ x: leftOreEnd, y: groundY + 24, type: "diamond" });
  }
  if (totalCommits >= 100 || leafBlocks.some((b) => b.commitLevel === 4)) {
    oreBlocks.push({ x: rightOreStart, y: groundY + 24, type: "emerald" });
  }
  if (opts.isContributor === true) {
    oreBlocks.push({ x: Math.round(rightOreStart + 0.50 * rightOreSpan), y: groundY + 24, type: "lapis" });
  }
  if (totalMergedPRs >= 2 || (totalOpenPRs + totalMergedPRs + totalAssignedPRs) >= 3 || currentStreak >= 14) {
    oreBlocks.push({ x: rightOreEnd, y: groundY + 24, type: "redstone" });
  }

  // 6. Wooden Stat Signpost 🪧 (Placed at the midpoint of the left flank for optimal balance)
  const signpostX = Math.round(trunkX * 0.42);
  const signpost: SignpostPos | undefined =
    opts.showSignpost !== false ? { x: signpostX, y: groundY - 22, streak: currentStreak } : undefined;

  // 7. Minecraft Beehive 🍯 & Bee 🐝
  let beehive: BeehivePos | undefined;
  if (currentStreak >= 3 || totalCommits >= 25) {
    beehive = { x: trunkX + bs - 2, y: trunkStartY + bs + 28, side: "right" };
  }

  let bee: BeePos | undefined;
  if (opts.showBee !== false && (currentStreak >= 1 || totalCommits > 0)) {
    bee = { x: trunkX - 44, y: canopyBottomY + 28 };
  }

  // 8. Minecraft Companion Pet 🐾 (Wolf 🐺, Fox 🦊, Cat 🐱, Parrot 🦜 on Left Side of trunk)
  let pet: PetPos | undefined;
  const rawPetOpt = opts.pet ?? "auto";
  const isNight = weather.type === "night" || weather.isDay === false;

  if (rawPetOpt !== "none") {
    let chosenType: PetType | undefined;
    if (rawPetOpt === "wolf" || rawPetOpt === "fox" || rawPetOpt === "cat" || rawPetOpt === "parrot") {
      chosenType = rawPetOpt;
    } else if (rawPetOpt === "auto") {
      if (treeType === "jungle") {
        chosenType = "parrot";
      } else if (currentStreak >= 14) {
        chosenType = "wolf";
      } else if (currentStreak >= 7) {
        chosenType = "fox";
      } else if (currentStreak >= 3 || totalCommits >= 25) {
        chosenType = "cat";
      } else if (totalCommits > 0) {
        chosenType = "fox";
      }
    }

    if (chosenType) {
      const petState =
        chosenType === "fox"
          ? isNight
            ? "standing"
            : "sleeping"
          : "sitting";
      pet = {
        x: trunkX - 34, // Sits comfortably next to trunk on the left
        y: groundY - (chosenType === "fox" && petState === "sleeping" ? 12 : chosenType === "parrot" ? 16 : 18),
        type: chosenType,
        state: petState,
      };
    }
  }

  // 9. Minecraft Farmer Under Tree 👨‍🌾 (Default on right side of trunk)
  let farmer: FarmerPos | undefined;
  const recent2WeeksCommits = recentWeeks.slice(-2).reduce((acc, w) => acc + (w ? w.total : 0), 0);
  const showFarmerOpt = opts.showFarmer ?? true;

  if (showFarmerOpt !== false) {
    let mood: FarmerMood = "watering";
    const rawMoodOpt = opts.farmerMood ?? "auto";

    if (rawMoodOpt === "sad" || rawMoodOpt === "dancing" || rawMoodOpt === "watering") {
      mood = rawMoodOpt;
    } else {
      const isDry = totalCommits === 0 || leafBlocks.every((l) => l.commitLevel === 0);
      const isFlourishing = totalCommits >= 30 || currentStreak >= 7 || recent2WeeksCommits >= 10;

      if (isDry) {
        mood = "sad";
      } else if (isFlourishing) {
        mood = "dancing";
      } else {
        mood = "watering";
      }
    }

    farmer = {
      x: trunkX + bs + 10, // Stands cleanly on right side of trunk
      y: groundY - 24, // Feet resting flush on grass surface
      mood,
    };
  }

  // 10. Milestone Treasure Chest 📦
  let chest: ChestPos | undefined;
  const showChestOpt = opts.showChest ?? "auto";
  if (showChestOpt !== false) {
    let chestType: ChestType | undefined;
    if (totalCommits >= 500) {
      chestType = "ender";
    } else if (totalCommits >= 300) {
      chestType = "diamond";
    } else if (totalCommits >= 150) {
      chestType = "gold";
    } else if (totalCommits >= 50) {
      chestType = "iron";
    } else if (totalCommits >= 15 || showChestOpt === true) {
      chestType = "wood";
    }

    if (chestType) {
      const chestX = farmer ? trunkX + bs + 48 : trunkX + bs + 24;
      chest = { x: chestX, y: groundY - 16, type: chestType };
    }
  }

  // 11. Roasting Campfire 🔥 (Active sprint mode)
  let campfire: CampfirePos | undefined;
  const showCampfireOpt = opts.showCampfire ?? "auto";
  const shouldShowCampfire =
    showCampfireOpt === true ||
    (showCampfireOpt === "auto" && (recent2WeeksCommits >= 12 || currentStreak >= 10 || totalCommits >= 60));

  if (shouldShowCampfire) {
    const campfireX = (farmer && chest)
      ? trunkX + bs + 98
      : (farmer || chest)
      ? trunkX + bs + 76
      : trunkX + bs + 44;
    campfire = { x: campfireX, y: groundY - 16 };
  }

  // 12. Seasonal Holiday / Event Modes 🎃🎄🎆
  const curDate = opts.currentDate ?? new Date();
  const curMonth = curDate.getMonth(); // 0 = Jan, 9 = Oct, 11 = Dec
  const eventOpt = opts.event ?? "auto";

  let seasonalEvent: SeasonalEvent = "none";
  if (eventOpt === "halloween" || eventOpt === "holiday" || eventOpt === "fireworks" || eventOpt === "none") {
    seasonalEvent = eventOpt;
  } else if (eventOpt === "auto") {
    if (curMonth === 9) {
      seasonalEvent = "halloween";
    } else if (curMonth === 11) {
      seasonalEvent = "holiday";
    } else if (curMonth === 0) {
      seasonalEvent = "fireworks";
    }
  }

  let jackOLantern: JackOLanternPos | undefined;
  let holidayGifts: HolidayGiftPos[] | undefined;

  if (seasonalEvent === "halloween") {
    const jackX = campfire ? Math.max(24, signpost ? signpostX - 42 : trunkX - 180) : trunkX + bs + 144;
    jackOLantern = { x: jackX, y: groundY - 16 };
  } else if (seasonalEvent === "holiday") {
    const giftBaseX = chest ? chest.x + 28 : farmer ? farmer.x + 36 : trunkX + bs + 24;
    holidayGifts = [
      { x: giftBaseX, y: groundY - 12, size: 12, boxColor: "#d32f2f", ribbonColor: "#388e3c" },
      { x: giftBaseX + 13, y: groundY - 10, size: 10, boxColor: "#fbc02d", ribbonColor: "#d32f2f" },
    ];
  }

  // 13. Dynamic Non-Overlapping & Proportional Lawn Placement (Flowers 🌸 & Golden Apples 🍏✨)
  const leftObstacles: [number, number][] = [];
  const rightObstacles: [number, number][] = [];

  if (signpost) leftObstacles.push([signpost.x - 14, signpost.x + 50]);
  if (pet) leftObstacles.push([pet.x - 16, pet.x + 24]);
  if (farmer) rightObstacles.push([farmer.x - 14, farmer.x + 20]);
  if (chest) rightObstacles.push([chest.x - 12, chest.x + 22]);
  if (campfire) rightObstacles.push([campfire.x - 12, campfire.x + 22]);
  if (jackOLantern) {
    if (jackOLantern.x < trunkX) {
      leftObstacles.push([jackOLantern.x - 12, jackOLantern.x + 22]);
    } else {
      rightObstacles.push([jackOLantern.x - 12, jackOLantern.x + 22]);
    }
  }
  if (holidayGifts) {
    for (const g of holidayGifts) {
      if (g.x < trunkX) {
        leftObstacles.push([g.x - 8, g.x + g.size + 8]);
      } else {
        rightObstacles.push([g.x - 8, g.x + g.size + 8]);
      }
    }
  }

  function getFreeSegments(
    startBound: number,
    endBound: number,
    obstacles: [number, number][]
  ): { start: number; end: number; length: number }[] {
    let segs: { start: number; end: number }[] = [{ start: startBound, end: endBound }];
    for (const [obsStart, obsEnd] of obstacles) {
      const nextSegs: { start: number; end: number }[] = [];
      for (const seg of segs) {
        if (obsEnd <= seg.start || obsStart >= seg.end) {
          nextSegs.push(seg);
        } else {
          if (obsStart > seg.start + 16) {
            nextSegs.push({ start: seg.start, end: Math.min(seg.end, obsStart) });
          }
          if (obsEnd < seg.end - 16) {
            nextSegs.push({ start: Math.max(seg.start, obsEnd), end: seg.end });
          }
        }
      }
      segs = nextSegs;
    }
    return segs
      .map((s) => ({ start: s.start, end: s.end, length: s.end - s.start }))
      .filter((s) => s.length >= 18);
  }

  const leftSegments = getFreeSegments(24, trunkX - 10, leftObstacles);
  const rightSegments = getFreeSegments(trunkX + bs + 8, width - 24, rightObstacles);

  function generateSlotsForSide(
    segments: { start: number; end: number; length: number }[],
    count: number
  ): number[] {
    if (count <= 0 || segments.length === 0) return [];

    if (segments.length === 1) {
      const seg = segments[0];
      const slots: number[] = [];
      for (let i = 1; i <= count; i++) {
        slots.push(Math.round(seg.start + (i - 0.5) * (seg.length / count)));
      }
      return slots;
    }

    // Distribute slots across segments respecting capacity
    const segmentCounts = segments.map(() => 0);
    let remaining = count;

    const segIndicesByLength = segments
      .map((s, idx) => ({ idx, length: s.length }))
      .sort((a, b) => b.length - a.length);

    while (remaining > 0) {
      let allocatedAny = false;
      for (const { idx } of segIndicesByLength) {
        const seg = segments[idx];
        const currentCount = segmentCounts[idx];
        const cap = Math.max(1, Math.floor((seg.length + 2) / 20));
        if (currentCount < cap && remaining > 0) {
          segmentCounts[idx]++;
          remaining--;
          allocatedAny = true;
        }
      }
      if (!allocatedAny) {
        segmentCounts[segIndicesByLength[0].idx] += remaining;
        remaining = 0;
      }
    }

    const slots: number[] = [];
    segments.forEach((seg, idx) => {
      const segCount = segmentCounts[idx];
      if (segCount > 0) {
        for (let i = 1; i <= segCount; i++) {
          slots.push(Math.round(seg.start + (i - 0.5) * (seg.length / segCount)));
        }
      }
    });

    return slots.sort((a, b) => a - b);
  }

  const flowerTypes: ("poppy" | "dandelion" | "tulip" | "sakura")[] =
    treeType === "sakura"
      ? ["sakura", "poppy", "dandelion", "tulip"]
      : ["poppy", "dandelion", "tulip", "poppy"];

  const flowerCount = Math.min(MAX_FLOWERS, totalOpenPRs);
  const goldenAppleCount = Math.min(MAX_GOLDEN_APPLES, totalAssignedPRs);
  const totalItems = flowerCount + goldenAppleCount;

  type GroundItem = { kind: "flower"; type: "poppy" | "dandelion" | "tulip" | "sakura" } | { kind: "goldenApple" };

  const rawFlowers: GroundItem[] = [];
  for (let i = 0; i < flowerCount; i++) {
    rawFlowers.push({ kind: "flower", type: flowerTypes[i % flowerTypes.length] });
  }

  const rawApples: GroundItem[] = [];
  for (let i = 0; i < goldenAppleCount; i++) {
    rawApples.push({ kind: "goldenApple" });
  }

  // Allocate items between Left and Right lawns
  const numLeft = Math.min(4, Math.floor(totalItems / 2));
  const numRight = totalItems - numLeft;

  let leftFlowerCount = Math.min(flowerCount, Math.round((flowerCount / Math.max(1, totalItems)) * numLeft));
  let leftAppleCount = numLeft - leftFlowerCount;
  if (leftAppleCount > goldenAppleCount) {
    leftAppleCount = goldenAppleCount;
    leftFlowerCount = numLeft - leftAppleCount;
  }
  const rightFlowerCount = flowerCount - leftFlowerCount;
  const rightAppleCount = goldenAppleCount - leftAppleCount;

  // Interleave flowers and apples for left side
  const leftItems: GroundItem[] = [];
  const maxLeft = Math.max(leftFlowerCount, leftAppleCount);
  for (let i = 0; i < maxLeft; i++) {
    if (i < leftFlowerCount && rawFlowers.length > 0) leftItems.push(rawFlowers.shift()!);
    if (i < leftAppleCount && rawApples.length > 0) leftItems.push(rawApples.shift()!);
  }

  // Interleave flowers and apples for right side
  const rightItems: GroundItem[] = [];
  const maxRight = Math.max(rightFlowerCount, rightAppleCount);
  for (let i = 0; i < maxRight; i++) {
    if (i < rightAppleCount && rawApples.length > 0) rightItems.push(rawApples.shift()!);
    if (i < rightFlowerCount && rawFlowers.length > 0) rightItems.push(rawFlowers.shift()!);
  }

  const leftSlots = generateSlotsForSide(leftSegments, leftItems.length);
  const rightSlots = generateSlotsForSide(rightSegments, rightItems.length);

  const flowers: FlowerPos[] = [];
  const goldenApples: GoldenApplePos[] = [];

  leftItems.forEach((item, idx) => {
    const slotX = leftSlots[idx];
    if (slotX !== undefined) {
      if (item.kind === "flower") {
        flowers.push({
          x: slotX,
          y: groundY - 21,
          width: 18,
          height: 24,
          type: item.type,
          side: "left",
        });
      } else {
        goldenApples.push({
          x: slotX,
          y: groundY - 18,
          size: 18,
          side: "left",
        });
      }
    }
  });

  rightItems.forEach((item, idx) => {
    const slotX = rightSlots[idx];
    if (slotX !== undefined) {
      if (item.kind === "flower") {
        flowers.push({
          x: slotX,
          y: groundY - 21,
          width: 18,
          height: 24,
          type: item.type,
          side: "right",
        });
      } else {
        goldenApples.push({
          x: slotX,
          y: groundY - 18,
          size: 18,
          side: "right",
        });
      }
    }
  });

  return {
    width,
    height,
    groundY,
    trunkX,
    treeType,
    trunkBlocks,
    leafBlocks,
    flowers,
    apples,
    goldenApples,
    oreBlocks,
    bee,
    beehive,
    signpost,
    pet,
    farmer,
    campfire,
    chest,
    seasonalEvent,
    holidayGifts,
    jackOLantern,
    totalCommits,
    openPRs: totalOpenPRs,
    mergedPRs: totalMergedPRs,
    assignedPRs: totalAssignedPRs,
    currentStreak,
    weather,
    isOwner: opts.isOwner,
    isContributor: opts.isContributor,
    growthStage,
    isExpanded,
  };
}

export type TreeOptions = {
  width?: number;
  height?: number;
  weather?: WeatherCondition;
  treeType?: TreeType;
  growth?: TreeGrowthMode;
  showSignpost?: boolean;
  showBee?: boolean;
  isOwner?: boolean;
  isContributor?: boolean;
  pet?: "auto" | "wolf" | "fox" | "cat" | "parrot" | "none";
  showFarmer?: boolean | "auto";
  farmerMood?: "auto" | "sad" | "dancing" | "watering";
  showCampfire?: boolean | "auto";
  showChest?: boolean | "auto";
  event?: "auto" | "halloween" | "holiday" | "fireworks" | "none";
  currentDate?: Date;
  streak?: number;
  openPRs?: number;
  mergedPRs?: number;
  assignedPRs?: number;
};

export function calculateTree(
  contributions: {
    weeks: ContributionWeek[];
    totalCommits?: number;
    currentStreak?: number;
    totalOpenPRs?: number;
    totalMergedPRs?: number;
    totalAssignedPRs?: number;
  },
  opts: TreeOptions = {}
): TreeLayout {
  return buildTreeLayout(contributions.weeks, contributions.totalCommits, {
    streak: contributions.currentStreak,
    openPRs: contributions.totalOpenPRs,
    mergedPRs: contributions.totalMergedPRs,
    assignedPRs: contributions.totalAssignedPRs,
    ...opts,
  });
}

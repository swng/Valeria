/**
 * Main File for Valeria.
 */

import { Latent } from './common';
import { ComboContainer } from './combo_container';
import { DungeonInstance } from './dungeon';
import { SearchInit } from './fuzzy_search';
import { Team } from './player_team';
import { MonsterEditor, ValeriaDisplay, MonsterUpdate } from './templates';
import { floof } from './ilmina_stripped';

async function waitFor(conditionFn: () => boolean, waitMs = 50) {
  while (!conditionFn()) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
}

class Valeria {
  display: ValeriaDisplay = new ValeriaDisplay();
  comboContainer: ComboContainer = new ComboContainer();
  monsterEditor: MonsterEditor;
  team: Team;
  dungeon: DungeonInstance;
  constructor() {

    // this._testRocheDeleteLater = testRoche();
    this.display.leftTabs.getTab('Combo Editor').appendChild(this.comboContainer.getElement());

    this.monsterEditor = new MonsterEditor((ctx: MonsterUpdate) => {
      const monster = this.team.monsters[this.team.activeMonster];

      if (ctx.hasOwnProperty('level')) {
        let level = Number(ctx.level);
        monster.level = level;
      }
      if (ctx.hasOwnProperty('inheritLevel')) {
        let level = Number(ctx.inheritLevel);
        monster.inheritLevel = level;
      }
      if (ctx.hasOwnProperty('hpPlus')) {
        monster.setHpPlus(Number(ctx.hpPlus));
      }
      if (ctx.hasOwnProperty('atkPlus')) {
        monster.setAtkPlus(Number(ctx.atkPlus));
      }
      if (ctx.hasOwnProperty('rcvPlus')) {
        monster.setRcvPlus(Number(ctx.rcvPlus));
      }
      if (ctx.hasOwnProperty('inheritPlussed')) {
        monster.inheritPlussed = Boolean(ctx.inheritPlussed);
      }
      if (ctx.hasOwnProperty('awakeningLevel')) {
        monster.awakenings = Number(ctx.awakeningLevel);
      }
      if (ctx.hasOwnProperty('superAwakeningIdx')) {
        monster.superAwakeningIdx = Number(ctx.superAwakeningIdx);
      }
      if (ctx.hasOwnProperty('id')) {
        monster.setId(Number(ctx.id));
      }
      if (ctx.hasOwnProperty('inheritId')) {
        monster.inheritId = Number(ctx.inheritId);
      }
      if (ctx.hasOwnProperty('addLatent')) {
        monster.addLatent(ctx.addLatent as Latent);
      }
      if (ctx.hasOwnProperty('removeLatent')) {
        monster.removeLatent(Number(ctx.removeLatent))
      }
      this.team.update();
      this.updateMonsterEditor();
      console.log(ctx);
    });
    this.monsterEditor.pdchu.importButton.onclick = () => {
      this.team.fromPdchu(this.monsterEditor.pdchu.io.value);
    };
    this.monsterEditor.pdchu.exportButton.onclick = () => {
      this.monsterEditor.pdchu.io.value = this.team.toPdchu();
    }
    this.display.leftTabs.getTab('Monster Editor').appendChild(this.monsterEditor.getElement());

    this.team = new Team();
    this.team.updateIdxCb = () => {
      this.updateMonsterEditor();
    }
    this.team.fromPdchu('3298 (5414 | lv99 +297) | lv110  sa3 / 2957 (5212) | lv103  sa1 / 5521 (5417 | lv99 +297) | lv110  sa3 / 5382 (5239) | lv110  sa5 / 5141 (5411) | lv110  sa3 / 5209 (5190) | lv110 sa2');

    this.display.panes[1].appendChild(this.team.teamPane.getElement());

    this.dungeon = new DungeonInstance();
    this.display.panes[2].appendChild(this.dungeon.getPane());
  }

  updateMonsterEditor() {
    const monster = this.team.monsters[this.team.activeMonster];
    this.monsterEditor.update({
      id: monster.id,
      inheritId: monster.inheritId,
      level: monster.level,
      hpPlus: monster.hpPlus,
      atkPlus: monster.atkPlus,
      rcvPlus: monster.rcvPlus,
      awakeningLevel: monster.awakenings,
      inheritLevel: monster.inheritLevel,
      inheritPlussed: monster.inheritPlussed,
      latents: monster.latents,
      superAwakeningIdx: monster.superAwakeningIdx,
    });
  }

  getElement(): HTMLElement {
    return this.display.getElement();
  }
}

declare global {
  interface Window { valeria: Valeria; }
}

async function init() {
  await waitFor(() => floof.ready);
  console.log('Valeria taking over.');

  // annotateMonsterScaling();
  SearchInit();
  const valeria = new Valeria();

  document.body.appendChild(valeria.getElement());
  for (const el of document.getElementsByClassName('main-site-div')) {
    (el as HTMLElement).style.display = 'none';
  }
  window.valeria = valeria;
}

init();
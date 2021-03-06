const patron = require('patron.js');
const discord = require('discord.js');
const db = require('../../database');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const num = require('../../utility/num.js');
const Sender = require('../../utility/Sender.js');
const pluralize = require('pluralize');
const pad = require('pad');

class OpenCrate extends patron.Command {
  constructor() {
    super({
      names: ['opencrate', 'open'],
      groupName: 'items',
      description: 'Open a crate!',
      guildOnly: false,
      cooldown: Constants.openCrate.cooldown,
      args: [
        new patron.Argument({
          name: 'crate',
          key: 'crate',
          type: 'crate',
          example: 'silver'
        }),
        new patron.Argument({
          name: 'quantity',
          key: 'quantity',
          type: 'quantity',
          example: '500',
          defaultValue: 1,
          preconditions: ['ownquantity', { name: 'maximum', options: { maximum: Constants.openCrate.max } }]
        })
      ]
    });
  }

  async run(msg, args) {
    const items = await db.items.crateItems(args.crate.id);
    const totalCrateOdds = items.reduce((sum, x) => sum + x.crate_odds, 0);
    let won = new discord.Collection();

    for (let i = 0; i < args.quantity; i++) {
      const item = Random.weighted(items, 'crate_odds', totalCrateOdds);

      won.set(item, 1 + (won.has(item) === true ? won.get(item) : 0));
    }

    await db.items.modifyInventory(msg.author.id, msg.guild.id, args.crate.id, -args.quantity);

    won = won.sort((a, b, c, d) => c.names[0] > d.names[0] ? 1 : c.names[0] > d.names[0] ? -1 : 0);

    const max = won.reduce((a, b) => Math.max(a, num(b).length), 0);
    let description = '```';

    for (const [key, value] of won) {
      await db.items.modifyInventory(msg.author.id, msg.guild.id, key.id, value);

      description += pad(num(value), max) + ' ' + pluralize(StringUtil.capitializeWords(key.names[0]), value) + '\n';
    }

    return Sender.send(msg.channel, description + '```', { title: 'Items Won' });
  }
}

module.exports = new OpenCrate();

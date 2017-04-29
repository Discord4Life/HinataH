﻿using DEA.Common;
using DEA.Common.Preconditions;
using Discord.Commands;
using System.Threading.Tasks;

namespace DEA.Modules
{
    [Name("Bot Owners")]
    [Require(Attributes.BotOwner)]
    public class Bot_Owners : DEAModule
    {

        [Command("SetGame")]
        [Summary("Sets the game of DEA.")]
        public async Task SetGame([Summary("boss froth")] [Remainder] string game)
        {
            await Context.SocketClient.SetGameAsync(game);
            await ReplyAsync($"Successfully set the game to {game}.");
        }
    }
}

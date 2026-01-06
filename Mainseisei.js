const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// 1. サーバー稼働維持のためのWebサーバー機能
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Web server is running on port ${PORT}`);
});

// 2. BOTのクライアント設定
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates // VC監視に必要
    ]
});

// 設定項目（ここを書き換えてください）
const TARGET_WORD = 'こんにちは'; // 反応する言葉
const REPLY_WORD = 'こんにちは、元気ですか？'; // 返信する言葉
const NOTIFY_CHANNEL_ID = 'あなたの通知先チャンネルID'; // 通知を送るチャンネルのID
const DISCORD_TOKEN = process.env.DISCORD_TOKEN; // 環境変数からトークンを読み込み

// BOT起動時の処理
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// メッセージ返信機能
client.on('messageCreate', async message => {
    if (message.author.bot) return; // BOT自身の発言は無視

    if (message.content === TARGET_WORD) {
        await message.reply(REPLY_WORD);
    }
});

// VC入室検知機能
client.on('voiceStateUpdate', (oldState, newState) => {
    // ユーザーがVCに参加したか判定（以前は無し、現在は有り）
    if (oldState.channelId === null && newState.channelId !== null) {
        const channel = client.channels.cache.get(NOTIFY_CHANNEL_ID);
        if (channel) {
            channel.send(`${newState.member.displayName} さんがボイスチャンネル「${newState.channel.name}」に参加しました。`);
        }
    }
});

// ログイン
client.login(DISCORD_TOKEN);

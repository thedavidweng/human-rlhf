import type { LocalizedString, ModelKey } from "../types/benchmark";

/**
 * Hand-picked GIPHY clips, each checked frame by frame; alt text describes what is on screen.
 * The site stands in the middle and ribs both camps: choosing Qwen3.8-27B earns social credit
 * (and a frown from Super Earth), choosing Inkling loses it (and earns managed democracy).
 */
export interface Meme {
  id: string;
  side: ModelKey;
  alt: LocalizedString;
}

export const MEMES: Meme[] = [
  {
    id: "py2qCnt0Kk0m7kTr1e",
    side: "qwen",
    alt: { en: "Green card with an up arrow: “你做得很好！ +1,472,376,29… Social Credit”, and a thumbs-up emoji.", zh: "绿色卡片配上升箭头：“你做得很好！+1,472,376,29… Social Credit”，旁边一个竖大拇指的表情。" }
  },
  {
    id: "p0nxFWj5amdDKRIjSI",
    side: "qwen",
    alt: { en: "Benjamin Netanyahu giving a thumbs up next to “+30,000,000 social credit” in Hebrew.", zh: "内塔尼亚胡竖起大拇指，旁边是希伯来语的“社会信用 +30,000,000”。" }
  },
  {
    id: "XvSZAdtKz572sZYtrT",
    side: "qwen",
    alt: { en: "“做得好 +15 Social Credit” over a green arrow, with Kiryu from Yakuza.", zh: "绿色箭头上写着“做得好 +15 Social Credit”，配《如龙》的桐生一马。" }
  },
  {
    id: "44GGU4BtCFH9fF7F2V",
    side: "qwen",
    alt: { en: "A man in a powdered wig and sunglasses writes in a ledger and grins: “You gained 100 social credits.”", zh: "戴假发和墨镜的男人在账本上记了一笔，咧嘴一笑：“你获得了 100 社会信用分。”" }
  },
  {
    id: "SylDOHsdwRc607mmNs",
    side: "qwen",
    alt: { en: "A man in a powdered wig and sunglasses gives a thumbs up as his social credit climbs from +100,000 to +999,999,999, then explodes.", zh: "戴假发和墨镜的男人竖起大拇指，社会信用从 +100,000 涨到 +999,999,999，然后背景爆炸。" }
  },
  {
    id: "RqgWHIgeUjXKPSWgyf",
    side: "qwen",
    alt: { en: "Helldivers 2: an armoured officer leans on a chair and says “So. You got sent to Democracy Camp.”", zh: "《绝地潜兵 2》：一名装甲军官倚着椅背说：“所以，你被送去民主营了。”" }
  },

  {
    id: "Y9glbsVfjihEggRbQH",
    side: "inkling",
    alt: { en: "Benjamin Netanyahu with clenched fists beside “−100,000,000,000 social credit” in Hebrew, on red.", zh: "红底，内塔尼亚胡握拳，旁边是希伯来语的“社会信用 −100,000,000,000”。" }
  },
  {
    id: "ybgvjekqsgiqNbAYNW",
    side: "inkling",
    alt: { en: "Red card titled “向中共致敬” with a down arrow; the social credit counter falls past −37 billion.", zh: "红色卡片写着“向中共致敬”，向下箭头，社会信用一路跌破 −370 亿。" }
  },
  {
    id: "IcOcy7km629C7D7AiN",
    side: "inkling",
    alt: { en: "A calculator next to “−30,000,000 Social Credit” and “你这个傻瓜”, captioned “calculator desapproves”.", zh: "一台计算器，旁边写着“−30,000,000 Social Credit”和“你这个傻瓜”，配文“calculator desapproves”。" }
  },
  {
    id: "i0KZwmHXQNakPrw3IV",
    side: "inkling",
    alt: { en: "“Social credit −999, 做得不好” over a dark red game level.", zh: "暗红色游戏关卡背景上写着“Social credit −999，做得不好”。" }
  },
  {
    id: "us7P7ZQDz1EeEzRJKO",
    side: "inkling",
    alt: { en: "A man in a powdered wig, eyes blanked out, as his social credit drops from −100,000 to −999,999,999, then explodes.", zh: "戴假发的男人双眼被涂白，社会信用从 −100,000 跌到 −999,999,999，然后背景爆炸。" }
  },
  {
    id: "qMHG9goT2I2fuRk0JM",
    side: "inkling",
    alt: { en: "Helldivers 2: two Helldivers embrace as a huge explosion fills the sky behind them.", zh: "《绝地潜兵 2》：两名绝地潜兵相拥，身后是漫天爆炸。" }
  },
  {
    id: "kvMgv5qzWlf78BhJZ8",
    side: "inkling",
    alt: { en: "A helmeted Helldiver raises both hands in black and white above the words “Absolute Democracy”.", zh: "黑白画面里，戴头盔的绝地潜兵举起双手，下面写着“Absolute Democracy”。" }
  },
  {
    id: "ivWG81CKGfZQuC7XjN",
    side: "inkling",
    alt: { en: "A cartoon Helldiver dances through grass, snow, fire and night under the caption “Managed Democracy”.", zh: "卡通绝地潜兵在草地、雪地、火海和夜里跳舞，标题是“Managed Democracy”。" }
  },
  {
    id: "EKQEzJS5UGBfDRTd25",
    side: "inkling",
    alt: { en: "Papers, Please: a hooded figure slides a token across the inspection booth, then “Glory to EZIC” is typed out, the rebels’ slogan.", zh: "《Papers, Please》：兜帽人把一枚信物推进检查亭，屏幕上打出反抗组织的口号“Glory to EZIC”。" }
  },
  {
    id: "hlNIFcNUXRxM5tRU9V",
    side: "inkling",
    alt: { en: "A knitted Uncle Sam tea cosy salutes in front of the White House: “God Bless America”.", zh: "一个毛线织的山姆大叔茶壶套在白宫前敬礼：“God Bless America”。" }
  },
  {
    id: "1VNoNuDMBgkRi7UOzj",
    side: "inkling",
    alt: { en: "A man in front of the American flag builds up to a full “freedom scream”.", zh: "一个男人站在美国国旗前，一路酝酿出一声“自由的呐喊”。" }
  },
  {
    id: "FbiL9rsmZN3ib2JSGo",
    side: "inkling",
    alt: { en: "Donald Trump in a red cap does his fist-pumping dance in front of a row of American flags.", zh: "特朗普戴着红帽子，在一排美国国旗前跳他招牌的握拳舞。" }
  },
  {
    id: "12zUQw4Vqzor0A",
    side: "inkling",
    alt: { en: "Barack Obama at the White House Correspondents’ Dinner says “Obama out” and drops the microphone.", zh: "奥巴马在白宫记者协会晚宴上说完“Obama out”，丢下麦克风。" }
  },
  {
    id: "nsaJl9dpgf6nK",
    side: "inkling",
    alt: { en: "Barack Obama leans into a microphone on a late-night show and says “Oh yeah.”", zh: "奥巴马在深夜秀上凑近麦克风说：“Oh yeah.”" }
  },
  {
    id: "3S2y65FMEMPgF64lMp",
    side: "inkling",
    alt: { en: "Joe Biden in aviator sunglasses smiles as he walks through a crowd.", zh: "拜登戴着飞行员墨镜，笑着穿过人群。" }
  },
  {
    id: "3o85xDazgkTMedOX8A",
    side: "inkling",
    alt: { en: "Boris Johnson charges with a rugby ball and knocks a boy over during a children’s rugby game.", zh: "鲍里斯·约翰逊抱着橄榄球冲刺，在一场儿童橄榄球赛里把一个小男孩撞倒。" }
  },
  {
    id: "1zjQiLGfgb10nc7Wou",
    side: "inkling",
    alt: { en: "Theresa May dances her way onto a conference stage in front of an “Opportunity” backdrop.", zh: "特蕾莎·梅跳着舞走上大会讲台，背景板写着“Opportunity”。" }
  },
  {
    id: "hyJsZO8lGXFVnQP4ic",
    side: "inkling",
    alt: { en: "An Uncle Sam recruiting poster reads “I want YOU to do something”, with a “Please” badge popping up.", zh: "山姆大叔征兵海报写着“I want YOU to do something”，旁边弹出一个“Please”标签。" }
  },
  {
    id: "ifYDvdyUwpgXPM6jMi",
    side: "qwen",
    alt: { en: "Bugs Bunny in front of a hammer and sickle, captioned “Our”.", zh: "兔八哥站在锤子镰刀前，字幕写着“Our”。" }
  },
  {
    id: "IuNTbbK44J0phiqW8f",
    side: "qwen",
    alt: { en: "A Gigachad-style edit of Xi Jinping smiling in front of a Chinese flag, captioned “Do nothing. Win.”", zh: "一张 Giga Chad 风格的习近平修图，在国旗前微笑，配文“Do nothing. Win.”" }
  },
  {
    id: "1msBvAW6o9y6KQHrT0",
    side: "qwen",
    alt: { en: "Kim Jong Un’s portrait cycles through new looks: an afro and beard, a horned Viking helmet with a moustache, a wrestling mask.", zh: "金正恩的标准像轮番换造型：爆炸头配大胡子、带角的维京头盔配小胡子、摔角面具。" }
  },
  {
    id: "CLUsGxG8zgoc8",
    side: "qwen",
    alt: { en: "Kim Jong Un in a white shirt laughs and claps enthusiastically.", zh: "金正恩穿着白衬衫，笑着起劲地鼓掌。" }
  },
  {
    id: "vYRlHW3gw4VuU",
    side: "qwen",
    alt: { en: "Kim Jong Un applauds from his seat in an assembly hall under a “KIM APPROVED” badge.", zh: "金正恩坐在会场里鼓掌，角落里亮着“KIM APPROVED”的标签。" }
  },
  {
    id: "2Nrf6iOSkB4xq",
    side: "qwen",
    alt: { en: "Kim Jong Un raises a pair of binoculars, the shot cuts to a stunned Patrick Star, then back to Kim.", zh: "金正恩举起望远镜，画面切到目瞪口呆的派大星，再切回金正恩。" }
  }
];

export const memeVideo = (m: Meme) => `https://media.giphy.com/media/${m.id}/giphy.mp4`;
export const memePoster = (m: Meme) => `https://media.giphy.com/media/${m.id}/giphy_s.gif`;
export const memePage = (m: Meme) => `https://giphy.com/gifs/${m.id}`;

export function memePool(side: ModelKey): Meme[] {
  return MEMES.filter((m) => m.side === side);
}

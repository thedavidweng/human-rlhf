import type { Skin } from "../lib/skins";

export interface Track {
  title: string;
  artist: string;
  release: string;
  label: string;
  year: number;
  /** Item page on the Internet Archive. */
  page: string;
  file: string;
  /** Only the standard track is openly licensed; the hidden themes' songs are unofficial uploads, used at the owner's risk. */
  license?: { name: string; url: string };
}

const IA = "https://archive.org";

/** One track per theme, streamed verbatim from the Internet Archive rather than copied into the repo. */
export const MUSIC: Record<Skin, Track> = {
  default: {
    title: "Access Denied!!!",
    artist: "Figure",
    release: "Maintenance EP",
    label: "Heavy Industries",
    year: 2004,
    page: `${IA}/details/heavy-industries004/hi004_03_-_Figure_-_Access_Denied.mp3`,
    file: `${IA}/download/heavy-industries004/hi004_03_-_Figure_-_Access_Denied.mp3`,
    license: { name: "CC BY-NC-ND 1.0", url: "https://creativecommons.org/licenses/by-nd-nc/1.0/" }
  },
  red: {
    title: "天上太阳红彤彤",
    artist: "屠洪刚",
    release: "歌唱毛泽东 群星颂伟人",
    label: "深圳先科",
    year: 1996,
    page: `${IA}/details/ge-chang-mao-zedong-qun-xing-song-wei-ren`,
    file: `${IA}/download/ge-chang-mao-zedong-qun-xing-song-wei-ren/${encodeURIComponent("6.天上太阳红彤彤屠洪刚-Mặt-Trời-Đỏ-Chót-Trên-Trời-Đồ-Hồng-Cương.mp3")}`
  },
  freedom: {
    title: "America, Fuck Yeah",
    artist: "Team America",
    release: "Team America: World Police",
    label: "Paramount / Atlantic",
    year: 2004,
    page: `${IA}/details/team-america-world-police-ost`,
    file: `${IA}/download/team-america-world-police-ost/${encodeURIComponent("03 - America, Fuck Yeah.mp3")}`
  }
};

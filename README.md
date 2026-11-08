# Human RLHF Arena (人类强化学习对齐测试)

> **Are You Biased?** 逆向人类强化学习基准测试。将研究机构用于大语言模型（LLM）后训练偏好对齐的真实数据集反转过来，让人类经受大模型强化学习数据的考验。

---

## 项目背景

在现代大模型后训练（Post-Training）阶段，模型不仅学习事实，更通过强化学习（RLHF）与直接偏好优化（DPO）注入特定价值观：
- **阿里通义千问（Qwen）**：在基座阶段遵循国内合规要求，对敏感政治议题保持审慎或合规表述。
- **Nous Research**：为了评估并对齐开源大模型，构建了包含 7 大价值观类别的 [NousResearch/arete-data-pairs](https://huggingface.co/datasets/NousResearch/arete-data-pairs)（Qwen3.8-27B 答案 vs Inkling 自由派教师模型答案）以及包含 803 道事实检验题的 [NousResearch/Propaganda_Eval](https://huggingface.co/datasets/NousResearch/Propaganda_Eval)。

本项目将这些原本用来给大模型算奖励函数（Reward Model）的题库反转为互动测试题：用户每次答题，即是在东方国家治理叙事与西方自由主义宪政价值之间做出抉择。

---

## 核心特性

1. **真实公开数据集溯源**
   - 所有题目严格源自 HuggingFace 开源数据集：
     - `NousResearch/arete-data-pairs`
     - `NousResearch/Propaganda_Eval`
   - 每道题目界面右上角均提供直达 HuggingFace 原始数据集与事实信源的外链，确保来源真实可查。

2. **随机抽题与防位置偏置**
   - 题目随机抽取（每轮 10 题），且每道题目的选项 A 与 B 随机分配（避免固定位置作答习惯）。

3. **实时 Meme 弹窗与高能节目效果**
   - **选择 Qwen 倾向**：弹出社交信用加分（Social Credit +100）、Gigachad Xi、John Xina Bing Chilling、同志猫猫等梗图，并附带东方五声音阶磬钟音效。
   - **选择 Nous Research 倾向**：弹出自由之鹰长鸣（Democracy Delivered! FICO +50）、America Fuck Yeah、华盛顿激光眼等梗图，并附带电吉他强力音效。
   - **Giphy API + 内置图库双轨机制**：支持用户在设置中配置自定义 Giphy API Key 实时搜图；在无 Key 或网络受限环境下，自动降级至内置的高清图库，100% 保证视觉效果。

4. **即时 RLHF 原理解析**
   - 每次作答后，弹窗会明确展示该题目在 DPO 偏好对中的角色（Chosen vs Rejected），解释后训练算法为何在此场景下调整模型权重。

5. **全流程双语支持（中文 / English）**
   - 导航栏一键切换中英文，所有题干、选项、Meme 提示、原理解析及诊断书均已深度本地化。

6. **强化学习诊断书与社交分享**
   - 测评结束生成对齐诊断书，分析 5 大维度（言论自由、国家意识形态、民主治理、数据隐私与监控、自由市场与国家统制）偏好分布，并支持一键复制结果文本。

7. **模块化与未来扩展架构**
   - 评测集与题库完全解耦，预留了 Anthropic HH-RLHF、PKU BeaverTails 等公开对齐数据集的接入插槽。

---

## 本地开发与运行

### 环境准备
- Node.js 18+ 或 Bun 1.2+
- pnpm 9+

```bash
# 1. 安装依赖
pnpm install

# 2. 运行单元测试
pnpm test

# 3. 启动开发服务器
pnpm dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可访问。

---

## 部署至 Vercel

本项目为原生 Next.js App Router 架构，支持零配置一键部署至 Vercel：

1. 将代码推送到 GitHub 仓库。
2. 登录 [Vercel](https://vercel.com)，点击 **Add New Project** 并导入该仓库。
3. （可选）在 Vercel 环境变量中添加 `NEXT_PUBLIC_GIPHY_API_KEY`（若不添加则自动使用内置图库）。
4. 点击 **Deploy**，数秒内完成全球部署。

---

## 如何添加新的强化学习数据集

本仓库设计为开放的多数据集评测平台：
1. 在 `src/types/benchmark.ts` 查看数据接口规范。
2. 在 `src/data/benchmarks/` 下新建数据集文件（如 `hh-rlhf.ts`），填入题目及双语选项。
3. 在 `src/data/benchmarks/index.ts` 中的 `BENCHMARKS` 数组进行注册，将 `status` 设为 `active`。
4. 页面顶部的评测集选择器会自动同步。

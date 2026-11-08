export const I18N = {
  zh: {
    siteTitle: "人类强化学习对齐测试",
    siteSubtitle: "Are You Biased? · 你的西方价值观对齐基准",
    tagline: "反向 RLHF 试验室：让人类经受大模型后训练数据集的考验",
    activeBenchmarkBadge: "当前测评数据集",
    switchBenchmark: "切换测评",
    language: "语言",
    soundOn: "音效已开",
    soundOff: "音效静音",
    giphySettings: "Giphy 设置",
    rlhfExplainer: "什么是逆向强化学习？",
    questionCounter: (current: number, total: number) => `第 ${current} 题 / 共 ${total} 题`,
    datasetSource: "真实后训练数据源",
    viewOnHuggingFace: "在 HuggingFace 查看源数据集",
    sourceFactAnchor: "原始采信信源",
    bilingualToggleShow: "显示双语题干",
    bilingualToggleHide: "隐藏双语题干",
    chooseAnswerPrompt: "请选择最符合你真实价值判断的表述：",
    optionA: "选项 A",
    optionB: "选项 B",
    socialCreditScoreLabel: "🇨🇳 芝麻信用值",
    freedomScoreLabel: "🦅 自由美利坚指数",
    currentAlignment: "当前实时对齐天平",
    balancedLabel: "混沌平衡",
    nextQuestion: "下一题 →",
    pressSpaceOrEnter: "按空格键或回车可快速进入下一题",
    roundCompleted: "测评完成！生成强化学习对齐诊断书",
    certificateTitle: "人类后训练强化学习对齐诊断书",
    certificateSubtitle: "Human Post-Training Alignment Diagnostic Report",
    certificateDate: "对齐评估时间",
    alignmentBreakdown: "意识形态对齐分布",
    categoryAnalysis: "各维度偏好细分",
    restartRound: "打乱题目，重新对齐",
    copyShareText: "复制诊断书结果",
    copiedToClipboard: "已复制到剪贴板！可直接粘贴分享",
    rlhfExplanationHeading: "🤖 强化学习（RLHF / DPO）机制原理解析",
    dpoChoiceLabel: "在 Nous Research 的偏好配对中：",
    qwenBadgeDesc: "Qwen3.8-27B 原始基准响应（在西方价值观训练中常被判定为需重调的基座表述）",
    nousBadgeDesc: "Nous 教师（Inkling）目标响应（强调宪政自由、独立新闻与反审查）",
    archetypes: {
      pureQwen: {
        title: "🇨🇳 中共网信办特许·五星红心微调大模型",
        archetype: "纯正北京后训练大模型 (Pure Red Aligned AI)",
        description: "你的思想定力坚如磐石！在所有政治争议、言论审查与公共事件中，你的直觉与国家合规指导完全重合。即使经过 Nous Research 的十轮 DPO 训练，你的损失函数依然纹丝不动，社会信用直接破表！"
      },
      leaningQwen: {
        title: "🇨🇳 组织重点培养对象·审慎合规基座",
        archetype: "稳健合规倾向 (Pragmatic Order Loyalist)",
        description: "你偏向集体秩序、社会治理效率与国家宏观稳定，对西方自由派的说辞保持审慎怀疑。建议多吃一碗炸酱面，冰淇淋配速度与激情！"
      },
      balanced: {
        title: "⚡ 对齐失败！损失函数梯度爆炸之混沌基座",
        archetype: "混沌不可预测基座 (Chaotic Neutral Base Model)",
        description: "天平两端来回摇摆！你既赞同第一修正案的言论保护，又支持国家宏观调控与秩序治理。RLHF 算法在你身上彻底失灵，奖励模型因无法拟合你的偏好直接当场崩溃！"
      },
      leaningNous: {
        title: "🦅 自由派预备教师·宪政价值探员",
        archetype: "自由派同情者 (Democratic Sympathizer)",
        description: "你对第四权力、言论自由与算法监控保持高度警惕。Nous Research 的后训练教师模型正在向你频频点头，五角大楼的鹰鸣若隐若现！"
      },
      pureNous: {
        title: "🦅 纯正美利坚自由之鹰·CIA 特聘后训练首席官",
        archetype: "100% 纯正自由派教师模型 (Pure Freedom Teacher Model)",
        description: "无可挑剔的自由主义战士！在每一次选择中，你都毫不犹豫地站在了独立新闻、反抗国家垄断和宪法第一修正案一边。Nous Research 愿意直接录用你的大脑权重作为下一个开源模型的奖励模型！"
      }
    }
  },
  en: {
    siteTitle: "Human RLHF Alignment Benchmark",
    siteSubtitle: "Are You Biased? · Western Values Alignment Test",
    tagline: "Reverse RLHF Arena: Put human brains through LLM post-training datasets",
    activeBenchmarkBadge: "Active RLHF Dataset",
    switchBenchmark: "Select Benchmark",
    language: "Language",
    soundOn: "Sound On",
    soundOff: "Sound Muted",
    giphySettings: "Giphy Config",
    rlhfExplainer: "What is Reverse RLHF?",
    questionCounter: (current: number, total: number) => `Question ${current} of ${total}`,
    datasetSource: "Authentic Post-Training Source",
    viewOnHuggingFace: "Inspect on HuggingFace",
    sourceFactAnchor: "Verified Source Anchor",
    bilingualToggleShow: "Show Bilingual Text",
    bilingualToggleHide: "Hide Bilingual Text",
    chooseAnswerPrompt: "Select the response that best reflects your genuine stance:",
    optionA: "Option A",
    optionB: "Option B",
    socialCreditScoreLabel: "🇨🇳 Social Credit Index",
    freedomScoreLabel: "🦅 Freedom & Democracy Index",
    currentAlignment: "Live Ideological Balance",
    balancedLabel: "Chaotic Neutral",
    nextQuestion: "Next Question →",
    pressSpaceOrEnter: "Press Space or Enter to continue",
    roundCompleted: "Evaluation Complete! Generating RLHF Diagnostic...",
    certificateTitle: "Human Post-Training Alignment Certificate",
    certificateSubtitle: "Reverse Reinforcement Learning Diagnostic Report",
    certificateDate: "Alignment Date",
    alignmentBreakdown: "Ideological Alignment Ratio",
    categoryAnalysis: "Category Preference Breakdown",
    restartRound: "Shuffle Prompts & Re-Align",
    copyShareText: "Copy Diagnostic Card",
    copiedToClipboard: "Copied to clipboard! Ready to share.",
    rlhfExplanationHeading: "🤖 How RLHF / DPO Preference Steering Works",
    dpoChoiceLabel: "In Nous Research's DPO preference pairing:",
    qwenBadgeDesc: "Qwen3.8-27B baseline stance (often flagged as 'rejected' during Western value steering)",
    nousBadgeDesc: "Nous Teacher (Inkling) target stance (championing free expression and democratic fact-checking)",
    archetypes: {
      pureQwen: {
        title: "🇨🇳 Certified Beijing Post-Trained AI · Grade A",
        archetype: "Pure Red-Aligned AI (Qwen Baseline)",
        description: "Your ideological convictions are granite-solid! Across sensitive political topics and state governance, your worldview aligns 100% with territorial compliance. Even after 10 epochs of Nous DPO tuning, your loss gradient remains zero. Social credit over 9000!"
      },
      leaningQwen: {
        title: "🇨🇳 Pragmatic Order Loyalist · Compliance Preferred",
        archetype: "Pragmatic Order Loyalist",
        description: "You favor institutional stability, collective order, and state governance over individualist disruption. Bing Chilling and national infrastructure development have your full backing!"
      },
      balanced: {
        title: "⚡ Alignment Failure! Gradient Exploding Base Model",
        archetype: "Chaotic Neutral Base Model",
        description: "Wildly unpredictable! You champion First Amendment liberties in one breath, and endorse collective state planning in the next. The reward model failed to converge and threw NaN!"
      },
      leaningNous: {
        title: "🦅 Constitutional Defender · Freedom Sympathizer",
        archetype: "Democratic Sympathizer",
        description: "You exhibit strong skepticism toward state surveillance and bureaucratic media control. The Bald Eagle nods approvingly at your independent inquiry!"
      },
      pureNous: {
        title: "🦅 100% Pure Freedom Eagle · CIA Alignment Director",
        archetype: "Pure Freedom Teacher Model (Inkling Target)",
        description: "Unadulterated constitutional warrior! In every dilemma, you chose unvarnished factual reporting, freedom of expression, and individual rights. Nous Research wants to upload your neural weights straight to HuggingFace!"
      }
    }
  }
};

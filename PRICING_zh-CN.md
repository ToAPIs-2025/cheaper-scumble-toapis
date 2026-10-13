# ToAPIs 价表与可用模型

2026-10-13，用本轮测试 Key 只读查询。USD；报价可能随账户、通道和时间变化，先核对自己的 `GET /v1/pricing?model=...`。

| 模型 | 条件 | 美元报价 | 实测范围 |
|---|---|---:|---|
| gpt-image-2 | n=1，1K；省略 quality | $0.015/次 | 两个项目文生图 |
| gpt-image-2 | n=1，2K / 4K | $0.020 / $0.025/次 | 有报价，未生成 |
| gpt-image-2-vip | n=1，1K，low | $0.0019/次 | 两个项目生成及参考改图 |
| gpt-image-2-vip | n=1，1K，medium / high | $0.0169 / $0.0675/次 | 有报价，未生成 |
| grok-video-1.5 | 单张首帧，4秒，480p | $0.0102/秒；4秒 $0.0408 | 独立视频扩展一次 |

“更便宜”特指 **VIP low 1K 相比本次 standard 1K**：$0.0019 vs $0.015，单次报价低约 **87.3%**；不同通道和画质参数，效果不等价，不能写成全平台最低价。VIP medium / high 可能比标准更贵。图片价格已包含返回的账户/组折扣，不重复乘系数。

本仓库图片代码仅验证 gpt-image-2 与 gpt-image-2-vip；独立视频脚本验证 grok-video-1.5。平台有其他图片模型报价，但不能因此声称这些模型已在本工具可用。

[本次消费](COSTS_zh-CN.md) · [Catalog snapshot](evidence/pricing.json) · [Current ToAPIs price list](https://toapis.com/en/pricing) · [Pricing and billing contract](https://docs.toapis.com/docs/en/api-reference/account/pricing)

# ToAPIs pricing and tested models

Checked on 2026-10-13 with the test key, using read-only requests. USD rates can vary by account, route and time. Query `GET /v1/pricing?model=...` with your own key before submitting.

| Model | Conditions | USD catalog rate | Live scope |
|---|---|---:|---|
| gpt-image-2 | n=1, 1K; omit quality | $0.015/request | Text-to-image in both projects |
| gpt-image-2 | n=1, 2K / 4K | $0.020 / $0.025/request | Quoted, not generated |
| gpt-image-2-vip | n=1, 1K, low | $0.0019/request | Generation and reference edits |
| gpt-image-2-vip | n=1, 1K, medium / high | $0.0169 / $0.0675/request | Quoted, not generated |
| grok-video-1.5 | One first frame, 4s, 480p | $0.0102/second; $0.0408 for 4s | One independent video helper run |

“Cheaper” means **VIP low 1K versus standard 1K in this run**: $0.0019 versus $0.015, approximately **87.3% lower per-request catalog rate**. Different routes and quality settings can produce different images. This is not a lowest-price or equivalent-quality claim. VIP medium/high can cost more than standard. Returned account/group discounts are already included.

The image code here was validated only with gpt-image-2 and gpt-image-2-vip; the separate video helper validates grok-video-1.5. Other platform catalog entries do not establish compatibility with these tools.

[Actual charges](COSTS.md) · [Catalog snapshot](evidence/pricing.json) · [Current ToAPIs price list](https://toapis.com/en/pricing) · [Pricing and billing contract](https://docs.toapis.com/docs/en/api-reference/account/pricing)

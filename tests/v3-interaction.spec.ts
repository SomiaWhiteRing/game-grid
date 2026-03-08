import { expect, test, type Page } from "@playwright/test";

const SHARE_ID = "60fe04cbe7874fa2";
const ONE_PIXEL_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9YxX5iQAAAAASUVORK5CYII=";

type MockShareState = {
  creatorName: string | null;
  games: Array<Record<string, unknown> | null>;
};

function createFilledGames() {
  return Array.from({ length: 9 }, (_, index) => ({
    id: 2000 + index,
    name: `Game ${index + 1}`,
    localizedName: `游戏 ${index + 1}`,
    cover: null,
    releaseYear: 2000 + index,
    gameTypeId: 0,
    platforms: ["PC"],
    comment: "",
    spoiler: false,
  }));
}

function buildSearchResponse(query: string) {
  if (query.toLowerCase() === "zelda") {
    return {
      ok: true,
      source: "bangumi",
      items: [
        {
          id: 101,
          name: "The Legend of Zelda",
          localizedName: "塞尔达传说",
          cover: null,
          releaseYear: 2017,
          gameTypeId: 0,
          platforms: ["Nintendo Switch"],
        },
        {
          id: 102,
          name: "Stardew Valley",
          localizedName: "星露谷物语",
          cover: null,
          releaseYear: 2016,
          gameTypeId: 0,
          platforms: ["PC"],
        },
      ],
      topPickIds: [101],
      suggestions: ["可尝试游戏正式名或别名"],
      noResultQuery: null,
    };
  }

  const hash = Array.from(query).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const id = Math.max(1000, hash + 900);
  return {
    ok: true,
    source: "bangumi",
    items: [
      {
        id,
        name: `Result ${query}`,
        localizedName: `结果 ${query}`,
        cover: null,
        releaseYear: 2020,
        gameTypeId: 0,
        platforms: ["PC"],
      },
    ],
    topPickIds: [id],
    suggestions: ["减少关键词，仅保留核心词"],
    noResultQuery: null,
  };
}

async function mockV3Apis(page: Page) {
  const state: MockShareState = {
    creatorName: "测试玩家",
    games: createFilledGames(),
  };

  await page.route(/\/api\/share\/touch\?/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.route(/\/api\/share-image\/[^/?]+/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      body: Buffer.from(ONE_PIXEL_PNG_BASE64, "base64"),
    });
  });

  await page.route(/\/api\/games\/search\?/, async (route) => {
    const url = new URL(route.request().url());
    const q = (url.searchParams.get("q") || "").trim();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(buildSearchResponse(q)),
    });
  });

  await page.route(/\/api\/search\?/, async (route) => {
    const url = new URL(route.request().url());
    const q = (url.searchParams.get("q") || "").trim();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(buildSearchResponse(q)),
    });
  });

  await page.route(/\/api\/share(\?.*)?$/, async (route) => {
    const request = route.request();
    if (request.method() === "POST") {
      await new Promise((resolve) => setTimeout(resolve, 220));
      const body = request.postDataJSON() as {
        creatorName?: string | null;
        games?: Array<Record<string, unknown> | null>;
      };
      state.creatorName = body.creatorName || null;
      state.games = Array.isArray(body.games) ? body.games : state.games;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          shareId: SHARE_ID,
          shareUrl: `http://localhost:3000/s/${SHARE_ID}`,
        }),
      });
      return;
    }

    const url = new URL(request.url());
    const id = url.searchParams.get("id");
    if (id !== SHARE_ID) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "分享不存在" }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        shareId: SHARE_ID,
        creatorName: state.creatorName,
        games: state.games,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastViewedAt: Date.now(),
      }),
    });
  });
}

async function installClientSpies(page: Page) {
  await page.addInitScript(() => {
    const g = window as typeof window & {
      __clipboardWrites?: string[];
      __clipboardFail?: boolean;
    };

    g.__clipboardWrites = [];
    g.__clipboardFail = false;

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          if (g.__clipboardFail) {
            throw new Error("clipboard_failed");
          }
          g.__clipboardWrites!.push(text);
        },
      },
    });
  });
}

async function fillSlot(page: Page, slot: number, query: string) {
  await page.getByLabel(`选择第 ${slot} 格游戏`).click();
  const searchInput = page.getByPlaceholder("输入游戏名");
  await searchInput.fill(query);
  await searchInput.press("Enter");
  await searchInput.press("Enter");
  await expect(page.getByText(`已填入第 ${slot} 格`)).toBeVisible();
}

test.describe("v3 interaction", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await installClientSpies(page);
    await mockV3Apis(page);
  });

  test("首页初始态按钮与文案正确", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("0 / 9 已选择")).toBeVisible();
    await expect(page.getByRole("button", { name: "撤销" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "清空" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "还差 9 个可保存" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "保存图片" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "生成分享链接" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "生成分享图片" })).toHaveCount(0);
  });

  test("搜索键盘选择、重复去重与评论剧透折叠生效", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("选择第 1 格游戏").click();
    await page.getByPlaceholder("输入游戏名").fill("zelda");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await expect(page.getByText("已填入第 1 格")).toBeVisible();

    await page.getByLabel("选择第 2 格游戏").click();
    await page.getByPlaceholder("输入游戏名").fill("zelda");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await expect(page.getByText("《塞尔达传说》已在第 1 格选中")).toBeVisible();
    await expect(page.getByText("已填入第 2 格")).not.toBeVisible();
    await page.getByRole("button", { name: "关闭搜索弹窗" }).click();

    await page.getByRole("button", { name: "编辑第 1 格评论" }).first().click();
    await page.getByPlaceholder("写下你想说的评论...").fill("终局剧情神作");
    await page.getByLabel("剧透折叠").check();
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(page.getByText("剧透评论已折叠，点击展开预览")).toBeVisible();
    await page.getByRole("button", { name: "剧透评论已折叠，点击展开预览" }).click();
    await expect(page.getByText("终局剧情神作")).toBeVisible();
  });

  test("填写页刷新后保留本地缓存草稿", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("输入你的昵称").fill("缓存玩家");
    await page.getByLabel("选择第 1 格游戏").click();
    await page.getByPlaceholder("输入游戏名").fill("zelda");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await expect(page.getByText("已填入第 1 格")).toBeVisible();

    await page.reload();

    await expect(page.getByPlaceholder("输入你的昵称")).toHaveValue("缓存玩家");
    await expect(page.getByText("1 / 9 已选择")).toBeVisible();
    await expect(page.getByText("塞尔达传说")).toBeVisible();
  });

  test("未填满可点击保存，需单次确认", async ({ page }) => {
    await page.goto("/");
    await fillSlot(page, 1, "zelda");

    let dialogIndex = 0;
    page.on("dialog", async (dialog) => {
      dialogIndex += 1;
      await dialog.accept();
    });

    await page.getByRole("button", { name: "还差 8 个可保存" }).click();
    await expect(page).toHaveURL(`/s/${SHARE_ID}`, { timeout: 30_000 });
    expect(dialogIndex).toBe(1);
  });

  test("9/9 保存后跳只读页，且只读操作锁定", async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/");
    for (let slot = 1; slot <= 9; slot += 1) {
      await fillSlot(page, slot, `q${slot}`);
    }
    await expect(page.getByRole("button", { name: "保存页面" })).toBeEnabled();
    await page.getByRole("button", { name: "保存页面" }).click();
    await expect(page.getByRole("button", { name: "保存中..." })).toBeVisible();
    await expect(page).toHaveURL(`/s/${SHARE_ID}`, { timeout: 30_000 });

    await expect(page.getByText("这是共享页面（只读）")).toBeVisible();
    await expect(page.getByRole("button", { name: "撤销" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "清空" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "共享页面" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "保存图片" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "从空白重新开始" })).toBeVisible();
  });

  test("只读页仅保留分享链接/分享图片，复制与导图可用", async ({ page }) => {
    await page.goto(`/s/${SHARE_ID}`);
    await expect(page.getByText("正在加载共享页面...")).not.toBeVisible({ timeout: 15_000 });

    await expect(page.getByRole("button", { name: "生成分享链接" })).toBeVisible();
    await expect(page.getByRole("button", { name: "生成分享图片" })).toBeVisible();
    await expect(page.getByRole("button", { name: "X 分享" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "微博" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "QQ好友" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "QQ空间" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "B站文案" })).toHaveCount(0);

    await page.getByRole("button", { name: "生成分享链接" }).click();
    await expect(page.getByText("已生成并复制分享链接")).toBeVisible();
    const copied = await page.evaluate(() => {
      const g = window as typeof window & { __clipboardWrites?: string[] };
      return g.__clipboardWrites || [];
    });
    expect(copied.some((item) => item.endsWith(`/s/${SHARE_ID}`))).toBeTruthy();

    await page.evaluate(() => {
      const g = window as typeof window & { __clipboardFail?: boolean };
      g.__clipboardFail = true;
    });
    await page.getByRole("button", { name: "生成分享链接" }).click();
    await expect(page.getByText("生成分享链接失败，请手动复制")).toBeVisible();

    await page.getByRole("button", { name: "生成分享图片" }).click();
    await expect(page.getByRole("heading", { name: "生成分享图片" })).toBeVisible();
    const qrSwitch = page.getByRole("switch", { name: "附带二维码和提示文案" });
    await expect(qrSwitch).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText("已开启：底部追加扫码区与文案")).toBeVisible();
    await expect(page.getByAltText("分享图片预览")).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "保存图片" }).click();

    const exportInfo = await page.evaluate(() => {
      const g = window as typeof window & {
        __GAMEGRID_LAST_BILI_EXPORT__?: { width: number; height: number };
      };
      return g.__GAMEGRID_LAST_BILI_EXPORT__ || null;
    });
    expect(exportInfo).not.toBeNull();
    expect(exportInfo?.width).toBe(1080);
    expect(exportInfo?.height).toBe(1660);

    await qrSwitch.click();
    await expect(qrSwitch).toHaveAttribute("aria-checked", "false");
    await expect(page.getByText("已关闭：仅保留基础分享图")).toBeVisible();

    await page.evaluate(() => {
      const g = window as typeof window & {
        __ORIGIN_CREATE_OBJECT_URL__?: typeof URL.createObjectURL;
      };
      g.__ORIGIN_CREATE_OBJECT_URL__ = URL.createObjectURL;
      URL.createObjectURL = (() => {
        throw new Error("create_object_url_failed");
      }) as typeof URL.createObjectURL;
    });
    await page.getByRole("button", { name: "保存图片" }).click();
    await expect(page.getByText("下载失败，请长按预览图保存")).toBeVisible();
    await page.evaluate(() => {
      const g = window as typeof window & {
        __ORIGIN_CREATE_OBJECT_URL__?: typeof URL.createObjectURL;
      };
      if (g.__ORIGIN_CREATE_OBJECT_URL__) {
        URL.createObjectURL = g.__ORIGIN_CREATE_OBJECT_URL__;
      }
    });
  });
});

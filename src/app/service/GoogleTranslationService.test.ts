import "jest";
import GoogleTranslationService from "./GoogleTranslationService";

// const data = `[
//   [
//     [
//       "你叫什么名字？",
//       "What's your name?",
//       null,
//       null,
//       1
//     ]
//   ],
//   null,
//   "en",
//   null,
//   null,
//   null,
//   1.0,
//   [],
//   [
//     [
//       "en"
//     ],
//     null,
//     [
//       1.0
//     ],
//     [
//       "en"
//     ]
//   ]
// ]`;
// (global as any).fetch = jest.fn(() => Promise.resolve(new Response(data, {
//   status: 200
// })));

describe("Google Translation Service", () => {
  const service = new GoogleTranslationService();

  test("'What's your name?' to '你叫什么名字？'", async () => {
    // expect.assertions(1);
    const res = await service.translate("What's your name?", "zh-cn");
    expect(res.ok).toBeTruthy();
    expect(res.result).toBe("你叫什么名字？");
    return;
  });
});

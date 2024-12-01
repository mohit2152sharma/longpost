import { createThread } from "~/lib/post";

describe("Test post functions", () => {
  const testCases = [
    {
      parsedValues: { content: "hello world", shoutout: false },
      characterLimit: 5,
      expected: { error: false, message: "", texts: ["hello", "world"] },
    },
    {
      parsedValues: { content: "hello world!", shoutout: true },
      characterLimit: 5,
      expected: {
        error: true,
        message: "Characters in word are greater than character limit",
        texts: undefined,
      },
    },
    {
      parsedValues: { content: "hello world", shoutout: false },
      characterLimit: 6,
      expected: { error: false, message: "", texts: ["hello", "world"] },
    },
    {
      parsedValues: {
        content: "hello     world world world world world world",
        shoutout: false,
      },
      characterLimit: 10,
      expected: {
        error: false,
        message: "",
        texts: ["hello", ...Array(6).fill("world")],
      },
    },
    {
      parsedValues: { content: "hello    world \n\n\nworld", shoutout: false },
      characterLimit: 11,
      expected: {
        error: false,
        message: "",
        texts: ["hello (1/3)", "world (2/3)", "world (3/3)"],
      },
    },
    {
      parsedValues: { content: "hello    world \n\n\nworld", shoutout: true },
      characterLimit: 11,
      expected: {
        error: false,
        message: "",
        texts: [
          "hello (1/4)",
          "world (2/4)",
          "world (3/4)",
          "This thread was created by Longpost. Try it out at: https://mohit2152sharma.github.io/bsky-projects/ (4/4)",
        ],
      },
    },
  ];

  test.each(testCases)(
    "Testing thread function",
    ({ parsedValues, characterLimit, expected }) => {
      const { texts, error, message } = createThread(
        parsedValues.content,
        parsedValues.shoutout,
        characterLimit,
      );
      expect(error).toBe(expected.error);
      expect(message).toBe(expected.message);
      expect(texts).toEqual(expected.texts);
    },
  );
});

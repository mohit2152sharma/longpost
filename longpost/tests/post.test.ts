import { createThread } from "~/lib/post";

describe("Test post functions", () => {
  const testCases = [
    {
      text: "hello world",
      characterLimit: 5,
      expected: { error: false, message: "", texts: ["hello", "world"] },
    },
    {
      text: "hello world!",
      characterLimit: 5,
      expected: {
        error: true,
        message: "Characters in word are greater than character limit",
        texts: undefined,
      },
    },
    {
      text: "hello world",
      characterLimit: 6,
      expected: { error: false, message: "", texts: ["hello", "world"] },
    },
    {
      text: "hello     world world world world world world",
      characterLimit: 10,
      expected: {
        error: false,
        message: "",
        texts: ["hello", ...Array(6).fill("world")],
      },
    },
    {
      text: "hello    world \n\n\nworld",
      characterLimit: 11,
      expected: {
        error: false,
        message: "",
        texts: ["hello (1/3)", "world (2/3)", "world (3/3)"],
      },
    },
  ];

  test.each(testCases)(
    "Testing thread function",
    ({ text, characterLimit, expected }) => {
      const { texts, error, message } = createThread(text, characterLimit);
      expect(error).toBe(expected.error);
      expect(message).toBe(expected.message);
      expect(texts).toEqual(expected.texts);
    },
  );
});

import assert from "node:assert";
import test, { describe } from "node:test";

// Mock settings and functions for difficulty management
type Difficulty = { name: string; price: number };

type ChangeDifficultyParams = {
  oldName: string;
  newName: string;
  newPrice: number;
};

function addDifficulty(difficulties: Array<Difficulty>, name: string, price: number): Array<Difficulty> {
  return [...difficulties, { name, price }];
}

function changeDifficulty(
  difficulties: Array<Difficulty>,
  params: ChangeDifficultyParams
): Array<Difficulty> {
  const { oldName, newName, newPrice } = params;
  return difficulties.map((diff) =>
    diff.name === oldName ? { ...diff, name: newName, price: newPrice } : diff
  );
}

describe("Difficulty management", () => {
  test("add a new difficulty", () => {
    const initial = [
      { name: "easy", price: 1 },
      { name: "medium", price: 2.5 },
    ];
    const updated = addDifficulty(initial, "hard", 5);
    assert.strictEqual(updated.length, 3);
    assert.deepStrictEqual(updated[2], { name: "hard", price: 5 });
  });

  test("change an existing difficulty's name and price", () => {
    const initial = [
      { name: "easy", price: 1 },
      { name: "medium", price: 2.5 },
    ];
    const updated = changeDifficulty(initial, {
      oldName: "easy",
      newName: "super easy",
      newPrice: 1.2,
    });
    assert.strictEqual(updated.length, 2);
    assert.deepStrictEqual(updated[0], { name: "super easy", price: 1.2 });
    assert.deepStrictEqual(updated[1], { name: "medium", price: 2.5 });
  });
});

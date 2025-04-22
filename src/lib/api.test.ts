import { getTransactions } from "./api";

describe("API Utilities", () => {
  test("getTransactions returns filtered transactions", async () => {
    const result = await getTransactions({
      category: "Food",
      page: 1,
      limit: 10,
    });
    expect(result.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ category: "Food" })])
    );
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});

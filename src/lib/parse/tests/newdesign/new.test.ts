import newParse from "./newParse";

const ts = `export class Basic2 {
  @hasOne("authority")
  counter: {
    authority: Pubkey;
    count: u64;
  };
  create(authority: Pubkey) {
    this.counter = {
      count: 0,
      authority,
    };
  }

  increment() {
    this.counter.count += 1;
  }
}`;

test("newParse", () => {
  expect(newParse(ts)).toEqual({
    name: "Basic2",
    accounts: {
      counter: {
        type: {
          authority: { type: "Pubkey", constraints: ["hasOne"] },
          count: { type: "u64" },
        },
      },
    },
    instructions: {},
  });
});

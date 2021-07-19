class Basic1 {
  myAccount: {
    data: u64;
  };
  @init("myAccount")
  initialize(data: u64) {
    this.myAccount.data = data;
  }
  update(data: u64) {
    this.myAccount.data = data;
  }
}

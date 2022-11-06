export class ListNode<T> {
  constructor(
    public data: T,
    public next?: ListNode<T>,
    public previous?: ListNode<T>
  ) {
    if (this.next)
      this.next.previous = this;
    if (this.previous) 
      this.previous.next = this;
  }
};

export class LinkedList<T> {
  constructor(public head?: ListNode<T>){}
}
export class SKEvent {
  constructor(
    public type: string,
    public timeStamp: number,
    public source?: object
  ) {}
}

export class SKMouseEvent extends SKEvent {
  constructor(
    type: string,
    timeStamp: number,
    public x: number,
    public y: number,
    source?: object
  ) {
    super(type, timeStamp, source);
  }
}

export class SKKeyboardEvent extends SKEvent {
  constructor(
    type: string,
    timeStamp: number,
    public key: string | null = null,
    source?: object
  ) {
    super(type, timeStamp, source);
  }
}

export class SKResizeEvent extends SKEvent {
  constructor(
    type: string,
    timeStamp: number,
    public width: number,
    public height: number,
    source?: object
  ) {
    super(type, timeStamp, source);
  }
}

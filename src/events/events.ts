export class SKEvent {
  type: string;
  timeStamp: number;
  source?: object;

  constructor(type: string, timeStamp: number, source?: object) {
    this.type = type;
    this.timeStamp = timeStamp;
    this.source = source;
  }
}

export class SKMouseEvent extends SKEvent {
  x: number;
  y: number;

  constructor(
    type: string,
    timeStamp: number,
    x: number,
    y: number,
    source?: object
  ) {
    super(type, timeStamp, source);
    this.x = x;
    this.y = y;
  }
}

export class SKKeyboardEvent extends SKEvent {
  key: string | null;

  constructor(
    type: string,
    timeStamp: number,
    key: string | null = null,
    source?: object
  ) {
    super(type, timeStamp, source);
    this.key = key;
  }
}

export class SKResizeEvent extends SKEvent {
  width: number;
  height: number;

  constructor(
    type: string,
    timeStamp: number,
    width: number,
    height: number,
    source?: object
  ) {
    super(type, timeStamp, source);
    this.width = width;
    this.height = height;
  }
}

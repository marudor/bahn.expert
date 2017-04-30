declare module 'inline-style-prefixer' {
  class Prefixer {
    constructor();
    prefix<T>(styles: T): T;
  }
  namespace Prefixer { }
  export = Prefixer;
}

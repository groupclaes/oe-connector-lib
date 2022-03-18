export declare class OE {
  configuration: any

  run(name: string, parameters: any[], options: any): Promise<any>
  test(name: string, parameters: any[], options: any): any
  configure(noptions: any): void
}

/** singleton Oe instance */
export declare const oe: OE;
export { };